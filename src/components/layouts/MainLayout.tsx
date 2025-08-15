import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { AppHeader } from "./AppHeader"
import { useAuthStore } from "@/store/authStore"
import { useNotificationStore } from "@/store/notificationStore"

export function MainLayout() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { loadNotifications } = useNotificationStore()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    
    // Carregar notificações quando o layout for montado
    loadNotifications()
  }, [isAuthenticated, navigate, loadNotifications])

  if (!isAuthenticated) {
    return null
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}