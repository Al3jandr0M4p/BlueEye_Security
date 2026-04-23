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
import type { AdminReportExport } from "../../types/types";

type ExportFormat = "CSV" | "Excel" | "PDF";
type ExportRow = Record<string, string | number>;

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
    .map((row) => `<tr>${headers.map((header) => `<td>${String(row[header])}</td>`).join("")}</tr>`)
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

const formatFileName = (value: string) =>
  value.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and");

const getExportIcon = (format: string) => {
  if (format === "Excel") return FileSpreadsheet;
  if (format === "PDF") return FileText;
  return ArrowDownToLine;
};

const AdminReportsScreen: React.FC = () => {
  const { data, error, loading } = useAdminReportsOverview();
  const [lastExport, setLastExport] = useState<string | null>(null);

  const reports = data?.reports ?? [];
  const exportsList = data?.exports ?? [];
  const trendData = data?.monthlyTrend ?? [];
  const mixData = data?.mix ?? [];

  const summaryChartData = useMemo(
    () =>
      reports.map((report) => ({
        name: report.title,
        value: parseMetricValue(report.metric),
      })),
    [reports],
  );

  const handleDownload = (item: AdminReportExport, format: ExportFormat) => {
    const rows = item.rows ?? [];
    const fileBaseName = formatFileName(item.type);

    if (format === "CSV") {
      downloadBlob(toCsv(rows), `${fileBaseName}.csv`, "text/csv;charset=utf-8;");
    }

    if (format === "Excel") {
      downloadBlob(
        toExcelHtml(item.type, rows),
        `${fileBaseName}.xls`,
        "application/vnd.ms-excel;charset=utf-8;",
      );
    }

    if (format === "PDF") {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      doc.setFontSize(18);
      doc.text(item.type, 40, 40);
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

    setLastExport(`${item.type} · ${format}`);
  };

  return (
    <AdminPageShell
      tag="Reportes"
      title="Analitica del negocio"
      subtitle="Graficos reales, datasets listos para exportar y una lectura rapida de operacion e inventario."
    >
      <div className="space-y-6">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
                Reportes ejecutivos
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                Operacion, personal e inventario en una sola vista
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                El panel ya no depende de valores fake: ahora responde a tickets,
                usuarios del negocio y catalogo real de inventario.
              </p>
              {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
            </div>

            <div className="grid min-w-[240px] gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Ultima exportacion
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {lastExport ?? "Sin descargas aun"}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Estado
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {loading ? "Cargando..." : `${reports.length} KPIs activos`}
                </p>
              </div>
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
                    {summaryChartData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={chartColors[summaryChartData.findIndex((item) => item.name === entry.name) % chartColors.length]}
                      />
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
                <p className="text-sm text-slate-500">Balance actual entre backlog y capacidad.</p>
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
                    {mixData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={chartColors[mixData.findIndex((item) => item.name === entry.name) % chartColors.length]}
                      />
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
              <p className="text-sm text-slate-500">Tickets, planificacion y flujo de stock.</p>
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
                <Line type="monotone" dataKey="tickets" stroke="#0f172a" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="planned" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="stockFlow" stroke="#14b8a6" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Exportaciones</h2>
              <p className="text-sm text-slate-600">
                Descarga el estado real de usuarios, tickets e inventario.
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
                      Ultima referencia: {item.lastExported}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {item.format}
                  </span>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
                  {(["CSV", "Excel", "PDF"] as ExportFormat[]).map((format) => {
                    const Icon = getExportIcon(format);
                    return (
                      <button
                        key={`${item.type}-${format}`}
                        onClick={() => handleDownload(item, format)}
                        className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          Descargar {format}
                        </span>
                        <span className="text-xs text-slate-400">{item.rows.length}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
                  {item.rows.length} filas disponibles para exportar
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
