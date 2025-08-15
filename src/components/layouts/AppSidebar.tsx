import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import {
  BarChart3,
  Bell,
  Calendar,
  CreditCard,
  Heart,
  Home,
  MessageCircle,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
  History
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/store/authStore"
import { cn } from "@/lib/utils"

const mainItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Nova Análise", url: "/analise/new", icon: Plus },
  { title: "Meus Interesses", url: "/interesses", icon: Heart },
  { title: "Sugestões", url: "/sugestoes", icon: Sparkles },
  { title: "Histórico", url: "/historico", icon: History },
  { title: "Meus Arremates", url: "/arremates", icon: TrendingUp },
]

const secondaryItems = [
  { title: "Calendário", url: "/calendario", icon: Calendar },
  { title: "Assinatura", url: "/assinatura", icon: CreditCard },
  { title: "Chat", url: "/chat", icon: MessageCircle },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const { subscription } = useAuthStore()
  const currentPath = location.pathname
  const collapsed = state === 'collapsed'

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/'
    return currentPath.startsWith(path)
  }

  const getNavCls = (active: boolean) =>
    cn(
      "transition-all duration-200",
      active 
        ? "bg-primary/20 text-primary border-r-2 border-primary font-medium" 
        : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
    )

  const getPlanBadgeColor = (plan?: string) => {
    switch (plan) {
      case 'starter': return 'bg-muted text-muted-foreground'
      case 'pro': return 'bg-primary/20 text-primary'
      case 'elite': return 'bg-gradient-primary text-primary-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <Sidebar className={cn(
      "border-r border-border transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <SidebarContent className="bg-sidebar">
        
        {/* Logo Area */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold text-gradient">ArremateAlert</h1>
                {subscription && (
                  <Badge className={cn("text-xs", getPlanBadgeColor(subscription.plan))}>
                    {subscription.plan.toUpperCase()}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={cn(!collapsed && "text-xs uppercase tracking-wide text-muted-foreground font-medium")}>
            {!collapsed && "Principal"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavCls(isActive(item.url))}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Secondary Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={cn(!collapsed && "text-xs uppercase tracking-wide text-muted-foreground font-medium")}>
            {!collapsed && "Ferramentas"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavCls(isActive(item.url))}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Usage Stats */}
        {!collapsed && subscription && (
          <div className="mt-auto p-4 border-t border-sidebar-border">
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Uso do mês</div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Análises</span>
                  <span>{subscription.usage.analyses}/{subscription.limits.analyses}</span>
                </div>
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ 
                      width: `${(subscription.usage.analyses / subscription.limits.analyses) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  )
}