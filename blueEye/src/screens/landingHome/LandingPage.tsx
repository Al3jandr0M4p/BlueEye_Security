import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Footer } from "../../components/Footer/Footer";
import { PremiumBadger } from "../../components/PremiumBadger/PremiumBadger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// ─── BlueEye brand tokens ──────────────────────────────────────────────────────
const T = {
  bg:         "#F8FAF8",
  white:      "#FFFFFF",
  green:      "#4CAF82",
  greenDark:  "#2E8B5E",
  greenSft:   "#EAF7F1",
  greenMid:   "#A8DBBE",
  greenLight: "#C8EDD9",
  navy:       "#1A2332",
  navyLight:  "#2E3D55",
  t1:         "#1A2332",
  t2:         "#4A5568",
  t3:         "#9AA3B2",
  border:     "#E2E8E4",
  sans:       "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
};

const LandingHome: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [hovLogin, setHovLogin] = useState(false);
  const [hovReg, setHovReg] = useState(false);
  const [hovCTA, setHovCTA] = useState(false);

  return (
    <>
      {isVisible && <PremiumBadger setIsVisible={setIsVisible} />}

      {/* ── NAVBAR ──────────────────────────────────────────────────────────── */}
      <nav
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 48px",
          height: 64,
          background: T.white,
          borderBottom: `1px solid ${T.border}`,
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxSizing: "border-box",
          fontFamily: T.sans,
        }}
      >
        {/* Logo + badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: T.navy,
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
          <h1
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: T.t1,
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            BlueEye <span style={{ color: T.green }}>Security</span>
          </h1>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.06em",
              background: T.greenSft,
              color: T.greenDark,
              padding: "2px 8px",
              borderRadius: 100,
              border: `1px solid ${T.greenMid}`,
            }}
          >
            Business
          </span>
        </div>

        {/* Hamburger — mobile */}
        <button
          style={{
            display: "none",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: T.t2,
            fontSize: 18,
          }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </button>

        {/* Nav links */}
        <ul
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 4,
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {[
            { label: "Home",           href: "#home" },
            { label: "Sobre nosotros", href: "#about-us" },
            { label: "Iniciar",        href: "#getStart" },
          ].map((item) => (
            <li key={item.label}>
              <NavLink href={item.href}>{item.label}</NavLink>
            </li>
          ))}
        </ul>

        {/* Auth buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onMouseEnter={() => setHovLogin(true)}
            onMouseLeave={() => setHovLogin(false)}
            onClick={() => navigate("/login")}
            style={{
              padding: "8px 20px",
              background: hovLogin ? T.greenSft : "transparent",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              fontFamily: T.sans,
              fontSize: 13,
              fontWeight: 700,
              color: T.greenDark,
              transition: "all 0.15s",
            }}
          >
            Iniciar sesión
          </button>
          <button
            onMouseEnter={() => setHovReg(true)}
            onMouseLeave={() => setHovReg(false)}
            onClick={() => navigate("/register")}
            style={{
              padding: "8px 20px",
              background: hovReg ? T.greenDark : T.green,
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              fontFamily: T.sans,
              fontSize: 13,
              fontWeight: 700,
              color: T.white,
              boxShadow: hovReg
                ? "0 4px 16px rgba(76,175,130,0.4)"
                : "0 2px 8px rgba(76,175,130,0.2)",
              transform: hovReg ? "translateY(-1px)" : "none",
              transition: "all 0.18s",
            }}
          >
            Registro →
          </button>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section
        id="home"
        style={{
          background: T.white,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "96px 48px 80px",
          textAlign: "center",
          borderBottom: `1px solid ${T.border}`,
          position: "relative",
          overflow: "hidden",
          fontFamily: T.sans,
        }}
      >
        {/* Soft green glow behind title */}
        <div
          style={{
            position: "absolute",
            top: -80,
            left: "50%",
            transform: "translateX(-50%)",
            width: 600,
            height: 300,
            background: `radial-gradient(ellipse, ${T.greenSft} 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        {/* Live badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: T.greenSft,
            border: `1.5px solid ${T.greenMid}`,
            borderRadius: 100,
            padding: "6px 16px",
            fontSize: 12,
            fontWeight: 700,
            color: T.greenDark,
            marginBottom: 28,
            letterSpacing: "0.02em",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: T.green,
              boxShadow: `0 0 0 3px ${T.greenLight}`,
            }}
          />
          Plataforma en tiempo real · Ahora disponible
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: T.t1,
            margin: "0 auto 20px",
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            maxWidth: 820,
            position: "relative",
            zIndex: 1,
          }}
        >
          BlueEye Security —{" "}
          <span
            style={{
              background: `linear-gradient(135deg, ${T.green}, ${T.greenDark})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Gestor de Vigilancia
          </span>{" "}
          Empresarial e Infraestructura
        </h1>

        {/* Subtitle */}
        <p
          style={{
            textAlign: "center",
            paddingTop: 8,
            maxWidth: 580,
            margin: "0 auto 40px",
            color: T.t2,
            fontSize: 16,
            lineHeight: 1.7,
            fontWeight: 500,
            position: "relative",
            zIndex: 1,
          }}
        >
          Diseña, despliega y controla sistemas de seguridad desde una sola
          plataforma. Simplificamos la planificación, el monitoreo y la gestión
          de infraestructuras de vigilancia.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            marginBottom: 56,
            position: "relative",
            zIndex: 1,
          }}
        >
          <button
            style={{
              padding: "12px 28px",
              background: T.green,
              color: T.white,
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              fontFamily: T.sans,
              fontSize: 14,
              fontWeight: 700,
              boxShadow: "0 2px 8px rgba(76,175,130,0.25)",
            }}
            onClick={() => navigate("/register")}
          >
            Comenzar gratis →
          </button>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "inline-flex",
            background: T.bg,
            border: `1px solid ${T.border}`,
            borderRadius: 16,
            overflow: "hidden",
            position: "relative",
            zIndex: 1,
          }}
        >
          {[
            { value: "99.9%", label: "Uptime garantizado" },
            { value: "500+",  label: "Cámaras gestionadas" },
            { value: "24/7",  label: "Soporte técnico" },
            { value: "<50ms", label: "Latencia promedio" },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                padding: "16px 28px",
                borderRight: i < 3 ? `1px solid ${T.border}` : "none",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: T.green,
                  letterSpacing: "-0.03em",
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 11, color: T.t3, fontWeight: 600, marginTop: 2 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SOBRE NOSOTROS ──────────────────────────────────────────────────── */}
      <section
        id="about-us"
        style={{
          background: T.white,
          padding: "96px 48px",
          borderBottom: `1px solid ${T.border}`,
          fontFamily: T.sans,
        }}
      >
        <h2
          style={{
            fontSize: 38,
            fontWeight: 800,
            textAlign: "center",
            marginBottom: 64,
            color: T.t1,
            letterSpacing: "-0.03em",
          }}
        >
          Sobre Nosotros
        </h2>

        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
          }}
        >
          {/* Illustration */}
          <div
            style={{
              background: `linear-gradient(145deg, ${T.greenSft}, ${T.bg})`,
              border: `1px solid ${T.greenMid}`,
              borderRadius: 20,
              height: 360,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 16,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -40,
                right: -40,
                width: 160,
                height: 160,
                borderRadius: "50%",
                background: T.greenLight,
                opacity: 0.5,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -30,
                left: -30,
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: T.greenMid,
                opacity: 0.3,
              }}
            />
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 18,
                background: T.white,
                border: `1.5px solid ${T.greenMid}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 20px rgba(76,175,130,0.15)",
                zIndex: 1,
              }}
            >
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <ellipse
                  cx="18" cy="18" rx="16" ry="11"
                  stroke={T.green} strokeWidth="2"
                />
                <circle cx="18" cy="18" r="5" fill={T.green} />
                <circle cx="18" cy="18" r="2" fill={T.white} />
              </svg>
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: T.greenDark,
                zIndex: 1,
              }}
            >
              BlueEye Security
            </span>
          </div>

          {/* Text */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <div style={{ marginBottom: 36 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: T.greenSft,
                    border: `1.5px solid ${T.greenMid}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                  }}
                >
                  🎯
                </div>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: T.t1,
                    margin: 0,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Nuestra misión
                </h3>
              </div>
              <p style={{ color: T.t2, fontSize: 14, lineHeight: 1.75, margin: 0 }}>
                En BlueEye Security nos dedicamos a crear soluciones de
                vigilancia y gestión de infraestructura de seguridad que
                simplifiquen el trabajo de nuestros clientes, protegiendo lo que
                más importa.
              </p>
            </div>

            <div style={{ marginBottom: 32 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: T.greenSft,
                    border: `1.5px solid ${T.greenMid}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                  }}
                >
                  ⚡
                </div>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: T.t1,
                    margin: 0,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Nuestro enfoque
                </h3>
              </div>
              <p style={{ color: T.t2, fontSize: 14, lineHeight: 1.75, margin: 0 }}>
                Combinamos tecnología avanzada, monitoreo en tiempo real y
                soporte especializado para ofrecer una plataforma confiable y
                eficiente que crece junto a tu empresa.
              </p>
            </div>

            {/* Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[
                "Monitoreo 24/7",
                "Multi-sede",
                "Alertas en tiempo real",
                "Soporte técnico",
                "API abierta",
              ].map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: T.greenDark,
                    background: T.greenSft,
                    border: `1px solid ${T.greenMid}`,
                    padding: "5px 12px",
                    borderRadius: 100,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section
        id="getStart"
        style={{
          position: "relative",
          padding: "100px 48px",
          background: `linear-gradient(135deg, ${T.green} 0%, ${T.greenDark} 100%)`,
          textAlign: "center",
          overflow: "hidden",
          fontFamily: T.sans,
        }}
      >
        {/* SVG circles — igual que el original */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <svg
            style={{ width: "100%", height: "100%" }}
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 1440 600"
          >
            <circle cx="720" cy="300" r="400" fill="rgba(255,255,255,0.06)" />
            <circle cx="500" cy="200" r="250" fill="rgba(255,255,255,0.05)" />
            <circle cx="1000" cy="400" r="250" fill="rgba(255,255,255,0.04)" />
          </svg>
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto" }}>
          {/* Trust badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 100,
              padding: "5px 16px",
              fontSize: 12,
              fontWeight: 700,
              color: T.white,
              marginBottom: 24,
              letterSpacing: "0.04em",
            }}
          >
            ✓ Sin tarjeta de crédito requerida
          </div>

          <h2
            style={{
              fontSize: 40,
              fontWeight: 800,
              marginBottom: 20,
              color: T.white,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
            }}
          >
            Comienza hoy mismo
          </h2>
          <p
            style={{
              fontSize: 17,
              color: "rgba(255,255,255,0.82)",
              marginBottom: 40,
              lineHeight: 1.7,
            }}
          >
            Regístrate y prueba nuestra plataforma sin compromiso. Descubre cómo
            nuestra gestión de seguridad puede hacer tu trabajo más eficiente y
            seguro.
          </p>
          <button
            onMouseEnter={() => setHovCTA(true)}
            onMouseLeave={() => setHovCTA(false)}
            onClick={() => navigate("/register")}
            style={{
              padding: "14px 48px",
              background: T.white,
              color: T.greenDark,
              border: "none",
              borderRadius: 100,
              cursor: "pointer",
              fontFamily: T.sans,
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: "-0.01em",
              boxShadow: hovCTA
                ? "0 8px 32px rgba(0,0,0,0.18)"
                : "0 4px 16px rgba(0,0,0,0.12)",
              transform: hovCTA ? "translateY(-2px)" : "none",
              transition: "all 0.2s ease",
            }}
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

// ─── NavLink helper ────────────────────────────────────────────────────────────

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        fontSize: 14,
        fontWeight: 500,
        color: hov ? "#4CAF82" : "#4A5568",
        padding: "6px 14px",
        borderRadius: 8,
        background: hov ? "#EAF7F1" : "transparent",
        textDecoration: "none",
        transition: "all 0.15s",
        display: "block",
      }}
    >
      {children}
    </a>
  );
};
