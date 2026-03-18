import React from "react";
import ReactDOM from "react-dom";
import type { AdminAddUsersModalProps } from "../../types/types";
import Input from "../../components/Input/Input";
import { useAdminCreateUsersHook } from "../../hooks/use-admin-createUsers-hook";

export const AdminAddUsersModal: React.FC<AdminAddUsersModalProps> = ({
  setIsAddUserModalOpen,
}) => {
  const { selectedType, email, setSelectedType, setEmail, handleCreateUser } =
    useAdminCreateUsersHook();

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2
          className="text-xl font-semibold text-[#101827]"
          style={{ fontFamily: "Google Sans" }}
        >
          Agregar usuario
        </h2>

        {!selectedType && (
          <>
            <p
              className="mt-1 text-sm text-[#5d6675]"
              style={{ fontFamily: "Google Sans" }}
            >
              Elige el tipo de usuario que deseas agregar.
            </p>

            <div className="mt-5 grid gap-3">
              <button
                onClick={() => setSelectedType("usuario")}
                className="rounded-xl border px-4 py-2.5 text-left text-sm font-semibold hover:bg-[#f3f5f8] cursor-pointer"
                style={{ fontFamily: "Google Sans" }}
              >
                Usuarios
              </button>

              <button
                onClick={() => setSelectedType("tecnico")}
                className="rounded-xl border px-4 py-2.5 text-left text-sm font-semibold hover:bg-[#f3f5f8] cursor-pointer"
                style={{ fontFamily: "Google Sans" }}
              >
                Técnicos
              </button>
            </div>

            <button
              onClick={() => setIsAddUserModalOpen(false)}
              className="mt-5 w-full rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1f2937] cursor-pointer"
              style={{ fontFamily: "Google Sans" }}
            >
              Cerrar
            </button>
          </>
        )}

        {selectedType && (
          <>
            <div className="mt-5">
              <p
                className="text-sm mb-2 font-medium"
                style={{ fontFamily: "Google Sans" }}
              >
                Email
              </p>

              <Input
                text="email"
                translationKey="email"
                type="email"
                variant="default"
                value={email}
                onValueChange={setEmail}
              />

              <button
                onClick={() => setSelectedType(null)}
                className="mt-3 text-sm text-blue-600 cursor-pointer"
                style={{ fontFamily: "Google Sans" }}
              >
                Volver
              </button>
            </div>

            <button
              disabled={!email}
              onClick={handleCreateUser}
              className={`mt-5 w-full rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1f2937] ${email ? "cursor-pointer" : "cursor-not-allowed"}`}
              style={{ fontFamily: "Google Sans" }}
            >
              Crear usuario
            </button>
          </>
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modal, document.body);
};
