import type { Invoice } from "../types/client.types";

interface InvoiceTableProps {
  invoices: Invoice[];
  onDownload: (invoiceId: string) => void;
}

const statusStyles: Record<Invoice["status"], string> = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  overdue: "bg-red-100 text-red-700",
};

const InvoiceTable = ({ invoices, onDownload }: InvoiceTableProps) => (
  <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
    <h2 className="mb-4 text-lg font-semibold text-gray-800">Facturas</h2>
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-600">
            <th className="pb-2 font-medium">Codigo</th>
            <th className="pb-2 font-medium">Monto</th>
            <th className="pb-2 font-medium">Fecha</th>
            <th className="pb-2 font-medium">Estado</th>
            <th className="pb-2 font-medium">Accion</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="border-b border-gray-100">
              <td className="py-3 font-medium text-gray-800">{invoice.code}</td>
              <td className="py-3 text-gray-700">${invoice.amount.toFixed(2)}</td>
              <td className="py-3 text-gray-700">{new Date(invoice.issueDate).toLocaleDateString()}</td>
              <td className="py-3">
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyles[invoice.status]}`}>
                  {invoice.status}
                </span>
              </td>
              <td className="py-3">
                <button
                  type="button"
                  onClick={() => onDownload(invoice.id)}
                  className="rounded-md bg-gray-800 px-3 py-1 text-xs font-semibold text-white"
                >
                  Descargar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default InvoiceTable;
