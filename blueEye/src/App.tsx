import "./styles/output.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// ── Client Dashboard ──────────────────────────────────────────────────────────
import ClientDashboardMenu from "./screens/ClientDashboard/types/ClientDashboardMenu";
import ClientDashboard from "./screens/ClientDashboard/types/Dashboard";

import React from "react";
import SuperAdminDashboard from "./screens/Superadmindashboard/SuperAdminDashboard";
import LoginScreen from "./screens/login/LoginScreen";
import LandingHome from "./screens/landingHome/LandingPage";
import ProfilePage from "./components/ProfileContainer/ProfileContainer";
import TechDashboard from "./screens/techDashboard/Dashboard";
import PricingScreen from "./screens/pricing/Princing";
import ResetPassword from "./screens/resetPassword/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoutes";
import RegisterScreen from "./screens/register/Registerscreen";
import TechDashboardMenu from "./components/techDashboardMenu/TechDashboardMenu";
import ForgotYourPassword from "./screens/forgotPassword/ForgotPassword";
import AdminDashboardMenu from "./components/adminDashboardMenu/AdminDashboardMenu";
import { useAppSessionAsyncHooks } from "./hooks/use-app-hooks";

const App: React.FC = () => {
  useAppSessionAsyncHooks();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingHome />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />

        <Route path="/forgot-your-password" element={<ForgotYourPassword />} />
        <Route path="/reset-your-password" element={<ResetPassword />} />

        <Route path="/unauthorized" element={<h1>No autorizado</h1>} />

        {/* ── Client Dashboard — Ryan, Sebastian, Alejandro ── */}
        <Route path="/clientDashboard" element={<ClientDashboardMenu />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<ClientDashboard />} />
          <Route path="tickets" element={<div>Tickets</div>} />
          <Route path="facturas" element={<div>Facturas</div>} />
          <Route path="documentos" element={<div>Documentos</div>} />
          <Route path="notificaciones" element={<div>Notificaciones</div>} />
          <Route path="mantenimiento" element={<div>Mantenimiento</div>} />
        </Route>

        <Route path="/super/admin/dashboard" element={<SuperAdminDashboard />}/>

        {/* TechDashboard by Alejandro */}
        <Route
          path="/techDashboard"
          element={
            <ProtectedRoute allowedRoles={["tecnico"]}>
              <TechDashboardMenu />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<TechDashboard />} />
          <Route path="tickets" element={<h1>Tickets Screen</h1>} />
        </Route>

        <Route
          path="/perfil"
          element={
            <ProtectedRoute
              allowedRoles={["usuario", "tecnico", "admin", "superAdmin"]}
            >
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* AdminDashboard by Alejandro */}
        <Route
          path="/adminDashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboardMenu />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" />
          <Route path="clients" />
          <Route path="business" />
          <Route path="proyects" />
          <Route path="tech-pre-proyect" />
          <Route path="devices" />
          <Route path="inventory" />
          <Route path="suport" />
          <Route path="orders-payments" />
          <Route path="reports" />
          <Route path="employees" />
          <Route path="pricing" element={<PricingScreen />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;