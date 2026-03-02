import type { ClientDocument } from "../types/client.types";
import { clientService } from "../services/client.service";

interface DocumentListProps {
  documents: ClientDocument[];
  onDownload: (documentId: string) => void;
}

const DocumentList = ({ documents, onDownload }: DocumentListProps) => {
  const groupedBySite = documents.reduce<Record<string, ClientDocument[]>>((acc, document) => {
    const siteGroup = acc[document.site] ?? [];
    siteGroup.push(document);
    acc[document.site] = siteGroup;
    return acc;
  }, {});

  const entries = Object.entries(groupedBySite);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">Documentos por sitio</h2>
      <div className="space-y-4">
        {entries.map(([site, siteDocuments]) => (
          <article key={site} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <h3 className="text-sm font-semibold text-gray-800">{site}</h3>
            <ul className="mt-2 space-y-2">
              {siteDocuments.map((document) => (
                <li
                  key={document.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-white p-2 text-sm"
                >
                  <span className="font-medium text-gray-700">{document.name}</span>
                  <span className="text-gray-500">{clientService.getDocumentTypeLabel(document.type)}</span>
                  <button
                    type="button"
                    onClick={() => onDownload(document.id)}
                    className="rounded-md bg-blue-600 px-3 py-1 text-xs font-semibold text-white"
                  >
                    Descargar
                  </button>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
};

export default DocumentList;
