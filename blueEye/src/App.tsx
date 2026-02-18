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

import "./styles/output.css";
import PricingScreen from "./screens/pricingTech/PrincingTech";
import LandingHome from "./screens/landingHome/LandingPage";

function App() {
  // TODO: Implement authentication logic to protect routes and manage user sessions
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingHome />}/>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />

        {/* hacer el dashboard del cliente rederizar la pantalla */}
        {/* ClientDashboard by Ryan, Sebastian, Alejandro */}
        <Route path="/clientDashbord" element={<div>Client Dashbord</div>} />

        {/* TechDashboard by Alejandro */}
        <Route path="/techDashboard" element={<TechDashboardMenu />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<TechDashboard />} />
          <Route path="tickets" element={<h1>Tickets Screen</h1>} />
          <Route path="pricing" element={<PricingScreen />}/>
        </Route>

        <Route path="/perfil" element={<h1>Perfil</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
