import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import DashboardLayout from "@/components/DashboardLayout";
import ChatWidget from "@/components/ChatWidget";
import CyberHelpline from "@/components/CyberHelpline";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ImageDetection from "./pages/ImageDetection";
import VoiceDetection from "./pages/VoiceDetection";
import PhishingAnalyzer from "./pages/PhishingAnalyzer";
import MalwareScanner from "./pages/MalwareScanner";
import FakeLoanDetector from "./pages/FakeLoanDetector";
import FakeSmsDetector from "./pages/FakeSmsDetector";
import NotFound from "./pages/NotFound";
import { ReactNode } from "react";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <ChatWidget />
      <CyberHelpline />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout><Dashboard /></DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/image"
          element={
            <ProtectedRoute>
              <DashboardLayout><ImageDetection /></DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/voice"
          element={
            <ProtectedRoute>
              <DashboardLayout><VoiceDetection /></DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/phishing"
          element={
            <ProtectedRoute>
              <DashboardLayout><PhishingAnalyzer /></DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/malware"
          element={
            <ProtectedRoute>
              <DashboardLayout><MalwareScanner /></DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/fake-loan"
          element={
            <ProtectedRoute>
              <DashboardLayout><FakeLoanDetector /></DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/fake-sms"
          element={
            <ProtectedRoute>
              <DashboardLayout><FakeSmsDetector /></DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
