
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NotFound from "./pages/NotFound";
import Creation from "./pages/Creation";
import RecipePage from "./pages/RecipePage";
import StandbyLanding from "./pages/StandbyLanding";
import QRCodePage from "./pages/QRCodePage";
import MainLayout from "./components/layout/MainLayout";
import VideoTransitionTest from "./components/creation/VideoTransitionTest";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StandbyLanding />} />
          <Route path="/standby" element={<StandbyLanding />} />
          <Route element={<MainLayout />}>
            <Route path="/creation" element={<Creation />} />
            <Route path="/recipe/:id" element={<RecipePage />} />
          </Route>
          <Route path="/qr-code" element={<QRCodePage />} />
          <Route path="/video-test" element={<VideoTransitionTest />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
