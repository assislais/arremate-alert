import { useState, useEffect } from "react"
import { MessageCircle, Users, Heart, Share2, Send, Plus, ArrowRight, Repeat2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { formatDateTime } from "@/lib/utils"
import { useAuthStore } from "@/store/authStore"
import { Link } from "react-router-dom"

interface CommunityPost {
  id: string
  author: {
    name: string
    avatar: string
    plan: 'basico' | 'elite'
  }
  content: string
  type: 'discussion' | 'trade' | 'tip'
  timestamp: string
  likes: number
  comments: number
  isLiked: boolean
  tradeItem?: {
    item: string
    looking: string
    location: string
  }
}

interface TradeOffer {
  id: string
  user: {
    name: string
    avatar: string
    location: string
  }
  offering: string
  seeking: string
  category: 'veiculos' | 'imoveis' | 'diversos'
  timestamp: string
  status: 'open' | 'negotiating' | 'closed'
}

export default function Community() {
  const { user } = useAuthStore()
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [trades, setTrades] = useState<TradeOffer[]>([])
  const [newPost, setNewPost] = useState("")
  const [newTrade, setNewTrade] = useState({ offering: "", seeking: "", category: "" })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data loading
    const loadCommunityData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockPosts: CommunityPost[] = [
        {
          id: '1',
          author: {
            name: 'João Silva',
            avatar: 'https://github.com/shadcn.png',
            plan: 'elite'
          },
          content: 'Acabei de arrematar um Civic 2019 por um preço excelente! Alguém tem indicação de despachante confiável em SP?',
          type: 'discussion',
          timestamp: '2024-08-16T10:30:00',
          likes: 8,
          comments: 3,
          isLiked: false
        },
        {
          id: '2',
          author: {
            name: 'Maria Santos',
            avatar: '',
            plan: 'basico'
          },
          content: 'Dica valiosa: sempre verifiquem o histórico de sinistros antes de dar lance em veículos. Me salvou de uma cilada ontem!',
          type: 'tip',
          timestamp: '2024-08-16T09:15:00',
          likes: 15,
          comments: 7,
          isLiked: true
        },
        {
          id: '3',
          author: {
            name: 'Carlos Pereira',
            avatar: '',
            plan: 'elite'
          },
          content: 'Tenho interesse em trocar meu apartamento em Copacabana por uma casa na Barra. Alguém interessado?',
          type: 'trade',
          timestamp: '2024-08-16T08:45:00',
          likes: 4,
          comments: 2,
          isLiked: false,
          tradeItem: {
            item: 'Apartamento 2Q em Copacabana',
            looking: 'Casa na Barra da Tijuca',
            location: 'Rio de Janeiro, RJ'
          }
        }
      ]

      const mockTrades: TradeOffer[] = [
        {
          id: '1',
          user: {
            name: 'Ana Costa',
            avatar: '',
            location: 'São Paulo, SP'
          },
          offering: 'Honda Civic 2018',
          seeking: 'Toyota Corolla 2019+',
          category: 'veiculos',
          timestamp: '2024-08-16T11:00:00',
          status: 'open'
        },
        {
          id: '2',
          user: {
            name: 'Roberto Lima',
            avatar: '',
            location: 'Belo Horizonte, MG'
          },
          offering: 'Máquina CNC',
          seeking: 'Equipamento de Solda',
          category: 'diversos',
          timestamp: '2024-08-16T10:20:00',
          status: 'negotiating'
        }
      ]
      
      setPosts(mockPosts)
      setTrades(mockTrades)
      setIsLoading(false)
    }

    loadCommunityData()
  }, [])

  const handleNewPost = () => {
    if (!newPost.trim()) return

    const post: CommunityPost = {
      id: Date.now().toString(),
      author: {
        name: user?.name || 'Usuário',
        avatar: user?.avatar || '',
        plan: 'elite' // Mock
      },
      content: newPost,
      type: 'discussion',
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      isLiked: false
    }

    setPosts(prev => [post, ...prev])
    setNewPost("")
  }

  const handleNewTrade = () => {
    if (!newTrade.offering.trim() || !newTrade.seeking.trim()) return

    const trade: TradeOffer = {
      id: Date.now().toString(),
      user: {
        name: user?.name || 'Usuário',
        avatar: user?.avatar || '',
        location: 'São Paulo, SP' // Mock
      },
      offering: newTrade.offering,
      seeking: newTrade.seeking,
      category: newTrade.category as any || 'diversos',
      timestamp: new Date().toISOString(),
      status: 'open'
    }

    setTrades(prev => [trade, ...prev])
    setNewTrade({ offering: "", seeking: "", category: "" })
  }

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ))
  }

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'trade': return <Repeat2 className="h-4 w-4 text-warning" />
      case 'tip': return <Heart className="h-4 w-4 text-success" />
      default: return <MessageCircle className="h-4 w-4 text-primary" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-success/20 text-success'
      case 'negotiating': return 'bg-warning/20 text-warning'
      case 'closed': return 'bg-muted/20 text-muted-foreground'
      default: return 'bg-muted/20 text-muted-foreground'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Comunidade</h1>
          <p className="text-muted-foreground mt-1">
            Compartilhe experiências e negocie com outros investidores
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Repeat2 className="h-4 w-4 mr-2" />
                Nova Troca
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Propor Troca</DialogTitle>
                <DialogDescription>
                  Publique uma proposta de troca para a comunidade
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">O que você tem:</label>
                  <Input
                    placeholder="Ex: Honda Civic 2018"
                    value={newTrade.offering}
                    onChange={(e) => setNewTrade(prev => ({ ...prev, offering: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">O que você procura:</label>
                  <Input
                    placeholder="Ex: Toyota Corolla 2019+"
                    value={newTrade.seeking}
                    onChange={(e) => setNewTrade(prev => ({ ...prev, seeking: e.target.value }))}
                  />
                </div>
                <Button onClick={handleNewTrade} className="w-full btn-premium">
                  Publicar Troca
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="feed" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="feed">Feed da Comunidade</TabsTrigger>
          <TabsTrigger value="trades">Trocas</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6">
          {/* New Post */}
          <Card className="card-glow">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <Textarea
                    placeholder="Compartilhe uma dica, experiência ou faça uma pergunta..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleNewPost} size="sm" className="btn-premium">
                      <Send className="h-4 w-4 mr-2" />
                      Publicar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="card-glow">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{post.author.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {post.author.plan.toUpperCase()}
                        </Badge>
                        {getPostIcon(post.type)}
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(post.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-sm mb-3">{post.content}</p>
                      
                      {post.tradeItem && (
                        <div className="bg-muted/50 rounded-lg p-3 mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Repeat2 className="h-4 w-4 text-warning" />
                            <span className="text-sm font-medium">Proposta de Troca</span>
                          </div>
                          <div className="text-xs space-y-1">
                            <div><strong>Oferece:</strong> {post.tradeItem.item}</div>
                            <div><strong>Procura:</strong> {post.tradeItem.looking}</div>
                            <div><strong>Local:</strong> {post.tradeItem.location}</div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(post.id)}
                          className={post.isLiked ? 'text-destructive' : ''}
                        >
                          <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {post.comments}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4 mr-1" />
                          Compartilhar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trades" className="space-y-6">
          {/* Trades Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Propostas de Troca</h2>
              <p className="text-sm text-muted-foreground">
                Encontre oportunidades de troca com outros membros
              </p>
            </div>
            <Link to="/trocas">
              <Button variant="outline" size="sm">
                Ver Todas
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Trades Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trades.map((trade) => (
              <Card key={trade.id} className="card-glow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={trade.user.avatar} />
                        <AvatarFallback>{trade.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-sm">{trade.user.name}</h4>
                        <p className="text-xs text-muted-foreground">{trade.user.location}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(trade.status)}>
                      {trade.status === 'open' ? 'Aberto' : 
                       trade.status === 'negotiating' ? 'Negociando' : 'Fechado'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="text-xs text-muted-foreground mb-1">Oferece:</div>
                      <div className="font-medium text-sm">{trade.offering}</div>
                    </div>
                    
                    <div className="flex justify-center">
                      <Repeat2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                    
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="text-xs text-muted-foreground mb-1">Procura:</div>
                      <div className="font-medium text-sm">{trade.seeking}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(trade.timestamp)}
                    </span>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contatar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}