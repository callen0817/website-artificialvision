import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import ScanAR from "./pages/ScanAR";
import AVSuite from "./pages/AVSuite";
import Technology from "./pages/Technology";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Synthesis from "./pages/Synthesis";
import AVScan from "./pages/AVScan";
import Insights from "./pages/Insights";
import Admin from "./pages/Admin";
import ComingSoonProduct from "./pages/ComingSoonProduct";
import { avSortProduct, avShiftProduct } from "./data/avSortShift";
import PageMetadata from "./components/site/PageMetadata";
import BackToTop from "./components/site/BackToTop";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: "auto" });
    else {
      const timer = window.setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "auto", block: "start" }), 150);
      return () => window.clearTimeout(timer);
    }
  }, [pathname, hash]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <ScrollToTop />
      <PageMetadata />
      <BackToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/av-synthesis" element={<Synthesis />} />
        <Route path="/av-scan" element={<AVScan />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/scanar" element={<ScanAR />} />
        <Route path="/av-suite" element={<AVSuite />} />
        <Route path="/av-suite/:productId" element={<AVSuite />} />
        <Route path="/technology" element={<Technology />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products" element={<Navigate to="/av-suite" replace />} />
        <Route path="/av-pre-vdc" element={<Navigate to="/av-synthesis" replace />} />
        <Route path="/av-sort" element={<ComingSoonProduct product={avSortProduct} />} />
        <Route path="/av-shift" element={<ComingSoonProduct product={avShiftProduct} />} />
        <Route path="/admin" element={<Admin />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;