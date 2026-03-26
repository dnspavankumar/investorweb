import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SiteHeader from "@/components/SiteHeader";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import StartupOnboarding from "./pages/StartupOnboarding";
import InvestorOnboarding from "./pages/InvestorOnboarding";
import StartupDashboard from "./pages/StartupDashboard";
import InvestorDashboard from "./pages/InvestorDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SiteHeader />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/startup/onboarding"
              element={(
                <ProtectedRoute role="startup">
                  <StartupOnboarding />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/investor/onboarding"
              element={(
                <ProtectedRoute role="investor">
                  <InvestorOnboarding />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/startup/dashboard"
              element={(
                <ProtectedRoute role="startup">
                  <StartupDashboard />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/investor/dashboard"
              element={(
                <ProtectedRoute role="investor">
                  <InvestorDashboard />
                </ProtectedRoute>
              )}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
