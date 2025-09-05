import { useFieldContext } from '../../hooks/form-context'

export default function DateField({ label, type="date", err }: { label: string, type?: "date" | "datetime-local" | "time", err?:string }) {
  const field = useFieldContext<string>()

  return (
    <>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type={type}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-primary"
        />
      <div className='text-red-500'>{err}</div>
    </>
  )
}
