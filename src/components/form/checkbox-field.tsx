import { useFieldContext } from '../../hooks/form-context'
import { CheckmarkIcon } from '../svg/CheckmarkIcon'

export default function CheckBoxField({ label, id, checked, disabled = false }: { 
  label: string, 
  id: number, 
  checked?: boolean, 
  disabled: boolean 
}) {
  const field = useFieldContext<Map<number, {
    ID: number;
    Checked: boolean;
    Name: string;
  }>>()

  return (
    <label
      className={`
        group relative flex items-center space-x-3 p-4 rounded-xl border-2 
        transition-all duration-200 ease-in-out cursor-pointer
        ${checked
          ? 'border-blue-primary bg-gradient-to-r from-blue-50 to-orange-50 shadow-md' 
          : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-gradient-to-r hover:from-blue-25 hover:to-orange-25 hover:shadow-sm'
        }
        ${disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:scale-[1.02] active:scale-[0.98]'
        }
        focus-within:ring-2 focus-within:ring-blue-primary focus-within:ring-opacity-20
      `}
    >
      {/* Custom checkbox styling */}
      <div className="relative flex-shrink-0">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          disabled={disabled}
          onChange={(e) => {
            if (disabled) return;
            
            const map = field.state.value
            const prev = map.get(id)
            if (prev) {
              prev.Checked = e.target.checked
            }
            field.setValue(map)
          }}
        />
        
        {/* Custom checkbox visual */}
        <div
          className={`
            w-6 h-6 rounded-lg border-2 flex items-center justify-center
            transition-all duration-200 ease-in-out
            ${checked
              ? 'bg-gradient-to-br from-blue-primary to-blue-600 border-blue-primary shadow-sm' 
              : 'bg-white border-gray-300 group-hover:border-blue-300'
            }
            ${!disabled && 'group-hover:shadow-md'}
          `}
        >
          {/* Checkmark icon */}
          {checked && (
            <CheckmarkIcon className="w-4 h-4 text-white animate-in zoom-in duration-150" />
          )}
        </div>
      </div>

      {/* Label with better typography */}
      <span 
        className={`
          font-medium text-base leading-relaxed transition-colors duration-200
          ${checked 
            ? 'text-blue-800' 
            : 'text-gray-700 group-hover:text-gray-900'
          }
        `}
      >
        {label}
      </span>

      {/* Subtle accent indicator when checked */}
      {checked && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-gold-400 rounded-full animate-pulse opacity-75" />
      )}
    </label>
  )
}
