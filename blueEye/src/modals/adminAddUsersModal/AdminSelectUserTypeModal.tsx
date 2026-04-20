import React from "react";
import ReactDOM from "react-dom";
import { HardHat, ShieldUser, X } from "lucide-react";
import type { AdminSelectUserTypeModalProps } from "../../types/types";

export const AdminSelectUserTypeModal: React.FC<
  AdminSelectUserTypeModalProps
> = ({ onSelectType, setIsAddUserModalOpen }) => {
  const modal = (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#09111f]/60 px-4 py-6 backdrop-blur-[6px] sm:px-6 sm:py-10">
      <div className="flex min-h-full items-center justify-center">
        <div className="w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.22)]">
          <div className="border-b border-[#edf1f5] bg-[linear-gradient(135deg,#f8fafc_0%,#eef4ff_100%)] px-5 py-5 sm:px-7 sm:py-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span
                  className="inline-flex rounded-full border border-[#d9e3f0] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#4f5b6b]"
                  style={{ fontFamily: "Google Sans" }}
                >
                  Nuevo acceso
                </span>
                <h2
                  className="mt-3 text-2xl font-semibold text-[#101827] sm:text-[28px]"
                  style={{ fontFamily: "Google Sans" }}
                >
                  Selecciona el perfil a crear
                </h2>
                <p
                  className="mt-2 max-w-xl text-sm leading-6 text-[#5d6675] sm:text-[15px]"
                  style={{ fontFamily: "Google Sans" }}
                >
                  Primero elige si vas a invitar un usuario o un tecnico. Luego
                  abriremos el formulario para completar el registro y enviarlo
                  al backend.
                </p>
              </div>

              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d7dce5] bg-white text-[#526072] transition hover:border-[#bec6d4] hover:bg-[#f6f8fb]"
                aria-label="Cerrar modal"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:gap-5 sm:p-7">
            <button
              onClick={() => onSelectType("usuario")}
              className="group rounded-[24px] border border-[#dce3ec] bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-[#b8c6da] hover:shadow-[0_18px_40px_rgba(15,23,42,0.10)]"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eff6ff] text-[#1d4ed8]">
                <ShieldUser size={22} />
              </div>
              <h3
                className="mt-4 text-lg font-semibold text-[#101827]"
                style={{ fontFamily: "Google Sans" }}
              >
                Usuario
              </h3>
              <p
                className="mt-2 text-sm leading-6 text-[#5d6675]"
                style={{ fontFamily: "Google Sans" }}
              >
                Ideal para clientes o personal administrativo con acceso al
                panel, seguimiento y gestion diaria.
              </p>
              <span
                className="mt-5 inline-flex text-sm font-semibold text-[#111827]"
                style={{ fontFamily: "Google Sans" }}
              >
                Continuar con usuario
              </span>
            </button>

            <button
              onClick={() => onSelectType("tecnico")}
              className="group rounded-[24px] border border-[#dce3ec] bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-[#b8c6da] hover:shadow-[0_18px_40px_rgba(15,23,42,0.10)]"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ecfdf3] text-[#15803d]">
                <HardHat size={22} />
              </div>
              <h3
                className="mt-4 text-lg font-semibold text-[#101827]"
                style={{ fontFamily: "Google Sans" }}
              >
                Tecnico
              </h3>
              <p
                className="mt-2 text-sm leading-6 text-[#5d6675]"
                style={{ fontFamily: "Google Sans" }}
              >
                Pensado para el equipo operativo que recibe asignaciones,
                visitas, mantenimientos y trabajo de campo.
              </p>
              <span
                className="mt-5 inline-flex text-sm font-semibold text-[#111827]"
                style={{ fontFamily: "Google Sans" }}
              >
                Continuar con tecnico
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modal, document.body);
};
