import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import SensorDetails from "./pages/SensorDetails";
import TractorListing from "./pages/TractorListing";
import TractorRegistration from "./pages/TractorRegistration";
import RentTractor from "./pages/RentTractor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set HTML direction based on language (RTL for Tamil)
    const htmlElement = document.documentElement;
    if (i18n.language === 'ta') {
      htmlElement.dir = 'rtl';
      htmlElement.lang = 'ta';
      document.body.style.textAlign = 'right';
    } else {
      htmlElement.dir = 'ltr';
      htmlElement.lang = i18n.language;
      document.body.style.textAlign = 'left';
    }
  }, [i18n.language]);

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/sensors" element={<SensorDetails />} />
      <Route path="/tractors" element={<TractorListing />} />
      <Route path="/register" element={<TractorRegistration />} />
      <Route path="/rent/:id" element={<RentTractor />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <AppContent />
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
