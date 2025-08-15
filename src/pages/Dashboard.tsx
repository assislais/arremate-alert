import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  Plus,
  BarChart3,
  Heart,
  Sparkles,
  TrendingUp,
  Calendar,
  Clock,
  DollarSign,
  Target,
  AlertTriangle,
  Eye
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuthStore } from "@/store/authStore"
import { formatCurrency, formatDateTime } from "@/lib/utils"

interface DashboardMetrics {
  leiloesAtivos: number
  leiloesHoje: number
  melhorMargem: number
  proximosPrazos: number
  totalAnalises: number
  totalInteresses: number
  totalArremates: number
  margemMedia: number
}

interface DicaSemana {
  id: string
  titulo: string
  descricao: string
  categoria: 'video' | 'artigo' | 'dica'
  url?: string
  visualizacoes: number
  duracao?: string
}

interface LeilaoDestaque {
  id: string
  titulo: string
  valorInicial: number
  valorEstimado: number
  margemPrevista: number
  dataLeilao: string
  status: 'ativo' | 'proximamente' | 'encerrado'
  risco: 'baixo' | 'medio' | 'alto'
}

export default function Dashboard() {
  const { user, subscription } = useAuthStore()
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [dicasSemana, setDicasSemana] = useState<DicaSemana[]>([])
  const [leiloesDestaque, setLeiloesDestaque] = useState<LeilaoDestaque[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento de dados
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMetrics({
        leiloesAtivos: 1247,
        leiloesHoje: 23,
        melhorMargem: 45.8,
        proximosPrazos: 8,
        totalAnalises: subscription?.usage.analyses || 0,
        totalInteresses: 15,
        totalArremates: 3,
        margemMedia: 28.4
      })

      setDicasSemana([
        {
          id: '1',
          titulo: 'Como Avaliar Riscos em Imóveis Comerciais',
          descricao: 'Aprenda as principais métricas para avaliar imóveis comerciais em leilões',
          categoria: 'video',
          visualizacoes: 2348,
          duracao: '12:34'
        },
        {
          id: '2',
          titulo: 'Estratégias de Lance: Quando Parar',
          descricao: 'Defina seus limites e evite lances emocionais',
          categoria: 'artigo',
          visualizacoes: 1876
        },
        {
          id: '3',
          titulo: 'Análise de Mercado: Zona Sul SP',
          descricao: 'Tendências e oportunidades na região mais valorizada da capital',
          categoria: 'dica',
          visualizacoes: 967
        }
      ])

      setLeiloesDestaque([
        {
          id: '1',
          titulo: 'Apartamento 3 quartos - Copacabana/RJ',
          valorInicial: 280000,
          valorEstimado: 420000,
          margemPrevista: 33.3,
          dataLeilao: '2024-08-20T14:00:00',
          status: 'ativo',
          risco: 'baixo'
        },
        {
          id: '2',
          titulo: 'Sala Comercial - Centro/SP',
          valorInicial: 150000,
          valorEstimado: 200000,
          margemPrevista: 25.0,
          dataLeilao: '2024-08-22T10:30:00',
          status: 'proximamente',
          risco: 'medio'
        },
        {
          id: '3',
          titulo: 'Casa 4 quartos - Barra da Tijuca/RJ',
          valorInicial: 450000,
          valorEstimado: 520000,
          margemPrevista: 13.5,
          dataLeilao: '2024-08-18T16:00:00',
          status: 'ativo',
          risco: 'alto'
        }
      ])

      setIsLoading(false)
    }

    loadData()
  }, [subscription])

  const quickActions = [
    {
      title: "Nova Análise",
      description: "Analisar um novo leilão",
      icon: Plus,
      href: "/analise/new",
      color: "bg-primary text-primary-foreground"
    },
    {
      title: "Meus Interesses",
      description: "Acompanhar leilões salvos",
      icon: Heart,
      href: "/interesses",
      color: "bg-success text-success-foreground"
    },
    {
      title: "Sugestões",
      description: "Ver recomendações da semana",
      icon: Sparkles,
      href: "/sugestoes",
      color: "bg-warning text-warning-foreground"
    },
    {
      title: "Meus Arremates",
      description: "Gerenciar arremates",
      icon: TrendingUp,
      href: "/arremates",
      color: "bg-accent text-accent-foreground"
    }
  ]

  const getRiskColor = (risco: string) => {
    switch (risco) {
      case 'baixo': return 'text-success'
      case 'medio': return 'text-warning'
      case 'alto': return 'text-destructive'
      default: return 'text-muted-foreground'
    }
  }

  const getRiskBadge = (risco: string) => {
    switch (risco) {
      case 'baixo': return 'bg-success/20 text-success'
      case 'medio': return 'bg-warning/20 text-warning'
      case 'alto': return 'bg-destructive/20 text-destructive'
      default: return 'bg-muted/20 text-muted-foreground'
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">
            Olá, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Aqui está um resumo dos seus leilões hoje
          </p>
        </div>
        
        {subscription && (
          <div className="text-right">
            <Badge className="mb-2">
              Plano {subscription.plan.toUpperCase()}
            </Badge>
            <div className="text-sm text-muted-foreground">
              {subscription.usage.analyses}/{subscription.limits.analyses} análises usadas
            </div>
            <Progress 
              value={(subscription.usage.analyses / subscription.limits.analyses) * 100} 
              className="w-32 h-2 mt-1"
            />
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Link key={index} to={action.href}>
            <Card className="card-glow hover:scale-105 transition-all duration-200 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${action.color}`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="card-glow">
              <CardContent className="p-6">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card className="card-glow">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Leilões Ativos</span>
                </div>
                <div className="text-2xl font-bold">{metrics?.leiloesAtivos.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="card-glow">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-success" />
                  <span className="text-sm text-muted-foreground">Novos Hoje</span>
                </div>
                <div className="text-2xl font-bold text-success">{metrics?.leiloesHoje}</div>
              </CardContent>
            </Card>

            <Card className="card-glow">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-warning" />
                  <span className="text-sm text-muted-foreground">Melhor Margem</span>
                </div>
                <div className="text-2xl font-bold text-warning">{metrics?.melhorMargem}%</div>
              </CardContent>
            </Card>

            <Card className="card-glow">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-destructive" />
                  <span className="text-sm text-muted-foreground">Próximos Prazos</span>
                </div>
                <div className="text-2xl font-bold text-destructive">{metrics?.proximosPrazos}</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Dicas da Semana */}
        <div className="lg:col-span-2">
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Dicas da Semana
              </CardTitle>
              <CardDescription>
                Conteúdo selecionado para aprimorar suas estratégias
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                ))
              ) : (
                dicasSemana.map((dica) => (
                  <div key={dica.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{dica.titulo}</h4>
                      <Badge variant="outline" className="text-xs">
                        {dica.categoria}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {dica.descricao}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {dica.visualizacoes.toLocaleString()}
                      </span>
                      {dica.duracao && (
                        <span>{dica.duracao}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Leilões em Destaque */}
        <div>
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Leilões em Destaque
              </CardTitle>
              <CardDescription>
                Oportunidades com alto potencial
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2 p-3 border border-border rounded">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))
              ) : (
                leiloesDestaque.map((leilao) => (
                  <div key={leilao.id} className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <h4 className="font-medium text-sm mb-2">{leilao.titulo}</h4>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Valor inicial:</span>
                        <span>{formatCurrency(leilao.valorInicial)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Margem prevista:</span>
                        <span className={getRiskColor(leilao.risco)}>
                          {leilao.margemPrevista}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Data:</span>
                        <span>{formatDateTime(leilao.dataLeilao)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <Badge className={getRiskBadge(leilao.risco)}>
                        {leilao.risco}
                      </Badge>
                      <Button size="sm" variant="outline">
                        Ver detalhes
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}