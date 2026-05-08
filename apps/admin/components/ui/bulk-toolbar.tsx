"use client";

import { useState } from "react";
import {
  Download,
  Mail,
  Trash2,
  Edit,
  FileSpreadsheet,
  CheckSquare,
  Square,
  X,
  AlertTriangle,
} from "lucide-react";

interface BulkToolbarProps {
  selectedCount: number;
  onExport?: () => void;
  onEmail?: () => void;
  onDelete?: () => void;
  onBulkEdit?: () => void;
  onSelectAll?: (selectAll: boolean) => void;
  allSelected?: boolean;
  entityType?: string;
  disabledActions?: string[];
}

export function BulkToolbar({
  selectedCount,
  onExport,
  onEmail,
  onDelete,
  onBulkEdit,
  onSelectAll,
  allSelected = false,
  entityType = "records",
  disabledActions = [],
}: BulkToolbarProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  if (selectedCount === 0) {
    return onSelectAll ? (
      <div className="bg-white border rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectAll(!allSelected)}
            className="p-1 hover:bg-gray-100 rounded"
            title={allSelected ? "Deselect all" : "Select all"}
          >
            {allSelected ? (
              <CheckSquare className="w-5 h-5 text-sky-600" />
            ) : (
              <Square className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <span className="text-sm text-gray-600">Select all {entityType}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Use checkboxes to select items for bulk operations</span>
        </div>
      </div>
    ) : null;
  }

  const handleDelete = () => {
    setShowConfirm(false);
    onDelete?.();
  };

  return (
    <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-sky-600" />
            <span className="font-medium text-sky-900">
              {selectedCount} {entityType} selected
            </span>
          </div>

          <div className="h-6 w-px bg-sky-200" />

          <div className="flex items-center gap-2">
            {!disabledActions.includes("export") && onExport && (
              <button
                onClick={onExport}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-sky-300 rounded-lg hover:bg-sky-50 text-sm font-medium text-sky-700"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Export
              </button>
            )}

            {!disabledActions.includes("email") && onEmail && (
              <button
                onClick={onEmail}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-sky-300 rounded-lg hover:bg-sky-50 text-sm font-medium text-sky-700"
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
            )}

            {!disabledActions.includes("edit") && onBulkEdit && (
              <button
                onClick={onBulkEdit}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-sky-300 rounded-lg hover:bg-sky-50 text-sm font-medium text-sky-700"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            )}

            {!disabledActions.includes("delete") && onDelete && (
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-red-300 rounded-lg hover:bg-red-50 text-sm font-medium text-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
          </div>
        </div>

        <button
          onClick={() => onSelectAll?.(false)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-sky-700 hover:bg-sky-100 rounded-lg"
        >
          <X className="w-4 h-4" />
          Clear Selection
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  Delete {selectedCount} {entityType}?
                </h3>
                <p className="text-gray-600">
                  This action cannot be undone. Are you sure you want to delete
                  the selected {entityType}?
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete {selectedCount} Items
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface BulkAction {
  id: string;
  label: string;
  icon: any;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}

interface BulkToolbarAdvancedProps {
  selectedCount: number;
  actions: BulkAction[];
  entityType?: string;
  onClose: () => void;
}

export function BulkToolbarAdvanced({
  selectedCount,
  actions,
  entityType = "records",
  onClose,
}: BulkToolbarAdvancedProps) {
  return (
    <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-sky-600 text-white rounded-full font-bold text-sm">
            {selectedCount}
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {selectedCount} {entityType} selected
            </p>
            <p className="text-sm text-gray-600">
              Choose an action to perform on selected items
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            disabled={action.disabled}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
              action.danger
                ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <action.icon className="w-4 h-4" />
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
