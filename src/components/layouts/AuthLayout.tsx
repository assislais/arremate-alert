import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { BarChart3 } from "lucide-react"
import { useAuthStore } from "@/store/authStore"

export function AuthLayout() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gradient mb-4">
            ArremateAlert
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            A plataforma mais avançada de análise de leilões do Brasil.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-left">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold text-sm">✓</span>
              </div>
              <span className="text-muted-foreground">
                Análises automáticas e precisas
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-left">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold text-sm">✓</span>
              </div>
              <span className="text-muted-foreground">
                Alertas em tempo real
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-left">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold text-sm">✓</span>
              </div>
              <span className="text-muted-foreground">
                Suporte 24/7 especializado
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-gradient ml-3">
              ArremateAlert
            </h1>
          </div>
          
          <Outlet />
        </div>
      </div>
    </div>
  )
}