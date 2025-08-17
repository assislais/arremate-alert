import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NewAnalysis from "./pages/NewAnalysis";
import Subscription from "./pages/Subscription";
import Reports from "./pages/Reports";
import LotDetails from "./pages/LotDetails";
import BestOpportunities from "./pages/BestOpportunities";
import Community from "./pages/Community";
import Exchanges from "./pages/Exchanges";
import Terms from "./pages/Terms";
import AuctionMapPage from "./pages/AuctionMap";
import NotFound from "./pages/NotFound";

// Layouts
import { MainLayout } from "./components/layouts/MainLayout";
import { AuthLayout } from "./components/layouts/AuthLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<AuthLayout />}>
            <Route index element={<Login />} />
          </Route>
          <Route path="/register" element={<AuthLayout />}>
            <Route index element={<Register />} />
          </Route>
          
          {/* Protected routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="analise/new" element={<NewAnalysis />} />
            <Route path="analise/:id" element={<div className="p-8 text-center text-muted-foreground">Resultado da Análise - Em desenvolvimento</div>} />
            <Route path="relatorios" element={<Reports />} />
            <Route path="lote/:id" element={<LotDetails />} />
            <Route path="melhores-oportunidades" element={<BestOpportunities />} />
            <Route path="interesses" element={<div className="p-8 text-center text-muted-foreground">Meus Interesses - Em desenvolvimento</div>} />
            <Route path="sugestoes" element={<div className="p-8 text-center text-muted-foreground">Sugestões - Em desenvolvimento</div>} />
            <Route path="historico" element={<div className="p-8 text-center text-muted-foreground">Histórico - Em desenvolvimento</div>} />
            <Route path="arremates" element={<div className="p-8 text-center text-muted-foreground">Meus Arremates - Em desenvolvimento</div>} />
            <Route path="calendario" element={<div className="p-8 text-center text-muted-foreground">Calendário - Em desenvolvimento</div>} />
            <Route path="assinatura" element={<Subscription />} />
            <Route path="comunidade" element={<Community />} />
            <Route path="trocas" element={<Exchanges />} />
            <Route path="mapa" element={<AuctionMapPage />} />
            <Route path="termos" element={<Terms />} />
            <Route path="chat" element={<div className="p-8 text-center text-muted-foreground">Chat - Em desenvolvimento</div>} />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
