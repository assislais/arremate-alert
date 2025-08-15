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
  leilaoUrl: z.string().url("URL inválida").min(1, "URL é obrigatória"),
  estado: z.string().min(1, "Estado é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  tipoBem: z.string().min(1, "Tipo do bem é obrigatório"),
  valorMinimo: z.number().min(1, "Valor mínimo é obrigatório"),
  valorMaximo: z.number().min(1, "Valor máximo é obrigatório"),
  observacoes: z.string().optional(),
}).refine((data) => data.valorMaximo > data.valorMinimo, {
  message: "Valor máximo deve ser maior que o mínimo",
  path: ["valorMaximo"],
})

type AnalysisFormData = z.infer<typeof analysisSchema>

export default function NewAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisStep, setAnalysisStep] = useState("")
  const [analysisComplete, setAnalysisComplete] = useState(false)
  
  const { subscription, incrementUsage } = useAuthStore()
  const { toast } = useToast()

  const form = useForm<AnalysisFormData>({
    resolver: zodResolver(analysisSchema),
    defaultValues: {
      leilaoUrl: "",
      estado: "",
      cidade: "",
      tipoBem: "",
      valorMinimo: 0,
      valorMaximo: 0,
      observacoes: "",
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
    const steps = [
      "Verificando URL do leilão...",
      "Extraindo dados do imóvel...",
      "Consultando preços de mercado...",
      "Analisando histórico da região...",
      "Calculando riscos e margens...",
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

  const tiposBem = [
    "Apartamento",
    "Casa",
    "Terreno",
    "Sala Comercial",
    "Loja",
    "Galpão",
    "Chácara",
    "Fazenda",
    "Outro"
  ]

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form */}
        <div className="lg:col-span-2">
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
                            disabled={!canAnalyze}
                          />
                        </FormControl>
                        <FormDescription>
                          Cole aqui o link completo do leilão que deseja analisar
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="estado"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!canAnalyze}>
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
                          <FormControl>
                            <Input placeholder="Ex: São Paulo" {...field} disabled={!canAnalyze} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="tipoBem"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo do Bem</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!canAnalyze}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo do bem" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tiposBem.map((tipo) => (
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
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              disabled={!canAnalyze}
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
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              disabled={!canAnalyze}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="observacoes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações (Opcional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Adicione informações extras sobre o imóvel..."
                            className="min-h-[100px]"
                            {...field}
                            disabled={!canAnalyze}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
              <CardTitle className="text-lg">Como Funciona</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-bold text-xs">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Cole o Link</h4>
                  <p className="text-muted-foreground">
                    Insira a URL do leilão que deseja analisar
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-bold text-xs">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Configure Filtros</h4>
                  <p className="text-muted-foreground">
                    Defina localização e faixa de preço
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-bold text-xs">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Receba Análise</h4>
                  <p className="text-muted-foreground">
                    Relatório completo em até 2 minutos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="text-lg">O que Analisamos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Preços de mercado da região</span>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}