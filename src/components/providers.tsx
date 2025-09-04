import { ToastProvider } from "../context/toast-context"

export const AppProvider = ({ children }: React.PropsWithChildren) => {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  )
}
