import {
    Bold,
    Heading2,
    Italic,
    Link2,
    List,
    ListOrdered,
    Redo2,
    Undo2,
} from 'lucide-react';
import { type MouseEvent, useEffect, useId, useRef } from 'react';

import { adminFieldErrorTextClass } from '@/components/admin/adminForm';
import { cn } from '@/lib/utils';

export interface RichTextEditorProps {
    label?: string;
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    error?: string;
    id?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    dir?: 'ltr' | 'rtl';
}

interface EditorHistory {
    past: string[];
    future: string[];
    current: string;
}

const toolbarButtonClass =
    'inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';

const contentClass =
    'min-h-[12rem] px-3 py-2.5 text-sm leading-relaxed text-foreground outline-none [&_a]:text-secondary [&_a]:underline [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:font-heading [&_h2]:text-base [&_h2]:font-semibold [&_li]:mb-1 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:ps-5 [&_p]:mb-2 [&_strong]:font-semibold [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:ps-5';

const MAX_HISTORY_LENGTH = 50;

function normalizeUrl(url: string): string {
    if (/^(https?:\/\/|mailto:|tel:)/i.test(url)) {
        return url;
    }

    return `https://${url}`;
}

function createHistoryState(html: string): EditorHistory {
    return {
        past: [],
        future: [],
        current: html,
    };
}

function preventToolbarFocusLoss(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
}

export function RichTextEditor({
    label,
    value,
    onChange,
    placeholder = 'Write content…',
    error,
    id,
    required = false,
    disabled = false,
    className,
    dir = 'ltr',
}: RichTextEditorProps) {
    const generatedId = useId();
    const editorId = id ?? generatedId;
    const errorId = `${editorId}-error`;
    const editorRef = useRef<HTMLDivElement>(null);
    const lastEmittedValue = useRef(value);
    const savedSelectionRef = useRef<Range | null>(null);
    const historyRef = useRef<EditorHistory>(createHistoryState(value));
    const isHistoryAction = useRef(false);

    useEffect(() => {
        if (!editorRef.current) {
            return;
        }

        const isEmpty = editorRef.current.innerHTML === '';
        const matchesLastEmitted = value === lastEmittedValue.current;

        if (matchesLastEmitted && !isEmpty) {
            return;
        }

        editorRef.current.innerHTML = value;
        lastEmittedValue.current = value;
        historyRef.current = createHistoryState(value);
    }, [value]);

    const saveSelection = () => {
        const selection = window.getSelection();

        if (!selection || selection.rangeCount === 0) {
            return;
        }

        savedSelectionRef.current = selection.getRangeAt(0).cloneRange();
    };

    const restoreSelection = () => {
        const selection = window.getSelection();
        const range = savedSelectionRef.current;

        if (!selection || !range || !editorRef.current) {
            return;
        }

        if (!editorRef.current.contains(range.commonAncestorContainer)) {
            return;
        }

        selection.removeAllRanges();
        selection.addRange(range);
    };

    const recordHistory = (html: string) => {
        if (isHistoryAction.current || html === historyRef.current.current) {
            return;
        }

        historyRef.current.past.push(historyRef.current.current);

        if (historyRef.current.past.length > MAX_HISTORY_LENGTH) {
            historyRef.current.past.shift();
        }

        historyRef.current.current = html;
        historyRef.current.future = [];
    };

    const syncValue = () => {
        if (!editorRef.current) {
            return;
        }

        const html = editorRef.current.innerHTML;

        recordHistory(html);
        lastEmittedValue.current = html;
        onChange(html);
    };

    const applyHistoryState = (html: string) => {
        if (!editorRef.current) {
            return;
        }

        isHistoryAction.current = true;
        editorRef.current.innerHTML = html;
        historyRef.current.current = html;
        lastEmittedValue.current = html;
        onChange(html);
        isHistoryAction.current = false;
    };

    const focusEditor = () => {
        editorRef.current?.focus();
        restoreSelection();
    };

    const runCommand = (command: string, commandValue?: string) => {
        if (disabled) {
            return;
        }

        focusEditor();
        document.execCommand(command, false, commandValue);
        syncValue();
    };

    const handleHeading = () => {
        if (disabled) {
            return;
        }

        focusEditor();
        document.execCommand('formatBlock', false, '<h2>');
        syncValue();
    };

    const handleLink = () => {
        if (disabled) {
            return;
        }

        saveSelection();
        const url = window.prompt('Enter link URL');

        if (!url?.trim()) {
            return;
        }

        focusEditor();
        document.execCommand('createLink', false, normalizeUrl(url.trim()));
        syncValue();
    };

    const handleUndo = () => {
        if (disabled) {
            return;
        }

        const { past, future } = historyRef.current;

        if (past.length === 0) {
            return;
        }

        future.unshift(historyRef.current.current);
        const previous = past.pop();

        if (previous === undefined) {
            return;
        }

        applyHistoryState(previous);
        focusEditor();
    };

    const handleRedo = () => {
        if (disabled) {
            return;
        }

        const { future, past } = historyRef.current;

        if (future.length === 0) {
            return;
        }

        past.push(historyRef.current.current);
        const next = future.shift();

        if (next === undefined) {
            return;
        }

        applyHistoryState(next);
        focusEditor();
    };

    return (
        <div className={cn('space-y-1', className)}>
            {label ? (
                <label id={`${editorId}-label`} htmlFor={editorId} className="text-xs font-medium text-foreground">
                    {label}
                    {required ? (
                        <>
                            <span className="text-red-600 dark:text-red-400" aria-hidden>
                                {' '}
                                *
                            </span>
                            <span className="sr-only"> (required)</span>
                        </>
                    ) : null}
                </label>
            ) : null}

            <div
                className={cn(
                    'overflow-hidden rounded-lg border border-border bg-surface',
                    error && 'border-red-500',
                    disabled && 'opacity-60',
                )}
            >
                <div
                    role="toolbar"
                    aria-label="Text formatting"
                    className="flex flex-wrap items-center gap-1 border-b border-border bg-surface-muted/40 p-1.5"
                >
                    <button
                        type="button"
                        disabled={disabled}
                        className={toolbarButtonClass}
                        onMouseDown={preventToolbarFocusLoss}
                        onClick={() => runCommand('bold')}
                        aria-label="Bold"
                    >
                        <Bold className="size-3.5" aria-hidden />
                    </button>
                    <button
                        type="button"
                        disabled={disabled}
                        className={toolbarButtonClass}
                        onMouseDown={preventToolbarFocusLoss}
                        onClick={() => runCommand('italic')}
                        aria-label="Italic"
                    >
                        <Italic className="size-3.5" aria-hidden />
                    </button>
                    <button
                        type="button"
                        disabled={disabled}
                        className={toolbarButtonClass}
                        onMouseDown={preventToolbarFocusLoss}
                        onClick={handleHeading}
                        aria-label="Heading"
                    >
                        <Heading2 className="size-3.5" aria-hidden />
                    </button>
                    <button
                        type="button"
                        disabled={disabled}
                        className={toolbarButtonClass}
                        onMouseDown={preventToolbarFocusLoss}
                        onClick={() => runCommand('insertUnorderedList')}
                        aria-label="Bullet list"
                    >
                        <List className="size-3.5" aria-hidden />
                    </button>
                    <button
                        type="button"
                        disabled={disabled}
                        className={toolbarButtonClass}
                        onMouseDown={preventToolbarFocusLoss}
                        onClick={() => runCommand('insertOrderedList')}
                        aria-label="Numbered list"
                    >
                        <ListOrdered className="size-3.5" aria-hidden />
                    </button>
                    <button
                        type="button"
                        disabled={disabled}
                        className={toolbarButtonClass}
                        onMouseDown={preventToolbarFocusLoss}
                        onClick={handleLink}
                        aria-label="Insert link"
                    >
                        <Link2 className="size-3.5" aria-hidden />
                    </button>
                    <button
                        type="button"
                        disabled={disabled}
                        className={toolbarButtonClass}
                        onMouseDown={preventToolbarFocusLoss}
                        onClick={handleUndo}
                        aria-label="Undo"
                    >
                        <Undo2 className="size-3.5" aria-hidden />
                    </button>
                    <button
                        type="button"
                        disabled={disabled}
                        className={toolbarButtonClass}
                        onMouseDown={preventToolbarFocusLoss}
                        onClick={handleRedo}
                        aria-label="Redo"
                    >
                        <Redo2 className="size-3.5" aria-hidden />
                    </button>
                </div>

                <div
                    ref={editorRef}
                    id={editorId}
                    role="textbox"
                    aria-labelledby={label ? `${editorId}-label` : undefined}
                    aria-multiline="true"
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? errorId : undefined}
                    contentEditable={!disabled}
                    dir={dir}
                    suppressContentEditableWarning
                    onInput={syncValue}
                    onBlur={saveSelection}
                    onKeyUp={saveSelection}
                    onMouseUp={saveSelection}
                    data-placeholder={placeholder}
                    className={cn(
                        contentClass,
                        disabled && 'cursor-not-allowed',
                        'empty:before:pointer-events-none empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]',
                    )}
                />
            </div>

            {error ? (
                <p id={errorId} role="alert" className={adminFieldErrorTextClass}>
                    {error}
                </p>
            ) : null}
        </div>
    );
}
