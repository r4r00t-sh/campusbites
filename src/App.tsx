import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedStudentRoute from "@/components/ProtectedStudentRoute";
import Landing from "./pages/Landing";
import AuthPage from "./pages/Auth";
import MenuPage from "./pages/student/Menu";
import CartPage from "./pages/student/Cart";
import OrdersPage from "./pages/student/Orders";
import HistoryPage from "./pages/student/History";
import StaffDashboard from "./pages/staff/Dashboard";
import StaffMenuManagement from "./pages/staff/MenuManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/student/menu" element={<ProtectedStudentRoute><MenuPage /></ProtectedStudentRoute>} />
            <Route path="/student/cart" element={<ProtectedStudentRoute><CartPage /></ProtectedStudentRoute>} />
            <Route path="/student/orders" element={<ProtectedStudentRoute><OrdersPage /></ProtectedStudentRoute>} />
            <Route path="/student/history" element={<ProtectedStudentRoute><HistoryPage /></ProtectedStudentRoute>} />
            <Route path="/staff/dashboard" element={<StaffDashboard />} />
            <Route path="/staff/menu" element={<StaffMenuManagement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
