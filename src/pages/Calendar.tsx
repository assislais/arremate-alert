import { useState, useEffect } from "react"
import { Calendar as CalendarIcon, Clock, MapPin, AlertCircle, CheckCircle, Camera, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"

interface ScheduledVisit {
  id: string
  lotTitle: string
  auctionDate: string
  visitDate: string
  location: string
  status: 'scheduled' | 'completed' | 'missed'
  checklist?: {
    frente: boolean
    lateralEsquerda: boolean
    lateralDireita: boolean
    traseira: boolean
    interior: boolean
    pontosAtencao: boolean
    documentacao: boolean
    kilometragem: boolean
    estadoGeral: boolean
    video: boolean
  }
  photos?: string[]
  discount?: number
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [visits, setVisits] = useState<ScheduledVisit[]>([])
  const [selectedVisit, setSelectedVisit] = useState<ScheduledVisit | null>(null)
  const [showVisitDialog, setShowVisitDialog] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [checklist, setChecklist] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  useEffect(() => {
    // Load scheduled visits
    const mockVisits: ScheduledVisit[] = [
      {
        id: '1',
        lotTitle: 'Apartamento 3 quartos - Copacabana/RJ',
        auctionDate: '2024-08-25T14:00:00',
        visitDate: '2024-08-24T09:00:00',
        location: 'Rua Barata Ribeiro, 500 - Copacabana/RJ',
        status: 'scheduled'
      },
      {
        id: '2',
        lotTitle: 'Honda Civic 2019 - 35.000km',
        auctionDate: '2024-08-23T10:30:00',
        visitDate: '2024-08-22T15:00:00',
        location: 'Pátio Auto Center - São Paulo/SP',
        status: 'completed',
        checklist: {
          frente: true,
          lateralEsquerda: true,
          lateralDireita: true,
          traseira: true,
          interior: true,
          pontosAtencao: true,
          documentacao: true,
          kilometragem: true,
          estadoGeral: true,
          video: true
        },
        photos: ['/placeholder.svg', '/placeholder.svg'],
        discount: 10
      },
      {
        id: '3',
        lotTitle: 'Loja Comercial - Centro Histórico',
        auctionDate: '2024-08-27T16:00:00',
        visitDate: '2024-08-26T11:00:00',
        location: 'Rua da Bahia, 1200 - Centro/BH',
        status: 'scheduled'
      }
    ]
    setVisits(mockVisits)
  }, [])

  const getVisitsForDate = (date: Date) => {
    return visits.filter(visit => {
      const visitDate = new Date(visit.visitDate)
      return visitDate.toDateString() === date.toDateString()
    })
  }

  const handleVisitComplete = (visit: ScheduledVisit) => {
    setSelectedVisit(visit)
    setShowVisitDialog(true)
  }

  const confirmVisitCompletion = (completed: boolean) => {
    if (completed && selectedVisit) {
      setShowVisitDialog(false)
      setShowUploadDialog(true)
      // Initialize checklist
      setChecklist({
        frente: false,
        lateralEsquerda: false,
        lateralDireita: false,
        traseira: false,
        interior: false,
        pontosAtencao: false,
        documentacao: false,
        kilometragem: false,
        estadoGeral: false,
        video: false
      })
    } else {
      // Mark as missed
      setVisits(prev => prev.map(v => 
        v.id === selectedVisit?.id 
          ? { ...v, status: 'missed' as const }
          : v
      ))
      setShowVisitDialog(false)
      toast({
        title: "Visita marcada como perdida",
        description: "Não se preocupe, você pode reagendar quando quiser.",
      })
    }
  }

  const handleUploadSubmit = () => {
    if (!selectedVisit) return
    
    const completedItems = Object.values(checklist).filter(Boolean).length
    const allCompleted = completedItems === Object.keys(checklist).length
    
    if (allCompleted) {
      // Award discount
      setVisits(prev => prev.map(v => 
        v.id === selectedVisit.id 
          ? { 
              ...v, 
              status: 'completed' as const,
              checklist: checklist as any,
              discount: 10
            }
          : v
      ))
      
      toast({
        title: "Parabéns! 🎉",
        description: "Visita completa! Você ganhou R$ 10 de desconto na próxima mensalidade.",
      })
    } else {
      // Partial completion
      setVisits(prev => prev.map(v => 
        v.id === selectedVisit.id 
          ? { 
              ...v, 
              status: 'completed' as const,
              checklist: checklist as any,
              discount: 0
            }
          : v
      ))
      
      toast({
        title: "Visita registrada",
        description: `Checklist parcial (${completedItems}/${Object.keys(checklist).length}). Desconto não aplicado.`,
        variant: "destructive"
      })
    }
    
    setShowUploadDialog(false)
    setSelectedVisit(null)
  }

  const checklistItems = [
    { key: 'frente', label: 'Foto da frente' },
    { key: 'lateralEsquerda', label: 'Foto lateral esquerda' },
    { key: 'lateralDireita', label: 'Foto lateral direita' },
    { key: 'traseira', label: 'Foto da traseira' },
    { key: 'interior', label: 'Fotos do interior' },
    { key: 'pontosAtencao', label: 'Pontos de atenção/defeitos' },
    { key: 'documentacao', label: 'Documentação visível' },
    { key: 'kilometragem', label: 'Kilometragem (veículos)' },
    { key: 'estadoGeral', label: 'Estado geral do bem' },
    { key: 'video', label: 'Vídeo de 30s mínimo' }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="text-warning border-warning">Agendada</Badge>
      case 'completed':
        return <Badge variant="outline" className="text-success border-success">Concluída</Badge>
      case 'missed':
        return <Badge variant="outline" className="text-destructive border-destructive">Perdida</Badge>
      default:
        return <Badge variant="outline">Indefinido</Badge>
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gradient">Calendário de Visitas</h1>
        <p className="text-lg text-muted-foreground">
          Gerencie suas visitas agendadas e ganhe descontos
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-glow">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {visits.filter(v => v.status === 'scheduled').length}
              </div>
              <div className="text-sm text-muted-foreground">Agendadas</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-glow">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {visits.filter(v => v.status === 'completed').length}
              </div>
              <div className="text-sm text-muted-foreground">Concluídas</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-glow">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">
                R$ {visits.reduce((sum, v) => sum + (v.discount || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Em Descontos</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-glow">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">
                {visits.filter(v => v.status === 'missed').length}
              </div>
              <div className="text-sm text-muted-foreground">Perdidas</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Calendário
            </CardTitle>
            <CardDescription>
              Selecione uma data para ver as visitas agendadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                hasVisits: (date) => getVisitsForDate(date).length > 0
              }}
              modifiersStyles={{
                hasVisits: { backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }
              }}
            />
          </CardContent>
        </Card>

        {/* Visits List */}
        <div className="lg:col-span-2">
          <Card className="card-glow">
            <CardHeader>
              <CardTitle>
                {selectedDate 
                  ? `Visitas para ${selectedDate.toLocaleDateString('pt-BR')}`
                  : 'Todas as Visitas'
                }
              </CardTitle>
              <CardDescription>
                {selectedDate
                  ? `${getVisitsForDate(selectedDate).length} visita(s) agendada(s)`
                  : `${visits.length} visita(s) no total`
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(selectedDate ? getVisitsForDate(selectedDate) : visits).map((visit) => (
                <div key={visit.id} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{visit.lotTitle}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDateTime(visit.visitDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {visit.location}
                        </span>
                      </div>
                    </div>
                    {getStatusBadge(visit.status)}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Leilão: </span>
                      <span>{formatDateTime(visit.auctionDate)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {visit.status === 'scheduled' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleVisitComplete(visit)}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Marcar como Realizada
                        </Button>
                      )}
                      
                      {visit.status === 'completed' && visit.discount && (
                        <Badge variant="outline" className="text-success border-success">
                          -R$ {visit.discount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {(selectedDate ? getVisitsForDate(selectedDate) : visits).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma visita agendada para esta data</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Visit Completion Dialog */}
      <Dialog open={showVisitDialog} onOpenChange={setShowVisitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Você visitou este lote?</DialogTitle>
            <DialogDescription>
              Confirme se você conseguiu visitar o lote conforme agendado.
              Se sim, você poderá fazer upload das fotos e ganhar desconto.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => confirmVisitCompletion(false)}>
              Não visitei
            </Button>
            <Button onClick={() => confirmVisitCompletion(true)}>
              <Camera className="h-4 w-4 mr-2" />
              Sim, fazer upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload de Fotos e Vídeos</DialogTitle>
            <DialogDescription>
              Complete o checklist abaixo para garantir seu desconto de R$ 10.
              Todos os itens devem ser marcados.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <Alert className="border-warning/20 bg-warning/10">
              <AlertCircle className="h-4 w-4 text-warning" />
              <AlertDescription className="text-warning">
                <strong>Importante:</strong> Marque apenas os itens que você realmente fotografou/filmou. 
                Checklist incompleto não gera desconto.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 gap-3">
              {checklistItems.map((item) => (
                <div key={item.key} className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                  <Checkbox
                    id={item.key}
                    checked={checklist[item.key] || false}
                    onCheckedChange={(checked) => 
                      setChecklist(prev => ({ ...prev, [item.key]: checked as boolean }))
                    }
                  />
                  <label
                    htmlFor={item.key}
                    className="flex-1 text-sm font-medium leading-none cursor-pointer"
                  >
                    {item.label}
                  </label>
                  <Button size="sm" variant="outline">
                    <Upload className="h-3 w-3 mr-1" />
                    Upload
                  </Button>
                </div>
              ))}
            </div>

            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground">
                Progresso: {Object.values(checklist).filter(Boolean).length}/{checklistItems.length} itens
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {Object.values(checklist).filter(Boolean).length === checklistItems.length 
                  ? "✅ Checklist completo - Desconto garantido!" 
                  : "❌ Checklist incompleto - Sem desconto"
                }
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUploadSubmit}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Finalizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}