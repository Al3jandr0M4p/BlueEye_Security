import { useEffect, useState } from "react";
import DocumentList from "../components/DocumentList";
import InvoiceTable from "../components/InvoiceTable";
import { clientService } from "../services/client.service";
import type { ClientDocument, Invoice } from "../types/client.types";

const C = {
  primary:    "#22d3ee",
  primaryBg:  "rgba(34,211,238,0.07)",
  primaryBd:  "rgba(34,211,238,0.16)",
  textPrimary:   "#f1f5f9",
  textSecondary: "#e2e8f0",
  textSubtle:    "#64748b",
  f: "'Geist','Inter',-apple-system,sans-serif",
  m: "'Geist Mono','JetBrains Mono',ui-monospace,monospace",
} as const;

const ClientInvoices = () => {
  const [invoices,   setInvoices]   = useState<Invoice[]>([]);
  const [documents,  setDocuments]  = useState<ClientDocument[]>([]);
  const [feedback,   setFeedback]   = useState("");

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
    <section style={{ padding: "24px 28px 56px", display: "flex", flexDirection: "column", gap: 20, fontFamily: C.f }}>

      {/* ── Page header ── */}
      <header>
        <div style={{ fontSize: 10, fontFamily: C.m, letterSpacing: "0.18em", textTransform: "uppercase", color: C.primary, marginBottom: 6, opacity: 0.8 }}>
          Portal del cliente · Finanzas
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: C.textPrimary, letterSpacing: "-0.02em", margin: 0, lineHeight: 1.15 }}>
          Facturas y documentos
        </h1>
        <p style={{ fontSize: 12, color: C.textSubtle, margin: "5px 0 0" }}>
          Consulta de facturación y documentos descargables.
        </p>
      </header>

      {/* ── Feedback toast ── */}
      {feedback && (
        <div style={{
          padding: "10px 16px",
          background: C.primaryBg,
          border: `1px solid ${C.primaryBd}`,
          borderRadius: 10,
          fontSize: 12,
          fontFamily: C.m,
          color: C.primary,
          letterSpacing: "0.02em",
        }}>
          ✓ {feedback}
        </div>
      )}

      <InvoiceTable   invoices={invoices}     onDownload={handleInvoiceDownload}  />
      <DocumentList   documents={documents}   onDownload={handleDocumentDownload} />

    </section>
  );
};

export default ClientInvoices;