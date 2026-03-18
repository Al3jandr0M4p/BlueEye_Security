import "./styles/output.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React from "react";
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
import AdminUsersScreen from "./screens/adminUsers/AdminUsers";
import InfoCrud from "./components/infoCrudUsers/InfoCrud";
import NotFound from "./screens/notFound/NotFound";
import Forbidden from "./screens/errors/Forbidden";
import BadRequest from "./screens/errors/BadRequest";
import DashboardAdminScreen from "./screens/adminDashboard/Dashboard";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingHome />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route
          path="/invite/user/config/accounts"
          element={<h1>Crea tu cuenta</h1>}
        />

        <Route path="/forgot-your-password" element={<ForgotYourPassword />} />
        <Route path="/reset-your-password" element={<ResetPassword />} />

        <Route path="/unauthorized" element={<Forbidden />} />
        <Route path="/403" element={<Forbidden />} />
        <Route path="/400" element={<BadRequest />} />
        <Route path="/404" element={<NotFound />} />

        {/* hacer el dashboard del cliente rederizar la pantalla */}
        {/* ClientDashboard by Ryan, Sebastian, Alejandro */}
        <Route path="/clientDashbord" element={<div>Client Dashbord</div>} />

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
          path="/invite/user/config/accounts"
          element={<h1>Configura tu cuenta</h1>}
        />

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
          <Route path="clients" />
          <Route path="business" />
          <Route path="proyects" />
          <Route path="tech-pre-proyect" />
          <Route path="devices" />
          <Route path="inventory" />
          <Route path="suport" />
          <Route path="orders-payments" />
          <Route path="reports" />
          <Route path="employees" element={<AdminUsersScreen />} />
          <Route path="pricing" element={<PricingScreen />} />
        </Route>

        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
