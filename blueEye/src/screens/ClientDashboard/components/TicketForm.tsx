import type React from "react";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import type { NewTicketInput } from "../../../types/client.types";
import { useTicketForm } from "../hooks/useTicketForm";

const T = {
  border: "#E2E8E4",
  danger: "#E05252",
  dangerBd: "rgba(224,82,82,0.30)",
  dangerSft: "rgba(224,82,82,0.08)",
  green: "#4CAF82",
  greenDark: "#2E8B5E",
  greenLight: "#C8EDD9",
  greenMid: "#A8DBBE",
  greenSft: "#EAF7F1",
  mono: "'JetBrains Mono', 'Fira Mono', monospace",
  sans: "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
  t1: "#1A2332",
  t2: "#4A5568",
  t3: "#9AA3B2",
  warning: "#D48A20",
  white: "#FFFFFF",
} as const;

interface TicketFormProps {
  onSubmit: (input: NewTicketInput, photo?: File) => Promise<void>;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function Field({
  error,
  id,
  label,
  onChange,
  placeholder,
  textarea,
  value,
}: {
  error?: string;
  id: string;
  label: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  textarea?: boolean;
  value: string;
}) {
  const [focus, setFocus] = useState(false);

  const shared: React.CSSProperties = {
    background: focus ? T.greenSft : T.white,
    border: `1.5px solid ${error ? T.dangerBd : focus ? T.greenMid : T.border}`,
    borderRadius: 10,
    boxShadow: focus ? `0 0 0 3px ${T.greenLight}` : "none",
    boxSizing: "border-box",
    color: T.t1,
    fontFamily: T.sans,
    fontSize: 13,
    outline: "none",
    transition: "all 0.18s",
    width: "100%",
  };

  return (
    <div>
      <label
        htmlFor={id}
        style={{
          color: error ? T.danger : T.t3,
          display: "block",
          fontFamily: T.mono,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.12em",
          marginBottom: 6,
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>

      {textarea ? (
        <textarea
          id={id}
          value={value}
          onBlur={() => setFocus(false)}
          onChange={onChange}
          onFocus={() => setFocus(true)}
          placeholder={placeholder}
          style={{ ...shared, height: 100, padding: "10px 14px", resize: "vertical" }}
        />
      ) : (
        <input
          id={id}
          value={value}
          onBlur={() => setFocus(false)}
          onChange={onChange}
          onFocus={() => setFocus(true)}
          placeholder={placeholder}
          style={{ ...shared, padding: "10px 14px" }}
        />
      )}

      {error && (
        <p style={{ color: T.danger, fontFamily: T.mono, fontSize: 11, margin: "5px 0 0" }}>
          {error}
        </p>
      )}
    </div>
  );
}

function PhotoField({
  dragging,
  error,
  maxSizeMb,
  onDragEnter,
  onDragLeave,
  onDrop,
  onFile,
  onRemove,
  photo,
  preview,
}: {
  dragging: boolean;
  error?: string;
  maxSizeMb: number;
  onDragEnter: (event: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onFile: (file: File) => void;
  onRemove: () => void;
  photo: File | null;
  preview: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFile(file);
    }

    event.target.value = "";
  };

  return (
    <div>
      <label
        style={{
          color: error ? T.danger : T.t3,
          display: "block",
          fontFamily: T.mono,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.12em",
          marginBottom: 6,
          textTransform: "uppercase",
        }}
      >
        Foto (opcional)
      </label>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        aria-label="Seleccionar foto"
        style={{ display: "none" }}
        onChange={handleChange}
      />

      {preview ? (
        <div style={{ background: T.greenSft, border: `1.5px solid ${T.greenMid}`, borderRadius: 10, overflow: "hidden", position: "relative" }}>
          <img src={preview} alt="preview" style={{ display: "block", maxHeight: 180, objectFit: "cover", width: "100%" }} />
          <div style={{ alignItems: "center", background: T.white, borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", padding: "7px 10px" }}>
            <div style={{ overflow: "hidden" }}>
              <div style={{ color: T.t1, fontFamily: T.mono, fontSize: 11, fontWeight: 700, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {photo?.name}
              </div>
              <div style={{ color: T.t3, fontFamily: T.mono, fontSize: 10, marginTop: 1 }}>
                {photo ? (photo.size / 1024 / 1024).toFixed(2) : "0"} MB
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                style={{ background: T.greenSft, border: `1px solid ${T.greenMid}`, borderRadius: 8, color: T.greenDark, cursor: "pointer", fontFamily: T.mono, fontSize: 11, fontWeight: 700, padding: "5px 10px" }}
              >
                Cambiar
              </button>
              <button
                type="button"
                onClick={onRemove}
                style={{ background: T.dangerSft, border: `1px solid ${T.dangerBd}`, borderRadius: 8, color: T.danger, cursor: "pointer", fontFamily: T.mono, fontSize: 11, fontWeight: 700, padding: "5px 10px" }}
              >
                Quitar
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={(event) => event.preventDefault()}
          onDrop={onDrop}
          style={{
            background: dragging ? T.greenSft : T.white,
            border: `1.5px dashed ${error ? T.dangerBd : dragging ? T.green : T.greenMid}`,
            borderRadius: 10,
            boxShadow: dragging ? `0 0 0 3px ${T.greenLight}` : "none",
            cursor: "pointer",
            padding: "22px 16px",
            textAlign: "center",
            transition: "all 0.18s",
          }}
        >
          <div style={{ fontSize: 22, marginBottom: 6 }}>📷</div>
          <div style={{ color: T.t2, fontSize: 12, fontWeight: 700 }}>Arrastra una imagen aqui</div>
          <div style={{ color: T.t3, fontSize: 11, marginTop: 3 }}>
            o <span style={{ color: T.green, fontWeight: 700 }}>haz clic para seleccionar</span>
          </div>
          <div style={{ color: T.t3, fontFamily: T.mono, fontSize: 10, marginTop: 8 }}>
            JPG · PNG · WEBP · GIF · max. {maxSizeMb} MB
          </div>
        </div>
      )}

      {error && (
        <p style={{ color: T.danger, fontFamily: T.mono, fontSize: 11, margin: "5px 0 0" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default function TicketForm({ onSubmit }: TicketFormProps) {
  const [btnHov, setBtnHov] = useState(false);
  const {
    applyFile,
    descriptionLength,
    dragging,
    errors,
    formData,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleSubmit,
    isSubmitting,
    maxSizeMb,
    photo,
    preview,
    removePhoto,
    updateField,
  } = useTicketForm(onSubmit);

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: T.white,
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        boxShadow: "0 1px 4px rgba(26,35,50,0.04)",
        fontFamily: T.sans,
        overflow: "hidden",
      }}
    >
      <div style={{ alignItems: "center", background: T.greenSft, borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", padding: "13px 18px" }}>
        <div>
          <div style={{ color: T.t1, fontSize: 13, fontWeight: 700, letterSpacing: "-0.01em" }}>
            Reportar falla
          </div>
          <div style={{ color: T.t3, fontFamily: T.mono, fontSize: 10, letterSpacing: "0.12em", marginTop: 2, textTransform: "uppercase" }}>
            Nuevo ticket de soporte
          </div>
        </div>
        <span style={{ background: T.white, border: `1px solid ${T.greenMid}`, borderRadius: 100, color: T.green, fontFamily: T.mono, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", padding: "3px 10px" }}>
          Soporte tecnico
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "18px" }}>
        <Field id="ticket-site" label="Sitio" error={errors.site} placeholder="Ej. HQ Santo Domingo" value={formData.site} onChange={updateField("site")} />
        <Field id="ticket-equipment" label="Equipo" error={errors.equipment} placeholder="Ej. Cam-03 Warehouse 1" value={formData.equipment} onChange={updateField("equipment")} />
        <Field id="ticket-description" label="Descripcion" error={errors.description} placeholder="Describe el problema detectado." value={formData.description} onChange={updateField("description")} textarea />

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -8 }}>
          <span style={{ color: descriptionLength > 450 ? T.warning : T.t3, fontFamily: T.mono, fontSize: 10 }}>
            {descriptionLength} / 500
          </span>
        </div>

        <PhotoField
          dragging={dragging}
          error={errors.photo}
          maxSizeMb={maxSizeMb}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onFile={applyFile}
          onRemove={removePhoto}
          photo={photo}
          preview={preview}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          onMouseEnter={() => setBtnHov(true)}
          onMouseLeave={() => setBtnHov(false)}
          style={{
            alignSelf: "flex-start",
            background: isSubmitting ? T.greenSft : btnHov ? T.green : T.greenSft,
            border: `1.5px solid ${isSubmitting ? T.greenMid : btnHov ? T.green : T.greenMid}`,
            borderRadius: 10,
            boxShadow: btnHov && !isSubmitting ? "0 4px 16px rgba(76,175,130,0.25)" : "none",
            color: isSubmitting ? T.t3 : btnHov ? T.white : T.greenDark,
            cursor: isSubmitting ? "not-allowed" : "pointer",
            fontFamily: T.sans,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.01em",
            padding: "11px 24px",
            transition: "all 0.18s",
          }}
        >
          {isSubmitting ? "Enviando..." : "Crear ticket ->"}
        </button>
      </div>
    </form>
  );
}
