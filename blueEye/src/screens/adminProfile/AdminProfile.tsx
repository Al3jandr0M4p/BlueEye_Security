import React, { useMemo } from "react";
import {
  BadgeCheck,
  BellRing,
  BriefcaseBusiness,
  CalendarClock,
  ChartNoAxesCombined,
  ChevronRight,
  KeyRound,
  LaptopMinimalCheck,
  LogOut,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../reduxjs/store/slices/auth.slice";
import { persistor } from "../../reduxjs/store/store";
import { signOut } from "../../service/service";
import { useAppDispatch, useAppSelector } from "../../hooks/use-store-hook";

const createInitials = (name: string): string => {
  const chunks = name
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean);

  if (!chunks.length) return "AD";

  return chunks
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

const formatDate = (unixTimestamp?: number): string => {
  if (!unixTimestamp) return "No disponible";

  return new Date(unixTimestamp * 1000).toLocaleString("es-DO", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const AdminProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { profile, user } = useAppSelector((state) => state.auth);

  const displayName = profile?.username ?? user?.username ?? "Administrador";
  const email = user?.email ?? "admin@blueeye.com";
  const initials = useMemo(() => createInitials(displayName), [displayName]);

  const highlights = [
    {
      label: "Rol activo",
      value: "Administrador principal",
      detail: "Control total sobre operaciones, usuarios y soporte.",
      icon: <ShieldCheck size={18} />,
    },
    {
      label: "Estado de sesion",
      value: "Protegida",
      detail: `Acceso iniciado ${formatDate(user?.iat)}.`,
      icon: <LaptopMinimalCheck size={18} />,
    },
    {
      label: "Expiracion",
      value: formatDate(user?.exp),
      detail: "Tu token actual sigue vigente dentro del sistema.",
      icon: <KeyRound size={18} />,
    },
  ];

  const quickStats = [
    {
      title: "Equipos bajo gestion",
      value: "128",
      caption: "Usuarios, tecnicos y clientes conectados a tu operacion.",
    },
    {
      title: "Ritmo semanal",
      value: "24 tickets",
      caption: "Promedio de casos que pasan por supervision administrativa.",
    },
    {
      title: "Salud operativa",
      value: "98.4%",
      caption: "Disponibilidad de los procesos clave del panel este mes.",
    },
  ];

  const timeline = [
    {
      title: "Revision matutina completada",
      detail: "Se supervisaron tickets criticos, actividad del equipo y accesos recientes.",
    },
    {
      title: "Invitaciones y permisos listos",
      detail: "El area de usuarios ya permite crear perfiles desde modal y enviarlos al backend.",
    },
    {
      title: "Seguridad en seguimiento",
      detail: "La sesion del admin se mantiene activa y monitoreada por expiracion de token.",
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      dispatch(logout());
      await persistor.purge();
      navigate("/login", { replace: true });
    }
  };

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe_0%,#f8fafc_38%,#eef2ff_100%)] px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#020617_0%,#0f172a_45%,#1d4ed8_100%)] p-6 text-white shadow-[0_30px_90px_rgba(15,23,42,0.30)] sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -left-10 top-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-0 h-52 w-52 rounded-full bg-indigo-300/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-20 h-36 w-36 rounded-full bg-sky-200/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-white/85">
                <Sparkles size={14} />
                Perfil ejecutivo
              </span>

              <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/20 bg-white/10 text-3xl font-semibold text-white shadow-inner shadow-white/10">
                  {initials}
                </div>

                <div>
                  <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    {displayName}
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/78 sm:text-[15px]">
                    Administra clientes, tecnicos, soporte y rendimiento del
                    negocio desde un perfil pensado para control total y
                    decisiones rapidas.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/85">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                      <Mail size={14} />
                      {email}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                      <BadgeCheck size={14} />
                      Admin verificado
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                      <MapPin size={14} />
                      Santo Domingo, RD
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:w-[360px] xl:grid-cols-1">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                <UserRound size={16} />
                Editar informacion
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                <LogOut size={16} />
                Cerrar sesion
              </button>
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              {quickStats.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur"
                >
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                    {item.title}
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.caption}
                  </p>
                </article>
              ))}
            </div>

            <article className="rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[0_25px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                    Resumen estrategico
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                    Centro de mando del administrador
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
                    Este perfil concentra identidad, estado de seguridad y una
                    lectura rapida del momento operativo para que no tengas que
                    saltar entre varias pantallas cada vez que entras al panel.
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                  <ShieldCheck size={15} />
                  Cuenta estable
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[24px] border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
                      {item.icon}
                    </div>
                    <p className="mt-4 text-xs uppercase tracking-[0.22em] text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-2 text-base font-semibold text-slate-900">
                      {item.value}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[0_25px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                    Operacion diaria
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                    Prioridades del admin hoy
                  </h2>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-600">
                  <CalendarClock size={15} />
                  Actualizado en tiempo real
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <div className="rounded-[28px] bg-[linear-gradient(135deg,#eff6ff_0%,#dbeafe_100%)] p-5">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm">
                    <ChartNoAxesCombined size={20} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    Vista ejecutiva
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Monitorea operaciones, usuarios, soporte y rendimiento con
                    una lectura clara del negocio desde tu punto de control.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/adminDashboard/dashboard")}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-800 transition hover:text-blue-950"
                  >
                    Ir al dashboard
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div className="rounded-[28px] bg-[linear-gradient(135deg,#ecfeff_0%,#cffafe_100%)] p-5">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-cyan-700 shadow-sm">
                    <BellRing size={20} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    Alertas y seguimiento
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Mantente encima de tickets, actividad del equipo y cambios
                    sensibles en la operacion sin perder contexto.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/adminDashboard/suport")}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-800 transition hover:text-cyan-950"
                  >
                    Revisar soporte
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </article>
          </div>

          <aside className="space-y-6">
            <article className="rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[0_25px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-7">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                Perfil profesional
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Identidad del administrador
              </h2>

              <div className="mt-6 space-y-4">
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Usuario
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    {displayName}
                  </p>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Email
                  </p>
                  <p className="mt-2 break-all text-base font-semibold text-slate-900">
                    {email}
                  </p>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    ID de cuenta
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {user?.sub ?? "No disponible"}
                  </p>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Area
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    BlueEye Security Operations
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[0_25px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-7">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                Ruta reciente
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Bitacora del dia
              </h2>

              <div className="mt-6 space-y-4">
                {timeline.map((item, index) => (
                  <div key={item.title} className="relative pl-6">
                    <span className="absolute left-0 top-2 h-3 w-3 rounded-full border-2 border-white bg-slate-900" />
                    {index !== timeline.length - 1 && (
                      <span className="absolute left-[5px] top-5 h-[calc(100%+14px)] w-px bg-slate-200" />
                    )}
                    <p className="text-sm font-semibold text-slate-900">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_100%)] p-6 text-white shadow-[0_25px_70px_rgba(15,23,42,0.18)] sm:p-7">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <BriefcaseBusiness size={22} />
              </div>
              <h2 className="mt-5 text-2xl font-semibold">
                Perfil listo para crecer
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/75">
                Cuando quieras, el siguiente paso natural aqui es conectar
                edicion real del perfil, avatar, telefonos y preferencias al
                backend.
              </p>
              <button
                type="button"
                onClick={() => navigate("/adminDashboard/employees")}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Gestionar usuarios
                <ChevronRight size={16} />
              </button>
            </article>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default AdminProfile;
