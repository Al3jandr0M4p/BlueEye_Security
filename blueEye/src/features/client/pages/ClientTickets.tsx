import { useCallback, useEffect, useState } from "react";
import TicketForm from "../components/TicketForm";
import { clientService } from "../services/client.service";
import type { NewTicketInput, Ticket } from "../types/client.types";

const C = {
  bgCard:    "#0f172a",
  bgCardEnd: "#1e293b",
  primary:      "#22d3ee",
  primaryBg:    "rgba(34,211,238,0.07)",
  primaryBd:    "rgba(34,211,238,0.16)",
  warning:   "#fbbf24",
  warningBg: "rgba(251,191,36,0.08)",
  warningBd: "rgba(251,191,36,0.22)",
  info:    "#0ea5e9",
  infoBg:  "rgba(14,165,233,0.08)",
  infoBd:  "rgba(14,165,233,0.22)",
  success:    "#22c55e",
  successBg:  "rgba(34,197,94,0.08)",
  successBd:  "rgba(34,197,94,0.22)",
  textPrimary:   "#f1f5f9",
  textSecondary: "#e2e8f0",
  textBody:      "#cbd5e1",
  textMuted:     "#94a3b8",
  textSubtle:    "#64748b",
  border:      "rgba(255,255,255,0.06)",
  borderCard:  "rgba(34,211,238,0.1)",
  f: "'Geist','Inter',-apple-system,sans-serif",
  m: "'Geist Mono','JetBrains Mono',ui-monospace,monospace",
} as const;

const STATUS_CFG = {
  open:        { label: "abierto",     color: C.info,    bg: C.infoBg,    bd: C.infoBd    },
  in_progress: { label: "en progreso", color: C.warning, bg: C.warningBg, bd: C.warningBd },
  resolved:    { label: "resuelto",    color: C.success, bg: C.successBg, bd: C.successBd },
} satisfies Record<Ticket["status"], object>;

function Tag({ bg, color, bd, children }: { bg: string; color: string; bd: string; children: React.ReactNode }) {
  return (
    <span style={{
      fontSize: 9, fontFamily: C.m, letterSpacing: "0.1em", fontWeight: 600,
      padding: "3px 9px", borderRadius: 5,
      background: bg, color, border: `1px solid ${bd}`,
      whiteSpace: "nowrap", lineHeight: 1, flexShrink: 0,
    }}>
      {children}
    </span>
  );
}

const ClientTickets = () => {
  const [tickets,   setTickets]   = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hovRow,    setHovRow]    = useState<string | null>(null);

  const loadTickets = useCallback(async () => {
    const data = await clientService.getTickets();
    setTickets(data);
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await loadTickets();
      setIsLoading(false);
    };
    void load();
  }, [loadTickets]);

  const createTicket = async (input: NewTicketInput) => {
    await clientService.createTicket(input);
    await loadTickets();
  };

  return (
    <section style={{
      padding: "24px 28px 56px",
      display: "grid",
      gridTemplateColumns: "minmax(320px, 420px) 1fr",
      gap: 20,
      alignItems: "start",
      fontFamily: C.f,
    }}>

      <TicketForm onSubmit={createTicket} />

      {/* ── Ticket history panel ── */}
      <article style={{
        background:   `linear-gradient(135deg, ${C.bgCard} 0%, ${C.bgCardEnd} 100%)`,
        border:       `1px solid ${C.borderCard}`,
        borderRadius: 12,
        overflow:     "hidden",
      }}>
        {/* Panel header */}
        <div style={{
          padding: "12px 18px",
          borderBottom: `1px solid ${C.border}`,
          background: "rgba(6,13,26,0.4)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, letterSpacing: "-0.01em" }}>
              Historial de tickets
            </div>
            <div style={{ fontSize: 9, fontFamily: C.m, letterSpacing: "0.12em", textTransform: "uppercase", color: C.textSubtle, marginTop: 2 }}>
              Solicitudes de soporte
            </div>
          </div>
          <Tag bg={C.primaryBg} color={C.primary} bd={C.primaryBd}>
            {tickets.length} tickets
          </Tag>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div style={{ padding: "40px 0", textAlign: "center", fontSize: 12, color: C.textSubtle, fontFamily: C.m }}>
            Cargando tickets...
          </div>
        )}

        {/* Empty state */}
        {!isLoading && tickets.length === 0 && (
          <div style={{ padding: "40px 0", textAlign: "center", fontSize: 12, color: C.textSubtle }}>
            ✓ No hay tickets registrados.
          </div>
        )}

        {/* Ticket list */}
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {tickets.map((ticket, i) => {
            const cfg    = STATUS_CFG[ticket.status];
            const isHov  = hovRow === ticket.id;
            const isLast = i === tickets.length - 1;

            return (
              <li
                key={ticket.id}
                onMouseEnter={() => setHovRow(ticket.id)}
                onMouseLeave={() => setHovRow(null)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "3px 1fr auto",
                  gap: 14, alignItems: "start",
                  padding: "12px 18px",
                  borderBottom: isLast ? "none" : `1px solid ${C.border}`,
                  background: isHov ? "rgba(255,255,255,0.02)" : "transparent",
                  cursor: "default",
                  transition: "background 0.15s",
                }}
              >
                {/* Status bar */}
                <div style={{
                  width: 3, borderRadius: 2, minHeight: 36, marginTop: 3,
                  background: cfg.color,
                  boxShadow: `0 0 8px ${cfg.color}55`,
                }} />

                {/* Content */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.textPrimary, fontFamily: C.m }}>
                      {ticket.id}
                    </span>
                    <span style={{ fontSize: 11, color: C.textSubtle }}>{ticket.site}</span>
                  </div>
                  <div style={{ fontSize: 11, color: C.textBody, marginBottom: 3 }}>
                    <span style={{ color: C.textMuted, fontWeight: 500 }}>Equipo: </span>
                    {ticket.equipment}
                  </div>
                  <div style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.55 }}>
                    {ticket.description}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 9, fontFamily: C.m, color: C.textSubtle, letterSpacing: "0.06em" }}>
                    {new Date(ticket.createdAt).toLocaleString()}
                  </div>
                </div>

                {/* Status tag */}
                <Tag bg={cfg.bg} color={cfg.color} bd={cfg.bd}>
                  {cfg.label}
                </Tag>
              </li>
            );
          })}
        </ul>
      </article>

    </section>
  );
};

export default ClientTickets;