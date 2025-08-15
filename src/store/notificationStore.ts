import { create } from 'zustand'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string
  actionUrl?: string
}

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  loadNotifications: () => Promise<void>
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(2),
      read: false,
      createdAt: new Date().toISOString()
    }
    
    set(state => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }))
  },

  markAsRead: (id) => {
    set(state => ({
      notifications: state.notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: state.notifications.filter(n => n.id === id && !n.read).length > 0 
        ? state.unreadCount - 1 
        : state.unreadCount
    }))
  },

  markAllAsRead: () => {
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0
    }))
  },

  removeNotification: (id) => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id),
      unreadCount: state.notifications.find(n => n.id === id && !n.read) 
        ? state.unreadCount - 1 
        : state.unreadCount
    }))
  },

  loadNotifications: async () => {
    // Mock de carregamento de notificações
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Novo leilão disponível',
        message: 'Encontramos 5 novos leilões que podem interessar você',
        type: 'info',
        read: false,
        createdAt: new Date(Date.now() - 60000).toISOString()
      },
      {
        id: '2',
        title: 'Análise concluída',
        message: 'A análise do leilão #12345 foi concluída',
        type: 'success',
        read: false,
        createdAt: new Date(Date.now() - 120000).toISOString(),
        actionUrl: '/analise/12345'
      },
      {
        id: '3',
        title: 'Limite de uso atingido',
        message: 'Você atingiu 80% do limite de análises do seu plano',
        type: 'warning',
        read: true,
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ]
    
    set({
      notifications: mockNotifications,
      unreadCount: mockNotifications.filter(n => !n.read).length
    })
  }
}))