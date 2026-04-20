import type React from "react";
import { useState } from "react";
import { clientService } from "../../../service/service";
import type { ClientDocument } from "../../../types/client.types";

// ─── BlueEye Landing tokens ───────────────────────────────────────────────────
const T = {
  white:     "#FFFFFF",
  green:     "#4CAF82",
  greenDark: "#2E8B5E",
  greenSft:  "#EAF7F1",
  greenMid:  "#A8DBBE",
  greenSft2: "rgba(76,175,130,0.12)",
  t1:        "#1A2332",
  t2:        "#4A5568",
  t3:        "#9AA3B2",
  border:    "#E2E8E4",
  sans:      "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
  mono:      "'JetBrains Mono', 'Fira Mono', monospace",
} as const;

interface DocumentListProps {
  documents:  ClientDocument[];
  onDownload: (documentId: string) => void;
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontSize: 10, fontFamily: T.mono, letterSpacing: "0.08em", fontWeight: 700,
      padding: "3px 10px", borderRadius: 100,
      background: T.greenSft, color: T.green, border: `1px solid ${T.greenMid}`,
      whiteSpace: "nowrap" as const, lineHeight: 1, flexShrink: 0,
    }}>
      {children}
    </span>
  );
}

function DocRow({ document, onDownload, last }: {
  document: ClientDocument; onDownload: () => void; last: boolean;
}) {
  const [hov,    setHov]    = useState(false);
  const [btnHov, setBtnHov] = useState(false);

  return (
    <li
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:        "flex",
        flexWrap:       "wrap" as const,
        alignItems:     "center",
        justifyContent: "space-between",
        gap:            10,
        padding:        "10px 14px",
        borderBottom:   last ? "none" : `1px solid ${T.border}`,
        background:     hov ? T.greenSft : T.white,
        transition:     "background 0.15s",
        cursor:         "default",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: T.t1, marginBottom: 2 }}>
          {document.name}
        </div>
        <div style={{ fontSize: 10, fontFamily: T.mono, color: T.t3 }}>
          {clientService.getDocumentTypeLabel(document.type)}
        </div>
      </div>
      <button
        type="button"
        onClick={onDownload}
        onMouseEnter={() => setBtnHov(true)}
        onMouseLeave={() => setBtnHov(false)}
        style={{
          padding:      "5px 14px",
          borderRadius: 100,
          background:   btnHov ? T.green     : T.greenSft,
          border:       `1px solid ${btnHov ? T.green : T.greenMid}`,
          color:        btnHov ? T.white     : T.greenDark,
          fontSize:     10,
          fontFamily:   T.mono,
          fontWeight:   700,
          letterSpacing:"0.06em",
          cursor:       "pointer",
          transition:   "all 0.15s",
          flexShrink:   0,
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
      background:   T.white,
      border:       `1px solid ${T.border}`,
      borderRadius: 14,
      overflow:     "hidden",
      fontFamily:   T.sans,
      boxShadow:    "0 1px 4px rgba(26,35,50,0.04)",
    }}>
      {/* Header */}
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
            Documentos por sitio
          </div>
          <div style={{
            fontSize: 10, fontFamily: T.mono, letterSpacing: "0.12em",
            textTransform: "uppercase" as const, color: T.t3, marginTop: 2,
          }}>
            Archivos y contratos
          </div>
        </div>
        <Tag>{documents.length} archivos</Tag>
      </div>

      {/* Site groups */}
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {entries.map(([site, siteDocs]) => (
          <div key={site} style={{
            background:   T.white,
            border:       `1px solid ${T.border}`,
            borderRadius: 10,
            overflow:     "hidden",
          }}>
            {/* Site header */}
            <div style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "space-between",
              padding:        "8px 14px",
              background:     T.greenSft,
              borderBottom:   `1px solid ${T.border}`,
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: T.greenDark }}>
                {site}
              </span>
              <span style={{ fontSize: 10, fontFamily: T.mono, color: T.t3 }}>
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
          <div style={{
            padding: "40px 0", textAlign: "center" as const,
            color: T.t3, fontSize: 12,
          }}>
            Sin documentos disponibles
          </div>
        )}
      </div>
    </section>
  );
}
