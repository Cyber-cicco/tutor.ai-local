// src/components/layout/main.tsx
import type { PropsWithChildren } from "react"
import { Navbar } from "../common/navbar"

export const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen min-w-screen main-bg">
      <Navbar />
      <main className="relative">
        {children}
      </main>
    </div>
  )
}
