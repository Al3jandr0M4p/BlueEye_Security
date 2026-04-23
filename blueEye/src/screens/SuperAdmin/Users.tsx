import type React from "react";
import { useMemo, useState } from "react";
import { PANEL_STYLE, StatCard } from "./components/shared";
import { useSuperAdminUsers } from "./hooks/useSuperAdminUsers";

export default function SuperAdminUsers(): React.ReactElement {
  const {
    admins,
    companies,
    createUser,
    currentUser,
    deleteUser,
    entries,
    error,
    integrationNote,
    isLoading,
    search,
    setSearch,
    total,
    updateUser,
  } = useSuperAdminUsers();

  const [createForm, setCreateForm] = useState({
    businessId: "",
    email: "",
    fullName: "",
    phone: "",
    rolename: "usuario" as "usuario" | "tecnico",
    username: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    email: "",
    phone: "",
    password: "",
  });
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeCount = useMemo(
    () => entries.filter((entry) => entry.status === "active").length,
    [entries],
  );

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <StatCard label="Usuarios detectados" value={total} sub="Desde la tabla global de cuentas" accent="#0f172a" />
        <StatCard label="Admins" value={admins} sub="Cuentas administrativas" />
        <StatCard label="Activos" value={activeCount} sub="Usuarios operativos" accent="#22c55e" />
        <StatCard label="Cuenta actual" value={currentUser.role} sub={currentUser.name} accent="#a855f7" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 16 }}>
        <div style={{ ...PANEL_STYLE, padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Directorio global</div>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar usuario..."
              style={{ background: "#f8fafc", border: "1px solid rgba(2,6,23,0.10)", borderRadius: 12, padding: "9px 12px", minWidth: 220, color: "#0f172a", fontSize: 12 }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.1fr 1fr 100px 100px 140px", gap: 12, padding: "8px 10px", marginBottom: 6 }}>
            {["Actor", "Email", "Empresa", "Rol", "Estado", "Acciones"].map((h) => (
              <div key={h} style={{ fontSize: 10, color: "#64748b", fontWeight: 900, letterSpacing: "0.10em", textTransform: "uppercase" }}>{h}</div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {entries.map((entry) => (
              <div key={entry.id} className="row-hover" style={{ display: "grid", gridTemplateColumns: "1.1fr 1.1fr 1fr 100px 100px 140px", gap: 12, padding: "12px 10px", borderRadius: 12, alignItems: "center" }}>
                <div style={{ color: "#0f172a", fontSize: 12, fontWeight: 900 }}>{entry.actor}</div>
                <div style={{ color: "#64748b", fontSize: 12 }}>{entry.email}</div>
                <div style={{ color: "#64748b", fontSize: 12 }}>{entry.company}</div>
                <div style={{ color: "#0ea5e9", fontSize: 11, fontWeight: 900, textTransform: "uppercase" }}>{entry.role}</div>
                <div style={{ color: entry.status === "blocked" ? "#b91c1c" : "#0f766e", fontSize: 11, fontWeight: 900, textTransform: "uppercase" }}>{entry.status}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(entry.id);
                      setEditForm({ email: entry.email, phone: entry.phone, password: "" });
                      setActionMessage(null);
                    }}
                    style={{ background: "#e0f2fe", border: "1px solid #bae6fd", borderRadius: 10, color: "#0369a1", cursor: "pointer", fontSize: 11, fontWeight: 800, padding: "8px 10px" }}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      void (async () => {
                        setIsSubmitting(true);
                        try {
                          await deleteUser(entry.id);
                          setActionMessage("Usuario desactivado correctamente.");
                        } catch {
                          setActionMessage("No se pudo desactivar el usuario.");
                        } finally {
                          setIsSubmitting(false);
                        }
                      })();
                    }}
                    disabled={isSubmitting}
                    style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 10, color: "#b91c1c", cursor: "pointer", fontSize: 11, fontWeight: 800, padding: "8px 10px" }}
                  >
                    Bloquear
                  </button>
                </div>
              </div>
            ))}

            {!entries.length && !isLoading && (
              <div style={{ color: "#64748b", fontSize: 12 }}>
                No hay usuarios para mostrar.
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ ...PANEL_STYLE, padding: 18 }}>
            <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Crear usuario</div>
            <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
              <select
                value={createForm.businessId}
                onChange={(event) => setCreateForm((current) => ({ ...current, businessId: event.target.value }))}
                style={{ background: "#f8fafc", border: "1px solid rgba(2,6,23,0.10)", borderRadius: 12, padding: "10px 12px", color: "#0f172a", fontSize: 12 }}
              >
                <option value="">Selecciona empresa</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              <input
                value={createForm.fullName}
                onChange={(event) => setCreateForm((current) => ({ ...current, fullName: event.target.value }))}
                placeholder="Nombre completo"
                style={{ background: "#f8fafc", border: "1px solid rgba(2,6,23,0.10)", borderRadius: 12, padding: "10px 12px", color: "#0f172a", fontSize: 12 }}
              />
              <input
                value={createForm.username}
                onChange={(event) => setCreateForm((current) => ({ ...current, username: event.target.value }))}
                placeholder="Username"
                style={{ background: "#f8fafc", border: "1px solid rgba(2,6,23,0.10)", borderRadius: 12, padding: "10px 12px", color: "#0f172a", fontSize: 12 }}
              />
              <input
                value={createForm.email}
                onChange={(event) => setCreateForm((current) => ({ ...current, email: event.target.value }))}
                placeholder="Correo"
                style={{ background: "#f8fafc", border: "1px solid rgba(2,6,23,0.10)", borderRadius: 12, padding: "10px 12px", color: "#0f172a", fontSize: 12 }}
              />
              <input
                value={createForm.phone}
                onChange={(event) => setCreateForm((current) => ({ ...current, phone: event.target.value }))}
                placeholder="Telefono"
                style={{ background: "#f8fafc", border: "1px solid rgba(2,6,23,0.10)", borderRadius: 12, padding: "10px 12px", color: "#0f172a", fontSize: 12 }}
              />
              <select
                value={createForm.rolename}
                onChange={(event) => setCreateForm((current) => ({ ...current, rolename: event.target.value as "usuario" | "tecnico" }))}
                style={{ background: "#f8fafc", border: "1px solid rgba(2,6,23,0.10)", borderRadius: 12, padding: "10px 12px", color: "#0f172a", fontSize: 12 }}
              >
                <option value="usuario">Usuario</option>
                <option value="tecnico">Tecnico</option>
              </select>
              <button
                type="button"
                disabled={isSubmitting || !createForm.businessId || !createForm.email || !createForm.username}
                onClick={() => {
                  void (async () => {
                    setIsSubmitting(true);
                    try {
                      await createUser(createForm);
                      setCreateForm({
                        businessId: "",
                        email: "",
                        fullName: "",
                        phone: "",
                        rolename: "usuario",
                        username: "",
                      });
                      setActionMessage("Usuario creado correctamente.");
                    } catch {
                      setActionMessage("No se pudo crear el usuario.");
                    } finally {
                      setIsSubmitting(false);
                    }
                  })();
                }}
                style={{ background: "#0f172a", border: "none", borderRadius: 12, color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 800, padding: "11px 14px" }}
              >
                Crear usuario
              </button>
            </div>
          </div>

          <div style={{ ...PANEL_STYLE, padding: 18 }}>
            <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Editar usuario</div>
            {editingId ? (
              <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
                <input
                  value={editForm.email}
                  onChange={(event) => setEditForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="Correo"
                  style={{ background: "#f8fafc", border: "1px solid rgba(2,6,23,0.10)", borderRadius: 12, padding: "10px 12px", color: "#0f172a", fontSize: 12 }}
                />
                <input
                  value={editForm.phone}
                  onChange={(event) => setEditForm((current) => ({ ...current, phone: event.target.value }))}
                  placeholder="Telefono"
                  style={{ background: "#f8fafc", border: "1px solid rgba(2,6,23,0.10)", borderRadius: 12, padding: "10px 12px", color: "#0f172a", fontSize: 12 }}
                />
                <input
                  value={editForm.password}
                  onChange={(event) => setEditForm((current) => ({ ...current, password: event.target.value }))}
                  placeholder="Nueva contraseña (opcional)"
                  style={{ background: "#f8fafc", border: "1px solid rgba(2,6,23,0.10)", borderRadius: 12, padding: "10px 12px", color: "#0f172a", fontSize: 12 }}
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => {
                      void (async () => {
                        setIsSubmitting(true);
                        try {
                          await updateUser(editingId, editForm);
                          setEditingId(null);
                          setActionMessage("Usuario actualizado correctamente.");
                        } catch {
                          setActionMessage("No se pudo actualizar el usuario.");
                        } finally {
                          setIsSubmitting(false);
                        }
                      })();
                    }}
                    style={{ background: "#0ea5e9", border: "none", borderRadius: 12, color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 800, padding: "11px 14px" }}
                  >
                    Guardar cambios
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    style={{ background: "#f8fafc", border: "1px solid rgba(2,6,23,0.10)", borderRadius: 12, color: "#475569", cursor: "pointer", fontSize: 12, fontWeight: 800, padding: "11px 14px" }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ color: "#64748b", fontSize: 12, marginTop: 14 }}>
                Selecciona un usuario desde la tabla para editarlo.
              </div>
            )}
          </div>

          <div style={{ ...PANEL_STYLE, padding: 18 }}>
            <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',sans-serif" }}>Cuenta autenticada</div>
            <div style={{ marginTop: 12, color: "#0f172a", fontSize: 14, fontWeight: 800 }}>{currentUser.name}</div>
            <div style={{ marginTop: 6, color: "#64748b", fontSize: 12 }}>{currentUser.email}</div>
            <div style={{ marginTop: 6, color: "#64748b", fontSize: 12, textTransform: "capitalize" }}>Rol: {currentUser.role}</div>
            <div style={{ color: actionMessage ? "#0f766e" : error ? "#b91c1c" : "#64748b", fontSize: 12, marginTop: 14, lineHeight: 1.6 }}>
              {actionMessage ?? error ?? integrationNote}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
