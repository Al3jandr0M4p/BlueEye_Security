import { useState, type ChangeEvent, type FormEvent } from "react";
import type { NewTicketInput } from "../types/client.types";

const C = {
  bgCard:    "#0f172a",
  bgCardEnd: "#1e293b",
  primary:      "#22d3ee",
  primaryBg:    "rgba(34,211,238,0.07)",
  primaryBg2:   "rgba(34,211,238,0.15)",
  primaryBd:    "rgba(34,211,238,0.16)",
  primaryBd2:   "rgba(34,211,238,0.35)",
  danger:    "#ef4444",
  dangerBg:  "rgba(239,68,68,0.08)",
  dangerBd:  "rgba(239,68,68,0.22)",
  textPrimary:   "#f1f5f9",
  textSecondary: "#e2e8f0",
  textBody:      "#cbd5e1",
  textMuted:     "#94a3b8",
  textSubtle:    "#64748b",
  border:      "rgba(255,255,255,0.06)",
  borderCard:  "rgba(34,211,238,0.1)",
  inputBorder: "rgba(255,255,255,0.09)",
  inputBg:     "rgba(255,255,255,0.04)",
  f: "'Geist','Inter',-apple-system,sans-serif",
  m: "'Geist Mono','JetBrains Mono',ui-monospace,monospace",
} as const;

interface TicketFormProps {
  onSubmit: (input: NewTicketInput) => Promise<void>;
}

interface FormErrors {
  site?:        string;
  equipment?:   string;
  description?: string;
}

const initialState: NewTicketInput = { site: "", equipment: "", description: "" };

function Field({
  id, label, error, placeholder, value, onChange, textarea,
}: {
  id: string; label: string; error?: string; placeholder: string;
  value: string; onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  textarea?: boolean;
}) {
  const [focus, setFocus] = useState(false);
  const shared: React.CSSProperties = {
    width: "100%", borderRadius: 8,
    background: focus ? "rgba(34,211,238,0.05)" : C.inputBg,
    border: `1px solid ${error ? C.dangerBd : focus ? C.primaryBd2 : C.inputBorder}`,
    color: C.textSecondary,
    fontSize: 12, fontFamily: C.f,
    outline: "none",
    transition: "all 0.18s",
    boxSizing: "border-box",
    boxShadow: focus ? `0 0 0 3px rgba(34,211,238,0.07)` : "none",
  };

  return (
    <div>
      <label htmlFor={id} style={{
        display: "block", marginBottom: 6,
        fontSize: 9, fontFamily: C.m, letterSpacing: "0.12em",
        textTransform: "uppercase", color: error ? "#f87171" : C.textSubtle,
        fontWeight: 600,
      }}>
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          placeholder={placeholder}
          style={{ ...shared, padding: "10px 14px", height: 100, resize: "vertical" }}
        />
      ) : (
        <input
          id={id}
          value={value}
          onChange={onChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          placeholder={placeholder}
          style={{ ...shared, padding: "10px 14px" }}
        />
      )}
      {error && (
        <p style={{ marginTop: 5, fontSize: 10, color: "#f87171", fontFamily: C.m }}>{error}</p>
      )}
    </div>
  );
}

export default function TicketForm({ onSubmit }: TicketFormProps) {
  const [formData,    setFormData]    = useState<NewTicketInput>(initialState);
  const [errors,      setErrors]      = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [btnHov,      setBtnHov]      = useState(false);

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!formData.site.trim())        e.site        = "El sitio es requerido.";
    if (!formData.equipment.trim())   e.equipment   = "El equipo es requerido.";
    if (!formData.description.trim()) e.description = "La descripción es requerida.";
    if (formData.description.length > 500) e.description = "Máximo 500 caracteres.";
    return e;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      setFormData(initialState);
      setErrors({});
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField =
    (field: keyof NewTicketInput) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFormData(prev => ({ ...prev, [field]: e.target.value }));

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background:   `linear-gradient(135deg, ${C.bgCard} 0%, ${C.bgCardEnd} 100%)`,
        border:       `1px solid ${C.borderCard}`,
        borderRadius: 12,
        overflow:     "hidden",
        fontFamily:   C.f,
      }}
    >
      {/* Panel header */}
      <div style={{
        padding: "12px 18px",
        borderBottom: `1px solid ${C.border}`,
        background: "rgba(6,13,26,0.4)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, letterSpacing: "-0.01em" }}>
            Reportar falla
          </div>
          <div style={{ fontSize: 9, fontFamily: C.m, letterSpacing: "0.12em", textTransform: "uppercase", color: C.textSubtle, marginTop: 2 }}>
            Nuevo ticket de soporte
          </div>
        </div>
        <span style={{
          fontSize: 9, fontFamily: C.m, letterSpacing: "0.1em", fontWeight: 600,
          padding: "3px 9px", borderRadius: 5,
          background: C.primaryBg, color: C.primary, border: `1px solid ${C.primaryBd}`,
        }}>
          Soporte técnico
        </span>
      </div>

      {/* Form body */}
      <div style={{ padding: "18px", display: "flex", flexDirection: "column", gap: 14 }}>
        <Field
          id="ticket-site"
          label="Sitio"
          error={errors.site}
          placeholder="Ej. HQ Santo Domingo"
          value={formData.site}
          onChange={updateField("site")}
        />
        <Field
          id="ticket-equipment"
          label="Equipo"
          error={errors.equipment}
          placeholder="Ej. Cam-03 Warehouse 1"
          value={formData.equipment}
          onChange={updateField("equipment")}
        />
        <Field
          id="ticket-description"
          label="Descripción"
          error={errors.description}
          placeholder="Describe el problema detectado."
          value={formData.description}
          onChange={updateField("description")}
          textarea
        />

        {/* Char counter */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -8 }}>
          <span style={{
            fontSize: 9, fontFamily: C.m,
            color: formData.description.length > 450 ? "#fcd34d" : C.textSubtle,
          }}>
            {formData.description.length} / 500
          </span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          onMouseEnter={() => setBtnHov(true)}
          onMouseLeave={() => setBtnHov(false)}
          style={{
            padding: "11px 22px", borderRadius: 8,
            background: isSubmitting
              ? "rgba(34,211,238,0.06)"
              : btnHov
                ? C.primaryBg2
                : C.primaryBg,
            border: `1px solid ${isSubmitting ? C.primaryBd : btnHov ? C.primaryBd2 : C.primaryBd}`,
            color: isSubmitting ? C.textSubtle : C.primary,
            fontSize: 12, fontFamily: C.m,
            fontWeight: 600, letterSpacing: "0.08em",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            transition: "all 0.18s",
            alignSelf: "flex-start",
          }}
        >
          {isSubmitting ? "Enviando..." : "Crear ticket"}
        </button>
      </div>
    </form>
  );
}