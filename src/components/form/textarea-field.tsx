import { useFieldContext } from '../../hooks/form-context'

export default function TextAreaField({ label, placeholder, err }: { label: string, placeholder: string, type?: "text" | "password", err?: string }) {
  const field = useFieldContext<string>()

  return (
    <>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-primary focus:border-blue-primary transition-all duration-200"
        value={field.state.value}
        placeholder={placeholder}
        onChange={(e) => field.handleChange(e.target.value)}
      ></textarea>
      <div className='text-red-500'>{err}</div>
    </>
  )
}
