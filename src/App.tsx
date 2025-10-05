import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NewBooking from "./pages/NewBooking";
import NotFound from "./pages/NotFound";

// Admin imports
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminLayout } from "./components/admin/AdminLayout";
import { Dashboard } from "./pages/admin/Dashboard";
import { Bookings } from "./pages/admin/Bookings";
import { CheckIn } from "./pages/admin/CheckIn";
import { PromoCodes } from "./pages/admin/PromoCodes";
import Settings from "./pages/admin/Settings";
import Reports from "./pages/admin/Reports";
import Messages from "./pages/admin/Messages";
import AdminUsers from "./pages/admin/AdminUsers";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";
import { initializeMockData } from "./lib/mockData";

// Initialize mock data on app load
initializeMockData();

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/booking" element={<NewBooking />} />
          
          {/* Admin Login - Public */}
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Protected Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route 
              path="bookings" 
              element={
                <ProtectedRoute requiredPermission="view_bookings">
                  <Bookings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="check-in" 
              element={
                <ProtectedRoute requiredPermission="check_in">
                  <CheckIn />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="promo-codes" 
              element={
                <ProtectedRoute requiredPermission="manage_promos">
                  <PromoCodes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="settings" 
              element={
                <ProtectedRoute requiredPermission="edit_settings">
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="reports" 
              element={
                <ProtectedRoute requiredPermission="view_reports">
                  <Reports />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="messages" 
              element={
                <ProtectedRoute requiredPermission="send_messages">
                  <Messages />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="users" 
              element={
                <ProtectedRoute requiredPermission="manage_users">
                  <AdminUsers />
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* 404 - Must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
