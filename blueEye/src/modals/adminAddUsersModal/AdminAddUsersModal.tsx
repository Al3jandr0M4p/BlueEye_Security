import React from "react";
import ReactDOM from "react-dom";

export interface AdminAddUsersModal {
  setIsAddUserModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AdminAddUsersModal: React.FC<AdminAddUsersModal> = ({
  setIsAddUserModalOpen,
}) => {

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2
          className="text-xl font-semibold text-[#101827]"
          style={{ fontFamily: "Google Sans" }}
        >
          Agregar usuario
        </h2>
        <p
          className="mt-1 text-sm text-[#5d6675]"
          style={{ fontFamily: "Google Sans" }}
        >
          Elige el tipo de usuario que deseas agregar.
        </p>

        <div className="mt-5 grid gap-3">
          <button
            onClick={() => {
              setIsAddUserModalOpen(false);
            }}
            className="rounded-xl border border-[#d7dce5] px-4 py-2.5 text-left text-sm font-semibold text-[#111827] transition hover:bg-[#f3f5f8]"
            style={{ fontFamily: "Google Sans" }}
          >
            Usuarios
          </button>
          <button
            onClick={() => {
              setIsAddUserModalOpen(false);
            }}
            className="rounded-xl border border-[#d7dce5] px-4 py-2.5 text-left text-sm font-semibold text-[#111827] transition hover:bg-[#f3f5f8]"
            style={{ fontFamily: "Google Sans" }}
          >
            Tecnicos
          </button>
        </div>

        <button
          onClick={() => setIsAddUserModalOpen(false)}
          className="mt-5 w-full rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f2937]"
          style={{ fontFamily: "Google Sans" }}
        >
          Cerrar
        </button>
      </div>
    </div>
  )

  return ReactDOM.createPortal(modal, document.body);
};
