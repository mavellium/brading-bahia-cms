// Em @/components/Input.tsx
import { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const inputElement = (
      <input
        ref={ref}
        className={`
          w-full px-4 py-3 
          bg-zinc-800 
          border ${error ? 'border-red-500' : 'border-zinc-700'}
          rounded-xl 
          focus:ring-2 focus:ring-[#0C8BD2] focus:border-transparent 
          transition-all duration-200 
          text-white 
          ${className}
        `}
        {...props}
      />
    );

    if (!label) return inputElement;

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-300">
          {label}
        </label>
        {inputElement}
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';