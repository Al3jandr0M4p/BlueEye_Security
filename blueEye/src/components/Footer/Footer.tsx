import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faXTwitter,
  faLinkedinIn,
  faInstagram,
  type IconDefinition,
} from "@fortawesome/free-brands-svg-icons";
import React, { useState } from "react";

// ─── BlueEye brand tokens ──────────────────────────────────────────────────────
const T = {
  white:      "#FFFFFF",
  green:      "#4CAF82",
  greenDark:  "#2E8B5E",
  greenSft:   "#EAF7F1",
  greenMid:   "#A8DBBE",
  navy:       "#1A2332",
  navyMid:    "#243044",
  navyLight:  "#2E3D55",
  tWhiteDim:  "rgba(255,255,255,0.5)",
  borderDark: "rgba(255,255,255,0.1)",
  sans:       "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
};

export const Footer: React.FC = () => {
  const cols = [
    {
      title: "Empresa",
      links: ["Acerca de", "Carreras", "Blog", "Contacto", "Prensa"],
    },
    {
      title: "Servicios",
      links: [
        "Monitoreo en tiempo real",
        "Gestión de infraestructura",
        "Seguridad avanzada",
        "Soporte 24/7",
        "Integraciones",
      ],
    },
    {
      title: "Recursos",
      links: ["Documentación", "API", "Casos de éxito", "Webinars", "FAQ"],
    },
  ];

  return (
    <footer
      style={{
        position: "relative",
        background: T.navy,
        color: T.white,
        paddingTop: 80,
        paddingBottom: 40,
        overflow: "hidden",
        fontFamily: T.sans,
      }}
    >
      {/* Watermark — igual que el original */}
      <span
        style={{
          position: "absolute",
          color: T.navyMid,
          fontSize: "13rem",
          fontWeight: 700,
          opacity: 0.35,
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          userSelect: "none",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          fontFamily: T.sans,
        }}
      >
        BlueEye
      </span>

      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 32px",
          display: "grid",
          gridTemplateColumns: "1.8fr 1fr 1fr 1fr 1.4fr",
          gap: 48,
          marginBottom: 48,
          paddingBottom: 48,
          borderBottom: `1px solid ${T.borderDark}`,
        }}
      >
        {/* Brand column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: T.navyLight,
                border: `1px solid ${T.borderDark}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <ellipse
                  cx="9" cy="9" rx="8" ry="5.5"
                  stroke={T.green} strokeWidth="1.5"
                />
                <circle cx="9" cy="9" r="2.5" fill={T.green} />
                <circle cx="9" cy="9" r="1" fill={T.white} />
              </svg>
            </div>
            <span
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: T.white,
                letterSpacing: "-0.02em",
              }}
            >
              BlueEye{" "}
              <span style={{ color: T.green }}>Security</span>
            </span>
          </div>

          <p
            style={{
              fontSize: 13,
              color: T.tWhiteDim,
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            Monitoreo y gestión de infraestructuras de seguridad desde una sola
            plataforma. Diseñada para empresas que exigen control total y
            eficiencia.
          </p>

          {/* Social icons */}
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            {[
              { icon: faFacebookF },
              { icon: faXTwitter },
              { icon: faLinkedinIn },
              { icon: faInstagram },
            ].map((s, i) => (
              <SocialIcon key={i} icon={s.icon} />
            ))}
          </div>
        </div>

        {/* Link columns */}
        {cols.map((col) => (
          <div key={col.title} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: T.white,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              {col.title}
            </div>
            {col.links.map((link) => (
              <FooterLink key={link}>{link}</FooterLink>
            ))}
          </div>
        ))}

        {/* Newsletter */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: T.white,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Suscríbete
          </div>
          <p style={{ fontSize: 13, color: T.tWhiteDim, lineHeight: 1.6, margin: 0 }}>
            Recibe novedades, actualizaciones y consejos de seguridad
            directamente en tu correo.
          </p>
          <form
            style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Email"
              style={{
                padding: "10px 14px",
                background: T.navyLight,
                border: `1.5px solid ${T.borderDark}`,
                borderRadius: 10,
                fontFamily: T.sans,
                fontSize: 13,
                color: T.white,
                outline: "none",
                width: "100%",
                boxSizing: "border-box",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "10px 16px",
                background: T.green,
                color: T.white,
                border: "none",
                borderRadius: 10,
                fontFamily: T.sans,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Suscribirse
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 12, color: T.tWhiteDim }}>
          © 2026 BlueEye Security. Todos los derechos reservados.
        </span>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacidad", "Términos", "Cookies"].map((link) => (
            <a
              key={link}
              href="#"
              style={{
                fontSize: 12,
                color: T.tWhiteDim,
                textDecoration: "none",
                fontFamily: T.sans,
              }}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

const FooterLink: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hov, setHov] = useState(false);
  return (
    <a
      href="#"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "block",
        fontSize: 13,
        fontWeight: 500,
        color: hov ? "#4CAF82" : "rgba(255,255,255,0.5)",
        textDecoration: "none",
        marginBottom: 10,
        transition: "color 0.15s",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {children}
    </a>
  );
};

const SocialIcon: React.FC<{ icon: IconDefinition }> = ({ icon }) => {
  const [hov, setHov] = useState(false);
  return (
    <a
      href="#"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 34,
        height: 34,
        borderRadius: 9,
        background: hov ? "#4CAF82" : "#2E3D55",
        border: "1px solid rgba(255,255,255,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: hov ? "#FFFFFF" : "rgba(255,255,255,0.5)",
        fontSize: 14,
        textDecoration: "none",
        transition: "all 0.15s",
      }}
    >
      <FontAwesomeIcon icon={icon} />
    </a>
  );
};