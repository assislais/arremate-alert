import { useState, useEffect } from "react"
import { Crown, TrendingUp, MapPin, Calendar, DollarSign, Eye, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useAuthStore } from "@/store/authStore"
import { Link } from "react-router-dom"

interface BestOpportunity {
  id: string
  titulo: string
  valorAtual: number
  valorEstimado: number
  margemPrevista: number
  score: number
  localizacao: string
  dataLeilao: string
  categoria: 'veiculos' | 'imoveis' | 'diversos'
  imagem: string
  motivo: string
  urgencia: 'alta' | 'media' | 'baixa'
}

export default function BestOpportunities() {
  const { subscription } = useAuthStore()
  const [opportunities, setOpportunities] = useState<BestOpportunity[]>([])
  const [filteredOpportunities, setFilteredOpportunities] = useState<BestOpportunity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState("")
  const [filterUrgency, setFilterUrgency] = useState("")

  const hasAccess = subscription?.limits.bestOpportunities

  useEffect(() => {
    if (!hasAccess) return

    // Mock data loading
    const loadOpportunities = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockOpportunities: BestOpportunity[] = [
        {
          id: '1',
          titulo: 'BMW X3 2018 xDrive28i',
          valorAtual: 145000,
          valorEstimado: 185000,
          margemPrevista: 27.5,
          score: 95,
          localizacao: 'São Paulo, SP',
          dataLeilao: '2024-08-26T14:00:00',
          categoria: 'veiculos',
          imagem: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400',
          motivo: 'Avaliação baixa do mercado, modelo em alta demanda',
          urgencia: 'alta'
        },
        {
          id: '2',
          titulo: 'Apartamento Duplex - Ipanema/RJ',
          valorAtual: 850000,
          valorEstimado: 1200000,
          margemPrevista: 41.2,
          score: 92,
          localizacao: 'Rio de Janeiro, RJ',
          dataLeilao: '2024-08-28T10:30:00',
          categoria: 'imoveis',
          imagem: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
          motivo: 'Localização premium, recém-reformado',
          urgencia: 'alta'
        },
        {
          id: '3',
          titulo: 'Mercedes-Benz C180 2019',
          valorAtual: 98000,
          valorEstimado: 125000,
          margemPrevista: 27.5,
          score: 88,
          localizacao: 'Curitiba, PR',
          dataLeilao: '2024-08-29T15:00:00',
          categoria: 'veiculos',
          imagem: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400',
          motivo: 'Baixa quilometragem, único dono',
          urgencia: 'media'
        },
        {
          id: '4',
          titulo: 'Equipamento Industrial Completo',
          valorAtual: 180000,
          valorEstimado: 220000,
          margemPrevista: 22.2,
          score: 85,
          localizacao: 'Belo Horizonte, MG',
          dataLeilao: '2024-08-25T16:30:00',
          categoria: 'diversos',
          imagem: 'https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?w=400',
          motivo: 'Equipamento seminovo, marca renomada',
          urgencia: 'baixa'
        }
      ]
      
      setOpportunities(mockOpportunities)
      setFilteredOpportunities(mockOpportunities)
      setIsLoading(false)
    }

    loadOpportunities()
  }, [hasAccess])

  useEffect(() => {
    let filtered = opportunities.filter(opp => {
      const matchesCategory = !filterCategory || opp.categoria === filterCategory
      const matchesUrgency = !filterUrgency || opp.urgencia === filterUrgency
      return matchesCategory && matchesUrgency
    })

    // Sort by score (highest first)
    filtered.sort((a, b) => b.score - a.score)

    setFilteredOpportunities(filtered)
  }, [opportunities, filterCategory, filterUrgency])

  const getUrgencyColor = (urgencia: string) => {
    switch (urgencia) {
      case 'alta': return 'bg-destructive/20 text-destructive'
      case 'media': return 'bg-warning/20 text-warning'
      case 'baixa': return 'bg-muted/20 text-muted-foreground'
      default: return 'bg-muted/20 text-muted-foreground'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success'
    if (score >= 80) return 'text-warning'
    return 'text-muted-foreground'
  }

  if (!hasAccess) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gradient mb-2">Melhores Oportunidades Hoje</h1>
          <p className="text-muted-foreground">Acesso exclusivo para assinantes Elite</p>
        </div>

        <Card className="card-glow max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Funcionalidade Premium</h3>
            <p className="text-muted-foreground mb-6">
              Esta funcionalidade está disponível apenas para assinantes do plano Elite. 
              Upgrade seu plano para acessar as melhores oportunidades diárias.
            </p>
            <Link to="/assinatura">
              <Button className="btn-premium">
                Fazer Upgrade
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Crown className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold text-gradient">Melhores Oportunidades Hoje</h1>
          </div>
          <p className="text-muted-foreground">
            Análises exclusivas com maior potencial de lucro
          </p>
        </div>
      </div>

      {/* Elite Badge */}
      <Alert className="border-primary/20 bg-primary/5">
        <Crown className="h-4 w-4 text-primary" />
        <AlertDescription className="text-primary">
          <strong>Funcionalidade Elite:</strong> Esta seção é atualizada diariamente com as oportunidades de maior potencial de lucro baseadas em nossa análise avançada.
        </AlertDescription>
      </Alert>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as categorias</SelectItem>
            <SelectItem value="veiculos">Veículos</SelectItem>
            <SelectItem value="imoveis">Imóveis</SelectItem>
            <SelectItem value="diversos">Bens Diversos</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterUrgency} onValueChange={setFilterUrgency}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Todas as urgências" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as urgências</SelectItem>
            <SelectItem value="alta">Alta urgência</SelectItem>
            <SelectItem value="media">Média urgência</SelectItem>
            <SelectItem value="baixa">Baixa urgência</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Opportunities Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="card-glow animate-pulse">
              <div className="flex">
                <div className="w-32 h-32 bg-muted" />
                <div className="flex-1 p-6 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOpportunities.map((opportunity, index) => (
            <Card key={opportunity.id} className="card-glow hover:scale-105 transition-all duration-200 relative overflow-hidden">
              {index < 3 && (
                <div className="absolute top-2 left-2 z-10">
                  <Badge className="bg-primary/20 text-primary border-primary">
                    #{index + 1} Top
                  </Badge>
                </div>
              )}
              
              <div className="flex">
                <div className="relative w-32 flex-shrink-0">
                  <img 
                    src={opportunity.imagem} 
                    alt={opportunity.titulo}
                    className="w-full h-32 object-cover"
                  />
                  <Badge className={`absolute bottom-2 left-2 text-xs ${getUrgencyColor(opportunity.urgencia)}`}>
                    {opportunity.urgencia}
                  </Badge>
                </div>
                
                <CardContent className="flex-1 p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-sm line-clamp-2">{opportunity.titulo}</h3>
                      <div className="text-right ml-2">
                        <div className={`text-lg font-bold ${getScoreColor(opportunity.score)}`}>
                          {opportunity.score}
                        </div>
                        <div className="text-xs text-muted-foreground">score</div>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {opportunity.motivo}
                    </p>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Valor atual:</span>
                        <span>{formatCurrency(opportunity.valorAtual)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Valor estimado:</span>
                        <span className="text-success font-medium">
                          {formatCurrency(opportunity.valorEstimado)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Margem prevista:</span>
                        <span className="text-success font-bold">
                          {opportunity.margemPrevista}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{opportunity.localizacao}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(opportunity.dataLeilao)}</span>
                      </div>
                    </div>

                    <Link to={`/lote/${opportunity.id}`}>
                      <Button size="sm" className="w-full btn-premium">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredOpportunities.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma oportunidade encontrada</h3>
          <p className="text-muted-foreground mb-4">
            Não há oportunidades que correspondam aos filtros selecionados.
          </p>
          <Button 
            variant="outline"
            onClick={() => {
              setFilterCategory("")
              setFilterUrgency("")
            }}
          >
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  )
}