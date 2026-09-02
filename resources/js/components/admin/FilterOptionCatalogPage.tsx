import { router, usePage } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';

import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import { ContentRecordViewDialog } from '@/components/admin/ContentRecordViewDialog';
import { FilterPlacementFormDialog } from '@/components/admin/FilterPlacementFormDialog';
import {
    buildFilterPlacementPayload,
    createEmptyFilterPlacementFormValues,
    filterPlacementToFormValues,
    type FilterPlacementFormValues,
} from '@/components/admin/filterPlacementForm';
import { buildFilterPlacementViewModel } from '@/components/admin/filterPlacementView';
import {
    PremiumDataTable,
    type DataTableColumn,
} from '@/components/admin/PremiumDataTable';
import { cn } from '@/lib/utils';
import type { TourFilterOption, TourFilterOptionType } from '@/types/tourFilterOptions';
import { tourFilterOptionTypeLabels } from '@/types/tourFilterOptions';

const statusStyles: Record<TourFilterOption['status'], string> = {
    Published: 'bg-secondary/10 text-secondary',
    Draft: 'bg-accent/15 text-accent',
};

const columns: DataTableColumn<TourFilterOption>[] = [
    {
        id: 'name',
        header: 'Name',
        accessor: (row) => row.name,
        render: (row) => (
            <p className="font-medium text-foreground">{row.name}</p>
        ),
    },
    {
        id: 'status',
        header: 'Status',
        accessor: (row) => row.status,
        render: (row) => (
            <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[row.status]}`}
            >
                {row.status}
            </span>
        ),
    },
    { id: 'order', header: 'Order', accessor: (row) => row.order },
    { id: 'updated', header: 'Updated', accessor: (row) => row.updated },
];

export interface FilterOptionCatalog {
    type: TourFilterOptionType;
    title: string;
    items: TourFilterOption[];
    description: string;
}

interface FilterOptionCatalogPageProps {
    pageId: string;
    title: string;
    description: string;
    icon: LucideIcon;
    catalogs: FilterOptionCatalog[];
    defaultType: TourFilterOptionType;
}

function tabStorageKey(pageId: string): string {
    return `admin-filter-tab:${pageId}`;
}

function catalogTabId(pageId: string, type: TourFilterOptionType): string {
    return `${pageId}-tab-${type}`;
}

function catalogPanelId(pageId: string, type: TourFilterOptionType): string {
    return `${pageId}-panel-${type}`;
}

function resolveInitialTab(
    pageId: string,
    catalogs: FilterOptionCatalog[],
    defaultType: TourFilterOptionType,
): TourFilterOptionType {
    const catalogTypes = new Set(catalogs.map((catalog) => catalog.type));

    if (typeof window !== 'undefined') {
        const fromUrl = new URLSearchParams(window.location.search).get('tab');

        if (fromUrl && catalogTypes.has(fromUrl as TourFilterOptionType)) {
            return fromUrl as TourFilterOptionType;
        }

        const stored = window.sessionStorage.getItem(tabStorageKey(pageId));

        if (stored && catalogTypes.has(stored as TourFilterOptionType)) {
            return stored as TourFilterOptionType;
        }
    }

    if (catalogTypes.has(defaultType)) {
        return defaultType;
    }

    return catalogs[0]?.type ?? defaultType;
}

function persistTab(pageId: string, type: TourFilterOptionType): void {
    if (typeof window === 'undefined') {
        return;
    }

    window.sessionStorage.setItem(tabStorageKey(pageId), type);

    const url = new URL(window.location.href);
    url.searchParams.set('tab', type);
    window.history.replaceState(window.history.state, '', url);
}

function submitFilterOptionForm(
    values: FilterPlacementFormValues,
    editingItemId: number | null,
): Promise<void> {
    const payload = buildFilterPlacementPayload(values);

    return new Promise((resolve, reject) => {
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                router.flush('/');
                router.flush('/tours');
                resolve();
            },
            onError: () => reject(),
        };

        if (editingItemId !== null) {
            router.patch(`/admin/filter-placement/${editingItemId}`, payload, options);

            return;
        }

        router.post('/admin/filter-placement', payload, options);
    });
}

export function FilterOptionCatalogPage({
    pageId,
    title,
    description,
    icon,
    catalogs,
    defaultType,
}: FilterOptionCatalogPageProps) {
    const { flash } = usePage().props;
    const [activeType, setActiveType] = useState<TourFilterOptionType>(defaultType);
    const [formOpen, setFormOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    const [viewingItemId, setViewingItemId] = useState<number | null>(null);

    const activeCatalog =
        catalogs.find((catalog) => catalog.type === activeType) ?? catalogs[0];
    const typeLabel = tourFilterOptionTypeLabels[activeCatalog.type];
    const publishedInCatalog = activeCatalog.items.filter(
        (item) => item.status === 'Published',
    ).length;
    const allItems = useMemo(
        () => catalogs.flatMap((catalog) => catalog.items),
        [catalogs],
    );
    const editingItem =
        editingItemId !== null ? allItems.find((item) => item.id === editingItemId) ?? null : null;
    const viewingItem =
        viewingItemId !== null ? allItems.find((item) => item.id === viewingItemId) ?? null : null;

    useEffect(() => {
        const resolved = resolveInitialTab(pageId, catalogs, defaultType);
        setActiveType(resolved);
        persistTab(pageId, resolved);
        // Restore the last section after Inertia redirects. Catalogs are page-local.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageId]);

    const closeForm = () => {
        setFormOpen(false);
        setEditingItemId(null);
    };

    const closeView = () => {
        setViewOpen(false);
        setViewingItemId(null);
    };

    const selectTab = (type: TourFilterOptionType) => {
        setActiveType(type);
        persistTab(pageId, type);
        closeForm();
        closeView();
    };

    const handleTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
            return;
        }

        event.preventDefault();

        const rtl = document.documentElement.dir === 'rtl';
        const goingNext = event.key === 'ArrowRight' ? !rtl : rtl;
        const index = catalogs.findIndex((catalog) => catalog.type === activeCatalog.type);
        const offset = goingNext ? 1 : -1;
        const next = catalogs[(index + offset + catalogs.length) % catalogs.length];

        selectTab(next.type);
        requestAnimationFrame(() => {
            document.getElementById(catalogTabId(pageId, next.type))?.focus();
        });
    };

    const openCreateForm = () => {
        setEditingItemId(null);
        setFormOpen(true);
    };

    const openEditForm = (row: TourFilterOption) => {
        setActiveType(row.type);
        persistTab(pageId, row.type);
        setEditingItemId(row.id);
        setFormOpen(true);
    };

    const openViewDialog = (row: TourFilterOption) => {
        setViewingItemId(row.id);
        setViewOpen(true);
    };

    const openEditFromView = () => {
        if (viewingItemId === null) {
            return;
        }

        closeView();
        setEditingItemId(viewingItemId);
        setFormOpen(true);
    };

    const handleSubmit = async (values: FilterPlacementFormValues) => {
        setActiveType(values.type);
        persistTab(pageId, values.type);
        await submitFilterOptionForm(values, editingItemId);
        closeForm();
    };

    const handleDelete = (row: TourFilterOption) => {
        setActiveType(row.type);
        persistTab(pageId, row.type);
        router.delete(`/admin/filter-placement/${row.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                router.flush('/');
                router.flush('/tours');
            },
        });
    };

    return (
        <>
            <div className="space-y-4">
                {flash.success ? (
                    <div
                        role="status"
                        className="rounded-xl border border-secondary/20 bg-secondary/10 px-4 py-3 text-sm text-secondary"
                    >
                        {flash.success}
                    </div>
                ) : null}

                {flash.error ? (
                    <div
                        role="alert"
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
                    >
                        {flash.error}
                    </div>
                ) : null}

                <AdminSectionHeader
                    eyebrow="Configuration"
                    title={title}
                    description={description}
                    icon={icon}
                    actions={
                        <button
                            type="button"
                            onClick={openCreateForm}
                            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-95"
                        >
                            <Plus className="size-4" aria-hidden />
                            New {typeLabel.toLowerCase()}
                        </button>
                    }
                />

                <div
                    role="tablist"
                    aria-label={`${title} sections`}
                    onKeyDown={handleTabKeyDown}
                    className="flex flex-wrap gap-1 rounded-xl border border-border bg-surface-muted/40 p-1"
                >
                    {catalogs.map((catalog) => {
                        const selected = catalog.type === activeCatalog.type;

                        return (
                            <button
                                key={catalog.type}
                                id={catalogTabId(pageId, catalog.type)}
                                type="button"
                                role="tab"
                                aria-selected={selected}
                                aria-controls={catalogPanelId(pageId, catalog.type)}
                                tabIndex={selected ? 0 : -1}
                                onClick={() => selectTab(catalog.type)}
                                className={cn(
                                    'inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                                    selected
                                        ? 'bg-surface text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground',
                                )}
                            >
                                {catalog.title}
                                <span
                                    className={cn(
                                        'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                                        selected
                                            ? 'bg-secondary/10 text-secondary'
                                            : 'bg-border/80 text-muted-foreground',
                                    )}
                                >
                                    {catalog.items.length}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div
                    id={catalogPanelId(pageId, activeCatalog.type)}
                    role="tabpanel"
                    aria-labelledby={catalogTabId(pageId, activeCatalog.type)}
                >
                    <PremiumDataTable
                        key={activeCatalog.type}
                        title={activeCatalog.title}
                        description={`${publishedInCatalog} published · ${activeCatalog.description}`}
                        data={activeCatalog.items}
                        columns={columns}
                        rowKey={(row) => row.id}
                        selectionLabel={(row) => row.name}
                        emptyTitle={`No ${typeLabel.toLowerCase()} options yet`}
                        emptyDescription="Add the first option to use it on the public website."
                        initialPageSize={8}
                        onView={openViewDialog}
                        onEdit={openEditForm}
                        onDelete={handleDelete}
                    />
                </div>
            </div>

            <ContentRecordViewDialog
                open={viewOpen}
                title="View option"
                description={viewingItem?.name}
                model={viewingItem ? buildFilterPlacementViewModel(viewingItem) : null}
                onClose={closeView}
                onEdit={openEditFromView}
            />

            <FilterPlacementFormDialog
                open={formOpen}
                mode={editingItemId !== null ? 'edit' : 'create'}
                resetKey={
                    editingItemId !== null
                        ? String(editingItemId)
                        : `create-${activeCatalog.type}`
                }
                initialValues={
                    editingItem
                        ? filterPlacementToFormValues(editingItem)
                        : createEmptyFilterPlacementFormValues(activeCatalog.type)
                }
                onClose={closeForm}
                onSubmit={handleSubmit}
            />
        </>
    );
}
