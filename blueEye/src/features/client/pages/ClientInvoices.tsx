import { useEffect, useState } from "react";
import DocumentList from "../components/DocumentList";
import InvoiceTable from "../components/InvoiceTable";
import { clientService } from "../services/client.service";
import type { ClientDocument, Invoice } from "../types/client.types";

const ClientInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [feedback, setFeedback] = useState("");

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
  };

  const handleDocumentDownload = async (documentId: string) => {
    const message = await clientService.downloadDocument(documentId);
    setFeedback(message);
  };

  return (
    <section className="space-y-6 p-4">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Facturas y documentos</h1>
        <p className="text-sm text-gray-600">Consulta de facturacion y documentos descargables del cliente.</p>
      </header>

      {feedback && <p className="rounded-lg bg-blue-50 p-3 text-sm font-medium text-blue-700">{feedback}</p>}

      <InvoiceTable invoices={invoices} onDownload={handleInvoiceDownload} />
      <DocumentList documents={documents} onDownload={handleDocumentDownload} />
    </section>
  );
};

export default ClientInvoices;
