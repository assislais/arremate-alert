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
  plan: 'starter' | 'pro' | 'elite'
  status: 'active' | 'cancelled' | 'expired'
  startDate: string
  endDate: string
  limits: {
    analyses: number
    exports: number
  }
  usage: {
    analyses: number
    exports: number
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
              plan: 'pro',
              status: 'active',
              startDate: new Date().toISOString(),
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              limits: { analyses: 5, exports: 25 },
              usage: { analyses: 2, exports: 3 }
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
            plan: 'starter',
            status: 'active',
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            limits: { analyses: 2, exports: 5 },
            usage: { analyses: 0, exports: 0 }
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