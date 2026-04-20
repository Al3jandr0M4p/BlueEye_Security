import DocumentList from "./components/DocumentList";
import InvoiceTable from "./components/InvoiceTable";
import { useClientInvoices } from "./hooks/useClientInvoices";

const T = {
  bg: "#F8FAF8",
  green: "#4CAF82",
  greenDark: "#2E8B5E",
  greenLight: "#C8EDD9",
  greenMid: "#A8DBBE",
  greenSft: "#EAF7F1",
  mono: "'JetBrains Mono', 'Fira Mono', monospace",
  sans: "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
  t1: "#1A2332",
  t3: "#9AA3B2",
} as const;

const Invoices = () => {
  const {
    documents,
    feedback,
    handleDocumentDownload,
    handleInvoiceDownload,
    integrationNote,
    invoices,
  } = useClientInvoices();

  return (
    <section style={{ background: T.bg, display: "flex", flexDirection: "column", fontFamily: T.sans, gap: 20, minHeight: "100vh", padding: "24px 28px 56px" }}>
      <header>
        <div style={{ color: T.green, fontFamily: T.mono, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", marginBottom: 6, textTransform: "uppercase" }}>Portal del cliente · Finanzas</div>
        <h1 style={{ color: T.t1, fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15, margin: 0 }}>Facturas y documentos</h1>
        <p style={{ color: T.t3, fontSize: 13, fontWeight: 500, margin: "5px 0 0" }}>Consulta de facturacion y documentos descargables.</p>
      </header>

      {feedback && (
        <div style={{ alignItems: "center", animation: "fadeIn 0.2s ease", background: T.greenSft, border: `1.5px solid ${T.greenMid}`, borderRadius: 10, boxShadow: `0 0 0 4px ${T.greenLight}`, color: T.greenDark, display: "flex", fontFamily: T.mono, fontSize: 12, gap: 10, letterSpacing: "0.02em", padding: "10px 16px" }}>
          <div style={{ background: T.green, borderRadius: "50%", boxShadow: `0 0 0 3px ${T.greenLight}`, flexShrink: 0, height: 7, width: 7 }} />
          {feedback}
        </div>
      )}

      <div style={{ background: "#FFFFFF", border: `1px solid ${T.greenMid}`, borderRadius: 12, color: T.t3, fontSize: 12, lineHeight: 1.6, padding: "14px 16px" }}>
        {integrationNote}
      </div>

      <InvoiceTable invoices={invoices} onDownload={handleInvoiceDownload} />
      <DocumentList documents={documents} onDownload={handleDocumentDownload} />
    </section>
  );
};

export default Invoices;
