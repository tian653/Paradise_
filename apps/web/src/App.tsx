import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import PublicPage from "./pages/public/PublicPage";
import LoginPage from "./pages/admin/LoginPage";
import AdminLayout from "./components/admin/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import AdminActivitiesPage from "./pages/admin/AdminActivitiesPage";
import AdminGalleryPage from "./pages/admin/AdminGalleryPage";
import AdminOfficersPage from "./pages/admin/AdminOfficersPage";
import AdminContactPage from "./pages/admin/AdminContactPage";

// Protected route wrapper
function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
}

// Redirect if already logged in
function GuestRoute() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }
  return <Outlet />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<PublicPage />} />

      {/* Admin Auth */}
      <Route element={<GuestRoute />}>
        <Route path="/admin/login" element={<LoginPage />} />
      </Route>

      {/* Admin Protected */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
          <Route path="activities" element={<AdminActivitiesPage />} />
          <Route path="gallery" element={<AdminGalleryPage />} />
          <Route path="officers" element={<AdminOfficersPage />} />
          <Route path="contact" element={<AdminContactPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--color-bg-card)",
              color: "var(--color-text-primary)",
              border: "1px solid var(--color-border)",
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
            },
            success: {
              iconTheme: {
                primary: "var(--color-gold)",
                secondary: "#0a0e1a",
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
