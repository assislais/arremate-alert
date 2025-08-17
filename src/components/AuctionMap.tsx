import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, DollarSign, Eye } from 'lucide-react';

// Mock auction data
const mockAuctions = [
  {
    id: 1,
    title: "Leilão de Veículos - São Paulo",
    status: "ongoing",
    lat: -23.5505,
    lng: -46.6333,
    city: "São Paulo",
    state: "SP",
    date: "2025-01-20",
    totalLots: 45,
    estimatedValue: 2500000,
  },
  {
    id: 2,
    title: "Leilão Imobiliário - Rio de Janeiro",
    status: "upcoming",
    lat: -22.9068,
    lng: -43.1729,
    city: "Rio de Janeiro", 
    state: "RJ",
    date: "2025-01-25",
    totalLots: 12,
    estimatedValue: 8900000,
  },
  {
    id: 3,
    title: "Leilão de Bens Diversos - Belo Horizonte",
    status: "ongoing",
    lat: -19.9167,
    lng: -43.9345,
    city: "Belo Horizonte",
    state: "MG", 
    date: "2025-01-18",
    totalLots: 78,
    estimatedValue: 1200000,
  },
  {
    id: 4,
    title: "Leilão Judicial - Porto Alegre",
    status: "upcoming",
    lat: -30.0346,
    lng: -51.2177,
    city: "Porto Alegre",
    state: "RS",
    date: "2025-01-30",
    totalLots: 23,
    estimatedValue: 4500000,
  },
  {
    id: 5,
    title: "Leilão de Veículos - Brasília",
    status: "ongoing",
    lat: -15.8267,
    lng: -47.9218,
    city: "Brasília",
    state: "DF",
    date: "2025-01-22",
    totalLots: 67,
    estimatedValue: 3200000,
  }
];

const AuctionMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedAuction, setSelectedAuction] = useState<typeof mockAuctions[0] | null>(null);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    if (!mapContainer.current) return;

    // For now, show an input for API key since we don't have Supabase secrets set up
    if (!apiKey && !showApiKeyInput) {
      setShowApiKeyInput(true);
      return;
    }

    if (!apiKey) return;

    // Initialize map with provided API key
    mapboxgl.accessToken = apiKey;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-47.9218, -15.8267], // Center on Brazil
      zoom: 4,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Add auction markers
    mockAuctions.forEach((auction) => {
      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.className = `
        w-4 h-4 rounded-full border-2 border-white shadow-lg cursor-pointer
        transition-transform hover:scale-110
        ${auction.status === 'ongoing' 
          ? 'bg-green-500' 
          : 'bg-yellow-500'
        }
      `;
      
      // Add marker to map
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([auction.lng, auction.lat])
        .addTo(map.current!);

      // Add click event to marker
      markerElement.addEventListener('click', () => {
        setSelectedAuction(auction);
        map.current?.flyTo({
          center: [auction.lng, auction.lat],
          zoom: 10,
          duration: 1000
        });
      });

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        className: 'auction-popup'
      }).setHTML(`
        <div class="p-2">
          <h3 class="font-semibold text-sm mb-1">${auction.title}</h3>
          <div class="text-xs text-gray-600 space-y-1">
            <div class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-full ${
                auction.status === 'ongoing' ? 'bg-green-500' : 'bg-yellow-500'
              }"></span>
              ${auction.status === 'ongoing' ? 'Em Andamento' : 'Em Breve'}
            </div>
            <div>${auction.totalLots} lotes</div>
            <div>R$ ${(auction.estimatedValue / 1000000).toFixed(1)}M</div>
          </div>
        </div>
      `);

      marker.setPopup(popup);
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [apiKey]);

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      setShowApiKeyInput(false);
    }
  };

  if (showApiKeyInput) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Configure Mapbox</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Para visualizar o mapa, insira sua chave pública do Mapbox. 
              Você pode obtê-la em{' '}
              <a 
                href="https://mapbox.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                mapbox.com
              </a>
            </p>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="pk.eyJ1IjoiZXhhbXBsZS..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md"
              />
              <Button onClick={handleApiKeySubmit} className="w-full">
                Carregar Mapa
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px]">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      
      {/* Map Legend */}
      <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
        <h3 className="font-semibold text-sm mb-2">Legenda</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Em Andamento</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Em Breve</span>
          </div>
        </div>
      </div>

      {/* Auction Details Panel */}
      {selectedAuction && (
        <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg max-w-sm">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-sm">{selectedAuction.title}</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedAuction(null)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Badge 
                  variant={selectedAuction.status === 'ongoing' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {selectedAuction.status === 'ongoing' ? 'Em Andamento' : 'Em Breve'}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{selectedAuction.city}, {selectedAuction.state}</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{new Date(selectedAuction.date).toLocaleDateString('pt-BR')}</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="h-3 w-3" />
                <span>R$ {(selectedAuction.estimatedValue / 1000000).toFixed(1)}M estimados</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Eye className="h-3 w-3" />
                <span>{selectedAuction.totalLots} lotes disponíveis</span>
              </div>
            </div>

            <Button size="sm" className="w-full">
              Ver Detalhes do Leilão
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionMap;