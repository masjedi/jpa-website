import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Check,
    ChevronFirst,
    ChevronLast,
    ChevronLeft,
    ChevronRight,
    Columns3,
    FileDown,
    FileText,
    Eye,
    ListFilter,
    Maximize2,
    Pencil,
    Printer,
    RefreshCw,
    Search,
    Trash2,
} from 'lucide-react';
import {
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';

import { DataTableDialog } from '@/components/admin/DataTableDialog';
import { cn } from '@/lib/utils';

export interface DataTableColumn<T extends object> {
    id: string;
    header: string;
    accessor: (row: T) => string | number | null | undefined;
    render?: (row: T) => ReactNode;
    searchable?: boolean;
    sortable?: boolean;
    className?: string;
    align?: 'start' | 'center' | 'end';
}

interface PremiumDataTableProps<T extends object> {
    title: string;
    description?: string;
    data?: readonly T[] | null;
    columns: readonly DataTableColumn<T>[];
    rowKey: (row: T) => string | number;
    emptyTitle?: string;
    emptyDescription?: string;
    initialPageSize?: number;
    pageSizeOptions?: readonly number[];
    onRefresh?: () => void | Promise<void>;
    selectionLabel?: (row: T) => string;
    onView?: (row: T) => void | Promise<void>;
    onEdit?: (row: T) => void | Promise<void>;
    onDelete?: (row: T) => void | Promise<void>;
    onPrint?: (row: T) => void | Promise<void>;
}

type DialogName =
    | 'print'
    | 'refresh'
    | 'columns'
    | 'filter'
    | 'fullscreen'
    | 'pdf'
    | 'csv'
    | 'view'
    | 'edit'
    | 'delete';
type SortDirection = 'asc' | 'desc';

interface SortState {
    columnId: string;
    direction: SortDirection;
}

const toolbarButtonClass =
    'inline-flex size-9 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-colors hover:border-secondary/30 hover:bg-surface-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';

function escapeHtml(value: string): string {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function valueToString(value: string | number | null | undefined): string {
    return value === null || value === undefined ? '' : String(value);
}

export function PremiumDataTable<T extends object>({
    title,
    description,
    data,
    columns,
    rowKey,
    emptyTitle = 'No records found',
    emptyDescription = 'Try changing your search or filter.',
    initialPageSize = 10,
    pageSizeOptions = [5, 10, 25, 50],
    onRefresh,
    selectionLabel,
    onView,
    onEdit,
    onDelete,
    onPrint,
}: PremiumDataTableProps<T>) {
    const rows = data ?? [];
    const [searchQuery, setSearchQuery] = useState('');
    const [filterColumnId, setFilterColumnId] = useState(columns[0]?.id ?? '');
    const [filterValue, setFilterValue] = useState('');
    const [draftFilterColumnId, setDraftFilterColumnId] = useState(columns[0]?.id ?? '');
    const [draftFilterValue, setDraftFilterValue] = useState('');
    const [visibleColumnIds, setVisibleColumnIds] = useState<Set<string>>(
        () => new Set(columns.map((column) => column.id)),
    );
    const [draftVisibleColumnIds, setDraftVisibleColumnIds] = useState<Set<string>>(
        () => new Set(columns.map((column) => column.id)),
    );
    const [sort, setSort] = useState<SortState | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [dialog, setDialog] = useState<DialogName | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedRowKey, setSelectedRowKey] = useState<string | number | null>(null);
    const [processingSelection, setProcessingSelection] = useState(false);

    const selectedRow = useMemo(
        () => rows.find((row) => rowKey(row) === selectedRowKey) ?? null,
        [rows, rowKey, selectedRowKey],
    );

    const selectedRowLabel = selectedRow
        ? (selectionLabel?.(selectedRow) ?? `Record ${String(rowKey(selectedRow))}`)
        : null;

    const visibleColumns = useMemo(
        () => columns.filter((column) => visibleColumnIds.has(column.id)),
        [columns, visibleColumnIds],
    );

    const processedRows = useMemo(() => {
        const normalizedSearch = searchQuery.trim().toLocaleLowerCase();
        const normalizedFilter = filterValue.trim().toLocaleLowerCase();
        const filterColumn = columns.find((column) => column.id === filterColumnId);

        const matchingRows = rows.filter((row) => {
            const matchesSearch =
                !normalizedSearch ||
                columns
                    .filter((column) => column.searchable !== false)
                    .some((column) =>
                        valueToString(column.accessor(row))
                            .toLocaleLowerCase()
                            .includes(normalizedSearch),
                    );

            const matchesFilter =
                !normalizedFilter ||
                !filterColumn ||
                valueToString(filterColumn.accessor(row))
                    .toLocaleLowerCase()
                    .includes(normalizedFilter);

            return matchesSearch && matchesFilter;
        });

        if (!sort) {
            return [...matchingRows].sort((left, right) => {
                const leftKey = rowKey(left);
                const rightKey = rowKey(right);

                if (typeof leftKey === 'number' && typeof rightKey === 'number') {
                    return rightKey - leftKey;
                }

                return valueToString(rightKey).localeCompare(valueToString(leftKey), undefined, {
                    numeric: true,
                    sensitivity: 'base',
                });
            });
        }

        const sortColumn = columns.find((column) => column.id === sort.columnId);
        if (!sortColumn) {
            return matchingRows;
        }

        return [...matchingRows].sort((left, right) => {
            const leftValue = sortColumn.accessor(left);
            const rightValue = sortColumn.accessor(right);
            const comparison =
                typeof leftValue === 'number' && typeof rightValue === 'number'
                    ? leftValue - rightValue
                    : valueToString(leftValue).localeCompare(valueToString(rightValue), undefined, {
                          numeric: true,
                          sensitivity: 'base',
                      });

            return sort.direction === 'asc' ? comparison : -comparison;
        });
    }, [columns, rows, filterColumnId, filterValue, rowKey, searchQuery, sort]);

    const totalPages = Math.max(1, Math.ceil(processedRows.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const pageStart = (safePage - 1) * pageSize;
    const pageRows = processedRows.slice(pageStart, pageStart + pageSize);
    const firstRecord = processedRows.length === 0 ? 0 : pageStart + 1;
    const lastRecord = Math.min(pageStart + pageSize, processedRows.length);

    useEffect(() => {
        setPage(1);
    }, [filterColumnId, filterValue, pageSize, searchQuery]);

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    const openColumnsDialog = () => {
        setDraftVisibleColumnIds(new Set(visibleColumnIds));
        setDialog('columns');
    };

    const openFilterDialog = () => {
        setDraftFilterColumnId(filterColumnId);
        setDraftFilterValue(filterValue);
        setDialog('filter');
    };

    const toggleSort = (column: DataTableColumn<T>) => {
        if (column.sortable === false) {
            return;
        }

        setSort((current) => {
            if (current?.columnId !== column.id) {
                return { columnId: column.id, direction: 'asc' };
            }

            if (current.direction === 'asc') {
                return { columnId: column.id, direction: 'desc' };
            }

            return null;
        });
    };

    const toggleDraftColumn = (columnId: string) => {
        setDraftVisibleColumnIds((current) => {
            const next = new Set(current);
            if (next.has(columnId)) {
                if (next.size > 1) {
                    next.delete(columnId);
                }
            } else {
                next.add(columnId);
            }
            return next;
        });
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await onRefresh?.();
            if (!onRefresh) {
                await new Promise((resolve) => window.setTimeout(resolve, 500));
            }
        } finally {
            setRefreshing(false);
            setDialog(null);
        }
    };

    const handleSelectedAction = async (action: 'edit' | 'delete') => {
        if (!selectedRow) {
            return;
        }

        setProcessingSelection(true);
        try {
            if (action === 'edit') {
                await onEdit?.(selectedRow);
            } else {
                await onDelete?.(selectedRow);
                setSelectedRowKey(null);
            }
        } finally {
            setProcessingSelection(false);
            setDialog(null);
        }
    };

    const buildPrintableTable = (documentTitle: string): string => {
        const headingCells = visibleColumns
            .map((column) => `<th>${escapeHtml(column.header)}</th>`)
            .join('');
        const bodyRows = processedRows
            .map(
                (row) =>
                    `<tr>${visibleColumns
                        .map(
                            (column) =>
                                `<td>${escapeHtml(valueToString(column.accessor(row)))}</td>`,
                        )
                        .join('')}</tr>`,
            )
            .join('');

        return `<!doctype html><html><head><title>${escapeHtml(documentTitle)}</title>
            <style>
                body{font-family:Arial,sans-serif;color:#172b3a;padding:28px}
                h1{font-size:22px;margin:0 0 6px}p{color:#5b6b78;margin:0 0 22px}
                table{border-collapse:collapse;width:100%;font-size:12px}
                th,td{border:1px solid #d9e4e9;padding:9px;text-align:left}
                th{background:#edf3f6;font-weight:600}
                @media print{body{padding:0}}
            </style></head><body><h1>${escapeHtml(title)}</h1>
            <p>${escapeHtml(description ?? `${processedRows.length} records`)}</p>
            <table><thead><tr>${headingCells}</tr></thead><tbody>${bodyRows}</tbody></table>
            </body></html>`;
    };

    const printTable = (asPdf: boolean) => {
        setDialog(null);

        const frame = document.createElement('iframe');
        frame.setAttribute('aria-hidden', 'true');
        frame.style.position = 'fixed';
        frame.style.inset = '0';
        frame.style.width = '0';
        frame.style.height = '0';
        frame.style.border = '0';
        frame.style.opacity = '0';
        frame.style.pointerEvents = 'none';
        document.body.appendChild(frame);

        const frameWindow = frame.contentWindow;
        const frameDocument = frame.contentDocument ?? frameWindow?.document;

        if (!frameWindow || !frameDocument) {
            frame.remove();
            return;
        }

        const cleanup = () => {
            frameWindow.removeEventListener('afterprint', cleanup);
            frame.remove();
        };

        frameWindow.addEventListener('afterprint', cleanup);
        frameDocument.open();
        frameDocument.write(buildPrintableTable(asPdf ? `${title} PDF` : title));
        frameDocument.close();

        window.setTimeout(() => {
            frameWindow.focus();
            frameWindow.print();
        }, 50);
    };

    const printSelectedRecord = async (asPdf: boolean) => {
        if (!onPrint || !selectedRow) {
            printTable(asPdf);
            return;
        }

        setProcessingSelection(true);
        try {
            await onPrint(selectedRow);
        } finally {
            setProcessingSelection(false);
            setDialog(null);
        }
    };

    const exportCsv = () => {
        const quote = (value: string) => `"${value.replaceAll('"', '""')}"`;
        const header = visibleColumns.map((column) => quote(column.header)).join(',');
        const rows = processedRows.map((row) =>
            visibleColumns
                .map((column) => quote(valueToString(column.accessor(row))))
                .join(','),
        );
        const csv = `\uFEFF${[header, ...rows].join('\r\n')}`;
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title.toLocaleLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        setDialog(null);
    };

    const renderTable = (fullscreen = false) => (
        <div className={cn('overflow-x-auto', fullscreen && 'max-h-[58vh] overflow-y-auto')}>
            <table className="min-w-full border-separate border-spacing-0 text-sm">
                <thead className={cn('bg-surface-muted/70', fullscreen && 'sticky top-0 z-10')}>
                    <tr>
                        <th
                            scope="col"
                            className="w-12 border-b border-border px-4 py-3 text-start"
                        >
                            <span className="sr-only">Select one record</span>
                        </th>
                        {visibleColumns.map((column) => (
                            <th
                                key={column.id}
                                scope="col"
                                className={cn(
                                    'border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground',
                                    column.align === 'center' && 'text-center',
                                    column.align === 'end' && 'text-end',
                                    (!column.align || column.align === 'start') && 'text-start',
                                    column.className,
                                )}
                            >
                                <button
                                    type="button"
                                    onClick={() => toggleSort(column)}
                                    disabled={column.sortable === false}
                                    className="inline-flex items-center gap-1.5 disabled:cursor-default"
                                >
                                    {column.header}
                                    {column.sortable !== false ? (
                                        sort?.columnId === column.id ? (
                                            sort.direction === 'asc' ? (
                                                <ArrowUp className="size-3.5 text-secondary" aria-hidden />
                                            ) : (
                                                <ArrowDown className="size-3.5 text-secondary" aria-hidden />
                                            )
                                        ) : (
                                            <ArrowUpDown className="size-3.5 opacity-45" aria-hidden />
                                        )
                                    ) : null}
                                </button>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-border bg-surface">
                    {pageRows.length > 0 ? (
                        pageRows.map((row) => (
                            <tr
                                key={rowKey(row)}
                                className={cn(
                                    'group transition-colors hover:bg-surface-muted/35',
                                    selectedRowKey === rowKey(row) && 'bg-secondary/5',
                                )}
                            >
                                <td className="w-12 border-b border-border px-4 py-3">
                                    <button
                                        type="button"
                                        role="checkbox"
                                        aria-checked={selectedRowKey === rowKey(row)}
                                        aria-label={`Select ${selectionLabel?.(row) ?? `record ${String(rowKey(row))}`}`}
                                        onClick={() =>
                                            setSelectedRowKey((current) =>
                                                current === rowKey(row) ? null : rowKey(row),
                                            )
                                        }
                                        className={cn(
                                            'inline-flex size-5 items-center justify-center rounded-md border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                                            selectedRowKey === rowKey(row)
                                                ? 'border-secondary bg-secondary text-secondary-foreground'
                                                : 'border-border bg-surface hover:border-secondary/50',
                                        )}
                                    >
                                        {selectedRowKey === rowKey(row) ? (
                                            <Check className="size-3.5" aria-hidden />
                                        ) : null}
                                    </button>
                                </td>
                                {visibleColumns.map((column) => (
                                    <td
                                        key={column.id}
                                        className={cn(
                                            'border-b border-border px-4 py-3 text-foreground last:border-b-0',
                                            column.align === 'center' && 'text-center',
                                            column.align === 'end' && 'text-end',
                                            column.className,
                                        )}
                                    >
                                        {column.render
                                            ? column.render(row)
                                            : valueToString(column.accessor(row))}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={Math.max(visibleColumns.length + 1, 1)}
                                className="px-6 py-14 text-center"
                            >
                                <p className="font-heading text-base font-semibold text-foreground">
                                    {emptyTitle}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">{emptyDescription}</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    const pageNumbers = useMemo(() => {
        const candidates = new Set([1, totalPages, safePage - 1, safePage, safePage + 1]);
        return [...candidates]
            .filter((candidate) => candidate >= 1 && candidate <= totalPages)
            .sort((left, right) => left - right);
    }, [safePage, totalPages]);

    const renderPagination = () => (
        <footer className="flex flex-col gap-4 border-t border-border bg-surface-muted/25 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span>
                    Showing <strong className="font-semibold text-foreground">{firstRecord}</strong>–
                    <strong className="font-semibold text-foreground">{lastRecord}</strong> of{' '}
                    <strong className="font-semibold text-foreground">{processedRows.length}</strong>
                </span>
                <label className="inline-flex items-center gap-2">
                    Rows
                    <select
                        value={pageSize}
                        onChange={(event) => setPageSize(Number(event.target.value))}
                        className="rounded-lg border border-border bg-surface px-2 py-1.5 text-xs text-foreground focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/20"
                    >
                        {pageSizeOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <nav className="flex items-center gap-1" aria-label="Table pagination">
                <PaginationButton
                    label="First page"
                    disabled={safePage === 1}
                    onClick={() => setPage(1)}
                >
                    <ChevronFirst className="size-4" aria-hidden />
                </PaginationButton>
                <PaginationButton
                    label="Previous page"
                    disabled={safePage === 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                    <ChevronLeft className="size-4" aria-hidden />
                </PaginationButton>

                {pageNumbers.map((pageNumber, index) => {
                    const previousPage = pageNumbers[index - 1];
                    return (
                        <span key={pageNumber} className="contents">
                            {previousPage && pageNumber - previousPage > 1 ? (
                                <span className="px-1 text-xs text-muted-foreground">…</span>
                            ) : null}
                            <button
                                type="button"
                                onClick={() => setPage(pageNumber)}
                                aria-current={pageNumber === safePage ? 'page' : undefined}
                                className={cn(
                                    'inline-flex size-8 items-center justify-center rounded-lg border text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                                    pageNumber === safePage
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-border bg-surface text-muted-foreground hover:bg-surface-muted hover:text-foreground',
                                )}
                            >
                                {pageNumber}
                            </button>
                        </span>
                    );
                })}

                <PaginationButton
                    label="Next page"
                    disabled={safePage === totalPages}
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                >
                    <ChevronRight className="size-4" aria-hidden />
                </PaginationButton>
                <PaginationButton
                    label="Last page"
                    disabled={safePage === totalPages}
                    onClick={() => setPage(totalPages)}
                >
                    <ChevronLast className="size-4" aria-hidden />
                </PaginationButton>
            </nav>
        </footer>
    );

    return (
        <>
            <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
                <header className="border-b border-border px-4 py-4 sm:px-5">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div className="min-w-0">
                            <h3 className="font-heading text-base font-semibold text-foreground">{title}</h3>
                            {description ? (
                                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                            ) : null}
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <label className="relative block min-w-0 sm:w-64">
                                <span className="sr-only">Search {title}</span>
                                <Search
                                    className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                                    aria-hidden
                                />
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    placeholder="Search records…"
                                    className="h-9 w-full rounded-lg border border-border bg-background pe-3 ps-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/20"
                                />
                            </label>

                            <div className="flex flex-wrap items-center gap-1.5">
                                <ToolbarButton
                                    label="View selected record"
                                    onClick={() => {
                                        if (onView && selectedRow) {
                                            void onView(selectedRow);
                                            return;
                                        }

                                        setDialog('view');
                                    }}
                                    disabled={!selectedRow}
                                >
                                    <Eye className="size-4" aria-hidden />
                                </ToolbarButton>
                                <ToolbarButton
                                    label="Edit selected record"
                                    onClick={() => setDialog('edit')}
                                    disabled={!selectedRow || !onEdit}
                                >
                                    <Pencil className="size-4" aria-hidden />
                                </ToolbarButton>
                                <ToolbarButton
                                    label="Delete selected record"
                                    onClick={() => setDialog('delete')}
                                    disabled={!selectedRow}
                                    danger
                                >
                                    <Trash2 className="size-4" aria-hidden />
                                </ToolbarButton>
                                <span
                                    className="mx-0.5 h-6 w-px bg-border"
                                    aria-hidden
                                />
                                <ToolbarButton label="Print" onClick={() => setDialog('print')}>
                                    <Printer className="size-4" aria-hidden />
                                </ToolbarButton>
                                <ToolbarButton label="Refresh" onClick={() => setDialog('refresh')}>
                                    <RefreshCw
                                        className={cn('size-4', refreshing && 'animate-spin')}
                                        aria-hidden
                                    />
                                </ToolbarButton>
                                <ToolbarButton label="Choose columns" onClick={openColumnsDialog}>
                                    <Columns3 className="size-4" aria-hidden />
                                </ToolbarButton>
                                <ToolbarButton
                                    label="Filter records"
                                    onClick={openFilterDialog}
                                    active={Boolean(filterValue)}
                                >
                                    <ListFilter className="size-4" aria-hidden />
                                </ToolbarButton>
                                <ToolbarButton
                                    label="Full page table"
                                    onClick={() => setDialog('fullscreen')}
                                >
                                    <Maximize2 className="size-4" aria-hidden />
                                </ToolbarButton>
                                <ToolbarButton label="Export PDF" onClick={() => setDialog('pdf')}>
                                    <FileText className="size-4" aria-hidden />
                                </ToolbarButton>
                                <ToolbarButton label="Export CSV" onClick={() => setDialog('csv')}>
                                    <FileDown className="size-4" aria-hidden />
                                </ToolbarButton>
                            </div>
                        </div>
                    </div>
                </header>

                {renderTable()}
                {selectedRowLabel ? (
                    <div className="border-t border-border bg-secondary/5 px-4 py-2 text-xs text-muted-foreground">
                        Selected: <strong className="font-semibold text-foreground">{selectedRowLabel}</strong>
                    </div>
                ) : null}
                {renderPagination()}
            </section>

            <DataTableDialog
                open={dialog === 'view' && Boolean(selectedRow)}
                title="Record details"
                description={selectedRowLabel ?? undefined}
                onClose={() => setDialog(null)}
                size="md"
            >
                <dl className="divide-y divide-border">
                    {selectedRow
                        ? visibleColumns.map((column) => (
                              <div
                                  key={column.id}
                                  className="grid gap-1 px-5 py-3 sm:grid-cols-[9rem_1fr] sm:gap-4"
                              >
                                  <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                                      {column.header}
                                  </dt>
                                  <dd className="text-sm text-foreground">
                                      {valueToString(column.accessor(selectedRow)) || '—'}
                                  </dd>
                              </div>
                          ))
                        : null}
                </dl>
                <footer className="flex justify-end border-t border-border bg-surface-muted/35 px-5 py-3">
                    <button
                        type="button"
                        onClick={() => setDialog(null)}
                        className="rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                        Done
                    </button>
                </footer>
            </DataTableDialog>

            <ActionDialog
                open={dialog === 'edit' && Boolean(selectedRow)}
                title="Edit selected record"
                description={`${selectedRowLabel ?? 'This record'} will be opened for editing.`}
                actionLabel={processingSelection ? 'Opening…' : 'Continue'}
                onClose={() => setDialog(null)}
                onConfirm={() => handleSelectedAction('edit')}
                disabled={processingSelection}
                icon={<Pencil className="size-5" aria-hidden />}
                note="This reusable action is ready to connect to the section's edit form."
            />

            <ActionDialog
                open={dialog === 'delete' && Boolean(selectedRow)}
                title="Delete selected record"
                description={`Are you sure you want to delete ${selectedRowLabel ?? 'this record'}?`}
                actionLabel={processingSelection ? 'Deleting…' : 'Delete record'}
                onClose={() => setDialog(null)}
                onConfirm={() => handleSelectedAction('delete')}
                disabled={processingSelection}
                icon={<Trash2 className="size-5" aria-hidden />}
                note="This action requires confirmation and can be connected to the section's delete endpoint."
                danger
            />

            <ActionDialog
                open={dialog === 'print'}
                title={onPrint ? 'Print selected record' : 'Print table'}
                description={
                    onPrint
                        ? selectedRow
                            ? `Print all received information for ${selectedRowLabel}.`
                            : 'Select a record first to print its full submitted details.'
                        : `Print ${processedRows.length} filtered records using the currently visible columns.`
                }
                actionLabel={processingSelection ? 'Preparing…' : 'Print'}
                onClose={() => setDialog(null)}
                onConfirm={() => printSelectedRecord(false)}
                disabled={processingSelection || (Boolean(onPrint) && !selectedRow)}
                icon={<Printer className="size-5" aria-hidden />}
                note={
                    onPrint
                        ? 'The printed document includes the full request, not only the table columns.'
                        : 'Only the current search, filter, and visible columns are included.'
                }
            />

            <ActionDialog
                open={dialog === 'refresh'}
                title="Refresh table data"
                description="Reload the latest records while preserving this table's current layout."
                actionLabel={refreshing ? 'Refreshing…' : 'Refresh now'}
                onClose={() => setDialog(null)}
                onConfirm={handleRefresh}
                disabled={refreshing}
                icon={<RefreshCw className={cn('size-5', refreshing && 'animate-spin')} aria-hidden />}
            />

            <ActionDialog
                open={dialog === 'pdf'}
                title={onPrint && selectedRow ? 'Export selected record' : 'Export as PDF'}
                description={
                    onPrint && selectedRow
                        ? `Open the print dialog for ${selectedRowLabel} and choose “Save as PDF”.`
                        : 'Use your browser print dialog and choose “Save as PDF” as the destination.'
                }
                actionLabel={processingSelection ? 'Preparing…' : 'Open PDF preview'}
                onClose={() => setDialog(null)}
                onConfirm={() => printSelectedRecord(true)}
                disabled={processingSelection}
                icon={<FileText className="size-5" aria-hidden />}
            />

            <ActionDialog
                open={dialog === 'csv'}
                title="Export as CSV"
                description={`Download ${processedRows.length} filtered records with the currently visible columns.`}
                actionLabel="Download CSV"
                onClose={() => setDialog(null)}
                onConfirm={exportCsv}
                icon={<FileDown className="size-5" aria-hidden />}
            />

            <DataTableDialog
                open={dialog === 'columns'}
                title="Column visibility"
                description="Choose which columns are shown, printed, and exported."
                onClose={() => setDialog(null)}
                size="sm"
            >
                <div className="space-y-2 p-5">
                    {columns.map((column) => {
                        const selected = draftVisibleColumnIds.has(column.id);
                        return (
                            <button
                                key={column.id}
                                type="button"
                                onClick={() => toggleDraftColumn(column.id)}
                                className="flex w-full items-center justify-between gap-3 rounded-xl border border-border px-3 py-2.5 text-start transition-colors hover:bg-surface-muted"
                            >
                                <span className="text-sm font-medium text-foreground">{column.header}</span>
                                <span
                                    className={cn(
                                        'inline-flex size-5 items-center justify-center rounded-md border',
                                        selected
                                            ? 'border-secondary bg-secondary text-secondary-foreground'
                                            : 'border-border bg-surface',
                                    )}
                                >
                                    {selected ? <Check className="size-3.5" aria-hidden /> : null}
                                </span>
                            </button>
                        );
                    })}
                </div>
                <DialogFooter
                    onCancel={() => setDialog(null)}
                    actionLabel="Apply columns"
                    onConfirm={() => {
                        setVisibleColumnIds(draftVisibleColumnIds);
                        setDialog(null);
                    }}
                />
            </DataTableDialog>

            <DataTableDialog
                open={dialog === 'filter'}
                title="Filter records"
                description="Filter this table by a specific column and value."
                onClose={() => setDialog(null)}
                size="sm"
            >
                <div className="space-y-4 p-5">
                    <label className="block space-y-2">
                        <span className="text-sm font-medium text-foreground">Column</span>
                        <select
                            value={draftFilterColumnId}
                            onChange={(event) => setDraftFilterColumnId(event.target.value)}
                            className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/20"
                        >
                            {columns.map((column) => (
                                <option key={column.id} value={column.id}>
                                    {column.header}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="block space-y-2">
                        <span className="text-sm font-medium text-foreground">Contains</span>
                        <input
                            value={draftFilterValue}
                            onChange={(event) => setDraftFilterValue(event.target.value)}
                            placeholder="Enter a value…"
                            className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/20"
                        />
                    </label>
                    {filterValue ? (
                        <button
                            type="button"
                            onClick={() => {
                                setDraftFilterValue('');
                                setFilterValue('');
                                setDialog(null);
                            }}
                            className="text-sm font-medium text-red-600 hover:underline dark:text-red-400"
                        >
                            Clear active filter
                        </button>
                    ) : null}
                </div>
                <DialogFooter
                    onCancel={() => setDialog(null)}
                    actionLabel="Apply filter"
                    onConfirm={() => {
                        setFilterColumnId(draftFilterColumnId);
                        setFilterValue(draftFilterValue);
                        setDialog(null);
                    }}
                />
            </DataTableDialog>

            <DataTableDialog
                open={dialog === 'fullscreen'}
                title={title}
                description={description}
                onClose={() => setDialog(null)}
                size="xl"
            >
                {renderTable(true)}
                {renderPagination()}
            </DataTableDialog>
        </>
    );
}

interface ToolbarButtonProps {
    label: string;
    children: ReactNode;
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    danger?: boolean;
}

function ToolbarButton({
    label,
    children,
    onClick,
    active = false,
    disabled = false,
    danger = false,
}: ToolbarButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            title={label}
            className={cn(
                toolbarButtonClass,
                active && 'border-secondary/35 bg-secondary/10 text-secondary',
                danger && !disabled && 'text-red-600 hover:bg-red-500/10 dark:text-red-400',
                disabled && 'cursor-not-allowed opacity-35 hover:border-border hover:bg-surface',
            )}
        >
            {children}
        </button>
    );
}

interface PaginationButtonProps {
    label: string;
    children: ReactNode;
    onClick: () => void;
    disabled: boolean;
}

function PaginationButton({ label, children, onClick, disabled }: PaginationButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            title={label}
            className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-35"
        >
            {children}
        </button>
    );
}

interface ActionDialogProps {
    open: boolean;
    title: string;
    description: string;
    actionLabel: string;
    icon: ReactNode;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    disabled?: boolean;
    note?: string;
    danger?: boolean;
}

function ActionDialog({
    open,
    title,
    description,
    actionLabel,
    icon,
    onClose,
    onConfirm,
    disabled = false,
    note = 'Only the current search, filter, and visible columns are included.',
    danger = false,
}: ActionDialogProps) {
    return (
        <DataTableDialog open={open} title={title} description={description} onClose={onClose} size="sm">
            <div className="flex items-center gap-3 px-5 py-5">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {icon}
                </span>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {note}
                </p>
            </div>
            <DialogFooter
                onCancel={onClose}
                actionLabel={actionLabel}
                onConfirm={onConfirm}
                disabled={disabled}
                danger={danger}
            />
        </DataTableDialog>
    );
}

interface DialogFooterProps {
    onCancel: () => void;
    onConfirm: () => void | Promise<void>;
    actionLabel: string;
    disabled?: boolean;
    danger?: boolean;
}

function DialogFooter({
    onCancel,
    onConfirm,
    actionLabel,
    disabled = false,
    danger = false,
}: DialogFooterProps) {
    return (
        <footer className="flex items-center justify-end gap-2 border-t border-border bg-surface-muted/35 px-5 py-3">
            <button
                type="button"
                onClick={onCancel}
                className="rounded-lg border border-border bg-surface px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
                Cancel
            </button>
            <button
                type="button"
                onClick={onConfirm}
                disabled={disabled}
                className={cn(
                    'rounded-lg px-3.5 py-2 text-sm font-semibold transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-50',
                    danger
                        ? 'bg-red-600 text-white'
                        : 'bg-primary text-primary-foreground',
                )}
            >
                {actionLabel}
            </button>
        </footer>
    );
}
