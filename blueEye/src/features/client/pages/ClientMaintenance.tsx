import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import MaintenanceHistory from "../components/MaintenanceHistory";
import { clientService } from "../services/client.service";
import type { MaintenanceRecord } from "../types/client.types";

// ─── BlueEye Landing tokens ───────────────────────────────────────────────────
const T = {
  bg:         "#F8FAF8",
  white:      "#FFFFFF",
  green:      "#4CAF82",
  greenDark:  "#2E8B5E",
  greenSft:   "#EAF7F1",
  greenMid:   "#A8DBBE",
  greenLight: "#C8EDD9",
  t1:         "#1A2332",
  t2:         "#4A5568",
  t3:         "#9AA3B2",
  border:     "#E2E8E4",
  sans:       "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
  mono:       "'JetBrains Mono', 'Fira Mono', monospace",
} as const;

function DateInput({ id, label, value, onChange }: {
  id: string; label: string; value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  const [focus, setFocus] = useState(false);
  return (
    <div>
      <label htmlFor={id} style={{
        display: "block", marginBottom: 6,
        fontSize: 10, fontFamily: T.mono, letterSpacing: "0.12em",
        textTransform: "uppercase" as const,
        color: T.t3, fontWeight: 700,
      }}>
        {label}
      </label>
      <input
        id={id}
        type="date"
        value={value}
        onChange={onChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          padding: "9px 14px", borderRadius: 10,
          background: focus ? T.greenSft : T.white,
          border: `1.5px solid ${focus ? T.greenMid : T.border}`,
          color: value ? T.t1 : T.t3,
          fontSize: 12, fontFamily: T.mono,
          outline: "none",
          transition: "all 0.18s",
          boxShadow: focus ? `0 0 0 3px ${T.greenLight}` : "none",
          colorScheme: "light",
        }}
      />
    </div>
  );
}

const ClientMaintenance = () => {
  const [records,  setRecords]  = useState<MaintenanceRecord[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate,   setToDate]   = useState("");
  const [btnHov,   setBtnHov]   = useState(false);

  const loadHistory = useCallback(async (from?: string, to?: string) => {
    const data = await clientService.getMaintenanceHistory(from, to);
    setRecords(data);
  }, []);

  useEffect(() => {
    const init = async () => { await loadHistory(); };
    void init();
  }, [loadHistory]);

  const applyFilter = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await loadHistory(fromDate || undefined, toDate || undefined);
  };

  return (
    <section style={{
      padding: "24px 28px 56px",
      display: "flex", flexDirection: "column", gap: 20,
      fontFamily: T.sans,
      background: T.bg,
      minHeight: "100vh",
    }}>

      {/* Header */}
      <header>
        <div style={{
          fontSize: 10, fontFamily: T.mono, letterSpacing: "0.18em",
          textTransform: "uppercase" as const,
          color: T.green, marginBottom: 6, fontWeight: 700,
        }}>
          Portal del cliente · Técnico
        </div>
        <h1 style={{
          fontSize: 24, fontWeight: 800, color: T.t1,
          letterSpacing: "-0.03em", margin: 0, lineHeight: 1.15,
        }}>
          Historial de mantenimiento
        </h1>
        <p style={{ fontSize: 13, color: T.t3, margin: "5px 0 0", fontWeight: 500 }}>
          Seguimiento de intervenciones técnicas realizadas.
        </p>
      </header>

      {/* Date filter */}
      <form
        onSubmit={applyFilter}
        style={{
          background:   T.white,
          border:       `1px solid ${T.border}`,
          borderRadius: 14,
          padding:      "16px 20px",
          display:      "flex",
          flexWrap:     "wrap" as const,
          alignItems:   "flex-end",
          gap:          16,
          boxShadow:    "0 1px 4px rgba(26,35,50,0.04)",
        }}
      >
        <DateInput id="from-date" label="Desde" value={fromDate} onChange={e => setFromDate(e.target.value)} />
        <DateInput id="to-date"   label="Hasta" value={toDate}   onChange={e => setToDate(e.target.value)}   />
        <button
          type="submit"
          onMouseEnter={() => setBtnHov(true)}
          onMouseLeave={() => setBtnHov(false)}
          style={{
            padding: "9px 24px", borderRadius: 10,
            background: btnHov ? T.green : T.greenSft,
            border: `1.5px solid ${btnHov ? T.green : T.greenMid}`,
            color: btnHov ? T.white : T.greenDark,
            fontSize: 12, fontFamily: T.mono,
            fontWeight: 700, letterSpacing: "0.08em",
            cursor: "pointer", transition: "all 0.18s",
            alignSelf: "flex-end",
            boxShadow: btnHov ? "0 4px 16px rgba(76,175,130,0.25)" : "none",
          }}
        >
          Filtrar
        </button>
      </form>

      <MaintenanceHistory records={records} />

    </section>
  );
};

export default ClientMaintenance;