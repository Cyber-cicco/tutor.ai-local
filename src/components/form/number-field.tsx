import { useFieldContext } from '../../hooks/form-context'

type NumberFieldProps = {
  label: string,
  min?: number,
  max?: number,
  mode?: "normal" | "small" | "large",
  err?: string
}

export default function NumberField({ label, min, max, mode = "normal", err }: NumberFieldProps) {
  const field = useFieldContext<string>()

  // Define different styles based on the mode
  const getInputStyles = () => {
    const baseStyles = "w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-primary transition-all duration-200"
    
    switch (mode) {
      case "small":
        return `${baseStyles} px-2 py-1 text-sm`
      case "large":
        return `${baseStyles} px-5 py-4 text-lg`
      default: // normal
        return `${baseStyles} px-4 py-3`
    }
  }

  // Define different label styles based on the mode
  const getLabelStyles = () => {
    const baseStyles = "block font-medium text-gray-700 mb-1"
    
    switch (mode) {
      case "small":
        return `${baseStyles} text-xs`
      case "large":
        return `${baseStyles} text-base`
      default: // normal
        return `${baseStyles} text-sm`
    }
  }

  return (
    <>
      <label className={getLabelStyles()}>{label}</label>
      <input 
        type="number"
        min={min}
        max={max}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={() => field.handleBlur()}
        className={getInputStyles()}
      />
      <div className={`text-red-500 ${mode === "small" ? "text-xs" : mode === "large" ? "text-base" : "text-sm"}`}>
        {err}
      </div>
    </>
  )
}
