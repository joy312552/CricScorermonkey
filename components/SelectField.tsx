
import React from 'react';

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string }[];
  error?: string;
  required?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  error,
  required = false
}) => {
  return (
    <div className="w-full space-y-1.5">
      <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider">
        {label} {required && <span className="text-emerald-500">*</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        className={`w-full bg-slate-800 border ${error ? 'border-red-500' : 'border-slate-700'} text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all appearance-none cursor-pointer`}
      >
        <option value="" disabled className="bg-slate-900">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
};
