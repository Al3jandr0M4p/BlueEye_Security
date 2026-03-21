import React, { useMemo, useState } from "react";
import {
  Activity,
  Camera,
  PackageCheck,
  Radar,
  ShieldAlert,
  Sparkles,
  Warehouse,
} from "lucide-react";
import { useAdminCatalogOverview, useAdminInventoryOverview } from "../../hooks/use-admin-dashboard";
import AdminPageShell from "../../components/AdminPageShell";

const badgeBase =
  "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide";

const stockStatusClasses: Record<string, string> = {
  Disponible: "bg-emerald-100 text-emerald-700",
  Estable: "bg-sky-100 text-sky-700",
  "Reorden pendiente": "bg-amber-100 text-amber-700",
  "Reserva urgente": "bg-rose-100 text-rose-700",
};

const cameraSeries = [
  "Core",
  "Vision",
  "Elite",
  "Pro",
  "Outdoor",
  "Night",
  "Urban",
  "360",
  "Smart",
  "Guard",
  "Secure",
  "Edge",
  "Plus",
  "Max",
  "Flex",
];

const sensorSeries = [
  "Motion",
  "Pulse",
  "Guard",
  "Perimeter",
  "Indoor",
  "Outdoor",
  "Access",
  "Secure",
  "Shield",
  "Track",
  "Sense",
  "Watch",
  "Active",
  "Zone",
  "Prime",
  "Alert",
  "Core",
  "Dual",
  "Smart",
  "Rapid",
];

const EMPTY_STOCK_LEVELS: {
  material: string;
  current: number;
  minimum: number;
  location: string;
  status: string;
}[] = [];

const EMPTY_ALERTS: string[] = [];

const EMPTY_CAMERAS: {
  name: string;
  type: string;
  resolution: string;
  lens: string;
  poe: boolean;
  onvif: boolean;
  nightVision: string;
  description: string;
  image: string;
  price: string;
  stock: number;
  features: string[];
}[] = [];

const EMPTY_SENSORS: {
  name: string;
  coverage: string;
  detection: string;
  connectivity: string;
  installation: string;
  description: string;
  image: string;
  price: string;
  stock: number;
  idealFor: string[];
  features: string[];
}[] = [];

type InventoryProductCard = {
  id: string;
  name: string;
  category: "Camara" | "Sensor";
  subcategory: string;
  image: string;
  price: string;
  stock: number;
  lineA: string;
  lineB: string;
  lineC: string;
  chips: string[];
  accent: string;
};

const AdminInventoryScreen: React.FC = () => {
  const { data, error } = useAdminInventoryOverview();
  const { data: catalogData } = useAdminCatalogOverview();

  const stockLevels = data?.stockLevels ?? EMPTY_STOCK_LEVELS;
  const alerts = data?.alerts ?? EMPTY_ALERTS;
  const cameraCatalog = catalogData?.cameraCatalog ?? EMPTY_CAMERAS;
  const motionSensors = catalogData?.motionSensorCatalog ?? EMPTY_SENSORS;

  const criticalItems = stockLevels.filter((item) => item.current <= item.minimum);
  const totalUnits = stockLevels.reduce((sum, item) => sum + item.current, 0);
  const cameraUnits = cameraCatalog.reduce((sum, camera) => sum + camera.stock, 0);
  const sensorUnits = motionSensors.reduce((sum, sensor) => sum + sensor.stock, 0);
  const featuredCamera = cameraCatalog[1] ?? cameraCatalog[0];
  const featuredSensor = motionSensors[0];
  const [currentPage, setCurrentPage] = useState(1);

  const extendedCatalog = useMemo<InventoryProductCard[]>(() => {
    const generatedCameras = cameraCatalog.flatMap((camera) =>
      cameraSeries.map((series, index) => ({
        id: `${camera.name}-camera-${index}`,
        name: `${camera.name} ${series}`,
        category: "Camara" as const,
        subcategory: camera.type,
        image: camera.image,
        price: camera.price,
        stock: camera.stock + (index % 5),
        lineA: camera.resolution,
        lineB: `Vision: ${camera.nightVision}`,
        lineC: `Lente: ${camera.lens}`,
        chips: [camera.poe ? "PoE" : "No PoE", camera.onvif ? "ONVIF" : "Cerrado", ...camera.features.slice(0, 2)],
        accent: "from-cyan-500/15 via-sky-500/10 to-transparent",
      })),
    );

    const generatedSensors = motionSensors.flatMap((sensor) =>
      sensorSeries.map((series, index) => ({
        id: `${sensor.name}-sensor-${index}`,
        name: `${sensor.name} ${series}`,
        category: "Sensor" as const,
        subcategory: sensor.detection,
        image: sensor.image,
        price: sensor.price,
        stock: sensor.stock + (index % 6),
        lineA: `Cobertura: ${sensor.coverage}`,
        lineB: `Conexion: ${sensor.connectivity}`,
        lineC: `Instalacion: ${sensor.installation}`,
        chips: [...sensor.idealFor.slice(0, 2), ...sensor.features.slice(0, 2)],
        accent: "from-amber-500/15 via-orange-400/10 to-transparent",
      })),
    );

    return [...generatedCameras, ...generatedSensors];
  }, [cameraCatalog, motionSensors]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(extendedCatalog.length / itemsPerPage);
  const paginatedCatalog = extendedCatalog.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <AdminPageShell
      tag="Devices"
      title="Inventario de dispositivos"
      subtitle="Una vista responsive con stock, alertas y un catalogo grande de camaras y sensores para el modulo devices."
    >
      <div className="space-y-8">
        <section className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-[0_25px_60px_rgba(15,23,42,0.12)]">
          <div className="grid xl:grid-cols-[1.2fr_0.8fr]">
            <div className="bg-linear-to-br from-slate-950 via-cyan-950 to-slate-900 p-6 text-white sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">
                Devices hub
              </p>
              <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
                Catalogo grande, responsive y listo para vender o planificar instalaciones
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-200">
                Esta pantalla sigue siendo `devices`, pero ahora se comporta como una
                vitrina premium para inventario tecnico: rapido de leer en movil, fuerte
                visualmente en desktop y con mas de 100 productos visibles.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <article className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <Warehouse className="h-5 w-5 text-cyan-300" />
                  <p className="mt-3 text-xs uppercase tracking-wide text-slate-300">
                    Unidades totales
                  </p>
                  <p className="mt-1 text-3xl font-semibold">{totalUnits}</p>
                </article>
                <article className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <Camera className="h-5 w-5 text-emerald-300" />
                  <p className="mt-3 text-xs uppercase tracking-wide text-slate-300">
                    Camaras
                  </p>
                  <p className="mt-1 text-3xl font-semibold">{cameraUnits}</p>
                </article>
                <article className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <Radar className="h-5 w-5 text-amber-300" />
                  <p className="mt-3 text-xs uppercase tracking-wide text-slate-300">
                    Sensores
                  </p>
                  <p className="mt-1 text-3xl font-semibold">{sensorUnits}</p>
                </article>
                <article className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <Sparkles className="h-5 w-5 text-fuchsia-300" />
                  <p className="mt-3 text-xs uppercase tracking-wide text-slate-300">
                    Catalogo total
                  </p>
                  <p className="mt-1 text-3xl font-semibold">{extendedCatalog.length}</p>
                </article>
              </div>
            </div>

            <div className="grid gap-4 bg-slate-50 p-6 sm:p-8">
              {featuredCamera && (
                <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className={`${badgeBase} bg-cyan-100 text-cyan-700`}>
                      Camara destacada
                    </span>
                    <span className="text-sm font-semibold text-emerald-600">
                      {featuredCamera.price}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                    <img
                      src={featuredCamera.image}
                      alt={featuredCamera.name}
                      className="h-32 w-full rounded-2xl object-cover sm:h-24 sm:w-24"
                    />
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {featuredCamera.name}
                      </h3>
                      <p className="text-sm text-slate-600">{featuredCamera.type}</p>
                      <p className="mt-2 text-sm text-slate-500">
                        {featuredCamera.resolution} · {featuredCamera.nightVision}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        Stock: {featuredCamera.stock} unidades
                      </p>
                    </div>
                  </div>
                </article>
              )}

              {featuredSensor && (
                <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className={`${badgeBase} bg-amber-100 text-amber-700`}>
                      Sensor destacado
                    </span>
                    <span className="text-sm font-semibold text-emerald-600">
                      {featuredSensor.price}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                    <img
                      src={featuredSensor.image}
                      alt={featuredSensor.name}
                      className="h-32 w-full rounded-2xl object-cover sm:h-24 sm:w-24"
                    />
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {featuredSensor.name}
                      </h3>
                      <p className="text-sm text-slate-600">{featuredSensor.detection}</p>
                      <p className="mt-2 text-sm text-slate-500">
                        Cobertura {featuredSensor.coverage} · {featuredSensor.connectivity}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        Stock: {featuredSensor.stock} unidades
                      </p>
                    </div>
                  </div>
                </article>
              )}

              <article className="rounded-3xl border border-rose-100 bg-rose-50 p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="h-5 w-5 text-rose-600" />
                  <p className="text-sm font-semibold text-rose-900">
                    Reposicion recomendada
                  </p>
                </div>
                <ul className="mt-4 space-y-3 text-sm text-rose-800">
                  {alerts.map((alert) => (
                    <li key={alert} className="rounded-2xl bg-white/80 px-4 py-3">
                      {alert}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
          {error && (
            <p className="border-t border-slate-200 px-6 py-4 text-sm text-rose-600">
              {error}
            </p>
          )}
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <PackageCheck className="h-5 w-5 text-slate-700" />
            <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">
              Ultima actualizacion
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {data?.lastUpdated ?? "--"}
            </p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <Activity className="h-5 w-5 text-indigo-600" />
            <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">
              Items monitoreados
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{stockLevels.length}</p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <Camera className="h-5 w-5 text-cyan-600" />
            <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">
              Modelos CCTV
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{cameraCatalog.length}</p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <Radar className="h-5 w-5 text-amber-600" />
            <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">
              Sensores activos
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{motionSensors.length}</p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <ShieldAlert className="h-5 w-5 text-rose-600" />
            <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">
              Criticos
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {criticalItems.length}
            </p>
          </article>
        </section>

        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Stock critico y disponibilidad
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">
                Materiales por bodega
              </h2>
            </div>
            <p className="text-sm text-slate-500">
              Responsive en movil y escritorio para revisar rapido el estado del inventario.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stockLevels.map((stock) => (
              <article
                key={stock.material}
                className="rounded-3xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">Material</p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900">
                      {stock.material}
                    </h3>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                      stockStatusClasses[stock.status] ?? "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {stock.status}
                  </span>
                </div>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <p>
                    <span className="font-semibold text-slate-900">Ubicacion:</span>{" "}
                    {stock.location}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-[11px] uppercase tracking-wide text-slate-400">
                        Actual
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-slate-900">
                        {stock.current}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-[11px] uppercase tracking-wide text-slate-400">
                        Minimo
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-slate-900">
                        {stock.minimum}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Catalogo masivo
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">
                Mas de 100 productos en la vista devices
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Camaras y sensores expandidos en una sola grilla grande para que el modulo
                se sienta completo y comercial.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={`${badgeBase} bg-cyan-100 text-cyan-700`}>
                {extendedCatalog.filter((item) => item.category === "Camara").length} camaras
              </span>
              <span className={`${badgeBase} bg-amber-100 text-amber-700`}>
                {extendedCatalog.filter((item) => item.category === "Sensor").length} sensores
              </span>
              <span className={`${badgeBase} bg-fuchsia-100 text-fuchsia-700`}>
                {extendedCatalog.length} productos
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
            {paginatedCatalog.map((product) => (
              <article
                key={product.id}
                className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(15,23,42,0.14)]"
              >
                <div className={`bg-linear-to-br ${product.accent} p-3`}>
                  <div className="relative h-48 overflow-hidden rounded-2xl">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute left-3 top-3">
                      <span
                        className={`${badgeBase} ${
                          product.category === "Camara"
                            ? "bg-cyan-100 text-cyan-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {product.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                        {product.subcategory}
                      </p>
                      <h3 className="mt-1 line-clamp-2 text-lg font-semibold text-slate-900">
                        {product.name}
                      </h3>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-emerald-600">
                      {product.price}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600">
                    <p>{product.lineA}</p>
                    <p>{product.lineB}</p>
                    <p>{product.lineC}</p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">
                      Stock disponible
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">
                      {product.stock}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.chips.map((chip) => (
                      <span
                        key={`${product.id}-${chip}`}
                        className={`${badgeBase} bg-slate-100 text-slate-700`}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Mostrando {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, extendedCatalog.length)} de{" "}
              {extendedCatalog.length} productos
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                    currentPage === page
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                      : "border border-slate-300 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </section>
      </div>
    </AdminPageShell>
  );
};

export default AdminInventoryScreen;
