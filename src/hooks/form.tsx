import { createFormHook } from '@tanstack/react-form'
import { fieldContext, formContext, useFormContext } from './form-context.tsx'
import TextField from '../components/form/text-field.tsx'
import DateField from '../components/form/date-field.tsx'
import TextAreaField from '../components/form/textarea-field.tsx'
import CheckBoxField from '../components/form/checkbox-field.tsx'
import ArrayTextField from '../components/form/arraytext-field.tsx'
import { Button } from '../components/common/button.tsx'
import { ArrayCheckBoxField } from '../components/form/arraycheckbox-field.tsx'
import NumberField from '../components/form/number-field.tsx'

function SubscribeButton({ label, model = "base", size = "long" }: { label: string, model?: "base" | "gray" | "empty", size? : "base" | "long" | "big" | "small" }) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => <Button type='submit' model={model} size={size} isLoading={isSubmitting}>{label}</Button>}
    </form.Subscribe>
  )
}

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
    DateField,
    TextAreaField,
    CheckBoxField,
    ArrayTextField,
    NumberField,
    ArrayCheckBoxField,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
})
