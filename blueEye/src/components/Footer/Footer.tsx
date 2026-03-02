import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faXTwitter,
  faLinkedinIn,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import React from "react";

export const Footer: React.FC = () => {
  return (
    <>
      <footer className="relative bg-gray-900 text-white pt-34 pb-22 overflow-hidden">
        <span
          className="absolute text-gray-800 text-[14rem] font-bold opacity-30 top-40 left-1/2 -translate-x-1/2 select-none pointer-events-none"
          style={{ fontFamily: "Google Sans" }}
        >
          BlueEye
        </span>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-5 gap-16 z-10">
          <div className="flex flex-col gap-6">
            <h3
              className="text-3xl font-bold"
              style={{ fontFamily: "Google Sans" }}
            >
              BlueEye Security
            </h3>
            <p
              className="text-gray-400 text-sm md:text-base"
              style={{ fontFamily: "Google Sans" }}
            >
              Monitoreo y gestión de infraestructuras de seguridad desde una
              sola plataforma. Diseñada para empresas que exigen control total y
              eficiencia.
            </p>
            <div className="flex gap-6 mt-4 text-2xl">
              <a href="#" className="hover:text-green-300 transition-colors">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="#" className="hover:text-green-300 transition-colors">
                <FontAwesomeIcon icon={faXTwitter} />
              </a>
              <a href="#" className="hover:text-green-300 transition-colors">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
              <a href="#" className="hover:text-green-300 transition-colors">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4
              className="font-semibold text-lg mb-2"
              style={{ fontFamily: "Google Sans" }}
            >
              Empresa
            </h4>
            <a
              href="#"
              style={{ fontFamily: "Google Sans" }}
              className="text-gray-400 hover:text-green-300 transition-colors"
            >
              Acerca de
            </a>
            <a
              href="#"
              style={{ fontFamily: "Google Sans" }}
              className="text-gray-400 hover:text-green-300 transition-colors"
            >
              Carreras
            </a>
            <a
              href="#"
              style={{ fontFamily: "Google Sans" }}
              className="text-gray-400 hover:text-green-300 transition-colors"
            >
              Blog
            </a>
            <a
              href="#"
              style={{ fontFamily: "Google Sans" }}
              className="text-gray-400 hover:text-green-300 transition-colors"
            >
              Contacto
            </a>
            <a
              href="#"
              style={{ fontFamily: "Google Sans" }}
              className="text-gray-400 hover:text-green-300 transition-colors"
            >
              Prensa
            </a>
          </div>

          <div className="flex flex-col gap-4">
            <h4
              className="font-semibold text-lg mb-2"
              style={{ fontFamily: "Google Sans" }}
            >
              Servicios
            </h4>
            <a
              href="#"
              style={{ fontFamily: "Google Sans" }}
              className="text-gray-400 hover:text-green-300 transition-colors"
            >
              Monitoreo en tiempo real
            </a>
            <a
              href="#"
              style={{ fontFamily: "Google Sans" }}
              className="text-gray-400 hover:text-green-300 transition-colors"
            >
              Gestión de infraestructura
            </a>
            <a
              href="#"
              style={{ fontFamily: "Google Sans" }}
              className="text-gray-400 hover:text-green-300 transition-colors"
            >
              Seguridad avanzada
            </a>
            <a
              href="#"
              style={{ fontFamily: "Google Sans" }}
              className="text-gray-400 hover:text-green-300 transition-colors"
            >
              Soporte 24/7
            </a>
            <a
              href="#"
              style={{ fontFamily: "Google Sans" }}
              className="text-gray-400 hover:text-green-300 transition-colors"
            >
              Integraciones
            </a>
          </div>

          <div className="flex flex-col gap-4">
            <h4
              className="font-semibold text-lg mb-2"
              style={{ fontFamily: "Google Sans" }}
            >
              Recursos
            </h4>
            <a
              href="#"
              style={{ fontFamily: "Google Sans" }}
              className="text-gray-400 hover:text-green-300 transition-colors"
            >
              Documentación
            </a>
            <a
              href="#"
              style={{ fontFamily: "Google Sans" }}
              className="text-gray-400 hover:text-green-300 transition-colors"
            >
              API
            </a>
            <a
              href="#"
              style={{ fontFamily: "Google Sans" }}
              className="text-gray-400 hover:text-green-300 transition-colors"
            >
              Casos de éxito
            </a>
            <a
              href="#"
              style={{ fontFamily: "Google Sans" }}
              className="text-gray-400 hover:text-green-300 transition-colors"
            >
              Webinars
            </a>
            <a
              href="#"
              style={{ fontFamily: "Google Sans" }}
              className="text-gray-400 hover:text-green-300 transition-colors"
            >
              FAQ
            </a>
          </div>

          <div className="flex flex-col gap-4">
            <h4
              className="font-semibold text-lg mb-2"
              style={{ fontFamily: "Google Sans" }}
            >
              Suscríbete
            </h4>
            <p
              className="text-gray-400 text-sm"
              style={{ fontFamily: "Google Sans" }}
            >
              Recibe novedades, actualizaciones y consejos de seguridad
              directamente en tu correo.
            </p>
            <form className="flex flex-col gap-3 mt-2">
              <input
                type="email"
                placeholder="Email"
                style={{ fontFamily: "Google Sans" }}
                className="px-4 py-2 border-2 border-white placeholder:text-white outline-none rounded-2xl text-gray-900 w-full sm:w-auto flex-1"
              />
              <button
                type="submit"
                style={{ fontFamily: "Google Sans" }}
                className="px-6 py-2 bg-green-300 rounded-2xl font-semibold hover:bg-green-400 transition-colors"
              >
                Suscribirse
              </button>
            </form>
          </div>
        </div>

        <div
          className="border-t border-gray-700 mt-20 pt-8 text-center text-gray-500 text-sm relative z-10"
          style={{ fontFamily: "Google Sans" }}
        >
          © 2026 BlueEye Security. Todos los derechos reservados.
        </div>
      </footer>
    </>
  );
};
