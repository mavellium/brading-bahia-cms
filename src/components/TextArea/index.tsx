// Em @/components/TextArea.tsx
import { forwardRef } from 'react';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = '', rows = 4, ...props }, ref) => {
    const textareaElement = (
      <textarea
        ref={ref}
        rows={rows}
        className={`
          w-full px-4 py-3 
          bg-zinc-800 
          border ${error ? 'border-red-500' : 'border-zinc-700'}
          rounded-xl 
          focus:ring-2 focus:ring-[#0C8BD2] focus:border-transparent 
          transition-all duration-200 
          resize-none 
          text-white 
          ${className}
        `}
        {...props}
      />
    );

    if (!label) return textareaElement;

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-300">
          {label}
        </label>
        {textareaElement}
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';