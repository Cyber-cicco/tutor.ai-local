import { createContext, type PropsWithChildren, useContext, useState, useEffect, type ReactNode } from "react"

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  message: string | ReactNode | ((closeToast: () => void) => ReactNode)
  type: ToastType
  duration?: number
  closeable: boolean
}

type ToastContextProps = {
  showToast: (
    message: string | ReactNode | ((closeToast: () => void) => ReactNode), 
    type?: ToastType, 
    duration?: number, 
    closeable?: boolean
  ) => void
  removeToast: (id: string) => void
  toasts: Toast[]
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined)

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (
    message: string | ReactNode | ((closeToast: () => void) => ReactNode), 
    type: ToastType = 'info', 
    duration: number = 3000, 
    closeable: boolean = false
  ) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = { id, message, type, duration, closeable }
    
    setToasts(prev => [...prev, newToast])

    // Auto remove toast after duration only if not closeable
    if (!closeable) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const value = {
    showToast,
    removeToast,
    toasts
  }

  return (
    <ToastContext.Provider value={value}>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      {children}
    </ToastContext.Provider>
  )
}

const ToastContainer = ({ toasts, onRemove }: { toasts: Toast[], onRemove: (id: string) => void }) => {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

const ToastItem = ({ toast, onRemove }: { toast: Toast, onRemove: (id: string) => void }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onRemove(toast.id), 300) // Wait for animation
  }

  const getToastStyles = () => {
    const baseStyles = "flex items-center px-4 py-3 rounded-lg shadow-lg border transition-all duration-300 transform max-w-md"
    const visibilityStyles = isVisible 
      ? "translate-x-0 opacity-100" 
      : "translate-x-full opacity-0"

    switch (toast.type) {
      case 'success':
        return `${baseStyles} ${visibilityStyles} bg-gold-100 text-gold-800 border-gold-200`
      case 'error':
        return `${baseStyles} ${visibilityStyles} bg-red-100 text-red-800 border-red-200`
      case 'warning':
        return `${baseStyles} ${visibilityStyles} bg-orange-100 text-orange-800 border-orange-200`
      default:
        return `${baseStyles} ${visibilityStyles} bg-blue-100 text-blue-800 border-blue-200`
    }
  }

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )
      case 'error':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        )
    }
  }

  const renderMessage = () => {
    if (typeof toast.message === 'function') {
      return <div className="flex-1">{toast.message(handleClose)}</div>
    }
    if (typeof toast.message === 'string') {
      return <span className="flex-1">{toast.message}</span>
    }
    return <div className="flex-1">{toast.message}</div>
  }

  return (
    <div className={getToastStyles()}>
      {getIcon()}
      {renderMessage()}
      {toast.closeable && (
        <button
          onClick={handleClose}
          className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none flex-shrink-0 transition-colors duration-200"
          aria-label="Fermer le toast"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

