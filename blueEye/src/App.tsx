import "./styles/output.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React from "react";
import ClientDashboardMenu from "./screens/ClientDashboard/ClientDashboardMenu";
import ClientDashboard from "./screens/ClientDashboard/Overview";
import ClientTickets from "./screens/ClientDashboard/Tickets";
import ClientInvoices from "./screens/ClientDashboard/Invoices";
import ClientMaintenance from "./screens/ClientDashboard/Maintenance";
import SuperAdminLayout from "./screens/SuperAdmin/Layout";
import SuperAdminDashboard from "./screens/SuperAdmin/Dashboard";
import SuperAdminCompanies from "./screens/SuperAdmin/Companies";
import SuperAdminPlans from "./screens/SuperAdmin/Plans";
import SuperAdminBilling from "./screens/SuperAdmin/Billing";
import SuperAdminUsers from "./screens/SuperAdmin/Users";
import SuperAdminAudit from "./screens/SuperAdmin/Audit";
import SuperAdminSupport from "./screens/SuperAdmin/Support";
import SuperAdminSettings from "./screens/SuperAdmin/Settings";
import SuperAdminProfile from "./screens/SuperAdmin/Profile";
import LoginScreen from "./screens/login/LoginScreen";
import LandingHome from "./screens/landingHome/LandingPage";
import ProfilePage from "./components/ProfileContainer/ProfileContainer";
import TechDashboard from "./screens/techDashboard/Dashboard";
import TechTickets from "./screens/techDashboard/Tickets";
import TechSurveys from "./screens/techDashboard/Surveys";
import TechSites from "./screens/techDashboard/Sites";
import PricingScreen from "./screens/pricing/Princing";
import ResetPassword from "./screens/resetPassword/ResetPassword";
import VerifyEmail from "./screens/verifyEmail/VerifyEmail";
import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoutes";
import RegisterScreen from "./screens/register/Registerscreen";
import TechDashboardMenu from "./components/techDashboardMenu/TechDashboardMenu";
import ForgotYourPassword from "./screens/forgotPassword/ForgotPassword";
import AdminDashboardMenu from "./components/adminDashboardMenu/AdminDashboardMenu";
import AdminUsersScreen from "./screens/adminUsers/AdminUsers";
import InfoCrud from "./components/infoCrudUsers/InfoCrud";
import NotFound from "./screens/notFound/NotFound";
import Forbidden from "./screens/errors/Forbidden";
import BadRequest from "./screens/errors/BadRequest";
import AdminReportsScreen from "./screens/adminDashboard/ReportsHub";
import DashboardAdminScreen from "./screens/adminDashboard/Dashboard";
import AdminSupportScreen from "./screens/adminDashboard/SupportDesk";
import AdminClientsScreen from "./screens/adminDashboard/ClientsOverview";
import AdminClientSitesScreen from "./screens/adminDashboard/ClientSites";
import AdminBusinessScreen from "./screens/adminDashboard/BusinessOverview";
import AdminInventoryScreen from "./screens/adminDashboard/InventoryControl";
import AdminProjectsScreen from "./screens/adminDashboard/ProjectsManagement";
import AdminPreProjectScreen from "./screens/adminDashboard/PreProjectPlanning";
import InviteUserConfiguration from "./screens/inviteUserConfiguration/InviteUserConfiguration";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingHome />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
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
            <ProtectedRoute allowedRoles={["usuario"]}>
              <ClientDashboardMenu />
            </ProtectedRoute>
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

        {/* ── Super Admin ── */}
        <Route
          path="/super/admin"
          element={
            <ProtectedRoute allowedRoles={["superAdmin", "admin"]}>
              <SuperAdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="companies" element={<SuperAdminCompanies />} />
          <Route path="plans" element={<SuperAdminPlans />} />
          <Route path="billing" element={<SuperAdminBilling />} />
          <Route path="users" element={<SuperAdminUsers />} />
          <Route path="audit" element={<SuperAdminAudit />} />
          <Route path="support" element={<SuperAdminSupport />} />
          <Route path="settings" element={<SuperAdminSettings />} />
          <Route path="profile" element={<SuperAdminProfile />} />
        </Route>

        {/* TechDashboard by Alejandro, sebastian, ryan */}
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
          <Route path="tickets" element={<TechTickets />} />
          <Route path="levantamientos" element={<TechSurveys />} />
          <Route path="sitios" element={<TechSites />} />
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
          <Route
            path="clients/:clientId/sites"
            element={<AdminClientSitesScreen />}
          />
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
