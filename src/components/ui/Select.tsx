import * as RadixSelect from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { clsx } from 'clsx'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  label?: string
  disabled?: boolean
  className?: string
}

export function Select({
  value,
  onValueChange,
  options,
  placeholder = 'Selecione...',
  label,
  disabled,
  className,
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <RadixSelect.Trigger
          className={clsx(
            'flex items-center justify-between rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            'data-[placeholder]:text-gray-400',
            className,
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <ChevronDown size={16} className="text-gray-500" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            className="z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg"
            position="popper"
            sideOffset={4}
          >
            <RadixSelect.Viewport className="p-1">
              {options.map((option) => (
                <RadixSelect.Item
                  key={option.value}
                  value={option.value}
                  className={clsx(
                    'relative flex cursor-pointer select-none items-center rounded px-8 py-2 text-sm text-gray-700',
                    'focus:bg-green-50 focus:text-green-700 focus:outline-none',
                    'data-[highlighted]:bg-green-50 data-[highlighted]:text-green-700',
                  )}
                >
                  <RadixSelect.ItemIndicator className="absolute left-2">
                    <Check size={14} />
                  </RadixSelect.ItemIndicator>
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </div>
  )
}
