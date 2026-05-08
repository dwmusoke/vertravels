import * as XLSX from "xlsx";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { companyInfo } from "./company-info";

export interface ExcelExportOptions {
  filename?: string;
  sheetName?: string;
  includeHeader?: boolean;
  branded?: boolean;
  columns?: { header: string; key: string; width?: number }[];
}

export interface ExcelImportResult<T> {
  data: T[];
  errors: ImportError[];
  summary: {
    total: number;
    valid: number;
    invalid: number;
  };
  preview?: {
    columns: string[];
    rows: any[];
  };
}

export interface ImportError {
  row: number;
  field: string;
  value: any;
  message: string;
}

export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: "string" | "number" | "date" | "email" | "phone";
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any, row: any) => string | null;
}

const BRAND_COLOR = {
  primary: { rgb: "0284c7", hex: "#0284c7" },
  secondary: { rgb: "0ea5e9", hex: "#0ea5e9" },
  light: { rgb: "e0f2fe", hex: "#e0f2fe" },
};

export async function exportToExcel<T extends Record<string, any>>(
  data: T[],
  filename: string,
  options: ExcelExportOptions = {}
): Promise<void> {
  const {
    filename: customFilename,
    sheetName = "Data",
    includeHeader = true,
    branded = true,
    columns,
  } = options;

  const finalFilename = customFilename || filename;

  if (branded) {
    await exportBrandedExcel(data, finalFilename, sheetName, columns);
  } else {
    exportSimpleExcel(data, finalFilename, sheetName, columns, includeHeader);
  }
}

function exportSimpleExcel<T extends Record<string, any>>(
  data: T[],
  filename: string,
  sheetName: string,
  columns?: { header: string; key: string; width?: number }[],
  includeHeader: boolean = true
): void {
  let ws: XLSX.WorkSheet;

  if (columns && columns.length > 0) {
    const formattedData = data.map((row) => {
      const formatted: Record<string, any> = {};
      columns.forEach((col) => {
        formatted[col.header] = row[col.key];
      });
      return formatted;
    });

    ws = XLSX.utils.json_to_sheet(formattedData);

    if (includeHeader) {
      const headerRange = XLSX.utils.decode_range(ws["!ref"] || "A1");
      headerRange.s.r = 0;
      headerRange.e.r = 0;
    }
  } else {
    ws = XLSX.utils.json_to_sheet(data);
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `${filename}.xlsx`);
}

async function exportBrandedExcel<T extends Record<string, any>>(
  data: T[],
  filename: string,
  sheetName: string,
  columns?: { header: string; key: string; width?: number }[]
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = companyInfo.name;
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(sheetName, {
    properties: {
      defaultRowHeight: 20,
    },
  });

  worksheet.columns = columns?.map((col) => ({
    key: col.key,
    header: col.header,
    width: col.width || 15,
  })) || [];

  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: `FF${BRAND_COLOR.primary.rgb}` },
  };
  headerRow.border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "medium" },
    right: { style: "thin" },
  };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };
  headerRow.height = 25;

  data.forEach((row, index) => {
    const rowIndex = index + 2;
    const worksheetRow = worksheet.getRow(rowIndex);

    columns?.forEach((col) => {
      const cell = worksheetRow.getCell(col.key);
      cell.value = row[col.key];

      if (typeof row[col.key] === "number") {
        cell.numFmt = "#,##0.00";
      }
    });

    worksheetRow.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    worksheetRow.alignment = { vertical: "middle" };
    worksheetRow.height = 22;
  });

  const lastRowNum = data.length + 1;
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1 && rowNumber <= lastRowNum) {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    }
  });

  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: worksheet.columnCount },
  };

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `${filename}.xlsx`);
}

export async function importFromExcel<T>(
  file: File,
  validationRules: ValidationRule[] = [],
  sheetName?: string
): Promise<ExcelImportResult<T>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = e.target?.result as ArrayBuffer;
        const workbook = XLSX.read(data, { type: "array", cellDates: true });

        const sheet = sheetName || workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheet];

        const jsonData = XLSX.utils.sheet_to_json<any>(worksheet, { raw: false });

        const result: ExcelImportResult<T> = {
          data: [],
          errors: [],
          summary: {
            total: jsonData.length,
            valid: 0,
            invalid: 0,
          },
        };

        jsonData.forEach((row, index) => {
          const rowErrors: ImportError[] = [];

          validationRules.forEach((rule) => {
            const value = row[rule.field];

            if (rule.required && (value === undefined || value === null || value === "")) {
              rowErrors.push({
                row: index + 2,
                field: rule.field,
                value,
                message: `${rule.field} is required`,
              });
              return;
            }

            if (value !== undefined && value !== null && value !== "") {
              if (rule.type === "number" && isNaN(Number(value))) {
                rowErrors.push({
                  row: index + 2,
                  field: rule.field,
                  value,
                  message: `${rule.field} must be a number`,
                });
              }

              if (rule.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                rowErrors.push({
                  row: index + 2,
                  field: rule.field,
                  value,
                  message: `${rule.field} must be a valid email`,
                });
              }

              if (rule.minLength && String(value).length < rule.minLength) {
                rowErrors.push({
                  row: index + 2,
                  field: rule.field,
                  value,
                  message: `${rule.field} must be at least ${rule.minLength} characters`,
                });
              }

              if (rule.maxLength && String(value).length > rule.maxLength) {
                rowErrors.push({
                  row: index + 2,
                  field: rule.field,
                  value,
                  message: `${rule.field} must be at most ${rule.maxLength} characters`,
                });
              }

              if (rule.type === "number" && rule.min !== undefined && Number(value) < rule.min) {
                rowErrors.push({
                  row: index + 2,
                  field: rule.field,
                  value,
                  message: `${rule.field} must be at least ${rule.min}`,
                });
              }

              if (rule.type === "number" && rule.max !== undefined && Number(value) > rule.max) {
                rowErrors.push({
                  row: index + 2,
                  field: rule.field,
                  value,
                  message: `${rule.field} must be at most ${rule.max}`,
                });
              }

              if (rule.pattern && !rule.pattern.test(String(value))) {
                rowErrors.push({
                  row: index + 2,
                  field: rule.field,
                  value,
                  message: `${rule.field} format is invalid`,
                });
              }

              if (rule.custom) {
                const customError = rule.custom(value, row);
                if (customError) {
                  rowErrors.push({
                    row: index + 2,
                    field: rule.field,
                    value,
                    message: customError,
                  });
                }
              }
            }
          });

          if (rowErrors.length > 0) {
            result.errors.push(...rowErrors);
            result.summary.invalid++;
          } else {
            result.data.push(row as T);
            result.summary.valid++;
          }
        });

        resolve(result);
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error}`));
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
}

export function getTemplateColumns(entityType: string): { header: string; key: string; width?: number }[] {
  const templates: Record<string, { header: string; key: string; width?: number }[]> = {
    bookings: [
      { header: "Booking Reference", key: "booking_reference", width: 20 },
      { header: "Customer Name", key: "customer_name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 20 },
      { header: "Destination", key: "destination", width: 20 },
      { header: "Travel Date", key: "travel_date", width: 15 },
      { header: "Return Date", key: "return_date", width: 15 },
      { header: "Service Type", key: "service_type", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Total Amount", key: "total_amount", width: 15 },
      { header: "Notes", key: "notes", width: 30 },
    ],
    invoices: [
      { header: "Invoice Number", key: "invoice_number", width: 20 },
      { header: "Customer Name", key: "customer_name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Issue Date", key: "issue_date", width: 15 },
      { header: "Due Date", key: "due_date", width: 15 },
      { header: "Subtotal", key: "subtotal", width: 15 },
      { header: "Tax", key: "tax", width: 15 },
      { header: "Total", key: "total", width: 15 },
      { header: "Amount Paid", key: "amount_paid", width: 15 },
      { header: "Balance", key: "balance", width: 15 },
      { header: "Status", key: "status", width: 15 },
    ],
    quotations: [
      { header: "Quote Number", key: "quote_number", width: 20 },
      { header: "Customer Name", key: "customer_name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 20 },
      { header: "Destination", key: "destination", width: 20 },
      { header: "Travel Date", key: "travel_date", width: 15 },
      { header: "Duration (Days)", key: "duration", width: 15 },
      { header: "Service Type", key: "service_type", width: 15 },
      { header: "Total Price", key: "total_price", width: 15 },
      { header: "Valid Until", key: "valid_until", width: 15 },
      { header: "Status", key: "status", width: 15 },
    ],
    suppliers: [
      { header: "Supplier Code", key: "supplier_code", width: 15 },
      { header: "Supplier Name", key: "supplier_name", width: 30 },
      { header: "Type", key: "supplier_type", width: 15 },
      { header: "Contact Person", key: "contact_person", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 20 },
      { header: "Address", key: "address", width: 40 },
      { header: "Payment Terms", key: "payment_terms", width: 15 },
      { header: "Credit Limit", key: "credit_limit", width: 15 },
      { header: "Commission Rate", key: "commission_rate", width: 15 },
      { header: "Status", key: "status", width: 15 },
    ],
    manual_postings: [
      { header: "Posting Number", key: "posting_number", width: 20 },
      { header: "Posting Type", key: "posting_type", width: 15 },
      { header: "PNR", key: "pnr", width: 15 },
      { header: "Ticket Number", key: "ticket_number", width: 20 },
      { header: "Passenger Name", key: "passenger_name", width: 25 },
      { header: "Route", key: "route_description", width: 30 },
      { header: "Travel Date", key: "travel_date", width: 15 },
      { header: "Base Fare", key: "fare", width: 15 },
      { header: "Tax", key: "tax", width: 15 },
      { header: "Commission", key: "commission", width: 15 },
      { header: "Total", key: "total_amount", width: 15 },
      { header: "Airline Code", key: "airline_code", width: 15 },
      { header: "Status", key: "status", width: 15 },
    ],
    customers: [
      { header: "Customer Name", key: "customer_name", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 20 },
      { header: "Address", key: "address", width: 40 },
      { header: "City", key: "city", width: 20 },
      { header: "Country", key: "country", width: 20 },
      { header: "Customer Type", key: "customer_type", width: 15 },
      { header: "Status", key: "status", width: 15 },
    ],
  };

  return templates[entityType] || [];
}

export function getValidationRules(entityType: string): ValidationRule[] {
  const rules: Record<string, ValidationRule[]> = {
    bookings: [
      { field: "customer_name", required: true, minLength: 2 },
      { field: "email", required: true, type: "email" },
      { field: "destination", required: true },
      { field: "travel_date", required: true, type: "date" },
      { field: "total_amount", required: true, type: "number", min: 0 },
    ],
    invoices: [
      { field: "invoice_number", required: true },
      { field: "customer_name", required: true },
      { field: "issue_date", required: true, type: "date" },
      { field: "due_date", required: true, type: "date" },
      { field: "total", required: true, type: "number", min: 0 },
    ],
    quotations: [
      { field: "quote_number", required: true },
      { field: "customer_name", required: true },
      { field: "email", required: true, type: "email" },
      { field: "total_price", required: true, type: "number", min: 0 },
      { field: "valid_until", required: true, type: "date" },
    ],
    suppliers: [
      { field: "supplier_name", required: true, minLength: 2 },
      { field: "email", required: true, type: "email" },
      { field: "phone", required: false, type: "phone" },
      { field: "commission_rate", type: "number", min: 0, max: 100 },
    ],
    manual_postings: [
      { field: "posting_type", required: true },
      { field: "passenger_name", required: true, minLength: 2 },
      { field: "route_description", required: true },
      { field: "travel_date", required: true, type: "date" },
      { field: "fare", required: true, type: "number", min: 0 },
      { field: "tax", required: true, type: "number", min: 0 },
    ],
  };

  return rules[entityType] || [];
}

export function formatDateForExcel(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().split("T")[0];
}

export function formatCurrencyForExcel(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export async function downloadTemplate(entityType: string): Promise<void> {
  const columns = getTemplateColumns(entityType);
  const sampleData: Record<string, any>[] = [];

  const sampleRow: Record<string, any> = {};
  columns.forEach((col) => {
    sampleRow[col.key] = getSampleValue(col.key);
  });
  sampleData.push(sampleRow);

  await exportToExcel(sampleData, `${entityType}-template`, {
    filename: `${entityType}-template`,
    sheetName: "Template",
    columns,
    branded: true,
    includeHeader: true,
  });
}

function getSampleValue(key: string): any {
  const samples: Record<string, any> = {
    booking_reference: "BKG-001",
    customer_name: "John Doe",
    email: "john@example.com",
    phone: "+256 700 123456",
    destination: "Dubai",
    travel_date: "2026-06-01",
    return_date: "2026-06-10",
    service_type: "flight",
    status: "confirmed",
    total_amount: 1500,
    notes: "Window seat preferred",
    invoice_number: "INV-2026-001",
    issue_date: "2026-05-01",
    due_date: "2026-05-15",
    subtotal: 1000,
    tax: 180,
    total: 1180,
    amount_paid: 500,
    balance: 680,
    quote_number: "QT-2026-001",
    duration: 7,
    total_price: 2500,
    valid_until: "2026-06-01",
    supplier_code: "SUP-001",
    supplier_name: "Emirates Airlines",
    supplier_type: "airline",
    contact_person: "Jane Smith",
    address: "123 Main Street, Kampala",
    payment_terms: "NET 30",
    credit_limit: 10000,
    commission_rate: 10,
    posting_number: "MAN-001",
    posting_type: "flight",
    pnr: "ABC123",
    ticket_number: "1761234567890",
    route_description: "EBB → LHR → JFK",
    fare: 1200,
    airline_code: "EK",
  };

  return samples[key] || "";
}

export function validateExcelData<T>(data: T[], rules: ValidationRule[]): ExcelImportResult<T> {
  const result: ExcelImportResult<T> = {
    data: [],
    errors: [],
    summary: {
      total: data.length,
      valid: 0,
      invalid: 0,
    },
  };

  data.forEach((row, index) => {
    const rowErrors: ImportError[] = [];

    rules.forEach((rule) => {
      const value = (row as any)[rule.field];

      if (rule.required && (value === undefined || value === null || value === "")) {
        rowErrors.push({
          row: index + 2,
          field: rule.field,
          value,
          message: `${rule.field} is required`,
        });
        return;
      }

      if (value !== undefined && value !== null && value !== "") {
        if (rule.custom) {
          const customError = rule.custom(value, row);
          if (customError) {
            rowErrors.push({
              row: index + 2,
              field: rule.field,
              value,
              message: customError,
            });
          }
        }
      }
    });

    if (rowErrors.length > 0) {
      result.errors.push(...rowErrors);
      result.summary.invalid++;
    } else {
      result.data.push(row);
      result.summary.valid++;
    }
  });

  return result;
}
