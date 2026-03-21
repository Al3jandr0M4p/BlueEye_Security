import React from "react";
import { useAdminOrdersPaymentsOverview } from "../../hooks/use-admin-dashboard";
import AdminPageShell from "../../components/AdminPageShell";

const AdminOrdersPaymentsScreen: React.FC = () => {
  const { data, error } = useAdminOrdersPaymentsOverview();
  const quotes = data?.quotes ?? [];
  const payments = data?.paymentsDue ?? [];
  const orders = data?.orders ?? [];

  return (
    <AdminPageShell
      tag="Finanzas"
      title="Ordenes y finanzas"
      subtitle="Gestiona cotizaciones, pagos pendientes y ordenes activas en un solo lugar."
    >
      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Cotizaciones y pagos
          </p>
          <h2 className="text-3xl font-semibold text-slate-900">Ordenes y finanzas</h2>
          <p className="text-sm text-slate-600">
            Gestiona cotizaciones, pagos pendientes y ordenes activas en un solo lugar.
          </p>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </header>

        <div className="grid gap-4 lg:grid-cols-[1.6fr_0.9fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Cotizaciones recientes
              </p>
              <span className="text-xs text-slate-500">{quotes.length} items</span>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-600">
                <thead className="text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="pb-3">Codigo</th>
                    <th className="pb-3">Cliente</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((quote) => (
                    <tr key={quote.id} className="border-t border-slate-100">
                      <td className="py-2 text-slate-900 font-semibold">{quote.id}</td>
                      <td className="py-2">{quote.client}</td>
                      <td className="py-2">{quote.total}</td>
                      <td className="py-2 text-xs font-semibold text-slate-700">
                        {quote.status}
                        <span className="ml-2 text-xs text-slate-500">{quote.sentDate}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <div className="grid gap-4">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Pagos pendientes
              </p>
              <div className="mt-4 space-y-3">
                {payments.map((payment) => (
                  <div
                    key={`${payment.client}-${payment.dueDate}`}
                    className="rounded-2xl border border-slate-100 bg-slate-50 p-3"
                  >
                    <p className="text-sm font-semibold text-slate-900">{payment.client}</p>
                    <p className="text-xs text-slate-600">{payment.method}</p>
                    <p className="text-sm text-slate-900">{payment.amount}</p>
                    <p className="text-xs text-slate-500">Vence: {payment.dueDate}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Ordenes activas
              </p>
              <div className="mt-4 space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm text-slate-900">
                      <span className="font-semibold">{order.id}</span>
                      <span className="text-xs font-semibold text-emerald-600">{order.status}</span>
                    </div>
                    <p className="text-xs text-slate-600">{order.nextAction}</p>
                    <p className="text-xs text-slate-500">Programada: {order.scheduled}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </div>
    </AdminPageShell>
  );
};

export default AdminOrdersPaymentsScreen;
