import React, { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  BarChart3,
  FileSpreadsheet,
  FileText,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAdminReportsOverview } from "../../hooks/use-admin-dashboard";
import AdminPageShell from "../../components/AdminPageShell";

type ExportFormat = "CSV" | "Excel" | "PDF";
type ExportRow = Record<string, string | number>;

const EMPTY_REPORTS: {
  title: string;
  metric: string;
  trend: string;
  details: string;
}[] = [];

const EMPTY_EXPORTS: {
  type: string;
  lastExported: string;
  format: string;
}[] = [];

const chartColors = ["#0f172a", "#2563eb", "#14b8a6", "#f59e0b"];

const parseMetricValue = (metric: string) => {
  const normalized = metric.replace(/[^\d.,]/g, "").replace(/,/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const downloadBlob = (content: BlobPart, fileName: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const toCsv = (rows: ExportRow[]) => {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;
  return [headers.join(","), ...rows.map((row) => headers.map((header) => escape(row[header])).join(","))].join("\n");
};

const toExcelHtml = (title: string, rows: ExportRow[]) => {
  if (rows.length === 0) return "<table></table>";
  const headers = Object.keys(rows[0]);
  const head = headers.map((header) => `<th>${header}</th>`).join("");
  const body = rows
    .map(
      (row) =>
        `<tr>${headers
          .map((header) => `<td>${String(row[header])}</td>`)
          .join("")}</tr>`,
    )
    .join("");

  return `
    <html>
      <head><meta charset="UTF-8" /></head>
      <body>
        <h2>${title}</h2>
        <table border="1">
          <thead><tr>${head}</tr></thead>
          <tbody>${body}</tbody>
        </table>
      </body>
    </html>
  `;
};

const AdminReportsScreen: React.FC = () => {
  const { data, error } = useAdminReportsOverview();
  const reports = data?.reports ?? EMPTY_REPORTS;
  const exportsList = data?.exports ?? EMPTY_EXPORTS;
  const [lastExport, setLastExport] = useState<string | null>(null);

  const summaryChartData = useMemo(
    () =>
      reports.map((report) => ({
        name: report.title,
        value: parseMetricValue(report.metric),
      })),
    [reports],
  );

  const trendData = useMemo(
    () => [
      { month: "Ene", ingresos: 66, tickets: 18, proyectos: 5 },
      { month: "Feb", ingresos: 79, tickets: 14, proyectos: 6 },
      { month: "Mar", ingresos: 98, tickets: 11, proyectos: 8 },
      { month: "Abr", ingresos: 104, tickets: 9, proyectos: 9 },
      { month: "May", ingresos: 113, tickets: 8, proyectos: 10 },
      { month: "Jun", ingresos: 121, tickets: 7, proyectos: 11 },
    ],
    [],
  );

  const mixData = useMemo(
    () => [
      { name: "Proyectos", value: parseMetricValue(reports[0]?.metric ?? "0") },
      { name: "Ingresos", value: parseMetricValue(reports[1]?.metric ?? "0") / 1000 },
      { name: "Tickets", value: parseMetricValue(reports[2]?.metric ?? "0") },
      { name: "Equipos", value: parseMetricValue(reports[3]?.metric ?? "0") / 12 },
    ],
    [reports],
  );

  const exportDataMap = useMemo<Record<string, ExportRow[]>>(
    () => ({
      "Clientes & sitios": [
        { cliente: "Banco Horizonte", sitios: 3, estado: "Activo", plan: "Enterprise Plus" },
        { cliente: "NovaTech Logistics", sitios: 5, estado: "Activo", plan: "Enterprise Plus" },
        { cliente: "Colmado del Valle", sitios: 1, estado: "Pendiente", plan: "Growth Vision" },
      ],
      "Cotizaciones aprobadas": [
        { cotizacion: "COT-2041", cliente: "Banco Horizonte", total: "USD 7,800", estado: "Aprobada" },
        { cotizacion: "COT-2050", cliente: "Grupo Polaris", total: "USD 11,200", estado: "Aprobada" },
        { cotizacion: "COT-2053", cliente: "BlueShore Resort", total: "USD 6,900", estado: "Aprobada" },
      ],
      "Tickets y SLA": [
        { ticket: "TCK-1050", prioridad: "Urgente", sla: "4h", estado: "Pendiente" },
        { ticket: "TCK-1051", prioridad: "Alta", sla: "24h", estado: "En analisis" },
        { ticket: "TCK-1045", prioridad: "Alta", sla: "24h", estado: "Planificado" },
      ],
    }),
    [],
  );

  const handleDownload = (type: string, format: ExportFormat) => {
    const rows = exportDataMap[type] ?? [];
    const fileBaseName = type.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and");

    if (format === "CSV") {
      downloadBlob(toCsv(rows), `${fileBaseName}.csv`, "text/csv;charset=utf-8;");
    }

    if (format === "Excel") {
      downloadBlob(
        toExcelHtml(type, rows),
        `${fileBaseName}.xls`,
        "application/vnd.ms-excel;charset=utf-8;",
      );
    }

    if (format === "PDF") {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      doc.setFontSize(18);
      doc.text(type, 40, 40);
      autoTable(doc, {
        startY: 60,
        head: rows.length > 0 ? [Object.keys(rows[0])] : [["Sin datos"]],
        body:
          rows.length > 0
            ? rows.map((row) => Object.values(row).map((value) => String(value)))
            : [["No hay datos disponibles"]],
        styles: { fontSize: 10 },
        headStyles: { fillColor: [15, 23, 42] },
      });
      doc.save(`${fileBaseName}.pdf`);
    }

    setLastExport(`${type} · ${format}`);
  };

  return (
    <AdminPageShell
      tag="Reportes"
      title="Analitica del negocio"
      subtitle="Vista ejecutiva con graficos y exportaciones descargables."
    >
      <div className="space-y-6">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
                Reportes ejecutivos
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                Un panel claro para negocio, soporte y operaciones
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Reorganicé la pantalla para que se vea sobria y profesional:
                menos ruido visual, mejor jerarquía y acciones de descarga más claras.
              </p>
              {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
            </div>

            <div className="min-w-[240px] rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Ultima exportacion
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {lastExport ?? "Sin descargas aun"}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {reports.map((report, index) => (
            <article
              key={report.title}
              className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  {report.title}
                </p>
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: chartColors[index % chartColors.length] }}
                />
              </div>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{report.metric}</p>
              <p className="mt-1 text-xs font-semibold text-emerald-600">{report.trend}</p>
              <p className="mt-4 text-sm leading-6 text-slate-600">{report.details}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-slate-700" />
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Resumen general</h2>
                <p className="text-sm text-slate-500">Comparativa de indicadores principales.</p>
              </div>
            </div>
            <div className="mt-5 h-[320px] sm:h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summaryChartData} barCategoryGap={26}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 14,
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
                    }}
                  />
                  <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                    {summaryChartData.map((entry, index) => (
                      <Cell key={`${entry.name}-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <PieChartIcon className="h-5 w-5 text-slate-700" />
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Distribucion operativa</h2>
                <p className="text-sm text-slate-500">Balance entre areas del negocio.</p>
              </div>
            </div>
            <div className="mt-5 h-[320px] sm:h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mixData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius="48%"
                    outerRadius="76%"
                    paddingAngle={2}
                  >
                    {mixData.map((entry, index) => (
                      <Cell key={`${entry.name}-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 14,
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </article>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <LineChartIcon className="h-5 w-5 text-slate-700" />
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Tendencia mensual</h2>
              <p className="text-sm text-slate-500">Ingresos, tickets y proyectos por mes.</p>
            </div>
          </div>
          <div className="mt-5 h-[340px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 14,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="ingresos" stroke="#0f172a" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="tickets" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="proyectos" stroke="#14b8a6" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Exportaciones</h2>
              <p className="text-sm text-slate-600">
                Descarga datasets del panel en el formato que necesites.
              </p>
            </div>
            <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              CSV · Excel · PDF
            </span>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {exportsList.map((item) => (
              <article
                key={item.type}
                className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{item.type}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Ultima exportacion: {item.lastExported}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {item.format}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => handleDownload(item.type, "CSV")}
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <span className="inline-flex items-center gap-2">
                      <ArrowDownToLine className="h-4 w-4" />
                      Descargar CSV
                    </span>
                    <span className="text-xs text-slate-400">Rapido</span>
                  </button>
                  <button
                    onClick={() => handleDownload(item.type, "Excel")}
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <span className="inline-flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      Descargar Excel
                    </span>
                    <span className="text-xs text-slate-400">Hoja</span>
                  </button>
                  <button
                    onClick={() => handleDownload(item.type, "PDF")}
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <span className="inline-flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Descargar PDF
                    </span>
                    <span className="text-xs text-slate-400">Formal</span>
                  </button>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
                  {exportDataMap[item.type]?.length ?? 0} filas disponibles para exportar
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AdminPageShell>
  );
};

export default AdminReportsScreen;
