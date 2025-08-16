import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, FileText, Shield, DollarSign } from "lucide-react"

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gradient mb-2">Termos de Uso</h1>
        <p className="text-muted-foreground">
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </p>
      </div>

      <Alert className="border-warning/20 bg-warning/5">
        <AlertTriangle className="h-4 w-4 text-warning" />
        <AlertDescription className="text-warning">
          <strong>Importante:</strong> Leia atentamente todos os termos antes de utilizar nossa plataforma. 
          O uso dos serviços implica na aceitação integral destes termos.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        
        {/* Análises e Limitações */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Limitações das Análises
            </CardTitle>
            <CardDescription>
              Entenda o que nossas análises representam e suas limitações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-destructive mb-2">DISCLAIMER IMPORTANTE</h4>
              <p className="text-sm text-muted-foreground mb-4">
                As análises fornecidas pela plataforma ArremateAlert são baseadas em dados históricos, 
                algoritmos proprietários e informações públicas disponíveis. <strong>NÃO CONSTITUEM 
                GARANTIA DE VALOR OU RECOMENDAÇÃO DE INVESTIMENTO.</strong>
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-semibold">Limitações Técnicas:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  As estimativas de valor são baseadas em dados históricos e podem não refletir condições atuais do mercado
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  Fatores externos como estado de conservação, documentação e localização específica podem afetar significativamente o valor real
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  A plataforma não tem acesso a informações privilegiadas ou análises presenciais dos bens
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  Mudanças súbitas no mercado podem tornar as análises desatualizadas
                </li>
              </ul>
            </div>

            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <h4 className="font-semibold text-destructive mb-2">Responsabilidade do Usuário:</h4>
              <p className="text-sm text-muted-foreground">
                O usuário deve sempre realizar sua própria due diligence, incluindo visitas presenciais, 
                análise de documentação e consulta a especialistas antes de participar de qualquer leilão. 
                A ArremateAlert não se responsabiliza por perdas financeiras decorrentes do uso de nossas análises.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Política de Descontos */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Política de Descontos
            </CardTitle>
            <CardDescription>
              Regras para obtenção de descontos na mensalidade
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Programa de Desconto por Engajamento</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Oferecemos desconto de R$ 10,00 na mensalidade para usuários que contribuem 
                com conteúdo de qualidade após visitas aos lotes.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Requisitos para Desconto:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  Upload de fotos de qualidade do bem visitado (mínimo 3 fotos)
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  Preenchimento completo do checklist técnico (quando aplicável)
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  Feedback detalhado sobre o estado do bem
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  Máximo de 1 desconto por lote visitado por mês
                </li>
              </ul>
            </div>

            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <h4 className="font-semibold text-warning mb-2">Condições do Desconto:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Desconto válido apenas para o mês seguinte ao upload</li>
                <li>• Conteúdo deve ser aprovado pela equipe de moderação</li>
                <li>• Fotos e informações falsas resultam em suspensão da conta</li>
                <li>• Desconto não cumulativo com outras promoções</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Responsabilidades */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Responsabilidades e Limitações
            </CardTitle>
            <CardDescription>
              Definição clara de responsabilidades entre usuário e plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Responsabilidades da ArremateAlert:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  Fornecer análises baseadas nos melhores dados disponíveis
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  Manter a plataforma funcionando dentro dos padrões técnicos
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  Proteger dados pessoais conforme LGPD
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  Oferecer suporte técnico dentro dos limites do plano contratado
                </li>
              </ul>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-2">Responsabilidades do Usuário:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  Realizar análise própria e independente antes de investir
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  Verificar toda documentação e condições dos leilões
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  Usar a plataforma de forma ética e conforme os termos
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  Manter suas informações de conta atualizadas
                </li>
              </ul>
            </div>

            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <h4 className="font-semibold text-destructive mb-2">EXCLUSÃO DE RESPONSABILIDADE:</h4>
              <p className="text-sm text-muted-foreground">
                A ArremateAlert NÃO se responsabiliza por: perdas financeiras em leilões, 
                inexatidão de dados de terceiros, problemas técnicos de leiloeiros, 
                mudanças regulatórias no setor, ou qualquer dano direto ou indireto 
                decorrente do uso da plataforma.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Uso da Plataforma */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle>Uso Aceitável da Plataforma</CardTitle>
            <CardDescription>
              Regras gerais para uso dos serviços
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Condutas Proibidas:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  Compartilhar login com terceiros
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  Tentar quebrar ou contornar limitações técnicas
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  Usar dados da plataforma para fins comerciais sem autorização
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  Publicar conteúdo falso ou enganoso na comunidade
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  Usar a plataforma para atividades ilegais
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Alterações nos Termos:</h4>
              <p className="text-sm text-muted-foreground">
                Reservamo-nos o direito de alterar estes termos a qualquer momento. 
                Usuários serão notificados por email sobre mudanças significativas 
                com 30 dias de antecedência. O uso continuado da plataforma após 
                as alterações implica na aceitação dos novos termos.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Lei Aplicável:</h4>
              <p className="text-sm text-muted-foreground">
                Estes termos são regidos pela legislação brasileira. 
                Eventuais disputas serão resolvidas no foro da comarca de São Paulo/SP.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center text-sm text-muted-foreground border-t border-border pt-6">
        <p>
          Para dúvidas sobre estes termos, entre em contato através do email: 
          <strong className="text-primary"> legal@arrematealert.com</strong>
        </p>
      </div>
    </div>
  )
}