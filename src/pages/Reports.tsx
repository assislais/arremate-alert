import { useState, useEffect } from "react"
import { Filter, MapPin, Calendar, DollarSign, Eye, Heart, ArrowUpDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { formatCurrency, formatDate, getRiskLevel, getRiskColor } from "@/lib/utils"
import { Link } from "react-router-dom"

interface LeilaoItem {
  id: string
  titulo: string
  descricao: string
  valorInicial: number
  valorAtual: number
  valorEstimado: number
  imagem: string
  localizacao: string
  estado: string
  dataLeilao: string
  status: 'ativo' | 'proximamente' | 'encerrado'
  avaliacaoLeiloeiro: number
  leiloeiro: string
  categoria: 'veiculos' | 'imoveis' | 'diversos'
  risco: 'baixo' | 'medio' | 'alto'
  interessados: number
}

export default function Reports() {
  const [items, setItems] = useState<LeilaoItem[]>([])
  const [filteredItems, setFilteredItems] = useState<LeilaoItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<'data' | 'distancia' | 'preco-asc' | 'preco-desc'>('data')
  const [filterState, setFilterState] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterCategory, setFilterCategory] = useState("")

  useEffect(() => {
    // Mock data loading
    const loadItems = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockItems: LeilaoItem[] = [
        {
          id: '1',
          titulo: 'Honda Civic 2019 LX CVT',
          descricao: 'Sedan automático, cor prata, 45.000km',
          valorInicial: 65000,
          valorAtual: 68500,
          valorEstimado: 78000,
          imagem: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400',
          localizacao: 'São Paulo, SP',
          estado: 'SP',
          dataLeilao: '2024-08-25T14:00:00',
          status: 'ativo',
          avaliacaoLeiloeiro: 4.5,
          leiloeiro: 'Leilões SP Premium',
          categoria: 'veiculos',
          risco: 'baixo',
          interessados: 12
        },
        {
          id: '2',
          titulo: 'Apartamento 2 quartos - Copacabana',
          descricao: 'Apartamento reformado, vista mar, 85m²',
          valorInicial: 380000,
          valorAtual: 420000,
          valorEstimado: 550000,
          imagem: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
          localizacao: 'Rio de Janeiro, RJ',
          estado: 'RJ',
          dataLeilao: '2024-08-28T10:30:00',
          status: 'proximamente',
          avaliacaoLeiloeiro: 4.8,
          leiloeiro: 'Leilões Carioca',
          categoria: 'imoveis',
          risco: 'medio',
          interessados: 8
        },
        {
          id: '3',
          titulo: 'Máquina Industrial CNC',
          descricao: 'Torno CNC seminovo, marca Romi',
          valorInicial: 85000,
          valorAtual: 92000,
          valorEstimado: 120000,
          imagem: 'https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?w=400',
          localizacao: 'Belo Horizonte, MG',
          estado: 'MG',
          dataLeilao: '2024-08-24T16:00:00',
          status: 'ativo',
          avaliacaoLeiloeiro: 4.2,
          leiloeiro: 'Leilões Industriais MG',
          categoria: 'diversos',
          risco: 'alto',
          interessados: 5
        },
        {
          id: '4',
          titulo: 'Toyota Corolla 2020 XEi',
          descricao: 'Sedan automático, cor branca, 28.000km',
          valorInicial: 78000,
          valorAtual: 82000,
          valorEstimado: 88000,
          imagem: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400',
          localizacao: 'Curitiba, PR',
          estado: 'PR',
          dataLeilao: '2024-08-26T15:30:00',
          status: 'ativo',
          avaliacaoLeiloeiro: 4.6,
          leiloeiro: 'Leilões Sul',
          categoria: 'veiculos',
          risco: 'baixo',
          interessados: 15
        }
      ]
      
      setItems(mockItems)
      setFilteredItems(mockItems)
      setIsLoading(false)
    }

    loadItems()
  }, [])

  useEffect(() => {
    let filtered = items.filter(item => {
      const matchesSearch = item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesState = !filterState || item.estado === filterState
      const matchesStatus = !filterStatus || item.status === filterStatus
      const matchesCategory = !filterCategory || item.categoria === filterCategory
      
      return matchesSearch && matchesState && matchesStatus && matchesCategory
    })

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'data':
          return new Date(a.dataLeilao).getTime() - new Date(b.dataLeilao).getTime()
        case 'preco-asc':
          return a.valorAtual - b.valorAtual
        case 'preco-desc':
          return b.valorAtual - a.valorAtual
        case 'distancia':
          // Mock distance sorting (would need geolocation)
          return a.localizacao.localeCompare(b.localizacao)
        default:
          return 0
      }
    })

    setFilteredItems(filtered)
  }, [items, searchTerm, sortBy, filterState, filterStatus, filterCategory])

  const handleSaveInterest = (itemId: string) => {
    // Mock save to interests
    console.log('Salvando interesse no item:', itemId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Relatórios de Leilões</h1>
          <p className="text-muted-foreground mt-1">
            Listagem completa de todos os leilões disponíveis
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-48">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="data">Data do leilão</SelectItem>
            <SelectItem value="distancia">Distância</SelectItem>
            <SelectItem value="preco-asc">Menor preço</SelectItem>
            <SelectItem value="preco-desc">Maior preço</SelectItem>
          </SelectContent>
        </Select>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
              <SheetDescription>
                Refine sua busca com os filtros abaixo
              </SheetDescription>
            </SheetHeader>
            
            <div className="space-y-4 mt-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Estado</label>
                <Select value={filterState} onValueChange={setFilterState}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os estados</SelectItem>
                    <SelectItem value="SP">São Paulo</SelectItem>
                    <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                    <SelectItem value="MG">Minas Gerais</SelectItem>
                    <SelectItem value="PR">Paraná</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os status</SelectItem>
                    <SelectItem value="ativo">Em andamento</SelectItem>
                    <SelectItem value="proximamente">Em breve</SelectItem>
                    <SelectItem value="encerrado">Encerrado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Categoria</label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as categorias</SelectItem>
                    <SelectItem value="veiculos">Veículos</SelectItem>
                    <SelectItem value="imoveis">Imóveis</SelectItem>
                    <SelectItem value="diversos">Bens Diversos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={() => {
                  setFilterState("")
                  setFilterStatus("")
                  setFilterCategory("")
                }}
                variant="outline"
                className="w-full"
              >
                Limpar filtros
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        {filteredItems.length} {filteredItems.length === 1 ? 'item encontrado' : 'itens encontrados'}
      </div>

      {/* Items Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="card-glow animate-pulse">
              <div className="aspect-[4/3] bg-muted rounded-t-lg" />
              <CardContent className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="card-glow hover:scale-105 transition-all duration-200">
              <div className="relative">
                <img 
                  src={item.imagem} 
                  alt={item.titulo}
                  className="w-full aspect-[4/3] object-cover rounded-t-lg"
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                  onClick={() => handleSaveInterest(item.id)}
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Badge 
                  className={`absolute top-2 left-2 ${
                    item.status === 'ativo' ? 'bg-success' : 
                    item.status === 'proximamente' ? 'bg-warning' : 'bg-muted'
                  }`}
                >
                  {item.status === 'ativo' ? 'Em andamento' :
                   item.status === 'proximamente' ? 'Em breve' : 'Encerrado'}
                </Badge>
              </div>
              
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-sm line-clamp-2">{item.titulo}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {item.descricao}
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor atual:</span>
                    <span className="font-medium">{formatCurrency(item.valorAtual)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor estimado:</span>
                    <span className="font-medium">{formatCurrency(item.valorEstimado)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Margem potencial:</span>
                    <span className={getRiskColor(item.risco)}>
                      {(((item.valorEstimado - item.valorAtual) / item.valorAtual) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{item.localizacao}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(item.dataLeilao)}</span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">⭐ {item.avaliacaoLeiloeiro}</span>
                  </div>
                  <Badge className={`text-xs ${
                    item.risco === 'baixo' ? 'bg-success/20 text-success' :
                    item.risco === 'medio' ? 'bg-warning/20 text-warning' :
                    'bg-destructive/20 text-destructive'
                  }`}>
                    {item.risco}
                  </Badge>
                </div>

                <Link to={`/lote/${item.id}`}>
                  <Button className="w-full btn-premium">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredItems.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            Nenhum item encontrado com os filtros aplicados
          </div>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSearchTerm("")
              setFilterState("")
              setFilterStatus("")
              setFilterCategory("")
            }}
          >
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  )
}