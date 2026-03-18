import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import MaintenanceHistory from "../components/MaintenanceHistory";
import { clientService } from "../services/client.service";
import type { MaintenanceRecord } from "../types/client.types";

const C = {
  bgCard:    "#0f172a",
  bgCardEnd: "#1e293b",
  primary:      "#22d3ee",
  primaryBg:    "rgba(34,211,238,0.07)",
  primaryBg2:   "rgba(34,211,238,0.15)",
  primaryBd:    "rgba(34,211,238,0.16)",
  primaryBd2:   "rgba(34,211,238,0.35)",
  textPrimary:   "#f1f5f9",
  textSecondary: "#e2e8f0",
  textSubtle:    "#64748b",
  inputBg:     "rgba(255,255,255,0.04)",
  inputBd:     "rgba(255,255,255,0.09)",
  border:      "rgba(255,255,255,0.06)",
  borderCard:  "rgba(34,211,238,0.1)",
  f: "'Geist','Inter',-apple-system,sans-serif",
  m: "'Geist Mono','JetBrains Mono',ui-monospace,monospace",
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
        fontSize: 9, fontFamily: C.m, letterSpacing: "0.12em",
        textTransform: "uppercase", color: C.textSubtle, fontWeight: 600,
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
          padding: "9px 14px", borderRadius: 8,
          background: focus ? "rgba(34,211,238,0.05)" : C.inputBg,
          border: `1px solid ${focus ? C.primaryBd2 : C.inputBd}`,
          color: value ? C.textSecondary : C.textSubtle,
          fontSize: 12, fontFamily: C.m,
          outline: "none",
          transition: "all 0.18s",
          boxShadow: focus ? "0 0 0 3px rgba(34,211,238,0.07)" : "none",
          colorScheme: "dark",
        }}
      />
    </div>
  );
}

const ClientMaintenance = () => {
  const [records,   setRecords]   = useState<MaintenanceRecord[]>([]);
  const [fromDate,  setFromDate]  = useState("");
  const [toDate,    setToDate]    = useState("");
  const [btnHov,    setBtnHov]    = useState(false);

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
    <section style={{ padding: "24px 28px 56px", display: "flex", flexDirection: "column", gap: 20, fontFamily: C.f }}>

      {/* ── Page header ── */}
      <header>
        <div style={{ fontSize: 10, fontFamily: C.m, letterSpacing: "0.18em", textTransform: "uppercase", color: C.primary, marginBottom: 6, opacity: 0.8 }}>
          Portal del cliente · Técnico
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: C.textPrimary, letterSpacing: "-0.02em", margin: 0, lineHeight: 1.15 }}>
          Historial de mantenimiento
        </h1>
        <p style={{ fontSize: 12, color: C.textSubtle, margin: "5px 0 0" }}>
          Seguimiento de intervenciones técnicas realizadas.
        </p>
      </header>

      {/* ── Date filter ── */}
      <form
        onSubmit={applyFilter}
        style={{
          background:   `linear-gradient(135deg, ${C.bgCard} 0%, ${C.bgCardEnd} 100%)`,
          border:       `1px solid ${C.borderCard}`,
          borderRadius: 12,
          padding:      "16px 20px",
          display:      "flex",
          flexWrap:     "wrap",
          alignItems:   "flex-end",
          gap:          16,
        }}
      >
        <DateInput
          id="from-date"
          label="Desde"
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
        />
        <DateInput
          id="to-date"
          label="Hasta"
          value={toDate}
          onChange={e => setToDate(e.target.value)}
        />
        <button
          type="submit"
          onMouseEnter={() => setBtnHov(true)}
          onMouseLeave={() => setBtnHov(false)}
          style={{
            padding: "9px 22px", borderRadius: 8,
            background: btnHov ? C.primaryBg2 : C.primaryBg,
            border: `1px solid ${btnHov ? C.primaryBd2 : C.primaryBd}`,
            color: C.primary, fontSize: 12, fontFamily: C.m,
            fontWeight: 600, letterSpacing: "0.08em",
            cursor: "pointer", transition: "all 0.18s",
            alignSelf: "flex-end",
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