import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link, Globe, MapPin, DollarSign, Calendar, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuthStore } from "@/store/authStore"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"

const analysisSchema = z.object({
  leilaoUrl: z.string().optional(),
  estado: z.string().optional(),
  cidade: z.string().optional(),
  categoria: z.string().optional(),
  tipoBem: z.string().optional(),
  status: z.string().optional(),
  valorMinimo: z.number().optional(),
  valorMaximo: z.number().optional(),
}).refine((data) => {
  // Pelo menos um campo deve estar preenchido
  const hasUrl = data.leilaoUrl && data.leilaoUrl.length > 0;
  const hasFilters = data.estado || data.cidade || data.categoria || data.tipoBem || data.status || data.valorMinimo || data.valorMaximo;
  return hasUrl || hasFilters;
}, {
  message: "Preencha o URL ou pelo menos um filtro",
  path: ["leilaoUrl"],
}).refine((data) => {
  if (data.valorMinimo && data.valorMaximo) {
    return data.valorMaximo > data.valorMinimo;
  }
  return true;
}, {
  message: "Valor máximo deve ser maior que o mínimo",
  path: ["valorMaximo"],
})

type AnalysisFormData = z.infer<typeof analysisSchema>

export default function NewAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisStep, setAnalysisStep] = useState("")
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [useUrl, setUseUrl] = useState(false)
  const [useFilters, setUseFilters] = useState(false)
  
  const { subscription, incrementUsage } = useAuthStore()
  const { toast } = useToast()

  const form = useForm<AnalysisFormData>({
    resolver: zodResolver(analysisSchema),
    defaultValues: {
      leilaoUrl: "",
      estado: "",
      cidade: "",
      categoria: "",
      tipoBem: "",
      status: "",
      valorMinimo: undefined,
      valorMaximo: undefined,
    },
  })

  const onSubmit = async (data: AnalysisFormData) => {
    // Verificar limite do plano
    if (subscription && subscription.usage.analyses >= subscription.limits.analyses) {
      toast({
        title: "Limite atingido",
        description: "Você atingiu o limite de análises do seu plano. Faça upgrade para continuar.",
        variant: "destructive"
      })
      return
    }

    setIsAnalyzing(true)
    setAnalysisProgress(0)
    setAnalysisComplete(false)

    // Simular processo de análise
    const steps = useUrl ? [
      "Verificando URL do leilão...",
      "Extraindo dados do lote...",
      "Consultando preços de mercado...",
      "Analisando histórico da região...",
      "Calculando riscos e margens...",
      "Gerando relatório final..."
    ] : [
      "Conectando à Junta Comercial do estado...",
      "Localizando leiloeiros credenciados...",
      "Percorrendo sites dos leiloeiros...",
      "Coletando dados dos lotes...",
      "Analisando oportunidades...",
      "Gerando relatório final..."
    ]

    for (let i = 0; i < steps.length; i++) {
      setAnalysisStep(steps[i])
      setAnalysisProgress((i + 1) * 16.67)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    // Finalizar análise
    setAnalysisComplete(true)
    incrementUsage('analyses')
    
    toast({
      title: "Análise concluída!",
      description: "Sua análise foi processada com sucesso.",
    })

    setTimeout(() => {
      setIsAnalyzing(false)
      form.reset()
    }, 2000)
  }

  const estadosBrasil = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", 
    "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", 
    "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ]

  const categorias = [
    "Veículos",
    "Imóveis", 
    "Bens Diversos"
  ]

  const tiposBem = {
    "Veículos": ["Carros", "Motos", "Caminhões", "Ônibus", "Tratores", "Outros Veículos"],
    "Imóveis": ["Apartamento", "Casa", "Terreno", "Sala Comercial", "Loja", "Galpão", "Chácara", "Fazenda"],
    "Bens Diversos": ["Máquinas", "Equipamentos", "Móveis", "Joias", "Eletrônicos", "Outros"]
  }

  const statusOptions = [
    "Em andamento",
    "Encerrado", 
    "Em breve"
  ]

  const cidades = {
    "SP": ["São Paulo", "Campinas", "Santos", "Ribeirão Preto", "Sorocaba"],
    "RJ": ["Rio de Janeiro", "Niterói", "Petrópolis", "Nova Iguaçu", "Duque de Caxias"],
    "MG": ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim"],
    "RS": ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria"],
    // Adicione mais cidades conforme necessário
  }

  const selectedEstado = form.watch("estado")
  const selectedCategoria = form.watch("categoria")
  const leilaoUrl = form.watch("leilaoUrl")

  // Lógica para controlar habilitação/desabilitação de campos
  const handleUrlFocus = () => {
    if (!useUrl && !useFilters) {
      setUseUrl(true)
    }
  }

  const handleFilterFocus = () => {
    if (!useUrl && !useFilters) {
      setUseFilters(true)
    }
  }

  const handleUrlChange = (value: string) => {
    if (value.length > 0 && !useUrl) {
      setUseUrl(true)
      setUseFilters(false)
      // Limpar filtros
      form.setValue("estado", "")
      form.setValue("cidade", "") 
      form.setValue("categoria", "")
      form.setValue("tipoBem", "")
      form.setValue("status", "")
      form.setValue("valorMinimo", undefined)
      form.setValue("valorMaximo", undefined)
    } else if (value.length === 0 && useUrl) {
      setUseUrl(false)
    }
  }

  const handleFilterChange = () => {
    if (!useFilters && !useUrl) {
      setUseFilters(true)
    } else if (useUrl) {
      setUseUrl(false)
      form.setValue("leilaoUrl", "")
      setUseFilters(true)
    }
  }

  const canAnalyze = subscription && subscription.usage.analyses < subscription.limits.analyses

  if (isAnalyzing) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="card-glow">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              {analysisComplete ? (
                <>
                  <CheckCircle className="h-6 w-6 text-success" />
                  Análise Concluída!
                </>
              ) : (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  Analisando Leilão
                </>
              )}
            </CardTitle>
            <CardDescription>
              {analysisComplete 
                ? "Sua análise está pronta e foi salva em seu histórico"
                : "Aguarde enquanto processamos as informações do leilão"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>{analysisStep}</span>
                <span>{Math.round(analysisProgress)}%</span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
            </div>

            {analysisComplete && (
              <div className="text-center space-y-4">
                <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                  <h3 className="font-semibold text-success mb-2">
                    Resultado Preliminar
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Margem Estimada:</span>
                      <div className="font-bold text-success">28.5%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Risco:</span>
                      <div className="font-bold text-warning">Médio</div>
                    </div>
                  </div>
                </div>
                
                <Button asChild className="btn-premium">
                  <Link to="/historico">
                    Ver Relatório Completo
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gradient mb-2">Nova Análise</h1>
        <p className="text-muted-foreground">
          Cole o link do leilão e configure os filtros para análise
        </p>
      </div>

      {/* Usage Status */}
      {subscription && (
        <Card className="card-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Uso do plano {subscription.plan.toUpperCase()}
                </div>
                <div className="font-semibold">
                  {subscription.usage.analyses}/{subscription.limits.analyses} análises utilizadas
                </div>
              </div>
              <Progress 
                value={(subscription.usage.analyses / subscription.limits.analyses) * 100}
                className="w-32 h-2"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alert if limit reached */}
      {!canAnalyze && (
        <Alert className="border-warning/20 bg-warning/10">
          <AlertDescription className="text-warning">
            Você atingiu o limite de análises do seu plano. 
            <Link to="/assinatura" className="ml-1 underline font-medium">
              Faça upgrade para continuar
            </Link>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Form */}
        <div>
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Dados do Leilão
              </CardTitle>
              <CardDescription>
                Preencha as informações para análise automática
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-4">
                        Escolha uma das opções abaixo para iniciar sua análise
                      </p>
                    </div>

                    <FormField
                      control={form.control}
                      name="leilaoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Link className="h-4 w-4" />
                            URL do Leilão
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://www.leilaoonline.com.br/leilao/12345"
                              {...field}
                              disabled={!canAnalyze || useFilters}
                              onFocus={handleUrlFocus}
                              onChange={(e) => {
                                field.onChange(e)
                                handleUrlChange(e.target.value)
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Cole aqui o link completo do leilão que deseja analisar
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          ou use os filtros
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="estado"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value)
                              form.setValue("cidade", "")
                              handleFilterChange()
                            }} 
                            value={field.value} 
                            disabled={!canAnalyze || useUrl}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o estado" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {estadosBrasil.map((estado) => (
                                <SelectItem key={estado} value={estado}>
                                  {estado}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cidade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cidade</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value)
                              handleFilterChange()
                            }} 
                            value={field.value}
                            disabled={!canAnalyze || useUrl || !selectedEstado}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a cidade" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {selectedEstado && cidades[selectedEstado as keyof typeof cidades]?.map((cidade) => (
                                <SelectItem key={cidade} value={cidade}>
                                  {cidade}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="categoria"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoria</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value)
                              form.setValue("tipoBem", "")
                              handleFilterChange()
                            }} 
                            value={field.value}
                            disabled={!canAnalyze || useUrl}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a categoria" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categorias.map((categoria) => (
                                <SelectItem key={categoria} value={categoria}>
                                  {categoria}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tipoBem"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo do Bem</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value)
                              handleFilterChange()
                            }} 
                            value={field.value}
                            disabled={!canAnalyze || useUrl || !selectedCategoria}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo do bem" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {selectedCategoria && tiposBem[selectedCategoria as keyof typeof tiposBem]?.map((tipo) => (
                                <SelectItem key={tipo} value={tipo}>
                                  {tipo}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value)
                            handleFilterChange()
                          }} 
                          value={field.value}
                          disabled={!canAnalyze || useUrl}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="valorMinimo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor Mínimo (R$)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="100000"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value ? Number(e.target.value) : undefined)
                                if (e.target.value) handleFilterChange()
                              }}
                              disabled={!canAnalyze || useUrl}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="valorMaximo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor Máximo (R$)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="500000"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value ? Number(e.target.value) : undefined)
                                if (e.target.value) handleFilterChange()
                              }}
                              disabled={!canAnalyze || useUrl}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full btn-premium" 
                    disabled={!canAnalyze}
                  >
                    Iniciar Análise
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="text-lg">O que Analisamos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Editais e documentação completa</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Histórico de vendas similares</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Análise de risco e rentabilidade</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Custos de regularização</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Potencial de valorização</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Dados de todos os leiloeiros do estado</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}