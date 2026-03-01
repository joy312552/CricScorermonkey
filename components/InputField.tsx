
import React from 'react';

interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false
}) => {
  return (
    <div className="w-full space-y-2">
      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
        {label} {required && <span className="text-emerald-600">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full bg-white border-2 ${error ? 'border-red-500' : 'border-slate-100'} text-slate-900 rounded-2xl px-5 py-4 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 placeholder:text-slate-300 font-bold`}
      />
      {error && <p className="text-xs text-red-500 font-bold ml-1 animate-in fade-in slide-in-from-top-1">{error}</p>}
    </div>
  );
};