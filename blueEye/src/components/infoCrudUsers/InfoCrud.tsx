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
import { useNavigate, useParams } from "react-router-dom";
import Input from "../Input/Input";
import { useAdminUserDetails } from "../../hooks/use-admin-user-details";
import type { UserRoleTab } from "../../types/types";

const InfoCrud: React.FC = () => {
  const navigate = useNavigate();
  const { userType, id } = useParams();
  const normalizedType: UserRoleTab =
    userType === "tecnico" ? "tecnico" : "usuario";
  const { deactivateUser, error, form, isLoading, saveChanges, updateField, user } =
    useAdminUserDetails(id);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f5f7fb] px-4 py-8 md:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#e2e8f0] bg-white p-8 text-center text-sm text-[#64748b]">
          Cargando usuario...
        </div>
      </main>
    );
  }

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
          {error && <p className="mt-3 text-sm text-[#b91c1c]">{error}</p>}
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
                    {normalizedType === "usuario" ? "Usuario" : "Tecnico"}
                  </span>
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-6 rounded-xl border border-[#fecaca] bg-[#fff1f2] p-4 text-sm text-[#b91c1c]">
                {error}
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-[#e7edf4] bg-[#fbfcfe] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">
                  Correo actual
                </p>
                <p className="mt-2 inline-flex items-center gap-2 text-sm text-[#1e293b]">
                  <Mail size={14} />
                  {user.email}
                </p>
              </article>

              <article className="rounded-xl border border-[#e7edf4] bg-[#fbfcfe] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">
                  Telefono actual
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
                Editar datos
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  text="admin-user-email"
                  translationKey="Nuevo email"
                  type="email"
                  variant="default"
                  value={form.email}
                  onValueChange={updateField("email")}
                />
                <Input
                  text="admin-user-phone"
                  translationKey="Nuevo telefono"
                  type="text"
                  variant="default"
                  value={form.phone}
                  onValueChange={updateField("phone")}
                />
                <div className="md:col-span-2">
                  <Input
                    text="admin-user-password"
                    translationKey="Nueva contrasena"
                    type="password"
                    variant="default"
                    value={form.password}
                    onValueChange={updateField("password")}
                  />
                </div>
              </div>
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
              <div className={`flex items-center gap-2 rounded-xl p-3 text-sm ${user.isActive ? "border border-[#dcfce7] bg-[#f0fdf4] text-[#166534]" : "border border-[#fecaca] bg-[#fff1f2] text-[#b91c1c]"}`}>
                <ShieldCheck size={16} />
                Estado: {user.isActive ? "Activo" : "Inactivo"}
              </div>
            </div>

            <button
              onClick={() => void saveChanges()}
              className="mt-5 w-full rounded-xl bg-[#111827] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1f2937]"
              style={{ fontFamily: "Google Sans" }}
            >
              Actualizar
            </button>

            <button
              onClick={async () => {
                const ok = await deactivateUser();
                if (ok) {
                  navigate("/adminDashboard/employees");
                }
              }}
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
