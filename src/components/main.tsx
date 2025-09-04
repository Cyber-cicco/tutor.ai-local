import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"
import { MainLayout } from "./layout/main"
import { HomePage } from "./home/main"
import { CoursePage } from "./course/main"
import { ProfilePage } from "./profile/main"
import { AppProvider } from "./providers"

export const Main = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout> <Outlet /></MainLayout>,
      children: [
        {
          path: "home",
          element: <HomePage />
        },
        {
          path: "course",
          element: <CoursePage />
        },
        {
          path: "profile",
          element: <ProfilePage />
        },
      ]
    }
  ])
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  )
}
