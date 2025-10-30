import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/shared/contexts/AuthContext";
import { ProtectedRoute } from "@/shared/guards/ProtectedRoute";
import { AdminRoute } from "@/shared/guards/AdminRoute";
import { AppLayout } from "@/shared/layouts/AppLayout";

// Auth
import { LoginPage } from "@/features/auth/LoginPage";
import { RegisterPage } from "@/features/auth/RegisterPage";

// Main Features
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { EventsPage } from "@/features/events/EventsPage";
import { EventDetailPage } from "@/features/events/EventDetailPage";
import { CommunityPage } from "@/features/community/CommunityPage";
import { ProfileDetailPage } from "@/features/community/ProfileDetailPage";
import { RoutesPage } from "@/features/routes/RoutesPage";
import { ResourcesPage } from "@/features/resources/ResourcesPage";
import { ResourceDetailPage } from "@/features/resources/ResourceDetailPage";
import { ProfilePage } from "@/features/profile/ProfilePage";

// Admin
import { AdminDashboard } from "@/features/admin/AdminDashboard";
import { UsersAdminPage } from "@/features/admin/UsersAdminPage";
import { EventsAdminPage } from "@/features/admin/EventsAdminPage";
import { ResourcesAdminPage } from "@/features/admin/ResourcesAdminPage";

import NotFound from "./pages/NotFound";

import DebugCalls from '@/pages/DebugCalls';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/debug" element={<DebugCalls />} />
            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <DashboardPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <EventsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/:id"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <EventDetailPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/community"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <CommunityPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/community/:id"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ProfileDetailPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/routes"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <RoutesPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/resources"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ResourcesPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/resources/:id"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ResourceDetailPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ProfilePage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AppLayout>
                    <AdminDashboard />
                  </AppLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AppLayout>
                    <UsersAdminPage />
                  </AppLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/events"
              element={
                <AdminRoute>
                  <AppLayout>
                    <EventsAdminPage />
                  </AppLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/resources"
              element={
                <AdminRoute>
                  <AppLayout>
                    <ResourcesAdminPage />
                  </AppLayout>
                </AdminRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
