import { forwardRef } from "react";
import clsx from "clsx";

const fieldBase =
  "w-full rounded-xl border bg-paper px-4 py-2.5 text-[0.95rem] text-ink placeholder:text-graphite-light/70 transition-colors focus:border-ink";

function FieldWrapper({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-graphite-light">{hint}</p>}
      {error && (
        <p role="alert" className="text-xs font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className, ...props }, ref) => {
    const fieldId = id ?? props.name ?? label;
    return (
      <FieldWrapper label={label} htmlFor={fieldId} error={error} hint={hint}>
        <input
          ref={ref}
          id={fieldId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          className={clsx(
            fieldBase,
            error ? "border-red-400" : "border-line",
            className
          )}
          {...props}
        />
      </FieldWrapper>
    );
  }
);
Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, id, className, ...props }, ref) => {
    const fieldId = id ?? props.name ?? label;
    return (
      <FieldWrapper label={label} htmlFor={fieldId} error={error} hint={hint}>
        <textarea
          ref={ref}
          id={fieldId}
          aria-invalid={Boolean(error)}
          rows={5}
          className={clsx(
            fieldBase,
            "resize-none",
            error ? "border-red-400" : "border-line",
            className
          )}
          {...props}
        />
      </FieldWrapper>
    );
  }
);
Textarea.displayName = "Textarea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { label: string; value: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, id, className, ...props }, ref) => {
    const fieldId = id ?? props.name ?? label;
    return (
      <FieldWrapper label={label} htmlFor={fieldId} error={error}>
        <select
          ref={ref}
          id={fieldId}
          aria-invalid={Boolean(error)}
          className={clsx(fieldBase, error ? "border-red-400" : "border-line", className)}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </FieldWrapper>
    );
  }
);
Select.displayName = "Select";
