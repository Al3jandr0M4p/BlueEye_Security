import { useState, useRef, type ChangeEvent, type FormEvent, type DragEvent } from "react";
import type { NewTicketInput } from "../types/client.types";

// ─── BlueEye Landing tokens ───────────────────────────────────────────────────
const T = {
  white:      "#FFFFFF",
  green:      "#4CAF82",
  greenDark:  "#2E8B5E",
  greenSft:   "#EAF7F1",
  greenMid:   "#A8DBBE",
  greenLight: "#C8EDD9",
  warning:    "#D48A20",
  danger:     "#E05252",
  dangerSft:  "rgba(224,82,82,0.08)",
  dangerBd:   "rgba(224,82,82,0.30)",
  t1:         "#1A2332",
  t2:         "#4A5568",
  t3:         "#9AA3B2",
  border:     "#E2E8E4",
  sans:       "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
  mono:       "'JetBrains Mono', 'Fira Mono', monospace",
} as const;

interface TicketFormProps {
  onSubmit: (input: NewTicketInput, photo?: File) => Promise<void>;
}

interface FormErrors {
  site?:        string;
  equipment?:   string;
  description?: string;
  photo?:       string;
}

const initialState: NewTicketInput = { site: "", equipment: "", description: "" };

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_MB    = 5;

function Field({
  id, label, error, placeholder, value, onChange, textarea,
}: {
  id: string; label: string; error?: string; placeholder: string;
  value: string; onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  textarea?: boolean;
}) {
  const [focus, setFocus] = useState(false);

  const shared: React.CSSProperties = {
    width:        "100%",
    borderRadius: 10,
    background:   focus ? T.greenSft : T.white,
    border:       `1.5px solid ${error ? T.dangerBd : focus ? T.greenMid : T.border}`,
    color:        T.t1,
    fontSize:     13,
    fontFamily:   T.sans,
    outline:      "none",
    transition:   "all 0.18s",
    boxSizing:    "border-box",
    boxShadow:    focus ? `0 0 0 3px ${T.greenLight}` : "none",
  };

  return (
    <div>
      <label htmlFor={id} style={{
        display:       "block",
        marginBottom:  6,
        fontSize:      10,
        fontFamily:    T.mono,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color:         error ? T.danger : T.t3,
        fontWeight:    700,
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
        <p style={{ marginTop: 5, fontSize: 11, color: T.danger, fontFamily: T.mono, margin: "5px 0 0" }}>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Photo upload field ────────────────────────────────────────────────────────
function PhotoField({
  photo,
  preview,
  error,
  dragging,
  onFile,
  onRemove,
  onDragEnter,
  onDragLeave,
  onDrop,
}: {
  photo:       File | null;
  preview:     string | null;
  error?:      string;
  dragging:    boolean;
  onFile:      (file: File) => void;
  onRemove:    () => void;
  onDragEnter: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
  onDrop:      (e: DragEvent<HTMLDivElement>) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
    // reset input so same file can be re-selected after removal
    e.target.value = "";
  };

  return (
    <div>
      <label style={{
        display:       "block",
        marginBottom:  6,
        fontSize:      10,
        fontFamily:    T.mono,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color:         error ? T.danger : T.t3,
        fontWeight:    700,
      }}>
        Foto (opcional)
      </label>

      {/* Hidden file input — aria-label satisfies axe/forms accessibility rule */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        aria-label="Seleccionar foto"
        style={{ display: "none" }}
        onChange={handleChange}
      />

      {preview ? (
        /* ── Preview card ── */
        <div style={{
          position:     "relative",
          borderRadius: 10,
          overflow:     "hidden",
          border:       `1.5px solid ${T.greenMid}`,
          background:   T.greenSft,
        }}>
          <img
            src={preview}
            alt="preview"
            style={{ width: "100%", maxHeight: 180, objectFit: "cover", display: "block" }}
          />
          {/* Overlay with file info + remove button */}
          <div style={{
            padding:         "7px 10px",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "space-between",
            background:      T.white,
            borderTop:       `1px solid ${T.border}`,
          }}>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.t1, fontFamily: T.mono, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 200 }}>
                {photo?.name}
              </div>
              <div style={{ fontSize: 10, color: T.t3, fontFamily: T.mono, marginTop: 1 }}>
                {photo ? (photo.size / 1024 / 1024).toFixed(2) : "0"} MB
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                style={{
                  padding: "5px 10px", borderRadius: 8, fontSize: 11, fontFamily: T.mono,
                  background: T.greenSft, border: `1px solid ${T.greenMid}`, color: T.greenDark,
                  cursor: "pointer", fontWeight: 700,
                }}
              >
                Cambiar
              </button>
              <button
                type="button"
                onClick={onRemove}
                style={{
                  padding: "5px 10px", borderRadius: 8, fontSize: 11, fontFamily: T.mono,
                  background: T.dangerSft, border: `1px solid ${T.dangerBd}`, color: T.danger,
                  cursor: "pointer", fontWeight: 700,
                }}
              >
                Quitar
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ── Drop zone ── */
        <div
          onDragEnter={onDragEnter}
          onDragOver={e => e.preventDefault()}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            borderRadius:   10,
            border:         `1.5px dashed ${error ? T.dangerBd : dragging ? T.green : T.greenMid}`,
            background:     dragging ? T.greenSft : T.white,
            padding:        "22px 16px",
            textAlign:      "center",
            cursor:         "pointer",
            transition:     "all 0.18s",
            boxShadow:      dragging ? `0 0 0 3px ${T.greenLight}` : "none",
          }}
        >
          <div style={{ fontSize: 22, marginBottom: 6 }}>📷</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.t2 }}>
            Arrastra una imagen aquí
          </div>
          <div style={{ fontSize: 11, color: T.t3, marginTop: 3 }}>
            o <span style={{ color: T.green, fontWeight: 700 }}>haz clic para seleccionar</span>
          </div>
          <div style={{ marginTop: 8, fontSize: 10, fontFamily: T.mono, color: T.t3 }}>
            JPG · PNG · WEBP · GIF &nbsp;·&nbsp; máx. {MAX_SIZE_MB} MB
          </div>
        </div>
      )}

      {error && (
        <p style={{ marginTop: 5, fontSize: 11, color: T.danger, fontFamily: T.mono, margin: "5px 0 0" }}>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────
export default function TicketForm({ onSubmit }: TicketFormProps) {
  const [formData,     setFormData]     = useState<NewTicketInput>(initialState);
  const [errors,       setErrors]       = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [btnHov,       setBtnHov]       = useState(false);

  // photo state
  const [photo,    setPhoto]    = useState<File | null>(null);
  const [preview,  setPreview]  = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const applyFile = (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrors(prev => ({ ...prev, photo: "Formato no soportado. Usa JPG, PNG, WEBP o GIF." }));
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrors(prev => ({ ...prev, photo: `La imagen no puede superar ${MAX_SIZE_MB} MB.` }));
      return;
    }
    setErrors(prev => ({ ...prev, photo: undefined }));
    setPhoto(file);
    const url = URL.createObjectURL(file);
    setPreview(prev => { if (prev) URL.revokeObjectURL(prev); return url; });
  };

  const removePhoto = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPhoto(null);
    setPreview(null);
    setErrors(prev => ({ ...prev, photo: undefined }));
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragging(false); };
  const handleDrop      = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) applyFile(file);
  };

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
      await onSubmit(formData, photo ?? undefined);
      setFormData(initialState);
      setErrors({});
      removePhoto();
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
        background:   T.white,
        border:       `1px solid ${T.border}`,
        borderRadius: 14,
        overflow:     "hidden",
        fontFamily:   T.sans,
        boxShadow:    "0 1px 4px rgba(26,35,50,0.04)",
      }}
    >
      {/* Panel header */}
      <div style={{
        padding:        "13px 18px",
        borderBottom:   `1px solid ${T.border}`,
        background:     T.greenSft,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.t1, letterSpacing: "-0.01em" }}>
            Reportar falla
          </div>
          <div style={{
            fontSize: 10, fontFamily: T.mono, letterSpacing: "0.12em",
            textTransform: "uppercase", color: T.t3, marginTop: 2,
          }}>
            Nuevo ticket de soporte
          </div>
        </div>
        <span style={{
          fontSize:      10,
          fontFamily:    T.mono,
          letterSpacing: "0.08em",
          fontWeight:    700,
          padding:       "3px 10px",
          borderRadius:  100,
          background:    T.white,
          color:         T.green,
          border:        `1px solid ${T.greenMid}`,
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
            fontSize:  10,
            fontFamily: T.mono,
            color: formData.description.length > 450 ? T.warning : T.t3,
          }}>
            {formData.description.length} / 500
          </span>
        </div>

        {/* Photo upload */}
        <PhotoField
          photo={photo}
          preview={preview}
          error={errors.photo}
          dragging={dragging}
          onFile={applyFile}
          onRemove={removePhoto}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          onMouseEnter={() => setBtnHov(true)}
          onMouseLeave={() => setBtnHov(false)}
          style={{
            padding:       "11px 24px",
            borderRadius:  10,
            background:    isSubmitting ? T.greenSft : btnHov ? T.green    : T.greenSft,
            border:        `1.5px solid ${isSubmitting ? T.greenMid : btnHov ? T.green : T.greenMid}`,
            color:         isSubmitting ? T.t3        : btnHov ? T.white   : T.greenDark,
            fontSize:      13,
            fontFamily:    T.sans,
            fontWeight:    700,
            letterSpacing: "0.01em",
            cursor:        isSubmitting ? "not-allowed" : "pointer",
            transition:    "all 0.18s",
            alignSelf:     "flex-start",
            boxShadow:     btnHov && !isSubmitting ? "0 4px 16px rgba(76,175,130,0.25)" : "none",
          }}
        >
          {isSubmitting ? "Enviando..." : "Crear ticket →"}
        </button>
      </div>
    </form>
  );
}