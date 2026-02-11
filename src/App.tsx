import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { MainLayout } from "./components/layout/MainLayout";
import Overview from "./pages/Overview";
import WalletAnalyzer from "./pages/WalletAnalyzer";
import PhishingDetection from "./pages/PhishingDetection";
import TransactionMonitor from "./pages/TransactionMonitor";
import AIModelInfo from "./pages/AIModelInfo";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route path="/" element={<Overview />} />
              <Route path="/wallet" element={<WalletAnalyzer />} />
              <Route path="/phishing" element={<PhishingDetection />} />
              <Route path="/transactions" element={<TransactionMonitor />} />
              <Route path="/ai-info" element={<AIModelInfo />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
