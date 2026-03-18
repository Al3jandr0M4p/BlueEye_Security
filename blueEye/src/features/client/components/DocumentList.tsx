import { useState } from "react";
import type { ClientDocument } from "../types/client.types";
import { clientService } from "../services/client.service";

const C = {
  bgCard:    "#0f172a",
  bgCardEnd: "#1e293b",
  bgBase:    "#060d1a",
  primary:      "#22d3ee",
  primaryBg:    "rgba(34,211,238,0.07)",
  primaryBg2:   "rgba(34,211,238,0.12)",
  primaryBd:    "rgba(34,211,238,0.16)",
  primaryBd2:   "rgba(34,211,238,0.28)",
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

interface DocumentListProps {
  documents:  ClientDocument[];
  onDownload: (documentId: string) => void;
}

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

function DocRow({ document, onDownload, last }: { document: ClientDocument; onDownload: () => void; last: boolean }) {
  const [hov, setHov] = useState(false);
  const [btnHov, setBtnHov] = useState(false);

  return (
    <li
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", flexWrap: "wrap", alignItems: "center",
        justifyContent: "space-between", gap: 10,
        padding: "10px 14px",
        borderBottom: last ? "none" : `1px solid ${C.border}`,
        background: hov ? "rgba(255,255,255,0.02)" : "transparent",
        transition: "background 0.15s",
        cursor: "default",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: C.textSecondary, marginBottom: 2 }}>
          {document.name}
        </div>
        <div style={{ fontSize: 9, fontFamily: C.m, color: C.textSubtle }}>
          {clientService.getDocumentTypeLabel(document.type)}
        </div>
      </div>
      <button
        type="button"
        onClick={onDownload}
        onMouseEnter={() => setBtnHov(true)}
        onMouseLeave={() => setBtnHov(false)}
        style={{
          padding: "4px 12px", borderRadius: 6,
          background: btnHov ? C.primaryBg2 : C.primaryBg,
          border: `1px solid ${btnHov ? C.primaryBd2 : C.primaryBd}`,
          color: C.primary, fontSize: 10, fontFamily: C.m,
          fontWeight: 600, letterSpacing: "0.06em",
          cursor: "pointer", transition: "all 0.15s", flexShrink: 0,
        }}
      >
        Descargar
      </button>
    </li>
  );
}

export default function DocumentList({ documents, onDownload }: DocumentListProps) {
  const grouped = documents.reduce<Record<string, ClientDocument[]>>((acc, doc) => {
    const g = acc[doc.site] ?? [];
    g.push(doc);
    acc[doc.site] = g;
    return acc;
  }, {});

  const entries = Object.entries(grouped);

  return (
    <section style={{
      background:   `linear-gradient(135deg, ${C.bgCard} 0%, ${C.bgCardEnd} 100%)`,
      border:       `1px solid ${C.borderCard}`,
      borderRadius: 12,
      overflow:     "hidden",
      fontFamily:   C.f,
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
            Documentos por sitio
          </div>
          <div style={{ fontSize: 9, fontFamily: C.m, letterSpacing: "0.12em", textTransform: "uppercase", color: C.textSubtle, marginTop: 2 }}>
            Archivos y contratos
          </div>
        </div>
        <Tag bg={C.primaryBg} color={C.primary} bd={C.primaryBd}>{documents.length} archivos</Tag>
      </div>

      {/* Site groups */}
      <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
        {entries.map(([site, siteDocs]) => (
          <div key={site} style={{
            background: "rgba(255,255,255,0.025)",
            border: `1px solid ${C.border}`,
            borderRadius: 10, overflow: "hidden",
          }}>
            {/* Site header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "8px 14px",
              background: "rgba(34,211,238,0.04)",
              borderBottom: `1px solid ${C.border}`,
            }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.primary, letterSpacing: "0.02em" }}>
                {site}
              </span>
              <span style={{ fontSize: 9, fontFamily: C.m, color: C.textSubtle }}>
                {siteDocs.length} {siteDocs.length === 1 ? "archivo" : "archivos"}
              </span>
            </div>

            {/* Doc rows */}
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {siteDocs.map((doc, i) => (
                <DocRow
                  key={doc.id}
                  document={doc}
                  onDownload={() => onDownload(doc.id)}
                  last={i === siteDocs.length - 1}
                />
              ))}
            </ul>
          </div>
        ))}

        {entries.length === 0 && (
          <div style={{ padding: "40px 0", textAlign: "center", color: C.textSubtle, fontSize: 12 }}>
            Sin documentos disponibles
          </div>
        )}
      </div>
    </section>
  );
}