import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { 
  TrendingUp, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Eye,
  AlertCircle,
  Sparkles
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatCurrency, formatDateTime, getRiskColor } from "@/lib/utils"
import { useAuthStore } from "@/store/authStore"

interface Opportunity {
  id: string
  titulo: string
  descricao: string
  valorAtual: number
  valorEstimado: number
  margemPotencial: number
  localizacao: string
  dataLeilao: string
  risco: 'baixo' | 'medio' | 'alto'
  categoria: string
  fotos: string[]
  leiloeiro: string
  status: 'ativo' | 'proximamente'
}

export default function BestOpportunities() {
  const { subscription } = useAuthStore()
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadOpportunities = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockOpportunities: Opportunity[] = [
        {
          id: '1',
          titulo: 'Apartamento 2 quartos - Copacabana/RJ',
          descricao: 'Apartamento com vista para o mar, necessita pequenos reparos',
          valorAtual: 280000,
          valorEstimado: 450000,
          margemPotencial: 60.7,
          localizacao: 'Copacabana, Rio de Janeiro/RJ',
          dataLeilao: '2024-08-25T14:00:00',
          risco: 'baixo',
          categoria: 'Imóvel',
          fotos: ['/placeholder.svg'],
          leiloeiro: 'Leiloeiro Silva & Associados',
          status: 'ativo'
        },
        {
          id: '2',
          titulo: 'Honda Civic 2019 - Baixa KM',
          descricao: 'Veículo seminovo com apenas 35.000km, conservado',
          valorAtual: 45000,
          valorEstimado: 65000,
          margemPotencial: 44.4,
          localizacao: 'São Paulo/SP',
          dataLeilao: '2024-08-23T10:30:00',
          risco: 'baixo',
          categoria: 'Veículo',
          fotos: ['/placeholder.svg'],
          leiloeiro: 'Auto Leilões Premium',
          status: 'ativo'
        },
        {
          id: '3',
          titulo: 'Loja Comercial - Centro Histórico',
          descricao: 'Imóvel comercial em região de alto fluxo',
          valorAtual: 180000,
          valorEstimado: 250000,
          margemPotencial: 38.9,
          localizacao: 'Belo Horizonte/MG',
          dataLeilao: '2024-08-27T16:00:00',
          risco: 'medio',
          categoria: 'Imóvel',
          fotos: ['/placeholder.svg'],
          leiloeiro: 'Leilões MG',
          status: 'proximamente'
        }
      ]
      
      setOpportunities(mockOpportunities)
      setIsLoading(false)
    }

    loadOpportunities()
  }, [])

  if (isLoading) {
    return (
      <Card className="card-glow">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>Melhores Oportunidades Hoje</CardTitle>
          </div>
          <CardDescription>
            Carregando as melhores oportunidades...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3 p-4 border border-border rounded-lg">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="card-glow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>Melhores Oportunidades Hoje</CardTitle>
          </div>
          <Badge variant="outline" className="text-primary border-primary">
            {opportunities.length} oportunidades
          </Badge>
        </div>
        <CardDescription>
          Seleção curada das melhores oportunidades com alto potencial de retorno
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Alert className="border-primary/20 bg-primary/5">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-primary">
            ⭐ Oportunidades atualizadas em tempo real baseadas em nossa análise de mercado
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          {opportunities.map((opportunity) => (
            <div key={opportunity.id} className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">
                    {opportunity.titulo}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {opportunity.descricao}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                    <MapPin className="h-3 w-3" />
                    {opportunity.localizacao}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-success mb-1">
                    {opportunity.margemPotencial}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    margem potencial
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <span className="text-muted-foreground">Valor atual:</span>
                  <div className="font-semibold">{formatCurrency(opportunity.valorAtual)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Valor estimado:</span>
                  <div className="font-semibold text-success">{formatCurrency(opportunity.valorEstimado)}</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`${getRiskColor(opportunity.risco)} border-current`}>
                    {opportunity.risco.toUpperCase()}
                  </Badge>
                  <Badge variant="secondary">
                    {opportunity.categoria}
                  </Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDateTime(opportunity.dataLeilao)}
                  </span>
                </div>
                
                <Button size="sm" variant="outline" asChild>
                  <Link to={`/lote/${opportunity.id}`}>
                    <Eye className="h-3 w-3 mr-1" />
                    Ver Detalhes
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <Button variant="outline" asChild>
            <Link to="/melhores-oportunidades">
              Ver Todas as Oportunidades
              <TrendingUp className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}