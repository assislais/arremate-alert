import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: string
}

export interface Subscription {
  id: string
  plan: 'basic' | 'pro' | 'elite'
  status: 'active' | 'cancelled' | 'expired'
  startDate: string
  endDate: string
  limits: {
    analyses: number
    exports: number
    devices: number
    states: number | -1 // -1 = unlimited
    bestOpportunities: boolean
    eliteFeatures?: boolean
    communityAccess?: boolean
  }
  usage: {
    analyses: number
    exports: number
    activeDevices: number
  }
  discounts: {
    visitDiscounts: number // Descontos por visitas/uploads
    totalSaved: number
  }
  deviceSessions: {
    desktop: string | null
    mobile: string | null
  }
}

interface AuthState {
  user: User | null
  token: string | null
  subscription: Subscription | null
  isAuthenticated: boolean
  
  // Actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateSubscription: (subscription: Subscription) => void
  incrementUsage: (type: 'analyses' | 'exports') => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      subscription: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          // Mock da API de login
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Simular validação
          if (email === 'admin@test.com' && password === 'admin123') {
            const mockUser: User = {
              id: '1',
              name: 'João Silva',
              email: email,
              avatar: 'https://github.com/shadcn.png',
              createdAt: new Date().toISOString()
            }
            
            const mockSubscription: Subscription = {
              id: '1',
              plan: 'elite',
              status: 'active',
              startDate: new Date().toISOString(),
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              limits: { 
                analyses: 10, 
                exports: 25, 
                devices: 2, 
                states: -1, 
                bestOpportunities: true,
                eliteFeatures: true,
                communityAccess: true
              },
              usage: { analyses: 3, exports: 1, activeDevices: 1 },
              discounts: { visitDiscounts: 2, totalSaved: 20.00 },
              deviceSessions: { desktop: 'session-123', mobile: null }
            }
            
            const token = 'mock-jwt-token'
            
            set({
              user: mockUser,
              token,
              subscription: mockSubscription,
              isAuthenticated: true
            })
            
            // Salvar cookie
            document.cookie = `auth-token=${token}; path=/; max-age=86400`
            
            return { success: true }
          }
          
          return { success: false, error: 'Credenciais inválidas' }
        } catch (error) {
          return { success: false, error: 'Erro no servidor' }
        }
      },

      register: async (name: string, email: string, password: string) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const mockUser: User = {
            id: '1',
            name,
            email,
            createdAt: new Date().toISOString()
          }
          
          const mockSubscription: Subscription = {
            id: '1',
            plan: 'basic',
            status: 'active',
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            limits: { 
              analyses: 1, 
              exports: 5, 
              devices: 1, 
              states: 1, 
              bestOpportunities: true 
            },
            usage: { analyses: 0, exports: 0, activeDevices: 1 },
            discounts: { visitDiscounts: 0, totalSaved: 0 },
            deviceSessions: { desktop: 'session-456', mobile: null }
          }
          
          const token = 'mock-jwt-token'
          
          set({
            user: mockUser,
            token,
            subscription: mockSubscription,
            isAuthenticated: true
          })
          
          document.cookie = `auth-token=${token}; path=/; max-age=86400`
          
          return { success: true }
        } catch (error) {
          return { success: false, error: 'Erro no servidor' }
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          subscription: null,
          isAuthenticated: false
        })
        document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
      },

      updateSubscription: (subscription: Subscription) => {
        set({ subscription })
      },

      incrementUsage: (type: 'analyses' | 'exports') => {
        const { subscription } = get()
        if (subscription) {
          set({
            subscription: {
              ...subscription,
              usage: {
                ...subscription.usage,
                [type]: subscription.usage[type] + 1
              }
            }
          })
        }
      }
    }),
    {
      name: 'arremate-auth',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        subscription: state.subscription,
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
)