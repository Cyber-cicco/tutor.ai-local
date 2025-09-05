import { useFieldContext } from '../../hooks/form-context'
import { TrashIcon } from '../svg/TrashIcon'

type NamedObject = {
  name: string;
} & {
  [key: string]: unknown;
}

export default function ArrayTextField({ placeholder, err, idx }: { placeholder: string, err?: string, idx: number }) {
  const field = useFieldContext<NamedObject[]>()

  return (
    <>
      <input type="text"
        value={field.state.value[idx].name}
        onChange={(e) => {
          const val = field.state.value
          val[idx].name = e.target.value
          field.setValue(val)
        }}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-primary"
        placeholder={placeholder} />
      <div className='text-red-500'>{err}</div>

      <button
        type="button"
        onClick={() => {
          const newVals = [...field.state.value];
          newVals.splice(idx, 1);
          field.setValue(newVals);
        }}
        className="text-gray-400 hover:text-red-500"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </>
  )
}
