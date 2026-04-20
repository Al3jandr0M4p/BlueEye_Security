import { useCallback, useEffect, useRef, useState } from "react";
import { clientService } from "../../../service/service";
import type { ClientDocument, Invoice } from "../../../types/client.types";

export function useClientInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [feedback, setFeedback] = useState("");
  const [integrationNote, setIntegrationNote] = useState("");
  const feedbackTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const load = async () => {
      const [invoiceData, documentData] = await Promise.all([
        clientService.getInvoices(),
        clientService.getDocuments(),
      ]);

      setInvoices(invoiceData);
      setDocuments(documentData);
      setIntegrationNote(clientService.getMissingInvoicesMessage());
    };

    void load();
  }, []);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        window.clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  const showFeedback = useCallback((message: string) => {
    setFeedback(message);

    if (feedbackTimeoutRef.current) {
      window.clearTimeout(feedbackTimeoutRef.current);
    }

    feedbackTimeoutRef.current = window.setTimeout(() => {
      setFeedback("");
      feedbackTimeoutRef.current = null;
    }, 4000);
  }, []);

  const handleInvoiceDownload = useCallback(
    async (invoiceId: string) => {
      const message = await clientService.downloadInvoice(invoiceId);
      showFeedback(message);
    },
    [showFeedback],
  );

  const handleDocumentDownload = useCallback(
    async (documentId: string) => {
      const message = await clientService.downloadDocument(documentId);
      showFeedback(message);
    },
    [showFeedback],
  );

  return {
    documents,
    feedback,
    handleDocumentDownload,
    handleInvoiceDownload,
    integrationNote,
    invoices,
  };
}
