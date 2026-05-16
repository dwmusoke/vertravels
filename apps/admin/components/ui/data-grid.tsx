"use client";

import { useState, useMemo, useCallback } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Check,
  Filter,
  X,
  Eye,
  Download,
  RefreshCw,
  Search,
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
      <div className="flex items-center justify-between bg-surface border border-border/60 rounded-xl p-3 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Quick filter..."
              className="input-field-sm pl-8 w-48"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowColumnMenu(!showColumnMenu)}
              className="btn-ghost btn-sm"
            >
              <Eye className="w-3.5 h-3.5" />
              Columns
            </button>
            {showColumnMenu && (
              <div className="absolute top-full left-0 mt-1 bg-surface border border-border rounded-xl shadow-elevated z-50 p-2 min-w-[200px] animate-scale-in">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-2">
                  Toggle Columns
                </div>
                {columns.map((column) => (
                  <label
                    key={column.key as string}
                    className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-lg cursor-pointer transition-colors"
                  >
                    {visibleColumns.has(column.key as string) ? (
                      <Check className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <div className="w-3.5 h-3.5 border-2 border-muted-foreground/30 rounded-sm" />
                    )}
                    <span className="text-xs">{column.header}</span>
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
            <button onClick={resetFilters} className="btn-ghost btn-sm text-danger">
              <X className="w-3.5 h-3.5" />
              Clear ({activeFiltersCount})
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground tabular-nums">
            {sortedAndFilteredData.length} records
            {currentPageData.length < sortedAndFilteredData.length &&
              ` • Page ${currentPage} of ${totalPages}`}
          </span>
          <button onClick={handleExport} className="btn-ghost btn-sm">
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* Active Filters */}
      {filters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {filters.map((filter, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium"
            >
              <span>{filter.column}: &ldquo;{filter.value}&rdquo;</span>
              <button onClick={() => handleRemoveFilter(filter.column)} className="hover:bg-primary/20 rounded-full p-0.5">
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <RefreshCw className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-3 text-sm text-muted-foreground">Loading...</span>
          </div>
        ) : currentPageData.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-8 h-8 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    {selectable && (
                      <th className="px-4 py-3 w-10">
                        <button onClick={handleSelectAll} className="p-0.5 hover:bg-muted rounded transition-colors">
                          {selectedIds.size === currentPageData.length && currentPageData.length > 0 ? (
                            <Check className="w-4 h-4 text-primary" />
                          ) : (
                            <div className="w-4 h-4 border-2 border-muted-foreground/30 rounded-sm" />
                          )}
                        </button>
                      </th>
                    )}
                    {columns
                      .filter((c) => visibleColumns.has(c.key as string))
                      .map((column) => (
                        <th key={column.key as string} style={{ width: column.width }}>
                          <div className="flex items-center gap-2">
                            {column.sortable ? (
                              <button
                                onClick={() => handleSort(column.key as string)}
                                className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                              >
                                {column.header}
                                <span className="text-muted-foreground">{getSortIcon(column.key as string)}</span>
                              </button>
                            ) : (
                              column.header
                            )}
                            {column.filterable && (
                              <div className="relative">
                                <button
                                  onClick={() => setShowFilterMenu(
                                    showFilterMenu === column.key ? null : (column.key as string)
                                  )}
                                  className={`p-0.5 rounded transition-colors ${
                                    filters.some((f) => f.column === column.key)
                                      ? "text-primary"
                                      : "text-muted-foreground hover:text-foreground"
                                  }`}
                                >
                                  <Filter className="w-3 h-3" />
                                </button>
                                {showFilterMenu === column.key && (
                                  <div className="absolute top-full right-0 mt-1 bg-surface border border-border rounded-xl shadow-elevated z-50 p-3 min-w-[200px] animate-scale-in">
                                    <div className="text-xs font-medium text-foreground mb-2">
                                      Filter by {column.header}
                                    </div>
                                    <input
                                      type="text"
                                      value={filterValue}
                                      onChange={(e) => setFilterValue(e.target.value)}
                                      onKeyDown={(e) => { if (e.key === "Enter") handleAddFilter(column.key as string); }}
                                      placeholder="Type to filter..."
                                      className="input-field-sm mb-2"
                                      autoFocus
                                    />
                                    <div className="flex gap-2">
                                      <button onClick={() => handleAddFilter(column.key as string)} className="btn-primary btn-xs flex-1">
                                        Apply
                                      </button>
                                      <button onClick={() => { setShowFilterMenu(null); setFilterValue(""); }} className="btn-secondary btn-xs flex-1">
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
                <tbody className="divide-y divide-border/60">
                  {currentPageData.map((row, rowIndex) => (
                    <tr
                      key={(row.id as string) || rowIndex}
                      onClick={() => onRowClick?.(row)}
                      className={`transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
                    >
                      {selectable && (
                        <td className="px-4 py-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleSelectRow(row.id!); }}
                            className="p-0.5 hover:bg-muted rounded transition-colors"
                          >
                            {selectedIds.has(row.id!) ? (
                              <Check className="w-4 h-4 text-primary" />
                            ) : (
                              <div className="w-4 h-4 border-2 border-muted-foreground/30 rounded-sm" />
                            )}
                          </button>
                        </td>
                      )}
                      {columns
                        .filter((c) => visibleColumns.has(c.key as string))
                        .map((column) => (
                          <td key={column.key as string}>
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
              <div className="flex items-center justify-between px-4 py-3 border-t border-border/60 bg-muted/30">
                <span className="text-xs text-muted-foreground">Rows per page: {pageSize}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}
                    className="btn-ghost btn-xs disabled:opacity-30">First</button>
                  <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                    className="btn-ghost btn-xs disabled:opacity-30">Prev</button>
                  <span className="text-xs text-muted-foreground px-2 tabular-nums">
                    {currentPage} / {totalPages}
                  </span>
                  <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                    className="btn-ghost btn-xs disabled:opacity-30">Next</button>
                  <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}
                    className="btn-ghost btn-xs disabled:opacity-30">Last</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
