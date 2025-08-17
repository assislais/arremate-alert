import AuctionMap from "@/components/AuctionMap"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar, TrendingUp } from "lucide-react"

export default function AuctionMapPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gradient mb-2">Mapa de Leilões</h1>
        <p className="text-muted-foreground">
          Visualize leilões em andamento e futuros em todo o Brasil
        </p>
      </div>

      {/* Map Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-glow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <MapPin className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-muted-foreground">Em Andamento</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Calendar className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">2</div>
                <div className="text-sm text-muted-foreground">Em Breve</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">225</div>
                <div className="text-sm text-muted-foreground">Total de Lotes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Map */}
      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Localização dos Leilões
          </CardTitle>
          <CardDescription>
            Clique nos marcadores para ver mais informações sobre cada leilão
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuctionMap />
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="card-glow">
        <CardHeader>
          <CardTitle>Como usar o mapa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-500 flex-shrink-0 flex items-center justify-center text-white text-xs">1</div>
            <div>
              <strong>Marcadores Verdes:</strong> Leilões em andamento que você pode participar agora
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-yellow-500 flex-shrink-0 flex items-center justify-center text-white text-xs">2</div>
            <div>
              <strong>Marcadores Amarelos:</strong> Leilões futuros para acompanhar
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white text-xs">3</div>
            <div>
              <strong>Clique nos marcadores:</strong> Veja detalhes, número de lotes e valores estimados
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}