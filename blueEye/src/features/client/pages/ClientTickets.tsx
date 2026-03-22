import { useCallback, useEffect, useState } from "react";
import TicketForm from "../components/TicketForm";
import { clientService } from "../services/client.service";
import type { NewTicketInput, Ticket } from "../types/client.types";

// ─── BlueEye Landing tokens ───────────────────────────────────────────────────
const T = {
  bg:         "#F8FAF8",
  white:      "#FFFFFF",
  green:      "#4CAF82",
  greenDark:  "#2E8B5E",
  greenSft:   "#EAF7F1",
  greenMid:   "#A8DBBE",
  warning:    "#D48A20",
  warningSft: "rgba(212,138,32,0.08)",
  warningBd:  "rgba(212,138,32,0.30)",
  info:       "#5A9EC8",
  infoSft:    "rgba(90,158,200,0.10)",
  infoBd:     "rgba(90,158,200,0.30)",
  t1:         "#1A2332",
  t2:         "#4A5568",
  t3:         "#9AA3B2",
  border:     "#E2E8E4",
  sans:       "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
  mono:       "'JetBrains Mono', 'Fira Mono', monospace",
} as const;

const STATUS_CFG = {
  open:        { label: "abierto",     color: T.info,    bg: T.infoSft,    bd: T.infoBd    },
  in_progress: { label: "en progreso", color: T.warning, bg: T.warningSft, bd: T.warningBd },
  resolved:    { label: "resuelto",    color: T.green,   bg: T.greenSft,   bd: T.greenMid  },
} satisfies Record<Ticket["status"], object>;

function Tag({ bg, color, bd, children }: { bg: string; color: string; bd: string; children: React.ReactNode }) {
  return (
    <span style={{
      fontSize: 10, fontFamily: T.mono, letterSpacing: "0.08em", fontWeight: 700,
      padding: "3px 10px", borderRadius: 100,
      background: bg, color, border: `1px solid ${bd}`,
      whiteSpace: "nowrap" as const, lineHeight: 1, flexShrink: 0,
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

  // ── Photo is passed as a separate File arg; attach to FormData if your
  //    backend supports multipart, or upload separately and attach the URL.
  const createTicket = async (input: NewTicketInput, photo?: File) => {
    if (photo) {
      const formData = new FormData();
      formData.append("site",        input.site);
      formData.append("equipment",   input.equipment);
      formData.append("description", input.description);
      formData.append("photo",       photo, photo.name);
      await clientService.createTicketWithPhoto(formData);
    } else {
      await clientService.createTicket(input);
    }
    await loadTickets();
  };

  return (
    <section style={{
      padding: "24px 28px 56px",
      display: "grid",
      gridTemplateColumns: "minmax(320px, 420px) 1fr",
      gap: 20,
      alignItems: "start",
      fontFamily: T.sans,
      background: T.bg,
      minHeight: "100vh",
    }}>

      <TicketForm onSubmit={createTicket} />

      {/* Ticket history panel */}
      <article style={{
        background:   T.white,
        border:       `1px solid ${T.border}`,
        borderRadius: 14,
        overflow:     "hidden",
        boxShadow:    "0 1px 4px rgba(26,35,50,0.04)",
      }}>
        {/* Panel header */}
        <div style={{
          padding: "13px 18px",
          borderBottom: `1px solid ${T.border}`,
          background: T.greenSft,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.t1, letterSpacing: "-0.01em" }}>
              Historial de tickets
            </div>
            <div style={{
              fontSize: 10, fontFamily: T.mono, letterSpacing: "0.12em",
              textTransform: "uppercase" as const, color: T.t3, marginTop: 2,
            }}>
              Solicitudes de soporte
            </div>
          </div>
          <Tag bg={T.white} color={T.green} bd={T.greenMid}>{tickets.length} tickets</Tag>
        </div>

        {/* Loading */}
        {isLoading && (
          <div style={{ padding: "40px 0", textAlign: "center" as const, fontSize: 12, color: T.t3, fontFamily: T.mono }}>
            Cargando tickets...
          </div>
        )}

        {/* Empty */}
        {!isLoading && tickets.length === 0 && (
          <div style={{ padding: "40px 0", textAlign: "center" as const, fontSize: 12, color: T.t3 }}>
            ✓ No hay tickets registrados.
          </div>
        )}

        {/* List */}
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {tickets.map((ticket, i) => {
            const cfg   = STATUS_CFG[ticket.status];
            const isHov = hovRow === ticket.id;

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
                  borderBottom: i < tickets.length - 1 ? `1px solid ${T.border}` : "none",
                  background: isHov ? T.greenSft : T.white,
                  cursor: "default",
                  transition: "background 0.15s",
                }}
              >
                {/* Status bar */}
                <div style={{
                  width: 3, borderRadius: 2, minHeight: 36, marginTop: 3,
                  background: cfg.color,
                }} />

                {/* Content */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: T.t1, fontFamily: T.mono }}>{ticket.id}</span>
                    <span style={{ fontSize: 11, color: T.t3 }}>{ticket.site}</span>
                  </div>
                  <div style={{ fontSize: 11, color: T.t2, marginBottom: 3 }}>
                    <span style={{ color: T.t3, fontWeight: 600 }}>Equipo: </span>{ticket.equipment}
                  </div>
                  <div style={{ fontSize: 11, color: T.t2, lineHeight: 1.55 }}>{ticket.description}</div>
                  {/* Show thumbnail if ticket has a photo URL */}
                  {ticket.photoUrl && (
                    <a href={ticket.photoUrl} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 6 }}>
                      <img
                        src={ticket.photoUrl}
                        alt="evidencia"
                        style={{
                          height: 52, width: 72, objectFit: "cover",
                          borderRadius: 6, border: `1px solid ${T.border}`,
                          display: "block",
                        }}
                      />
                    </a>
                  )}
                  <div style={{ marginTop: 6, fontSize: 10, fontFamily: T.mono, color: T.t3, letterSpacing: "0.04em" }}>
                    {new Date(ticket.createdAt).toLocaleString()}
                  </div>
                </div>

                {/* Status tag */}
                <Tag bg={cfg.bg} color={cfg.color} bd={cfg.bd}>{cfg.label}</Tag>
              </li>
            );
          })}
        </ul>
      </article>

    </section>
  );
};

export default ClientTickets;