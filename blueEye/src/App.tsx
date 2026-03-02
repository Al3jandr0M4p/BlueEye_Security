import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginScreen from "./screens/login/LoginScreen";
import RegisterScreen from "./screens/register/Registerscreen";
import TechDashboardMenu from "./screens/techDashboardMenu/TechDashboardMenu";
import TechDashboard from "./screens/techDashboard/Dashboard";

// ── Client Dashboard ──────────────────────────────────────────────────────────
import ClientDashboardMenu from "./screens/ClientDashboard/types/ClientDashboardMenu";
import ClientDashboard from "./screens/ClientDashboard/types/Dashboard";

import PricingScreen from "./screens/pricingTech/PrincingTech";
import LandingHome from "./screens/landingHome/LandingPage";
import React from "react";
import RegisterBusiness from "./screens/registerBusiness/RegisterBusiness";

import "./styles/output.css";

const App: React.FC = () => {
  // TODO: Implement authentication logic to protect routes and manage user sessions
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingHome />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/register/business" element={<RegisterBusiness />} />

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

        {/* ── Tech Dashboard — Alejandro ───────────────────── */}
        <Route path="/techDashboard" element={<TechDashboardMenu />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<TechDashboard />} />
          <Route path="tickets" element={<h1>Tickets Screen</h1>} />
          <Route path="pricing" element={<PricingScreen />} />
        </Route>

        <Route path="/perfil" element={<h1>Perfil</h1>} />
      </Routes>
    </Router>
  );
};

export default App;