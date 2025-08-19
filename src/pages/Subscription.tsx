import { useState } from "react"
import { Check, Crown, Zap, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuthStore } from "@/store/authStore"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface Plan {
  id: string
  name: string
  price: number
  originalPrice?: number
  description: string
  icon: any
  popular?: boolean
  features: string[]
  limits: {
    analyses: number
    exports: number
  }
  color: string
}

export default function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState<string>("")
  const [isUpgrading, setIsUpgrading] = useState(false)
  
  const { subscription, updateSubscription } = useAuthStore()
  const { toast } = useToast()

  const plans: Plan[] = [
    {
      id: 'basic',
      name: 'Básico',
      price: 49.90,
      description: 'Ideal para iniciantes',
      icon: Zap,
      features: [
        '1 análise por mês',
        '1 dispositivo (desktop ou mobile)',
        'Seleção de 1 estado',
        'Análise básica de propriedades e veículos',
        '"Melhores Oportunidades Hoje" na HOME',
        'Suporte por email'
      ],
      limits: { analyses: 1, exports: 5 },
      color: 'border-muted'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 79.90,
      description: 'Para investidores ativos',
      icon: Star,
      popular: true,
      features: [
        '10 análises por mês',
        '1 desktop + 1 mobile',
        'Múltiplos estados',
        'Todas as funcionalidades do Básico',
        'Análises ilimitadas',
        'Relatórios avançados',
        'Suporte prioritário'
      ],
      limits: { analyses: 10, exports: 50 },
      color: 'border-warning'
    },
    {
      id: 'elite',
      name: 'Elite',
      price: 229.90,
      description: 'Para profissionais sérios',
      icon: Crown,
      features: [
        '50 análises detalhadas por mês',
        'Todas as funcionalidades do Pro',
        'Avaliação de leiloeiros',
        'Comunidade exclusiva de arrematadores',
        'Suporte prioritário',
        'Alertas personalizados',
        'Controle anti-compartilhamento',
        'Histórico completo',
        'Análise de risco detalhada'
      ],
      limits: { analyses: 50, exports: -1 },
      color: 'border-primary'
    }
  ]

  const handleUpgrade = async (planId: string) => {
    setSelectedPlan(planId)
    setIsUpgrading(true)

    try {
      // Simular processo de upgrade
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const plan = plans.find(p => p.id === planId)
      if (plan && subscription) {
        const newSubscription = {
          ...subscription,
          plan: planId as 'basic' | 'pro' | 'elite',
          limits: { 
            ...plan.limits, 
            devices: planId === 'basic' ? 1 : 2,
            states: planId === 'basic' ? 1 : -1,
            bestOpportunities: true, // All plans now have it on HOME
            eliteFeatures: planId === 'elite',
            communityAccess: planId === 'elite'
          },
          usage: { analyses: 0, exports: 0, activeDevices: 1 } // Reset usage
        }
        
        updateSubscription(newSubscription)
        
        toast({
          title: "Plano atualizado!",
          description: `Você agora tem acesso ao plano ${plan.name}`,
        })
      }
    } catch (error) {
      toast({
        title: "Erro no upgrade",
        description: "Tente novamente em alguns minutos",
        variant: "destructive"
      })
    } finally {
      setIsUpgrading(false)
      setSelectedPlan("")
    }
  }

  const currentPlan = plans.find(p => p.id === subscription?.plan)

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gradient">
          Escolha seu Plano
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Desbloqueie todo o potencial da análise de leilões com nossos planos flexíveis
        </p>
        
        {/* Current Usage */}
        {subscription && currentPlan && (
          <Card className="max-w-md mx-auto card-glow">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <Badge className="mb-2">
                  Plano Atual: {currentPlan.name}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Análises</span>
                    <span>
                      {subscription.usage.analyses}/
                      {subscription.limits.analyses === -1 ? '∞' : subscription.limits.analyses}
                    </span>
                  </div>
                  <Progress 
                    value={
                      subscription.limits.analyses === -1 
                        ? 100 
                        : (subscription.usage.analyses / subscription.limits.analyses) * 100
                    }
                    className="h-2"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Exportações</span>
                    <span>
                      {subscription.usage.exports}/
                      {subscription.limits.exports === -1 ? '∞' : subscription.limits.exports}
                    </span>
                  </div>
                  <Progress 
                    value={
                      subscription.limits.exports === -1 
                        ? 100 
                        : (subscription.usage.exports / subscription.limits.exports) * 100
                    }
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const Icon = plan.icon
          const isCurrentPlan = subscription?.plan === plan.id
          const isUpgradingThis = selectedPlan === plan.id && isUpgrading

          return (
            <Card key={plan.id} className={cn(
              "relative card-glow transition-all duration-200",
              plan.popular && "ring-2 ring-primary/20 scale-105",
              plan.color
            )}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-primary text-primary-foreground px-4 py-1">
                    Mais Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-primary">
                  <Icon className="h-8 w-8 text-primary-foreground" />
                </div>
                
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-sm">
                  {plan.description}
                </CardDescription>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-bold text-gradient">
                      {formatCurrency(plan.price)}
                    </span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                  
                  {plan.originalPrice && (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm text-muted-foreground line-through">
                        {formatCurrency(plan.originalPrice)}
                      </span>
                      <Badge variant="outline" className="text-success">
                        -{Math.round((1 - plan.price / plan.originalPrice) * 100)}%
                      </Badge>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                
                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-success flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                <Button 
                  className={cn(
                    "w-full",
                    plan.popular ? "btn-premium" : "bg-muted hover:bg-muted/80"
                  )}
                  disabled={isCurrentPlan || isUpgradingThis}
                  onClick={() => handleUpgrade(plan.id)}
                >
                  {isUpgradingThis ? (
                    "Processando..."
                  ) : isCurrentPlan ? (
                    "Plano Atual"
                  ) : (
                    <>
                      Escolher {plan.name}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                
                {isCurrentPlan && (
                  <p className="text-xs text-center text-muted-foreground">
                    Você pode fazer upgrade a qualquer momento
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* FAQ Section */}
      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="text-center">Perguntas Frequentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Posso trocar de plano?</h4>
              <p className="text-sm text-muted-foreground">
                Sim, você pode fazer upgrade ou downgrade a qualquer momento. 
                As mudanças são aplicadas imediatamente.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Como funciona o pagamento?</h4>
              <p className="text-sm text-muted-foreground">
                Cobrança mensal automática via cartão de crédito ou boleto. 
                Sem taxas ocultas ou compromissos anuais.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Há período de teste?</h4>
              <p className="text-sm text-muted-foreground">
                Todos os planos incluem 7 dias de teste gratuito. 
                Cancele a qualquer momento sem cobrança.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Preciso de ajuda?</h4>
              <p className="text-sm text-muted-foreground">
                Nossa equipe está disponível para ajudar via chat, 
                email ou telefone dependendo do seu plano.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}