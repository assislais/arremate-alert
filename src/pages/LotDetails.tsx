import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Heart,
  Share2,
  Download,
  Info,
  Phone,
  Truck,
  Sparkles,
  Settings
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { formatCurrency, formatDate, formatDateTime, getRiskColor } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface LotDetails {
  id: string
  titulo: string
  descricao: string
  valorInicial: number
  valorAtual: number
  valorEstimado: number
  investimentoTotal: number
  potencialGanho: number
  risco: 'baixo' | 'medio' | 'alto'
  fotos: string[]
  localizacao: string
  estado: string
  dataLeilao: string
  dataVisitacao: string
  leiloeiro: {
    nome: string
    avaliacao: number
    contato: string
  }
  despachante: {
    nome: string
    telefone: string
  }
  documentos: string[]
  status: 'ativo' | 'proximamente' | 'encerrado'
  interessados: number
  categoria: string
  detalhes: {
    condicao: string
    observacoes: string[]
  }
}

export default function LotDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [lot, setLot] = useState<LotDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [isAware, setIsAware] = useState(false)
  const [showExitDialog, setShowExitDialog] = useState(false)

  useEffect(() => {
    // Mock data loading
    const loadLotDetails = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockLot: LotDetails = {
        id: id || '1',
        titulo: 'Honda Civic 2019 LX CVT',
        descricao: 'Sedan automático em excelente estado de conservação. Cor prata, interior em couro bege, ar condicionado, direção hidráulica, vidros elétricos, trava elétrica, airbag duplo, freios ABS.',
        valorInicial: 65000,
        valorAtual: 68500,
        valorEstimado: 78000,
        investimentoTotal: 73500, // valor atual + taxas
        potencialGanho: 4500,
        risco: 'baixo',
        fotos: [
          'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800',
          'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
          'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=800',
          'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800'
        ],
        localizacao: 'São Paulo, SP',
        estado: 'SP',
        dataLeilao: '2024-08-25T14:00:00',
        dataVisitacao: '2024-08-24T09:00:00',
        leiloeiro: {
          nome: 'Leilões SP Premium',
          avaliacao: 4.5,
          contato: '(11) 3333-4444'
        },
        despachante: {
          nome: 'Despachante Rápido',
          telefone: '(11) 9999-8888'
        },
        documentos: ['Laudo de Avaliação', 'Documento do Veículo', 'Edital Completo'],
        status: 'ativo',
        interessados: 12,
        categoria: 'Veículos',
        detalhes: {
          condicao: 'Usado em bom estado',
          observacoes: [
            'Pequeno risco no para-choque dianteiro',
            'Pneus em bom estado',
            'Última revisão em março/2024',
            'Manual e chave reserva disponíveis'
          ]
        }
      }
      
      setLot(mockLot)
      setIsLoading(false)
    }

    loadLotDetails()
  }, [id])

  const handleBackClick = () => {
    if (isAware) {
      setShowExitDialog(true)
    } else {
      navigate(-1)
    }
  }

  const handleSaveInterest = async () => {
    // Mock save to interests and add calendar event
    toast({
      title: "Interesse salvo!",
      description: "Lote adicionado aos seus interesses e evento criado no calendário."
    })
  }

  const handleVisitLot = () => {
    handleSaveInterest()
    navigate(-1)
  }

  const handleDownloadReport = () => {
    // Mock PDF generation
    toast({
      title: "Relatório baixado!",
      description: "O relatório detalhado foi salvo em Downloads."
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="aspect-[4/3] bg-muted rounded" />
            <div className="space-y-4">
              <div className="h-6 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!lot) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Lote não encontrado</h2>
        <p className="text-muted-foreground mb-4">O lote solicitado não foi encontrado.</p>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleBackClick}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{lot.titulo}</h1>
          <p className="text-muted-foreground">{lot.categoria} • {lot.localizacao}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadReport}>
            <Download className="h-4 w-4 mr-2" />
            Baixar PDF
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Photos and Description */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Photo Gallery */}
          <Card className="card-glow">
            <CardContent className="p-0">
              <div className="relative">
                <img 
                  src={lot.fotos[currentPhotoIndex]} 
                  alt={lot.titulo}
                  className="w-full aspect-[16/10] object-cover rounded-t-lg"
                />
                <Badge className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm">
                  {currentPhotoIndex + 1} / {lot.fotos.length}
                </Badge>
              </div>
              
              <div className="p-4">
                <div className="flex gap-2 overflow-x-auto">
                  {lot.fotos.map((foto, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPhotoIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all ${
                        index === currentPhotoIndex ? 'border-primary' : 'border-border'
                      }`}
                    >
                      <img 
                        src={foto} 
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="card-glow">
            <CardHeader>
              <CardTitle>Descrição</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{lot.descricao}</p>
              
              <div>
                <h4 className="font-medium mb-2">Condição</h4>
                <Badge variant="outline">{lot.detalhes.condicao}</Badge>
              </div>

              <div>
                <h4 className="font-medium mb-2">Observações</h4>
                <ul className="space-y-1">
                  {lot.detalhes.observacoes.map((obs, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                      {obs}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Partnership Services */}
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Serviços Parceiros
              </CardTitle>
              <CardDescription>
                Facilite seu processo com nossos parceiros
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Info className="h-6 w-6 text-primary" />
                <div className="text-center">
                  <div className="font-medium">Assessoria Jurídica</div>
                  <div className="text-xs text-muted-foreground">Análise de documentos</div>
                </div>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Truck className="h-6 w-6 text-primary" />
                <div className="text-center">
                  <div className="font-medium">Solicitar Frete</div>
                  <div className="text-xs text-muted-foreground">Cotação de transporte</div>
                </div>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <div className="text-center">
                  <div className="font-medium">Lavagem/Detalhamento</div>
                  <div className="text-xs text-muted-foreground">Prepare para venda</div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Financial Summary */}
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Resumo Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Valor inicial:</span>
                  <span className="font-medium">{formatCurrency(lot.valorInicial)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Valor atual:</span>
                  <span className="font-medium">{formatCurrency(lot.valorAtual)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Investimento total:</span>
                  <span className="font-medium">{formatCurrency(lot.investimentoTotal)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Valor estimado:</span>
                  <span className="font-bold text-success">{formatCurrency(lot.valorEstimado)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Potencial de ganho:</span>
                  <span className="font-bold text-success">{formatCurrency(lot.potencialGanho)}</span>
                </div>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Nível de Risco</span>
                  <Badge className={`${
                    lot.risco === 'baixo' ? 'bg-success/20 text-success' :
                    lot.risco === 'medio' ? 'bg-warning/20 text-warning' :
                    'bg-destructive/20 text-destructive'
                  }`}>
                    {lot.risco.toUpperCase()}
                  </Badge>
                </div>
                <Progress 
                  value={
                    lot.risco === 'baixo' ? 25 :
                    lot.risco === 'medio' ? 60 : 90
                  }
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Auction Info */}
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Informações do Leilão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground block">Data do leilão:</span>
                  <span className="font-medium">{formatDateTime(lot.dataLeilao)}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground block">Visitação:</span>
                  <span className="font-medium">{formatDateTime(lot.dataVisitacao)}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground block">Leiloeiro:</span>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{lot.leiloeiro.nome}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm">⭐ {lot.leiloeiro.avaliacao}</span>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{lot.leiloeiro.contato}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground block">Despachante:</span>
                  <span className="font-medium">{lot.despachante.nome}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="h-3 w-3" />
                    <span className="text-sm">{lot.despachante.telefone}</span>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground block">Interessados:</span>
                  <span className="font-medium">{lot.interessados} pessoas</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card className="card-glow">
            <CardHeader>
              <CardTitle>Documentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lot.documentos.map((doc, index) => (
                  <Button key={index} variant="outline" size="sm" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    {doc}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Awareness Checkbox */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-start space-x-2 mt-2">
                <Checkbox 
                  id="awareness" 
                  checked={isAware}
                  onCheckedChange={(checked) => setIsAware(checked as boolean)}
                />
                <label 
                  htmlFor="awareness" 
                  className="text-sm leading-relaxed cursor-pointer"
                >
                  Estou ciente que a análise é uma estimativa baseada em dados históricos e pode não refletir o valor real de mercado.
                </label>
              </div>
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              className="w-full btn-premium"
              disabled={!isAware}
              onClick={handleSaveInterest}
            >
              <Heart className="h-4 w-4 mr-2" />
              Salvar nos Interesses
            </Button>
            
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => navigate(`/leilao/${lot.id}`)}
            >
              Ver Página do Leilão
            </Button>
          </div>
        </div>
      </div>

      {/* Exit Dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deseja visitar este lote?</DialogTitle>
            <DialogDescription>
              Você demonstrou interesse neste lote. Gostaria de visitá-lo pessoalmente?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                setShowExitDialog(false)
                navigate(-1)
              }}
            >
              Não, obrigado
            </Button>
            <Button 
              className="flex-1 btn-premium"
              onClick={handleVisitLot}
            >
              Sim, quero visitar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}