import React from "react";
import ReactDOM from "react-dom";
import {
  ArrowLeft,
  CircleCheckBig,
  Mail,
  MapPin,
  Phone,
  UserRound,
  X,
} from "lucide-react";
import Input from "../../components/Input/Input";
import { useAdminCreateUsersHook } from "../../hooks/use-admin-createUsers-hook";
import type { AdminAddUsersModalProps } from "../../types/types";

export const AdminAddUsersModal: React.FC<AdminAddUsersModalProps> = ({
  selectedType,
  setIsAddUserModalOpen,
  onCreated,
  onBackToTypeSelection,
}) => {
  const { formData, handleCreateUser, isSubmitDisabled, updateField } =
    useAdminCreateUsersHook({
      selectedType,
      onSuccess: async () => {
        await onCreated?.();
        setIsAddUserModalOpen(false);
      },
    });

  const modal = (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#09111f]/60 px-4 py-6 backdrop-blur-[6px] sm:px-6 sm:py-10">
      <div className="flex min-h-full items-center justify-center">
        <div className="w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.22)]">
          <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
            <div className="bg-[linear-gradient(160deg,#111827_0%,#1f3b63_100%)] p-5 text-white sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <span
                  className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/85"
                  style={{ fontFamily: "Google Sans" }}
                >
                  Invitacion
                </span>
                <button
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/15"
                  aria-label="Cerrar modal"
                >
                  <X size={18} />
                </button>
              </div>

              <h2
                className="mt-5 text-2xl font-semibold capitalize sm:text-[30px]"
                style={{ fontFamily: "Google Sans" }}
              >
                Crear {selectedType}
              </h2>
              <p
                className="mt-3 max-w-sm text-sm leading-6 text-white/78 sm:text-[15px]"
                style={{ fontFamily: "Google Sans" }}
              >
                Completa los datos principales y enviaremos la informacion al
                backend para registrar el nuevo {selectedType}.
              </p>

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                  <CircleCheckBig size={18} className="text-[#86efac]" />
                  <div>
                    <p
                      className="text-sm font-semibold text-white"
                      style={{ fontFamily: "Google Sans" }}
                    >
                      Listo para enviarse
                    </p>
                    <p
                      className="text-xs text-white/70"
                      style={{ fontFamily: "Google Sans" }}
                    >
                      El tipo seleccionado viajara junto al formulario.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p
                      className="text-xs uppercase tracking-[0.2em] text-white/55"
                      style={{ fontFamily: "Google Sans" }}
                    >
                      Perfil
                    </p>
                    <p
                      className="mt-2 text-sm font-semibold capitalize text-white"
                      style={{ fontFamily: "Google Sans" }}
                    >
                      {selectedType}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p
                      className="text-xs uppercase tracking-[0.2em] text-white/55"
                      style={{ fontFamily: "Google Sans" }}
                    >
                      Campos clave
                    </p>
                    <p
                      className="mt-2 text-sm font-semibold text-white"
                      style={{ fontFamily: "Google Sans" }}
                    >
                      Nombre, usuario y email
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-h-[85vh] overflow-y-auto p-5 sm:p-7">
              <div className="flex flex-col gap-3 border-b border-[#edf1f5] pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <button
                    onClick={onBackToTypeSelection}
                    className="inline-flex items-center gap-2 rounded-full border border-[#d7dce5] px-3 py-1.5 text-sm font-medium text-[#3e4959] transition hover:bg-[#f3f5f8]"
                    style={{ fontFamily: "Google Sans" }}
                  >
                    <ArrowLeft size={16} />
                    Cambiar tipo
                  </button>
                  <h3
                    className="mt-4 text-xl font-semibold text-[#101827]"
                    style={{ fontFamily: "Google Sans" }}
                  >
                    Datos del nuevo {selectedType}
                  </h3>
                  <p
                    className="mt-1 text-sm text-[#5d6675]"
                    style={{ fontFamily: "Google Sans" }}
                  >
                    El modal se mantiene centrado y con scroll interno para que
                    se vea bien en movil y escritorio.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label
                    htmlFor="fullName"
                    className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-[#344054]"
                  >
                    <UserRound size={16} />
                    Nombre completo
                  </label>
                  <Input
                    text="fullName"
                    translationKey="nombre completo"
                    type="text"
                    variant="default"
                    value={formData.fullName}
                    onValueChange={updateField("fullName")}
                  />
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-[#344054]"
                  >
                    <UserRound size={16} />
                    Nombre de usuario
                  </label>
                  <Input
                    text="username"
                    translationKey="nombre de usuario"
                    type="text"
                    variant="default"
                    value={formData.username}
                    onValueChange={updateField("username")}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-[#344054]"
                  >
                    <Mail size={16} />
                    Email
                  </label>
                  <Input
                    text="email"
                    translationKey="email"
                    type="email"
                    variant="default"
                    value={formData.email}
                    onValueChange={updateField("email")}
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-[#344054]"
                  >
                    <Phone size={16} />
                    Telefono
                  </label>
                  <Input
                    text="phone"
                    translationKey="telefono"
                    type="text"
                    variant="default"
                    value={formData.phone}
                    onValueChange={updateField("phone")}
                  />
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-[#344054]"
                  >
                    <MapPin size={16} />
                    Ciudad
                  </label>
                  <Input
                    text="city"
                    translationKey="ciudad"
                    type="text"
                    variant="default"
                    value={formData.city}
                    onValueChange={updateField("city")}
                  />
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] px-4 py-3">
                <p
                  className="text-sm font-medium text-[#101827]"
                  style={{ fontFamily: "Google Sans" }}
                >
                  Campos obligatorios
                </p>
                <p
                  className="mt-1 text-sm text-[#5d6675]"
                  style={{ fontFamily: "Google Sans" }}
                >
                  Para habilitar el envio necesitamos nombre completo, nombre de
                  usuario y email.
                </p>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#edf1f5] pt-5 sm:flex-row sm:justify-end">
                <button
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="cursor-pointer rounded-xl border border-[#d7dce5] px-4 py-3 text-sm font-semibold text-[#3e4959] transition hover:bg-[#f3f5f8]"
                  style={{ fontFamily: "Google Sans" }}
                >
                  Cancelar
                </button>

                <button
                  disabled={isSubmitDisabled}
                  onClick={handleCreateUser}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold text-white transition ${
                    isSubmitDisabled
                      ? "cursor-not-allowed bg-[#94a3b8] opacity-80"
                      : "cursor-pointer bg-[#111827] hover:bg-[#1f2937]"
                  }`}
                  style={{ fontFamily: "Google Sans" }}
                >
                  Crear y enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modal, document.body);
};
