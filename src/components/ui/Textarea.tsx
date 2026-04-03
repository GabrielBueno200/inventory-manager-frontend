import { clsx } from 'clsx'
import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={4}
        className={clsx(
          'rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm resize-none',
          'placeholder:text-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
