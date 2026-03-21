import React, { useMemo, useState } from "react";
import { Mail, Phone, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { UserRoleTab } from "../../types/types";
import { clientsData, techsData } from "../../constants/constants";
import { AdminAddUsersModal } from "../../modals/adminAddUsersModal/AdminAddUsersModal";

const AdminUsersScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<UserRoleTab>("usuario");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const navigate = useNavigate();

  const users = useMemo(
    () => (activeTab === "usuario" ? clientsData : techsData),
    [activeTab],
  );

  return (
    <section className="w-full">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1
            className="text-3xl font-semibold text-[#101827]"
            style={{ fontFamily: "Google Sans" }}
          >
            Usuarios
          </h1>
          <p
            className="mt-1 text-sm text-[#5d6675]"
            style={{ fontFamily: "Google Sans" }}
          >
            Gestiona clientes y tecnicos de tu empresa.
          </p>
        </div>

        <button
          onClick={() => setIsAddUserModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f2937]"
          style={{ fontFamily: "Google Sans" }}
        >
          <Plus size={16} />
          Agregar usuario
        </button>
      </div>

      <div className="mt-6 inline-flex rounded-xl bg-[#eef1f4] p-1">
        <button
          onClick={() => setActiveTab("usuario")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            activeTab === "usuario"
              ? "bg-white text-[#111827] shadow-sm"
              : "text-[#556070] hover:text-[#111827]"
          }`}
          style={{ fontFamily: "Google Sans" }}
        >
          Usuarios
        </button>
        <button
          onClick={() => setActiveTab("tecnico")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            activeTab === "tecnico"
              ? "bg-white text-[#111827] shadow-sm"
              : "text-[#556070] hover:text-[#111827]"
          }`}
          style={{ fontFamily: "Google Sans" }}
        >
          Tecnicos
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {users.map((user) => (
          <article
            key={user.id}
            className="group rounded-2xl border border-[#e3e7ee] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <div>
                  <h3
                    className="text-base font-semibold text-[#101827]"
                    style={{ fontFamily: "Google Sans" }}
                  >
                    {user.name}
                  </h3>
                  <p
                    className="text-xs text-[#667084]"
                    style={{ fontFamily: "Google Sans" }}
                  >
                    {user.company}
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  navigate(
                    `/adminDashboard/employees/info/${activeTab}/${user.id}`,
                    {
                      state: { user, userType: activeTab },
                    },
                  )
                }
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#d7dce5] text-[#3e4959] transition hover:border-[#bec6d4] hover:bg-[#f3f5f8]"
                aria-label={`Ver mas de ${user.name}`}
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="mt-4 space-y-2">
              <p
                className="inline-flex items-center gap-2 text-sm text-[#4f5b6b]"
                style={{ fontFamily: "Google Sans" }}
              >
                <Mail size={14} />
                {user.email}
              </p>
              <p
                className="inline-flex items-center gap-2 text-sm text-[#4f5b6b]"
                style={{ fontFamily: "Google Sans" }}
              >
                <Phone size={14} />
                {user.phone}
              </p>
              <p
                className="text-sm text-[#4f5b6b]"
                style={{ fontFamily: "Google Sans" }}
              >
                Ciudad:{" "}
                <span className="font-medium text-[#1c2431]">{user.city}</span>
              </p>
            </div>
          </article>
        ))}
      </div>

      {isAddUserModalOpen && (
        <AdminAddUsersModal setIsAddUserModalOpen={setIsAddUserModalOpen} />
      )}
    </section>
  );
};

export default AdminUsersScreen;
