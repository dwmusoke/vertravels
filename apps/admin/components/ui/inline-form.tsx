"use client";

import React, { useEffect, useCallback } from "react";
import { X, Save, Loader2 } from "lucide-react";

interface InlineFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  children: React.ReactNode;
  title: string;
  isLoading?: boolean;
  isDirty?: boolean;
  validate?: () => { valid: boolean; errors: string[] };
}

export function InlineForm({
  isOpen,
  onClose,
  onSave,
  children,
  title,
  isLoading = false,
  isDirty = false,
  validate,
}: InlineFormProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSubmit();
      }
    },
    [isOpen, onClose, onSave]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleSubmit = async () => {
    if (validate) {
      const validation = validate();
      if (!validation.valid) {
        alert(validation.errors.join("\n"));
        return;
      }
    }

    try {
      await onSave(null);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="inline-form-container border-b bg-sky-50/50 animate-in slide-in-from-top-2 duration-300">
      <div className="px-6 py-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-sky-600 rounded" />
            <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              <kbd className="px-2 py-1 bg-gray-100 rounded border">Ctrl+S</kbd> to save
              <kbd className="px-2 py-1 bg-gray-100 rounded border ml-2">Esc</kbd> to cancel
            </span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child as React.ReactElement<any>, {
                onSave: handleSubmit,
                isLoading,
              });
            }
            return child;
          })}
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || (isDirty === false && !isLoading)}
            className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

interface InlineFormContextValue {
  registerField: (name: string, value: any) => void;
  unregisterField: (name: string) => void;
  getValues: () => Record<string, any>;
  setValues: (values: Record<string, any>) => void;
  errors: Record<string, string>;
  setError: (name: string, message: string) => void;
  clearError: (name: string) => void;
  isDirty: boolean;
  isLoading: boolean;
}

const InlineFormContext = React.createContext<InlineFormContextValue | null>(null);

export function InlineFormProvider({
  children,
  initialValues = {},
  onSubmit,
}: {
  children: React.ReactNode;
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => Promise<void>;
}) {
  const [values, setValues] = React.useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const fieldsRef = React.useRef<Record<string, any>>({});

  const registerField = useCallback((name: string, value: any) => {
    fieldsRef.current[name] = value;
  }, []);

  const unregisterField = useCallback((name: string) => {
    delete fieldsRef.current[name];
  }, []);

  const getValues = useCallback(() => {
    return { ...fieldsRef.current };
  }, []);

  const setFieldValues = useCallback((newValues: Record<string, any>) => {
    Object.entries(newValues).forEach(([key, value]) => {
      fieldsRef.current[key] = value;
    });
    setValues(newValues);
  }, []);

  const setError = useCallback((name: string, message: string) => {
    setErrors((prev) => ({ ...prev, [name]: message }));
  }, []);

  const clearError = useCallback((name: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  const handleValueChange = useCallback((name: string, value: any) => {
    fieldsRef.current[name] = value;
    setIsDirty(true);
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSubmit(getValues());
      setIsDirty(false);
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: InlineFormContextValue = {
    registerField,
    unregisterField,
    getValues,
    setValues: setFieldValues,
    errors,
    setError,
    clearError,
    isDirty,
    isLoading,
  };

  return (
    <InlineFormContext.Provider value={contextValue}>
      {children}
      <div className="flex items-center justify-end gap-3 pt-4 border-t mt-4">
        <button
          type="button"
          onClick={() => setFieldValues(initialValues)}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
          disabled={isLoading || !isDirty}
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save
            </>
          )}
        </button>
      </div>
    </InlineFormContext.Provider>
  );
}

export function useInlineForm() {
  const context = React.useContext(InlineFormContext);
  if (!context) {
    throw new Error("useInlineForm must be used within InlineFormProvider");
  }
  return context;
}

interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "number" | "email" | "tel" | "date" | "select" | "textarea";
  value?: any;
  onChange?: (value: any) => void;
  options?: { label: string; value: any }[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  className?: string;
  error?: string;
}

export function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  options,
  placeholder,
  required,
  disabled,
  rows,
  className,
  error,
}: FormFieldProps) {
  const context = useInlineForm();
  const [localValue, setLocalValue] = React.useState(value || "");

  useEffect(() => {
    context.registerField(name, localValue);
    return () => context.unregisterField(name);
  }, [name, context, localValue]);

  useEffect(() => {
    if (value !== undefined && value !== localValue) {
      setLocalValue(value);
    }
  }, [value]);

  const handleChange = (newValue: any) => {
    setLocalValue(newValue);
    context.clearError(name);
    onChange?.(newValue);
  };

  const fieldError = error || context.errors[name];

  const baseClasses = `w-full px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent ${
    disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
  } ${fieldError ? "border-red-500" : "border-gray-300"} ${className || ""}`;

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {type === "select" ? (
        <select
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          className={baseClasses}
          disabled={disabled}
        >
          <option value="">Select...</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          className={baseClasses}
          placeholder={placeholder}
          rows={rows || 3}
          disabled={disabled}
        />
      ) : (
        <input
          type={type}
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          className={baseClasses}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}

      {fieldError && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <span>{fieldError}</span>
        </p>
      )}
    </div>
  );
}

interface FormRowProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function FormRow({ children, columns = 2, className }: FormRowProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 ${className || ""}`}>
      {children}
    </div>
  );
}

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, children, className }: FormSectionProps) {
  return (
    <div className={`border rounded-lg p-4 bg-white ${className || ""}`}>
      <h4 className="font-medium text-gray-900 mb-3 pb-2 border-b">{title}</h4>
      {children}
    </div>
  );
}
