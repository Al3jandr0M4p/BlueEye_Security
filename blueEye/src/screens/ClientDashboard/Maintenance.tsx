import { useState, type ChangeEvent, type FormEvent } from "react";
import MaintenanceHistory from "./components/MaintenanceHistory";
import { useClientMaintenance } from "./hooks/useClientMaintenance";

const T = {
  bg: "#F8FAF8",
  border: "#E2E8E4",
  green: "#4CAF82",
  greenDark: "#2E8B5E",
  greenLight: "#C8EDD9",
  greenMid: "#A8DBBE",
  greenSft: "#EAF7F1",
  mono: "'JetBrains Mono', 'Fira Mono', monospace",
  sans: "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
  t1: "#1A2332",
  t3: "#9AA3B2",
  white: "#FFFFFF",
} as const;

function DateInput({
  id,
  label,
  onChange,
  value,
}: {
  id: string;
  label: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
}) {
  const [focus, setFocus] = useState(false);

  return (
    <div>
      <label htmlFor={id} style={{ color: T.t3, display: "block", fontFamily: T.mono, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", marginBottom: 6, textTransform: "uppercase" }}>{label}</label>
      <input
        id={id}
        type="date"
        value={value}
        onBlur={() => setFocus(false)}
        onChange={onChange}
        onFocus={() => setFocus(true)}
        style={{ background: focus ? T.greenSft : T.white, border: `1.5px solid ${focus ? T.greenMid : T.border}`, borderRadius: 10, boxShadow: focus ? `0 0 0 3px ${T.greenLight}` : "none", color: value ? T.t1 : T.t3, colorScheme: "light", fontFamily: T.mono, fontSize: 12, outline: "none", padding: "9px 14px", transition: "all 0.18s" }}
      />
    </div>
  );
}

const Maintenance = () => {
  const {
    applyFilter,
    fromDate,
    integrationNote,
    records,
    setFromDate,
    setToDate,
    toDate,
  } = useClientMaintenance();
  const [buttonHovered, setButtonHovered] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void applyFilter();
  };

  return (
    <section style={{ background: T.bg, display: "flex", flexDirection: "column", fontFamily: T.sans, gap: 20, minHeight: "100vh", padding: "24px 28px 56px" }}>
      <header>
        <div style={{ color: T.green, fontFamily: T.mono, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", marginBottom: 6, textTransform: "uppercase" }}>Portal del cliente · Tecnico</div>
        <h1 style={{ color: T.t1, fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15, margin: 0 }}>Historial de mantenimiento</h1>
        <p style={{ color: T.t3, fontSize: 13, fontWeight: 500, margin: "5px 0 0" }}>Seguimiento de intervenciones tecnicas realizadas.</p>
      </header>

      <div style={{ background: T.white, border: `1px solid ${T.greenMid}`, borderRadius: 12, color: T.t3, fontSize: 12, lineHeight: 1.6, padding: "14px 16px" }}>
        {integrationNote}
      </div>

      <form onSubmit={handleSubmit} style={{ alignItems: "flex-end", background: T.white, border: `1px solid ${T.border}`, borderRadius: 14, boxShadow: "0 1px 4px rgba(26,35,50,0.04)", display: "flex", flexWrap: "wrap", gap: 16, padding: "16px 20px" }}>
        <DateInput id="from-date" label="Desde" onChange={(event) => setFromDate(event.target.value)} value={fromDate} />
        <DateInput id="to-date" label="Hasta" onChange={(event) => setToDate(event.target.value)} value={toDate} />
        <button type="submit" onMouseEnter={() => setButtonHovered(true)} onMouseLeave={() => setButtonHovered(false)} style={{ alignSelf: "flex-end", background: buttonHovered ? T.green : T.greenSft, border: `1.5px solid ${buttonHovered ? T.green : T.greenMid}`, borderRadius: 10, boxShadow: buttonHovered ? "0 4px 16px rgba(76,175,130,0.25)" : "none", color: buttonHovered ? T.white : T.greenDark, cursor: "pointer", fontFamily: T.mono, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", padding: "9px 24px", transition: "all 0.18s" }}>Filtrar</button>
      </form>

      <MaintenanceHistory records={records} />
    </section>
  );
};

export default Maintenance;
