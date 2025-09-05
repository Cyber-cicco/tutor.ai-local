// src/components/layout/main.tsx
import type { PropsWithChildren } from "react"
import { Navbar } from "../common/navbar"

export const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <main className="relative">
        {children}
      </main>
    </div>
  )
}
