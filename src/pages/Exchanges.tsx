import { useState, useEffect } from "react"
import { Repeat2, Plus, MapPin, Calendar, Search, Filter, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { formatDateTime } from "@/lib/utils"
import { useAuthStore } from "@/store/authStore"

interface TradeOffer {
  id: string
  user: {
    name: string
    avatar: string
    location: string
    rating: number
    plan: 'basico' | 'elite'
  }
  offering: string
  offeringValue: number
  seeking: string
  seekingValue: number
  category: 'veiculos' | 'imoveis' | 'diversos'
  timestamp: string
  status: 'open' | 'negotiating' | 'closed'
  description: string
  images: string[]
  interested: number
}

export default function Exchanges() {
  const { user } = useAuthStore()
  const [trades, setTrades] = useState<TradeOffer[]>([])
  const [filteredTrades, setFilteredTrades] = useState<TradeOffer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [newTrade, setNewTrade] = useState({
    offering: "",
    offeringValue: "",
    seeking: "",
    seekingValue: "",
    category: "",
    description: ""
  })

  useEffect(() => {
    // Mock data loading
    const loadTrades = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockTrades: TradeOffer[] = [
        {
          id: '1',
          user: {
            name: 'Ana Costa',
            avatar: '',
            location: 'São Paulo, SP',
            rating: 4.8,
            plan: 'elite'
          },
          offering: 'Honda Civic 2018 LX CVT',
          offeringValue: 75000,
          seeking: 'Toyota Corolla 2019+ XEI',
          seekingValue: 80000,
          category: 'veiculos',
          timestamp: '2024-08-16T11:00:00',
          status: 'open',
          description: 'Carro em excelente estado, única dona, todas as revisões em dia. Aceito propostas similares ou com diferença.',
          images: ['https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400'],
          interested: 5
        },
        {
          id: '2',
          user: {
            name: 'Roberto Lima',
            avatar: '',
            location: 'Belo Horizonte, MG',
            rating: 4.5,
            plan: 'basico'
          },
          offering: 'Torno CNC Romi Galaxy 20',
          offeringValue: 120000,
          seeking: 'Centro de Usinagem ou Fresadora',
          seekingValue: 110000,
          category: 'diversos',
          timestamp: '2024-08-16T10:20:00',
          status: 'negotiating',
          description: 'Máquina seminova, pouco uso, completa com todos os acessórios. Troco por equipamento similar.',
          images: ['https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?w=400'],
          interested: 3
        },
        {
          id: '3',
          user: {
            name: 'Carlos Pereira',
            avatar: '',
            location: 'Rio de Janeiro, RJ',
            rating: 4.9,
            plan: 'elite'
          },
          offering: 'Apartamento 2Q Copacabana',
          offeringValue: 650000,
          seeking: 'Casa Barra da Tijuca 3Q',
          seekingValue: 580000,
          category: 'imoveis',
          timestamp: '2024-08-16T08:45:00',
          status: 'open',
          description: 'Apartamento reformado com vista mar, próximo ao metrô. Aceito casa na Barra com diferença.',
          images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'],
          interested: 8
        },
        {
          id: '4',
          user: {
            name: 'Marina Silva',
            avatar: '',
            location: 'Curitiba, PR',
            rating: 4.6,
            plan: 'elite'
          },
          offering: 'Mercedes C180 2019',
          offeringValue: 125000,
          seeking: 'BMW Série 3 2020+',
          seekingValue: 140000,
          category: 'veiculos',
          timestamp: '2024-08-15T16:30:00',
          status: 'open',
          description: 'Sedã premium em perfeito estado, baixa quilometragem. Troco por BMW com diferença.',
          images: ['https://images.unsplash.com/photo-1563720223185-11003d516935?w=400'],
          interested: 12
        }
      ]
      
      setTrades(mockTrades)
      setFilteredTrades(mockTrades)
      setIsLoading(false)
    }

    loadTrades()
  }, [])

  useEffect(() => {
    let filtered = trades.filter(trade => {
      const matchesSearch = trade.offering.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           trade.seeking.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           trade.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !filterCategory || trade.category === filterCategory
      const matchesStatus = !filterStatus || trade.status === filterStatus
      
      return matchesSearch && matchesCategory && matchesStatus
    })

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    setFilteredTrades(filtered)
  }, [trades, searchTerm, filterCategory, filterStatus])

  const handleNewTrade = () => {
    if (!newTrade.offering.trim() || !newTrade.seeking.trim()) return

    const trade: TradeOffer = {
      id: Date.now().toString(),
      user: {
        name: user?.name || 'Usuário',
        avatar: user?.avatar || '',
        location: 'São Paulo, SP', // Mock
        rating: 4.5, // Mock
        plan: 'elite' // Mock
      },
      offering: newTrade.offering,
      offeringValue: parseFloat(newTrade.offeringValue) || 0,
      seeking: newTrade.seeking,
      seekingValue: parseFloat(newTrade.seekingValue) || 0,
      category: newTrade.category as any || 'diversos',
      timestamp: new Date().toISOString(),
      status: 'open',
      description: newTrade.description,
      images: [],
      interested: 0
    }

    setTrades(prev => [trade, ...prev])
    setNewTrade({
      offering: "",
      offeringValue: "",
      seeking: "",
      seekingValue: "",
      category: "",
      description: ""
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-success/20 text-success'
      case 'negotiating': return 'bg-warning/20 text-warning'
      case 'closed': return 'bg-muted/20 text-muted-foreground'
      default: return 'bg-muted/20 text-muted-foreground'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'veiculos': return 'Veículos'
      case 'imoveis': return 'Imóveis'
      case 'diversos': return 'Bens Diversos'
      default: return category
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Central de Trocas</h1>
          <p className="text-muted-foreground mt-1">
            Negocie diretamente com outros investidores da comunidade
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="btn-premium">
              <Plus className="h-4 w-4 mr-2" />
              Nova Proposta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nova Proposta de Troca</DialogTitle>
              <DialogDescription>
                Crie uma proposta detalhada para atrair mais interessados
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">O que você oferece:</label>
                  <Input
                    placeholder="Ex: Honda Civic 2018"
                    value={newTrade.offering}
                    onChange={(e) => setNewTrade(prev => ({ ...prev, offering: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Valor estimado (R$):</label>
                  <Input
                    type="number"
                    placeholder="75000"
                    value={newTrade.offeringValue}
                    onChange={(e) => setNewTrade(prev => ({ ...prev, offeringValue: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">O que você procura:</label>
                  <Input
                    placeholder="Ex: Toyota Corolla 2019+"
                    value={newTrade.seeking}
                    onChange={(e) => setNewTrade(prev => ({ ...prev, seeking: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Valor desejado (R$):</label>
                  <Input
                    type="number"
                    placeholder="80000"
                    value={newTrade.seekingValue}
                    onChange={(e) => setNewTrade(prev => ({ ...prev, seekingValue: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Categoria:</label>
                <Select value={newTrade.category} onValueChange={(value) => setNewTrade(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="veiculos">Veículos</SelectItem>
                    <SelectItem value="imoveis">Imóveis</SelectItem>
                    <SelectItem value="diversos">Bens Diversos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Descrição detalhada:</label>
                <Textarea
                  placeholder="Descreva o item, condições, observações importantes..."
                  rows={4}
                  value={newTrade.description}
                  onChange={(e) => setNewTrade(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <Button onClick={handleNewTrade} className="w-full btn-premium">
                <Repeat2 className="h-4 w-4 mr-2" />
                Publicar Proposta
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar propostas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as categorias</SelectItem>
            <SelectItem value="veiculos">Veículos</SelectItem>
            <SelectItem value="imoveis">Imóveis</SelectItem>
            <SelectItem value="diversos">Bens Diversos</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os status</SelectItem>
            <SelectItem value="open">Disponível</SelectItem>
            <SelectItem value="negotiating">Em negociação</SelectItem>
            <SelectItem value="closed">Finalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        {filteredTrades.length} {filteredTrades.length === 1 ? 'proposta encontrada' : 'propostas encontradas'}
      </div>

      {/* Trades Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="card-glow animate-pulse">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-24" />
                    <div className="h-3 bg-muted rounded w-20" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTrades.map((trade) => (
            <Card key={trade.id} className="card-glow hover:scale-105 transition-all duration-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  
                  {/* User Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={trade.user.avatar} />
                        <AvatarFallback>{trade.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{trade.user.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {trade.user.plan.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{trade.user.location}</span>
                          <span>⭐ {trade.user.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(trade.status)}>
                        {trade.status === 'open' ? 'Disponível' : 
                         trade.status === 'negotiating' ? 'Negociando' : 'Finalizado'}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {getCategoryLabel(trade.category)}
                      </div>
                    </div>
                  </div>

                  {/* Trade Items */}
                  <div className="space-y-4">
                    
                    {/* Offering */}
                    <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-success">Oferece</span>
                        <span className="text-sm font-bold text-success">
                          R$ {trade.offeringValue.toLocaleString()}
                        </span>
                      </div>
                      <h5 className="font-medium">{trade.offering}</h5>
                      {trade.images.length > 0 && (
                        <img 
                          src={trade.images[0]} 
                          alt={trade.offering}
                          className="w-full h-32 object-cover rounded mt-2"
                        />
                      )}
                    </div>

                    {/* Exchange Icon */}
                    <div className="flex justify-center">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <Repeat2 className="h-4 w-4 text-primary" />
                      </div>
                    </div>

                    {/* Seeking */}
                    <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-warning">Procura</span>
                        <span className="text-sm font-bold text-warning">
                          R$ {trade.seekingValue.toLocaleString()}
                        </span>
                      </div>
                      <h5 className="font-medium">{trade.seeking}</h5>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {trade.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDateTime(trade.timestamp)}
                      </span>
                      <span>{trade.interested} interessados</span>
                    </div>
                    <Button size="sm" className="btn-premium">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contatar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredTrades.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Repeat2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma proposta encontrada</h3>
          <p className="text-muted-foreground mb-4">
            Não há propostas que correspondam aos filtros aplicados.
          </p>
          <Button 
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setFilterCategory("")
              setFilterStatus("")
            }}
          >
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  )
}