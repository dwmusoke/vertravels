"use client";

import { useState, useEffect, useRef } from "react";
import { Check, X, Loader2 } from "lucide-react";

interface EditableCellProps {
  value: any;
  type?: "text" | "number" | "select" | "date";
  options?: { label: string; value: any }[];
  onSave: (value: any) => Promise<void>;
  placeholder?: string;
  className?: string;
  validate?: (value: any) => string | null;
}

export function EditableCell({
  value,
  type = "text",
  options,
  onSave,
  placeholder,
  className,
  validate,
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (validate) {
      const validationError = validate(editValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setIsSaving(true);
    try {
      await onSave(editValue);
      setIsEditing(false);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className={`editable-cell-editing ${className || ""}`}>
        <div className="flex items-center gap-2">
          {type === "select" ? (
            <select
              ref={inputRef as any}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : type === "number" ? (
            <input
              ref={inputRef as any}
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="flex-1 px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          ) : type === "date" ? (
            <input
              ref={inputRef as any}
              type="date"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          ) : (
            <input
              ref={inputRef as any}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="flex-1 px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          )}

          <div className="flex items-center gap-1">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="p-1 text-green-600 hover:bg-green-50 rounded"
              title="Save"
            >
              {isSaving ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Check className="w-3 h-3" />
              )}
            </button>
            <button
              onClick={handleCancel}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
              title="Cancel"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={`editable-cell-view cursor-pointer hover:bg-sky-50 px-2 py-1 rounded transition-colors ${className || ""}`}
      title="Click to edit"
    >
      {value !== null && value !== undefined && value !== "" ? (
        type === "date" ? (
          new Date(value).toLocaleDateString()
        ) : type === "number" ? (
          typeof value === "number" ? value.toLocaleString() : value
        ) : (
          value
        )
      ) : (
        <span className="text-gray-400 italic">{placeholder || "—"}</span>
      )}
    </div>
  );
}

interface StatusCellProps {
  value: string;
  statusMap: Record<
    string,
    { label: string; color: string; icon?: string }
  >;
  onSave: (value: string) => Promise<void>;
}

export function StatusCell({ value, statusMap, onSave }: StatusCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (isEditing && selectRef.current) {
      selectRef.current.focus();
    }
  }, [isEditing]);

  const handleStatusChange = async (newStatus: string) => {
    setIsSaving(true);
    try {
      await onSave(newStatus);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const currentStatus = statusMap[value] || {
    label: value,
    color: "bg-gray-100 text-gray-700",
  };

  if (isEditing) {
    return (
      <select
        ref={selectRef}
        value={value}
        onChange={(e) => handleStatusChange(e.target.value)}
        onBlur={() => setIsEditing(false)}
        className="px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        disabled={isSaving}
      >
        {Object.entries(statusMap).map(([key, config]) => (
          <option key={key} value={key}>
            {config.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentStatus.color} cursor-pointer hover:opacity-80 transition-opacity`}
      title="Click to change status"
    >
      {currentStatus.label}
    </span>
  );
}
