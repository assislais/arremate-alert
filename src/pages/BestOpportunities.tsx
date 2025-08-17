import { useState, useEffect } from "react"
import { Crown, TrendingUp, MapPin, Calendar, DollarSign, Eye, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useAuthStore } from "@/store/authStore"
import { Link, useNavigate } from "react-router-dom"

interface OpportunityItem {
  id: string
  titulo: string
  descricao: string
  valorAtual: number
  valorEstimado: number
  potencialGanho: number
  margemPercentual: number
  imagem: string
  localizacao: string
  dataLeilao: string
  leiloeiro: string
  avaliacaoLeiloeiro: number
  categoria: string
  risco: 'baixo' | 'medio' | 'alto'
  motivoDestaque: string
  prioridadeScore: number
}

export default function BestOpportunities() {
  const { subscription } = useAuthStore()
  const navigate = useNavigate()
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se o usuário tem acesso (apenas Elite)
    if (!subscription?.limits.bestOpportunities) {
      navigate('/assinatura')
      return
    }

    // Mock data loading
    const loadOpportunities = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockOpportunities: OpportunityItem[] = [
        {
          id: '1',
          titulo: 'Apartamento Copacabana - Execução Fiscal',
          descricao: 'Apartamento 3 quartos, vista mar, necessita reforma',
          valorAtual: 420000,
          valorEstimado: 680000,
          potencialGanho: 260000,
          margemPercentual: 61.9,
          imagem: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600',
          localizacao: 'Rio de Janeiro, RJ',
          dataLeilao: '2024-08-25T10:00:00',
          leiloeiro: 'Leilões Carioca Premium',
          avaliacaoLeiloeiro: 4.8,
          categoria: 'Imóveis',
          risco: 'medio',
          motivoDestaque: 'Localização privilegiada + baixo interesse',
          prioridadeScore: 95
        }
      ]
      
      setOpportunities(mockOpportunities)
      setIsLoading(false)
    }

    loadOpportunities()
  }, [subscription, navigate])

  if (!subscription?.limits.bestOpportunities) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <Crown className="h-16 w-16 text-primary mx-auto mb-6" />
        <h2 className="text-3xl font-bold mb-4">Funcionalidade Exclusiva Elite</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Acesse as melhores oportunidades selecionadas por nossa IA com o plano Elite
        </p>
        <Link to="/assinatura">
          <Button size="lg" className="btn-premium">
            <Crown className="h-5 w-5 mr-2" />
            Fazer Upgrade para Elite
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Crown className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold text-gradient">Melhores Oportunidades Hoje</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Oportunidades selecionadas por nossa IA baseadas em análise de mercado, histórico de preços e baixo interesse de outros arrematadores
        </p>
        
        <Alert className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Exclusivo Elite:</strong> Esta análise é atualizada a cada 4 horas e considera mais de 15 fatores para identificar as melhores oportunidades.
          </AlertDescription>
        </Alert>
      </div>

      {/* Loading or Content */}
      {isLoading ? (
        <div className="text-center">Carregando oportunidades...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {opportunities.map((opportunity, index) => (
            <Card key={opportunity.id} className="card-glow hover:scale-105 transition-all duration-200">
              <div className="relative">
                <img 
                  src={opportunity.imagem} 
                  alt={opportunity.titulo}
                  className="w-full aspect-[4/3] object-cover rounded-t-lg"
                />
                <Badge className="absolute top-4 right-4 bg-gradient-primary text-primary-foreground font-bold">
                  #{index + 1} • {opportunity.prioridadeScore}pts
                </Badge>
              </div>
              
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-lg line-clamp-2 mb-2">{opportunity.titulo}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {opportunity.descricao}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-success/10 to-primary/10 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground block">Valor atual:</span>
                      <span className="font-bold">{formatCurrency(opportunity.valorAtual)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Potencial:</span>
                      <span className="font-bold text-success">{formatCurrency(opportunity.valorEstimado)}</span>
                    </div>
                  </div>
                </div>

                <Link to={`/lote/${opportunity.id}`}>
                  <Button className="w-full btn-premium">
                    <Eye className="h-4 w-4 mr-2" />
                    Analisar Oportunidade
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}