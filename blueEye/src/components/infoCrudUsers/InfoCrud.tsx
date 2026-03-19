import React from "react";
import {
  ArrowLeft,
  Building2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { usersFallback } from "../../constants/constants";
import type { LocationState, UserRoleTab } from "../../types/types";

const InfoCrud: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userType, id } = useParams();
  const state = (location.state as LocationState) || {};

  const normalizedType: UserRoleTab =
    userType === "tecnicos" ? "tecnicos" : "clientes";
  const userId = Number(id);

  const user =
    state.user ||
    usersFallback[normalizedType].find((item) => item.id === userId) ||
    null;

  if (!user) {
    return (
      <main className="min-h-screen bg-[#f5f7fb] px-4 py-8 md:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#e2e8f0] bg-white p-8 text-center">
          <h1
            className="text-2xl font-semibold text-[#101827]"
            style={{ fontFamily: "Google Sans" }}
          >
            Usuario no encontrado
          </h1>
          <button
            onClick={() => navigate("/adminDashboard/employees")}
            className="mt-6 rounded-xl bg-[#111827] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f2937]"
          >
            Volver a usuarios
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => navigate("/adminDashboard/employees")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#334155] transition hover:text-[#0f172a]"
          style={{ fontFamily: "Google Sans" }}
        >
          <ArrowLeft size={16} />
          Volver a usuarios
        </button>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-2xl border border-[#e2e8f0] bg-white p-5 md:p-7">
            <div className="flex flex-col gap-4 border-b border-[#e7edf4] pb-5 sm:flex-row sm:items-center">
              <img
                src={user.image}
                alt={user.name}
                className="h-20 w-20 rounded-2xl object-cover"
              />
              <div>
                <h1
                  className="text-3xl font-semibold text-[#0f172a]"
                  style={{ fontFamily: "Google Sans" }}
                >
                  {user.name}
                </h1>
                <p
                  className="mt-1 text-sm text-[#5b6576]"
                  style={{ fontFamily: "Google Sans" }}
                >
                  Perfil:{" "}
                  <span className="font-semibold text-[#111827]">
                    {normalizedType === "clientes" ? "Cliente" : "Tecnico"}
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-[#e7edf4] bg-[#fbfcfe] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">
                  Correo
                </p>
                <p className="mt-2 inline-flex items-center gap-2 text-sm text-[#1e293b]">
                  <Mail size={14} />
                  {user.email}
                </p>
              </article>

              <article className="rounded-xl border border-[#e7edf4] bg-[#fbfcfe] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">
                  Telefono
                </p>
                <p className="mt-2 inline-flex items-center gap-2 text-sm text-[#1e293b]">
                  <Phone size={14} />
                  {user.phone}
                </p>
              </article>

              <article className="rounded-xl border border-[#e7edf4] bg-[#fbfcfe] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">
                  Empresa
                </p>
                <p className="mt-2 inline-flex items-center gap-2 text-sm text-[#1e293b]">
                  <Building2 size={14} />
                  {user.company}
                </p>
              </article>

              <article className="rounded-xl border border-[#e7edf4] bg-[#fbfcfe] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">
                  Ubicacion
                </p>
                <p className="mt-2 inline-flex items-center gap-2 text-sm text-[#1e293b]">
                  <MapPin size={14} />
                  {user.city}
                </p>
              </article>
            </div>

            <section className="mt-6 rounded-xl border border-[#e7edf4] p-4">
              <h2
                className="text-lg font-semibold text-[#0f172a]"
                style={{ fontFamily: "Google Sans" }}
              >
                Informacion adicional
              </h2>
              <p
                className="mt-2 text-sm text-[#5b6576]"
                style={{ fontFamily: "Google Sans" }}
              >
                Aqui puedes mostrar historial, plan, notas internas, permisos,
                direcciones y cualquier metrica relacionada al usuario.
              </p>
            </section>
          </section>

          <aside className="h-fit rounded-2xl border border-[#e2e8f0] bg-white p-5 md:p-6">
            <h3
              className="text-xl font-semibold text-[#0f172a]"
              style={{ fontFamily: "Google Sans" }}
            >
              Acciones
            </h3>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 rounded-xl border border-[#e7edf4] bg-[#f8fafc] p-3 text-sm text-[#334155]">
                <UserCircle2 size={16} />
                ID de usuario: {user.id}
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-[#dcfce7] bg-[#f0fdf4] p-3 text-sm text-[#166534]">
                <ShieldCheck size={16} />
                Estado: Activo
              </div>
            </div>

            <button
              className="mt-5 w-full rounded-xl bg-[#111827] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1f2937]"
              style={{ fontFamily: "Google Sans" }}
            >
              Actualizar
            </button>

            <button
              className="mt-3 w-full rounded-xl border border-[#fecaca] bg-[#fff1f2] px-4 py-3 text-sm font-semibold text-[#b91c1c] transition hover:bg-[#ffe4e6]"
              style={{ fontFamily: "Google Sans" }}
            >
              Deshabilitar
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default InfoCrud;
