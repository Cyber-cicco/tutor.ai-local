import { useState, useEffect } from "react"
import { SpinnerIcon } from "../svg/SpinnerIcon"

type ButtonProps = {
  type?: "submit" | "reset" | "button" | undefined
  isDisabled?: boolean
  isLoading?: boolean
  children?: React.ReactNode
  model?: "base" | "gray" | "empty" | "red"
  size?: "base" | "long" | "big" | "small"
  onClick?: () => void
}
export const Button: React.FC<ButtonProps> = ({
  type = "button",
  isDisabled = false,
  isLoading = false,
  children = "Créer",
  model = "base",
  size = "base", // Added default value for size prop
  onClick = () => { },
}) => {
  const [disabled, setDisabled] = useState(isDisabled)
  const [isPressed, setIsPressed] = useState(false)
  // Sync with isDisabled prop
  useEffect(() => {
    setDisabled(isDisabled)
  }, [isDisabled])
  // Define model-specific styles
  const getModelStyles = () => {
    if (disabled) {
      return "bg-gray-400 text-gray-200 cursor-not-allowed"
    }
    switch (model) {
      case "gray":
        return "bg-gray-200 text-gray-700 hover:bg-gray-300"
      case "empty":
        return "bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50"
      case "red":
        return "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:scale-102 active:scale-98"
      case "base":
      default:
        return "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:scale-102 active:scale-98"
    }
  }
  // Define size-specific styles
  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return "px-2 py-1 text-sm"
      case "big":
        return "px-5 py-3 text-lg"
      case "long":
        return "px-8 py-2 w-full"
      case "base":
      default:
        return "px-3 py-2"
    }
  }
  return (
    <button
      type={type}
      className={`
        flex items-center justify-center gap-2
        ${getSizeStyles()} 
        font-medium rounded-lg
        overflow-hidden
        transition-all duration-300
        
        ${getModelStyles()}
        
        ${isPressed ? "scale-95" : ""}
        
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
        ${model !== "empty" ? "focus:shadow-lg" : ""}
        
        ${model !== "empty" ? `
        ` : ""}
        
        hover:cursor-pointer
      `}
      disabled={disabled || isLoading}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => {
        setIsPressed(false)
        onClick()
      }}
      onMouseLeave={() => setIsPressed(false)}
    >
      {isLoading && (
        <>

          {isLoading && (
            <>
              <SpinnerIcon
                className={`animate-spin -ml-1 mr-2 ${size === "small" ? "h-3 w-3" : size === "big" ? "h-5 w-5" : "h-4 w-4"} ${model === "empty" || model === "gray" ? "text-current" : "text-white"}`}
              />
            </>
          )}
        </>
      )}
      {children}
      {/* Ripple effect only for base, gray and red models */}
      {(model === "base" || model === "gray" || model === "red") && (
        <span className={`
          absolute inset-0 
          ${isPressed ? "animate-ripple" : ""}
          bg-white bg-opacity-30 
          rounded-full 
          transform scale-0
        `}></span>
      )}
    </button>
  )
}
