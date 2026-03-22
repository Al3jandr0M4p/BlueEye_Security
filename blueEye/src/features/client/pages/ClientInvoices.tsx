import { useEffect, useState } from "react";
import DocumentList from "../components/DocumentList";
import InvoiceTable from "../components/InvoiceTable";
import { clientService } from "../services/client.service";
import type { ClientDocument, Invoice } from "../types/client.types";

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

const ClientInvoices = () => {
  const [invoices,  setInvoices]  = useState<Invoice[]>([]);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [feedback,  setFeedback]  = useState("");

  useEffect(() => {
    const load = async () => {
      const [invoiceData, documentData] = await Promise.all([
        clientService.getInvoices(),
        clientService.getDocuments(),
      ]);
      setInvoices(invoiceData);
      setDocuments(documentData);
    };
    void load();
  }, []);

  const handleInvoiceDownload = async (invoiceId: string) => {
    const message = await clientService.downloadInvoice(invoiceId);
    setFeedback(message);
    setTimeout(() => setFeedback(""), 4000);
  };

  const handleDocumentDownload = async (documentId: string) => {
    const message = await clientService.downloadDocument(documentId);
    setFeedback(message);
    setTimeout(() => setFeedback(""), 4000);
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
          Portal del cliente · Finanzas
        </div>
        <h1 style={{
          fontSize: 24, fontWeight: 800, color: T.t1,
          letterSpacing: "-0.03em", margin: 0, lineHeight: 1.15,
        }}>
          Facturas y documentos
        </h1>
        <p style={{ fontSize: 13, color: T.t3, margin: "5px 0 0", fontWeight: 500 }}>
          Consulta de facturación y documentos descargables.
        </p>
      </header>

      {/* Feedback toast */}
      {feedback && (
        <div style={{
          padding: "10px 16px",
          background: T.greenSft,
          border: `1.5px solid ${T.greenMid}`,
          borderRadius: 10,
          fontSize: 12,
          fontFamily: T.mono,
          color: T.greenDark,
          letterSpacing: "0.02em",
          display: "flex",
          alignItems: "center",
          gap: 10,
          boxShadow: `0 0 0 4px ${T.greenLight}`,
          animation: "fadeIn 0.2s ease",
        }}>
          {/* Green pulse dot */}
          <div style={{
            width: 7, height: 7, borderRadius: "50%",
            background: T.green,
            boxShadow: `0 0 0 3px ${T.greenLight}`,
            flexShrink: 0,
          }} />
          {feedback}
        </div>
      )}

      <InvoiceTable  invoices={invoices}    onDownload={handleInvoiceDownload}  />
      <DocumentList  documents={documents}  onDownload={handleDocumentDownload} />

    </section>
  );
};

export default ClientInvoices;