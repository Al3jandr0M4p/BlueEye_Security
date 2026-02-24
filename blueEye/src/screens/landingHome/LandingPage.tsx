import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Footer } from "../../components/Footer/Footer";
import { PremiumBadger } from "../../components/PremiumBadger/PremiumBadger";

const LandingHome: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  return (
    <>
      {isVisible && <PremiumBadger setIsVisible={setIsVisible} />}

      <nav className="w-full flex flex-col sm:flex-row items-center justify-between px-4 sm:px-10 md:px-20 lg:px-40 py-4">
        <div className="flex items-center justify-between w-full sm:w-auto mb-3 sm:mb-0">
          <div className="flex items-center gap-4 flex-wrap">
            <h1
              className="text-2xl font-semibold"
              style={{ fontFamily: "Google Sans" }}
            >
              BlueEye Security
            </h1>
            <button
              className="px-3 py-0.5 bg-slate-300 rounded-2xl cursor-pointer text-sm sm:text-base font-medium"
              type="button"
              style={{ fontFamily: "Google Sans" }}
            >
              Business
            </button>
          </div>

          <button
            className="sm:hidden text-slate-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <FontAwesomeIcon icon={faTimes} />
            ) : (
              <FontAwesomeIcon icon={faBars} />
            )}
          </button>
        </div>

        <ul
          className={`flex flex-col sm:flex-row gap-2 sm:gap-6 text-base sm:text-lg font-medium mb-3 sm:mb-0 flex-wrap justify-center sm:justify-start w-full sm:w-auto transition-all duration-300 ${menuOpen ? "max-h-96" : "max-h-0 overflow-hidden sm:max-h-full"}`}
          style={{ fontFamily: "Google Sans" }}
        >
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#about-us">Sobre nosotros</a>
          </li>
          <li>
            <a href="#getStart">Iniciar</a>
          </li>
        </ul>

        <div
          className={`hidden sm:flex sm:flex-row items-center gap-2 sm:gap-6 w-full sm:w-auto transition-all duration-300 ${menuOpen ? "mb-3" : ""}`}
        >
          <button
            className="px-6 sm:px-8 py-1 bg-slate-300 rounded-2xl cursor-pointer font-medium text-sm sm:text-base min-w-1/2 sm:w-auto"
            style={{ fontFamily: "Google Sans" }}
            onClick={() => navigate("/login")}
          >
            login
          </button>
          <button
            className="px-4 sm:px-5 py-1 border-2 border-slate-300 rounded-2xl cursor-pointer font-medium text-sm sm:text-base min-w-1/2 sm:w-auto"
            style={{ fontFamily: "Google Sans" }}
            onClick={() => navigate("/register")}
          >
            registro
          </button>
        </div>
      </nav>

      <section
        className="bg-white flex flex-col items-center justify-center py-16 px-4 sm:px-10 md:px-20 lg:px-40 max-w-full"
        id="home"
      >
        <h1
          className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl text-center font-extrabold leading-tight max-w-full wrap-break-words"
          style={{ fontFamily: "Google Sans" }}
        >
          BlueEye Security — Enterprise Surveillance & Infrastructure Manager
        </h1>

        <p
          className="text-center pt-6 max-w-full sm:max-w-xl md:max-w-2xl mx-auto text-gray-600 text-sm sm:text-base"
          style={{ fontFamily: "Google Sans" }}
        >
          Diseña, despliega y controla sistemas de seguridad desde una sola
          plataforma. Simplificamos la planificación, el monitoreo y la gestión
          de infraestructuras de vigilancia.
        </p>
      </section>

      <section className="py-48 bg-white" id="about-us">
        <h2
          className="text-4xl sm:text-5xl font-bold text-center mb-16"
          style={{ fontFamily: "Google Sans" }}
        >
          Sobre Nosotros
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-6">
          <img
            src="/about-us-image.png"
            alt="Sobre Nosotros"
            className="w-full rounded-2xl"
          />

          <div className="flex flex-col justify-center">
            <h3
              className="text-3xl font-semibold mb-4"
              style={{ fontFamily: "Google Sans" }}
            >
              Nuestra mision
            </h3>
            <p
              className="text-gray-700 mb-6"
              style={{ fontFamily: "Google Sans" }}
            >
              En BlueEye Security nos dedicamos a crear soluciones de vigilancia
              y gestión de infraestructura de seguridad que simplifiquen el
              trabajo de nuestros clientes, protegiendo lo que más importa.
            </p>
            <h3
              className="text-3xl font-semibold mb-4"
              style={{ fontFamily: "Google Sans" }}
            >
              Nuestro enfoque
            </h3>
            <p className="text-gray-700" style={{ fontFamily: "Google Sans" }}>
              Combinamos tecnología avanzada, monitoreo en tiempo real y soporte
              especializado para ofrecer una plataforma confiable y eficiente
              que crece junto a tu empresa.
            </p>
          </div>
        </div>
      </section>

      <section
        className="relative py-58 bg-linear-to-r from-green-50 via-green-100 to-green-50 text-center overflow-hidden"
        id="getStart"
      >
        <div className="absolute inset-0">
          <svg
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 1440 600"
          >
            <circle cx="720" cy="300" r="400" fill="rgba(34,197,94,0.3)" />
            <circle cx="500" cy="200" r="250" fill="rgba(34,197,94,0.26)" />
            <circle cx="1000" cy="400" r="250" fill="rgba(34,197,94,0.2)" />
          </svg>
        </div>

        <div className="relative max-w-3xl mx-auto px-6">
          <h2
            className="text-4xl sm:text-5xl font-semibold mb-8 text-gray-950"
            style={{ fontFamily: "Google Sans" }}
          >
            Comienza hoy mismo
          </h2>
          <p
            className="text-lg sm:text-xl text-gray-800 mb-12 leading-relaxed"
            style={{ fontFamily: "Google Sans" }}
          >
            Regístrate y prueba nuestra plataforma sin compromiso. Descubre cómo
            nuestra gestión de seguridad puede hacer tu trabajo más eficiente y
            seguro.
          </p>
          <button
            className="px-24 py-3 bg-green-300 text-white font-normal text-xl rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 cursor-pointer"
            onClick={() => navigate("/register/business")}
            style={{ fontFamily: "Google Sans" }}
          >
            Registra tu empresa
          </button>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default LandingHome;
