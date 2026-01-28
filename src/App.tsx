import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Overview from "./pages/Overview";
import WalletAnalyzer from "./pages/WalletAnalyzer";
import PhishingDetection from "./pages/PhishingDetection";
import TransactionMonitor from "./pages/TransactionMonitor";
import AIModelInfo from "./pages/AIModelInfo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Overview />} />
            <Route path="/wallet" element={<WalletAnalyzer />} />
            <Route path="/phishing" element={<PhishingDetection />} />
            <Route path="/transactions" element={<TransactionMonitor />} />
            <Route path="/ai-info" element={<AIModelInfo />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
