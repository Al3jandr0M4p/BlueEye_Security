import "./styles/output.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React from "react";

import NotFound from "./screens/notFound/NotFound";
import Forbidden from "./screens/errors/Forbidden";
import BadRequest from "./screens/errors/BadRequest";
import LoginScreen from "./screens/login/LoginScreen";
import PricingScreen from "./screens/pricing/Princing";
import InfoCrud from "./components/infoCrudUsers/InfoCrud";
import LandingHome from "./screens/landingHome/LandingPage";
import TechDashboard from "./screens/techDashboard/Dashboard";
import RegisterScreen from "./screens/register/Registerscreen";
import AdminUsersScreen from "./screens/adminUsers/AdminUsers";
import ResetPassword from "./screens/resetPassword/ResetPassword";
import ClientTickets from "./features/client/pages/ClientTickets";
import ClientInvoices from "./features/client/pages/ClientInvoices";
import AdminReportsScreen from "./screens/adminDashboard/ReportsHub";
import ClientDashboard from "./features/client/pages/ClientDashboard";
import DashboardAdminScreen from "./screens/adminDashboard/Dashboard";
import AdminSupportScreen from "./screens/adminDashboard/SupportDesk";
import ForgotYourPassword from "./screens/forgotPassword/ForgotPassword";
import ProfilePage from "./components/ProfileContainer/ProfileContainer";
import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoutes";
import ClientMaintenance from "./features/client/pages/ClientMaintenance";
import AdminClientsScreen from "./screens/adminDashboard/ClientsOverview";
import AdminBusinessScreen from "./screens/adminDashboard/BusinessOverview";
import AdminInventoryScreen from "./screens/adminDashboard/InventoryControl";
import AdminProjectsScreen from "./screens/adminDashboard/ProjectsManagement";
import AdminPreProjectScreen from "./screens/adminDashboard/PreProjectPlanning";
import TechDashboardMenu from "./components/techDashboardMenu/TechDashboardMenu";
import SuperAdminDashboard from "./screens/Superadmindashboard/SuperAdminDashboard";
import AdminDashboardMenu from "./components/adminDashboardMenu/AdminDashboardMenu";
import ClientDashboardMenu from "./screens/ClientDashboard/types/ClientDashboardMenu";
import InviteUserConfiguration from "./screens/inviteUserConfiguration/InviteUserConfiguration";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingHome />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route
          path="/invite/user/config/accounts"
          element={<InviteUserConfiguration />}
        />

        <Route path="/forgot-your-password" element={<ForgotYourPassword />} />
        <Route path="/reset-your-password" element={<ResetPassword />} />

        <Route path="/unauthorized" element={<Forbidden />} />
        <Route path="/403" element={<Forbidden />} />
        <Route path="/400" element={<BadRequest />} />
        <Route path="/404" element={<NotFound />} />

        {/* ── Client Dashboard — Sebastian ── */}
        <Route
          path="/clientDashboard"
          element={
            // <ProtectedRoute allowedRoles={["usuario"]}>
            <ClientDashboardMenu />
            // </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<ClientDashboard />} />
          <Route path="tickets" element={<ClientTickets />} />
          <Route path="facturas" element={<ClientInvoices />} />
          <Route path="documentos" element={<ClientInvoices />} />
          <Route path="notificaciones" element={<ClientDashboard />} />
          <Route path="mantenimiento" element={<ClientMaintenance />} />
        </Route>

        <Route
          path="/super/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["superAdmin"]}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* TechDashboard by Alejandro, sebastian, ryan */}
        <Route
          path="/techDashboard"
          element={
            // <ProtectedRoute allowedRoles={["tecnico"]}>
            <TechDashboardMenu />
            // </ProtectedRoute>
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
          path="/adminDashboard/employees/info/:userType/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <InfoCrud />
            </ProtectedRoute>
          }
        />

        <Route
          path="/adminDashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboardMenu />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<DashboardAdminScreen />} />
          <Route path="clients" element={<AdminClientsScreen />} />
          <Route path="business" element={<AdminBusinessScreen />} />
          <Route path="proyects" element={<AdminProjectsScreen />} />
          <Route path="tech-pre-proyect" element={<AdminPreProjectScreen />} />
          <Route path="devices" element={<AdminInventoryScreen />} />
          <Route path="suport" element={<AdminSupportScreen />} />
          <Route path="reports" element={<AdminReportsScreen />} />
          <Route path="employees" element={<AdminUsersScreen />} />
          <Route path="pricing" element={<PricingScreen />} />
        </Route>

        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
