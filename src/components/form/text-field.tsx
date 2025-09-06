import { useFieldContext } from '../../hooks/form-context'

type TextFieldProps = {
  label: string,
  placeholder: string,
  mode?: "normal" | "small" | "large",
  type?: "text" | "password",
  err?: string
  required?: boolean
}

export default function TextField({ label, placeholder, mode = "normal", type = "text", required=false, err }: TextFieldProps) {
  const field = useFieldContext<string>()

  // Define different styles based on the mode
  const getInputStyles = () => {
    const baseStyles = "w-full font-mono rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-primary transition-all duration-200"
    
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
      <label className={getLabelStyles()}>{label} {required && <span className='text-red-primary'>*</span>}</label>
      <input 
        type={type}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        className={getInputStyles()}
        placeholder={placeholder} 
        required={required}
      />
      <div className={`text-red-500 ${mode === "small" ? "text-xs" : mode === "large" ? "text-base" : "text-sm"}`}>
        {err}
      </div>
    </>
  )
}
