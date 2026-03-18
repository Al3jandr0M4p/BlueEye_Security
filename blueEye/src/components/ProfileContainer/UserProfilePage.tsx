import React, { useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  KeyRound,
  LogOut,
  Mail,
  PencilLine,
  Save,
  ShieldCheck,
  Smartphone,
  UserRound,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/use-store-hook";
import { logout } from "../../reduxjs/store/slices/auth.slice";
import { persistor } from "../../reduxjs/store/store";
import type { Role } from "../../types/types";
import "./profile-page.css";

type EditableProfile = {
  username: string;
  email: string;
  phone: string;
  organization: string;
};

type RoleMeta = {
  label: string;
  description: string;
  color: string;
  background: string;
  border: string;
};

type PreferencesState = {
  emailAlerts: boolean;
  pushAlerts: boolean;
  weeklyReport: boolean;
};

const ROLE_META: Record<Role, RoleMeta> = {
  usuario: {
    label: "Usuario",
    description: "Acceso a monitoreo y tickets de su cuenta",
    color: "#22d3ee",
    background: "rgba(34,211,238,0.11)",
    border: "rgba(34,211,238,0.26)",
  },
  tecnico: {
    label: "Tecnico",
    description: "Gestion operativa de mantenimientos y incidencias",
    color: "#fbbf24",
    background: "rgba(251,191,36,0.11)",
    border: "rgba(251,191,36,0.30)",
  },
  admin: {
    label: "Admin",
    description: "Control de clientes, operaciones y configuracion",
    color: "#38bdf8",
    background: "rgba(56,189,248,0.11)",
    border: "rgba(56,189,248,0.28)",
  },
  superAdmin: {
    label: "Super Admin",
    description: "Permisos completos del ecosistema BlueEye",
    color: "#34d399",
    background: "rgba(52,211,153,0.11)",
    border: "rgba(52,211,153,0.28)",
  },
};

const DEFAULT_PHONE = "+1 809 000 0000";
const DEFAULT_ORGANIZATION = "BlueEye Security";

const createInitials = (value: string): string => {
  const tokens = value
    .split(" ")
    .map((token) => token.trim())
    .filter(Boolean);

  if (!tokens.length) return "US";

  return tokens
    .slice(0, 2)
    .map((token) => token.charAt(0).toUpperCase())
    .join("");
};

const formatSessionDate = (unixTimestamp?: number): string => {
  if (!unixTimestamp) return "No disponible";

  return new Date(unixTimestamp * 1000).toLocaleString("es-DO", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const UserProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { profile, user } = useAppSelector((state) => state.auth);

  const role: Role = profile?.rolename ?? user?.rolename ?? "usuario";
  const roleMeta = ROLE_META[role];

  const preferredUsername = profile?.username ?? user?.username ?? "Usuario";
  const preferredEmail = user?.email ?? "";

  // -----------------------
  // Inicializar estados
  // -----------------------
  const initialProfile: EditableProfile = {
    username: preferredUsername,
    email: preferredEmail || "",
    phone: DEFAULT_PHONE,
    organization: DEFAULT_ORGANIZATION,
  };

  const [savedProfile, setSavedProfile] = useState<EditableProfile>(initialProfile);
  const [draftProfile, setDraftProfile] = useState<EditableProfile>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [preferences, setPreferences] = useState<PreferencesState>({
    emailAlerts: true,
    pushAlerts: true,
    weeklyReport: false,
  });

  // -----------------------
  // Memorizaciones
  // -----------------------
  const initials = useMemo(() => createInitials(savedProfile.username), [savedProfile.username]);

  const activityFeed = useMemo(
    () => [
      { title: "Sesion iniciada", detail: formatSessionDate(user?.iat) },
      { title: "Rol activo", detail: `Perfil ${roleMeta.label.toLowerCase()} habilitado` },
      { title: "Sesion expira", detail: formatSessionDate(user?.exp) },
    ],
    [roleMeta.label, user?.exp, user?.iat]
  );

  // -----------------------
  // Handlers
  // -----------------------
  const handleInputChange = (field: keyof EditableProfile, value: string) => {
    setDraftProfile((current) => ({ ...current, [field]: value }));
  };

  const handleSave = () => {
    setSavedProfile(draftProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraftProfile(savedProfile);
    setIsEditing(false);
  };

  const togglePreference = (field: keyof PreferencesState) => {
    setPreferences((current) => ({ ...current, [field]: !current[field] }));
  };

  const handleLogout = async () => {
    dispatch(logout());
    await persistor.purge();
    navigate("/login", { replace: true });
  };

  return (
    <section className="profile-shell">
      <div className="profile-layout">
        <header className="profile-card profile-banner">
          <div>
            <p className="profile-kicker">Centro de cuenta</p>
            <h1 className="profile-title">Perfil de usuario</h1>
            <p className="profile-description">
              Administra tu identidad, seguridad y preferencias sin salir del
              portal.
            </p>
          </div>

          <button
            type="button"
            className="profile-action-btn profile-logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={14} />
            Cerrar sesion
          </button>
        </header>

        <article className="profile-card profile-identity">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-user-headline">
            <h2>{savedProfile.username}</h2>
            <p>{roleMeta.description}</p>
          </div>
          <div className="profile-meta">
            <span
              className="profile-role-pill"
              style={
                {
                  "--role-color": roleMeta.color,
                  "--role-bg": roleMeta.background,
                  "--role-border": roleMeta.border,
                } as React.CSSProperties
              }
            >
              <ShieldCheck size={12} />
              {roleMeta.label}
            </span>
            <span>ID: {user?.sub ?? "No disponible"}</span>
          </div>
        </article>

        <div className="profile-grid">
          <article className="profile-card profile-card-body">
            <div className="profile-card-header">
              <div>
                <h3>Informacion de cuenta</h3>
                <p>Datos basicos visibles en el sistema</p>
              </div>
              <div className="profile-actions">
                {!isEditing ? (
                  <button
                    type="button"
                    className="profile-action-btn profile-btn-neutral"
                    onClick={() => setIsEditing(true)}
                  >
                    <PencilLine size={14} />
                    Editar
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="profile-action-btn profile-btn-accent"
                      onClick={handleSave}
                    >
                      <Save size={14} />
                      Guardar
                    </button>
                    <button
                      type="button"
                      className="profile-action-btn profile-btn-neutral"
                      onClick={handleCancel}
                    >
                      <X size={14} />
                      Cancelar
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="profile-fields">
              <label className="profile-field">
                <span>Usuario</span>
                <div className="profile-input-wrap">
                  <UserRound size={14} />
                  <input
                    type="text"
                    className="profile-input"
                    value={draftProfile.username}
                    onChange={(event) =>
                      handleInputChange("username", event.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
              </label>

              <label className="profile-field">
                <span>Correo</span>
                <div className="profile-input-wrap">
                  <Mail size={14} />
                  <input
                    type="email"
                    className="profile-input"
                    value={draftProfile.email}
                    onChange={(event) =>
                      handleInputChange("email", event.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="correo@empresa.com"
                  />
                </div>
              </label>

              <label className="profile-field">
                <span>Telefono</span>
                <div className="profile-input-wrap">
                  <Smartphone size={14} />
                  <input
                    type="tel"
                    className="profile-input"
                    value={draftProfile.phone}
                    onChange={(event) =>
                      handleInputChange("phone", event.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
              </label>

              <label className="profile-field">
                <span>Organizacion</span>
                <div className="profile-input-wrap">
                  <ShieldCheck size={14} />
                  <input
                    type="text"
                    className="profile-input"
                    value={draftProfile.organization}
                    onChange={(event) =>
                      handleInputChange("organization", event.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
              </label>
            </div>
          </article>

          <article className="profile-card profile-card-body">
            <div className="profile-card-header">
              <div>
                <h3>Seguridad</h3>
                <p>Estado de acceso y proteccion de la sesion</p>
              </div>
            </div>

            <div className="profile-status-list">
              <div className="profile-status-row">
                <div>
                  <h4>Token activo</h4>
                  <span>Sesion iniciada: {formatSessionDate(user?.iat)}</span>
                </div>
                <CheckCircle2 size={16} className="status-ok" />
              </div>

              <div className="profile-status-row">
                <div>
                  <h4>Caducidad del acceso</h4>
                  <span>Expira: {formatSessionDate(user?.exp)}</span>
                </div>
                <KeyRound size={16} className="status-info" />
              </div>

              <div className="profile-status-row">
                <div>
                  <h4>Autenticacion en dos pasos</h4>
                  <span>Disponible para activar en proxima iteracion</span>
                </div>
                <Bell size={16} className="status-muted" />
              </div>
            </div>
          </article>

          <article className="profile-card profile-card-body">
            <div className="profile-card-header">
              <div>
                <h3>Preferencias</h3>
                <p>Control local de notificaciones</p>
              </div>
            </div>

            <div className="profile-preferences">
              <div className="profile-pref-row">
                <div>
                  <h4>Alertas por correo</h4>
                  <span>Incidencias y eventos criticos</span>
                </div>
                <button
                  type="button"
                  className="profile-toggle"
                  data-active={preferences.emailAlerts}
                  onClick={() => togglePreference("emailAlerts")}
                />
              </div>

              <div className="profile-pref-row">
                <div>
                  <h4>Push en navegador</h4>
                  <span>Recordatorios de tickets y mantenimientos</span>
                </div>
                <button
                  type="button"
                  className="profile-toggle"
                  data-active={preferences.pushAlerts}
                  onClick={() => togglePreference("pushAlerts")}
                />
              </div>

              <div className="profile-pref-row">
                <div>
                  <h4>Resumen semanal</h4>
                  <span>Reporte consolidado de salud del sistema</span>
                </div>
                <button
                  type="button"
                  className="profile-toggle"
                  data-active={preferences.weeklyReport}
                  onClick={() => togglePreference("weeklyReport")}
                />
              </div>
            </div>
          </article>

          <article className="profile-card profile-card-body">
            <div className="profile-card-header">
              <div>
                <h3>Actividad reciente</h3>
                <p>Resumen rapido de cuenta y sesion</p>
              </div>
            </div>

            <ul className="profile-activity-list">
              {activityFeed.map((activity) => (
                <li key={activity.title}>
                  <span>{activity.title}</span>
                  <small>{activity.detail}</small>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
};

export default UserProfilePage;
