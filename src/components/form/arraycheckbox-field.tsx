import { useFieldContext } from "../../hooks/form-context"
import { CheckmarkIcon } from "../svg/CheckmarkIcon"

type ArrayCheckBoxFieldProps = {
  label: string
  disabled: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const ArrayCheckBoxField: React.FC<ArrayCheckBoxFieldProps> = ({ label, disabled, onChange }) => {
  const field = useFieldContext<boolean>()
  return (
    <>
      <label
        className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-150 ${field.state.value
            ? 'border-gold-600 bg-gold-50 shadow-sm'
            : 'border-gray-200 hover:bg-gray-50'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-sm'}`}
      >
        <div className="relative">
          <input
            type="checkbox"
            className={`appearance-none h-5 w-5 rounded border ${field.state.value
                ? 'border-gold-600 bg-gold-600'
                : 'border-gray-300 bg-white'
              } transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-opacity-50`}
            checked={field.state.value}
            disabled={disabled}
            onChange={onChange}
          />
          {field.state.value && (

            <CheckmarkIcon className="absolute inset-0 h-5 w-5 text-white pointer-events-none" />
          )}
        </div>
        <span className="text-gray-700 font-medium">{label}</span>
      </label>
    </>
  )
}
