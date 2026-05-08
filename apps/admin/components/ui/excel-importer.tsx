"use client";

import { useState, useCallback } from "react";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, X, Loader2, Download, ChevronRight, ChevronLeft } from "lucide-react";
import { importFromExcel, getTemplateColumns, downloadTemplate, ValidationRule } from "@/lib/excel-utils";

interface ExcelImporterProps {
  entityType: string;
  onImport: (data: any[]) => Promise<void>;
  validationRules?: ValidationRule[];
  onClose: () => void;
}

type ImportStep = "upload" | "preview" | "mapping" | "validation" | "confirm" | "results";

interface ImportPreview {
  columns: string[];
  rows: any[];
  totalRows: number;
}

interface ColumnMapping {
  excelColumn: string;
  databaseField: string;
}

export function ExcelImporter({
  entityType,
  onImport,
  validationRules,
  onClose,
}: ExcelImporterProps) {
  const [currentStep, setCurrentStep] = useState<ImportStep>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [mapping, setMapping] = useState<ColumnMapping[]>([]);
  const [importResult, setImportResult] = useState<{
    data: any[];
    errors: any[];
    summary: { total: number; valid: number; invalid: number };
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith(".xlsx") || droppedFile.name.endsWith(".xls"))) {
      setFile(droppedFile);
      setError(null);
    } else {
      setError("Please drop a valid Excel file (.xlsx or .xls)");
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  }, []);

  const handlePreview = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const result = await importFromExcel(file, validationRules || []);
      
      setPreview({
        columns: Object.keys(result.data[0] || {}),
        rows: result.data.slice(0, 10),
        totalRows: result.summary.total,
      });

      setImportResult(result);
      setCurrentStep("preview");

      const dbColumns = getTemplateColumns(entityType);
      const initialMapping: ColumnMapping[] = result.preview?.columns.map((col: string) => ({
        excelColumn: col,
        databaseField: dbColumns.find((c) => c.header.toLowerCase() === col.toLowerCase())?.key || "",
      })) || [];

      setMapping(initialMapping);
    } catch (err: any) {
      setError(err.message || "Failed to read Excel file");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMappingChange = (excelColumn: string, databaseField: string) => {
    setMapping((prev) =>
      prev.map((m) => (m.excelColumn === excelColumn ? { ...m, databaseField } : m))
    );
  };

  const handleConfirm = async () => {
    if (!importResult) return;

    setIsProcessing(true);

    try {
      const mappedData = importResult.data.map((row) => {
        const mapped: Record<string, any> = {};
        mapping.forEach((m) => {
          if (m.databaseField) {
            mapped[m.databaseField] = row[m.excelColumn];
          }
        });
        return mapped;
      });

      await onImport(mappedData);

      setCurrentStep("results");
    } catch (err: any) {
      setError(err.message || "Failed to import data");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await downloadTemplate(entityType);
    } catch (err: any) {
      setError("Failed to download template");
    }
  };

  const renderStepIndicator = () => {
    const steps: { id: ImportStep; label: string }[] = [
      { id: "upload", label: "Upload" },
      { id: "preview", label: "Preview" },
      { id: "mapping", label: "Map Columns" },
      { id: "validation", label: "Validate" },
      { id: "confirm", label: "Confirm" },
      { id: "results", label: "Results" },
    ];

    const currentIndex = steps.findIndex((s) => s.id === currentStep);

    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                index <= currentIndex
                  ? "bg-sky-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {index < currentIndex ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                index + 1
              )}
            </div>
            <span
              className={`ml-2 text-sm font-medium ${
                index <= currentIndex ? "text-sky-600" : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <ChevronRight className="w-5 h-5 text-gray-300 mx-2" />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderUploadStep = () => (
    <div className="space-y-6">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
        className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-sky-500 transition-colors bg-gray-50"
      >
        <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Drop your Excel file here
        </h3>
        <p className="text-gray-600 mb-4">or click to browse</p>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Choose File
        </label>
      </div>

      {file && (
        <div className="bg-white border rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-8 h-8 text-green-600" />
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <button
            onClick={() => setFile(null)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      )}

      <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Download className="w-5 h-5 text-sky-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-sky-900 mb-1">
              Need a template?
            </h4>
            <p className="text-sm text-sky-700 mb-3">
              Download our pre-formatted Excel template with the correct columns and example data.
            </p>
            <button
              onClick={handleDownloadTemplate}
              className="text-sm text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
              Download {entityType} Template
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handlePreview}
          disabled={!file || isProcessing}
          className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 flex items-center gap-2 disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Next Step
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderPreviewStep = () => {
    if (!preview) return null;

    return (
      <div className="space-y-6">
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b">
            <h3 className="font-medium">Preview (First 10 rows)</h3>
            <p className="text-sm text-gray-600">
              Total rows: {preview.totalRows}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {preview.columns.map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left font-medium text-gray-700 border-b"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.rows.map((row, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    {preview.columns.map((col) => (
                      <td key={col} className="px-4 py-3 text-gray-600">
                        {row[col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {importResult && importResult.errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900 mb-2">
                  Validation Errors Found ({importResult.errors.length})
                </h4>
                <div className="text-sm text-red-700 max-h-40 overflow-y-auto">
                  {importResult.errors.slice(0, 5).map((err, idx) => (
                    <p key={idx} className="mb-1">
                      Row {err.row}: {err.field} - {err.message}
                    </p>
                  ))}
                  {importResult.errors.length > 5 && (
                    <p className="text-gray-600">
                      ...and {importResult.errors.length - 5} more errors
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep("upload")}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => setCurrentStep("mapping")}
              className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 flex items-center gap-2"
            >
              Map Columns
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderMappingStep = () => {
    const dbColumns = getTemplateColumns(entityType);

    return (
      <div className="space-y-6">
        <div className="bg-white border rounded-lg p-6">
          <h3 className="font-medium text-lg mb-4">Map Excel Columns to Database Fields</h3>
          <p className="text-gray-600 mb-6">
            Match each column from your Excel file to the corresponding field in the database.
          </p>

          <div className="space-y-4">
            {mapping.map((map) => (
              <div key={map.excelColumn} className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Excel Column: <span className="font-mono">{map.excelColumn}</span>
                  </label>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <select
                    value={map.databaseField}
                    onChange={(e) =>
                      handleMappingChange(map.excelColumn, e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">-- Select Field --</option>
                    {dbColumns.map((col) => (
                      <option key={col.key} value={col.key}>
                        {col.header}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep("preview")}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={() => setCurrentStep("validation")}
            className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 flex items-center gap-2"
          >
            Next Step
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderValidationStep = () => {
    if (!importResult) return null;

    const validPercentage = Math.round(
      (importResult.summary.valid / importResult.summary.total) * 100
    );

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">Total Records</p>
            <p className="text-2xl font-bold">{importResult.summary.total}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-sm text-green-600">Valid Records</p>
            <p className="text-2xl font-bold text-green-700">
              {importResult.summary.valid}
            </p>
            <p className="text-xs text-green-600">{validPercentage}%</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-sm text-red-600">Invalid Records</p>
            <p className="text-2xl font-bold text-red-700">
              {importResult.summary.invalid}
            </p>
          </div>
        </div>

        {importResult.errors.length > 0 && (
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-red-50 border-b">
              <h3 className="font-medium text-red-900">Validation Errors</h3>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Row</th>
                    <th className="px-4 py-2 text-left">Field</th>
                    <th className="px-4 py-2 text-left">Value</th>
                    <th className="px-4 py-2 text-left">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {importResult.errors.map((err, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="px-4 py-2">{err.row}</td>
                      <td className="px-4 py-2 font-mono">{err.field}</td>
                      <td className="px-4 py-2">{String(err.value)}</td>
                      <td className="px-4 py-2 text-red-600">{err.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep("mapping")}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={() => setCurrentStep("confirm")}
            className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 flex items-center gap-2"
          >
            Review & Confirm
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderConfirmStep = () => {
    if (!importResult) return null;

    return (
      <div className="space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-900 mb-1">
                Ready to Import
              </h4>
              <p className="text-sm text-amber-700">
                You are about to import{" "}
                <span className="font-bold">{importResult.summary.valid}</span>{" "}
                records into the {entityType} table.
              </p>
              {importResult.summary.invalid > 0 && (
                <p className="text-sm text-amber-700 mt-2">
                  {importResult.summary.invalid} records will be skipped due to validation errors.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep("validation")}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing || importResult.summary.valid === 0}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Confirm Import
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  const renderResultsStep = () => {
    if (!importResult) return null;

    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Import Complete!
          </h2>
          <p className="text-gray-600">
            Successfully imported {importResult.summary.valid} records
          </p>
          {importResult.summary.invalid > 0 && (
            <p className="text-red-600 mt-2">
              {importResult.summary.invalid} records failed validation
            </p>
          )}
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
          >
            Done
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <div>
            <h2 className="font-semibold text-xl">Import {entityType}</h2>
            <p className="text-sm text-gray-600">
              Import data from Excel spreadsheet
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {renderStepIndicator()}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </p>
            </div>
          )}

          {currentStep === "upload" && renderUploadStep()}
          {currentStep === "preview" && renderPreviewStep()}
          {currentStep === "mapping" && renderMappingStep()}
          {currentStep === "validation" && renderValidationStep()}
          {currentStep === "confirm" && renderConfirmStep()}
          {currentStep === "results" && renderResultsStep()}
        </div>
      </div>
    </div>
  );
}
