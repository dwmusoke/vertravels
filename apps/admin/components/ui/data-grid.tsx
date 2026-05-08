"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  CheckSquare,
  Square,
  Filter,
  X,
  Eye,
  EyeOff,
  Download,
  RefreshCw,
} from "lucide-react";

interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  visible?: boolean;
  width?: number;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataGridProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean;
  selectedIds?: Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;
  onRowClick?: (row: T) => void;
  pageSize?: number;
  emptyMessage?: string;
  className?: string;
}

type SortDirection = "asc" | "desc" | null;

interface SortConfig {
  key: string;
  direction: SortDirection;
}

interface FilterConfig {
  column: string;
  value: string;
  operator: "contains" | "equals" | "startsWith" | "endsWith";
}

export function DataGrid<T extends { id?: string }>({
  data,
  columns,
  loading = false,
  selectable = false,
  selectedIds = new Set(),
  onSelectionChange,
  onRowClick,
  pageSize = 25,
  emptyMessage = "No data available",
  className = "",
}: DataGridProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "", direction: null });
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.filter((c) => c.visible !== false).map((c) => c.key as string))
  );
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState("");

  const sortedAndFilteredData = useMemo(() => {
    let result = [...data];

    // Apply filters
    if (filters.length > 0) {
      result = result.filter((row) =>
        filters.every((filter) => {
          const value = row[filter.column as keyof T];
          const stringValue = String(value ?? "").toLowerCase();
          const searchValue = filter.value.toLowerCase();

          switch (filter.operator) {
            case "contains":
              return stringValue.includes(searchValue);
            case "equals":
              return stringValue === searchValue;
            case "startsWith":
              return stringValue.startsWith(searchValue);
            case "endsWith":
              return stringValue.endsWith(searchValue);
            default:
              return true;
          }
        })
      );
    }

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof T];
        const bValue = b[sortConfig.key as keyof T];

        if (aValue == null) return 1;
        if (bValue == null) return -1;

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
        }

        const aString = String(aValue);
        const bString = String(bValue);

        if (sortConfig.direction === "asc") {
          return aString.localeCompare(bString);
        } else {
          return bString.localeCompare(aString);
        }
      });
    }

    return result;
  }, [data, filters, sortConfig]);

  const totalPages = Math.ceil(sortedAndFilteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = sortedAndFilteredData.slice(startIndex, endIndex);

  const handleSort = useCallback((key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const handleSelectAll = useCallback(() => {
    if (!onSelectionChange) return;

    if (selectedIds.size === currentPageData.length && currentPageData.length > 0) {
      onSelectionChange(new Set());
    } else {
      const newSelected = new Set<string>(
        currentPageData.filter((row) => row.id).map((row) => row.id!)
      );
      onSelectionChange(newSelected);
    }
  }, [currentPageData, selectedIds.size, onSelectionChange]);

  const handleSelectRow = useCallback(
    (id: string) => {
      if (!onSelectionChange) return;

      const newSelected = new Set(selectedIds);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      onSelectionChange(newSelected);
    },
    [selectedIds, onSelectionChange]
  );

  const handleAddFilter = useCallback((column: string) => {
    if (!filterValue.trim()) return;

    setFilters((prev) => [...prev, { column, value: filterValue, operator: "contains" }]);
    setFilterValue("");
    setShowFilterMenu(null);
    setCurrentPage(1);
  }, [filterValue]);

  const handleRemoveFilter = useCallback((column: string) => {
    setFilters((prev) => prev.filter((f) => f.column !== column));
  }, []);

  const toggleColumnVisibility = useCallback((columnKey: string) => {
    setVisibleColumns((prev) => {
      const next = new Set(prev);
      if (next.has(columnKey)) {
        next.delete(columnKey);
      } else {
        next.add(columnKey);
      }
      return next;
    });
  }, []);

  const handleExport = useCallback(() => {
    const headers = columns
      .filter((c) => visibleColumns.has(c.key as string))
      .map((c) => c.header)
      .join(",");

    const rows = sortedAndFilteredData
      .map((row) =>
        columns
          .filter((c) => visibleColumns.has(c.key as string))
          .map((c) => {
            const value = row[c.key as keyof T];
            return String(value ?? "").replace(/,/g, ";");
          })
          .join(",")
      )
      .join("\n");

    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [sortedAndFilteredData, columns, visibleColumns]);

  const resetFilters = useCallback(() => {
    setFilters([]);
    setSortConfig({ key: "", direction: null });
    setCurrentPage(1);
  }, []);

  const getSortIcon = (columnKey: string) => {
    if (sortConfig.key !== columnKey) return <ChevronsUpDown className="w-4 h-4" />;
    if (sortConfig.direction === "asc") return <ChevronUp className="w-4 h-4" />;
    return <ChevronDown className="w-4 h-4" />;
  };

  const activeFiltersCount = filters.length;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-white border rounded-lg p-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowColumnMenu(!showColumnMenu)}
              className="flex items-center gap-2 px-3 py-1.5 border rounded-lg hover:bg-gray-50 text-sm"
            >
              <Eye className="w-4 h-4" />
              Columns
            </button>
            {showColumnMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-50 p-2 min-w-[200px]">
                <div className="text-xs font-medium text-gray-700 mb-2 px-2">
                  Toggle Columns
                </div>
                {columns.map((column) => (
                  <label
                    key={column.key as string}
                    className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    {visibleColumns.has(column.key as string) ? (
                      <CheckSquare className="w-4 h-4 text-sky-600" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="text-sm">{column.header}</span>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={visibleColumns.has(column.key as string)}
                      onChange={() => toggleColumnVisibility(column.key as string)}
                    />
                  </label>
                ))}
              </div>
            )}
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 text-sm"
            >
              <X className="w-4 h-4" />
              Clear Filters ({activeFiltersCount})
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            {sortedAndFilteredData.length} records
            {currentPageData.length < sortedAndFilteredData.length &&
              ` (Page ${currentPage} of ${totalPages})`}
          </span>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-1.5 border rounded-lg hover:bg-gray-50 text-sm"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Active Filters */}
      {filters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Active filters:</span>
          {filters.map((filter, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm"
            >
              <span>{filter.column}: "{filter.value}"</span>
              <button
                onClick={() => handleRemoveFilter(filter.column)}
                className="hover:bg-sky-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-sky-500" />
            <span className="ml-3 text-gray-600">Loading...</span>
          </div>
        ) : currentPageData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">{emptyMessage}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {selectable && (
                      <th className="px-4 py-3 w-12">
                        <button
                          onClick={handleSelectAll}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          {selectedIds.size === currentPageData.length &&
                          currentPageData.length > 0 ? (
                            <CheckSquare className="w-4 h-4 text-sky-600" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </th>
                    )}
                    {columns
                      .filter((c) => visibleColumns.has(c.key as string))
                      .map((column) => (
                        <th
                          key={column.key as string}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                          style={{ width: column.width }}
                        >
                          <div className="flex items-center gap-2">
                            {column.sortable ? (
                              <button
                                onClick={() => handleSort(column.key as string)}
                                className="flex items-center gap-2 hover:text-gray-700"
                              >
                                {column.header}
                                {getSortIcon(column.key as string)}
                              </button>
                            ) : (
                              column.header
                            )}
                            {column.filterable && (
                              <div className="relative">
                                <button
                                  onClick={() =>
                                    setShowFilterMenu(
                                      showFilterMenu === column.key ? null : (column.key as string)
                                    )
                                  }
                                  className={`p-1 hover:bg-gray-200 rounded ${
                                    filters.some((f) => f.column === column.key)
                                      ? "text-sky-600"
                                      : "text-gray-400"
                                  }`}
                                >
                                  <Filter className="w-3 h-3" />
                                </button>
                                {showFilterMenu === column.key && (
                                  <div className="absolute top-full right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 p-3 min-w-[200px]">
                                    <div className="text-xs font-medium text-gray-700 mb-2">
                                      Filter by {column.header}
                                    </div>
                                    <input
                                      type="text"
                                      value={filterValue}
                                      onChange={(e) => setFilterValue(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          handleAddFilter(column.key as string);
                                        }
                                      }}
                                      placeholder="Type to filter..."
                                      className="w-full px-2 py-1 border rounded text-sm mb-2"
                                      autoFocus
                                    />
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleAddFilter(column.key as string)}
                                        className="flex-1 px-2 py-1 bg-sky-600 text-white rounded text-xs hover:bg-sky-700"
                                      >
                                        Apply
                                      </button>
                                      <button
                                        onClick={() => {
                                          setShowFilterMenu(null);
                                          setFilterValue("");
                                        }}
                                        className="flex-1 px-2 py-1 border rounded text-xs hover:bg-gray-50"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {currentPageData.map((row, rowIndex) => (
                    <tr
                      key={(row.id as string) || rowIndex}
                      onClick={() => onRowClick?.(row)}
                      className={`hover:bg-gray-50 ${onRowClick ? "cursor-pointer" : ""}`}
                    >
                      {selectable && (
                        <td className="px-4 py-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectRow(row.id!);
                            }}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            {selectedIds.has(row.id!) ? (
                              <CheckSquare className="w-4 h-4 text-sky-600" />
                            ) : (
                              <Square className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                        </td>
                      )}
                      {columns
                        .filter((c) => visibleColumns.has(c.key as string))
                        .map((column) => (
                          <td key={column.key as string} className="px-6 py-4 text-sm">
                            {column.render
                              ? column.render(row[column.key as keyof T], row)
                              : String(row[column.key as keyof T] ?? "")}
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-3 border-t bg-gray-50">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Rows per page:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setCurrentPage(1);
                    }}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-white"
                  >
                    First
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-white"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-white"
                  >
                    Next
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-white"
                  >
                    Last
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
