import React, { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  Boxes,
  PencilLine,
  Search,
  ShieldAlert,
  Trash2,
  Warehouse,
} from "lucide-react";
import { useAdminInventoryOverview } from "../../hooks/use-admin-dashboard";
import AdminPageShell from "../../components/AdminPageShell";
import {
  createAdminInventoryMovement,
  createAdminInventoryProduct,
  deleteAdminInventoryProduct,
  updateAdminInventoryProduct,
} from "../../service/service";
import type {
  AdminInventoryProduct,
  CreateInventoryMovementPayload,
  CreateInventoryProductPayload,
} from "../../types/types";

type ProductForm = {
  name: string;
  category: string;
  subcategory: string;
  price: string;
  stock: string;
  minimum: string;
  location: string;
  image: string;
  description: string;
  chips: string;
};

type MovementForm = {
  productId: string;
  movementType: "in" | "out";
  quantity: string;
  reason: string;
  reference: string;
};

const emptyProductForm: ProductForm = {
  name: "",
  category: "Camaras",
  subcategory: "",
  price: "",
  stock: "",
  minimum: "",
  location: "Bodega principal",
  image: "",
  description: "",
  chips: "",
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const fallbackImage =
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?fit=crop&w=800&q=60";

const statusClasses: Record<string, string> = {
  Disponible: "bg-emerald-100 text-emerald-700",
  Estable: "bg-sky-100 text-sky-700",
  "Reorden pendiente": "bg-amber-100 text-amber-700",
  "Reserva urgente": "bg-rose-100 text-rose-700",
};

function getStockAccent(stock: number, minimum: number) {
  if (stock <= Math.max(1, Math.floor(minimum * 0.5))) {
    return "from-rose-500/18 to-orange-500/10 text-rose-700 ring-rose-200";
  }

  if (stock <= minimum) {
    return "from-amber-500/18 to-yellow-500/10 text-amber-700 ring-amber-200";
  }

  return "from-emerald-500/18 to-teal-500/10 text-emerald-700 ring-emerald-200";
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(file);
  });
}

const InventoryControl: React.FC = () => {
  const { data, error, loading, reload } = useAdminInventoryOverview();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [productModal, setProductModal] = useState(false);
  const [movementModal, setMovementModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>(emptyProductForm);
  const [movementForm, setMovementForm] = useState<MovementForm>({
    productId: "",
    movementType: "out",
    quantity: "1",
    reason: "",
    reference: "",
  });

  const products = data?.products ?? [];
  const summary = data?.summary ?? { totalProducts: 0, totalUnits: 0, lowStock: 0, totalValue: 0 };
  const stockLevels = data?.stockLevels ?? [];
  const recentMovements = data?.recentMovements ?? [];
  const alerts = data?.alerts ?? [];

  const categories = useMemo(
    () => ["Todos", ...Array.from(new Set(products.map((product) => product.category)))],
    [products],
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = category === "Todos" || product.category === category;
      const matchesSearch =
        search.trim().length === 0 ||
        `${product.name} ${product.subcategory} ${product.location}`.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [category, products, search]);

  const submitProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setFeedback(null);

    const payload: CreateInventoryProductPayload = {
      name: productForm.name,
      category: productForm.category,
      subcategory: productForm.subcategory,
      price: Number(productForm.price || 0),
      stock: Number(productForm.stock || 0),
      minimum: Number(productForm.minimum || 0),
      location: productForm.location,
      image: productForm.image,
      description: productForm.description,
      chips: productForm.chips.split(",").map((chip) => chip.trim()).filter(Boolean),
    };

    await (editingProductId
      ? updateAdminInventoryProduct(editingProductId, payload)
      : createAdminInventoryProduct(payload))
      .then(async () => {
        setFeedback(
          editingProductId
            ? "Producto actualizado correctamente."
            : "Producto agregado al inventario.",
        );
        setProductModal(false);
        setEditingProductId(null);
        setProductForm(emptyProductForm);
        await reload();
      })
      .catch((err: unknown) => {
        setFeedback(err instanceof Error ? err.message : "No se pudo guardar el producto.");
      });

    setBusy(false);
  };

  const openCreateProductModal = () => {
    setEditingProductId(null);
    setProductForm(emptyProductForm);
    setProductModal(true);
  };

  const openEditProductModal = (product: AdminInventoryProduct) => {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name,
      category: product.category,
      subcategory: product.subcategory,
      price: String(product.price ?? ""),
      stock: String(product.stock ?? 0),
      minimum: String(product.minimum ?? 0),
      location: product.location,
      image: product.image,
      description: product.description,
      chips: product.chips.join(", "),
    });
    setProductModal(true);
  };

  const removeProduct = async (product: AdminInventoryProduct) => {
    const confirmed = window.confirm(
      `Eliminar ${product.name} del inventario activo?`,
    );
    if (!confirmed) return;

    setBusy(true);
    setFeedback(null);

    await deleteAdminInventoryProduct(product.id)
      .then(async () => {
        setFeedback("Producto eliminado del inventario.");
        await reload();
      })
      .catch((err: unknown) => {
        setFeedback(err instanceof Error ? err.message : "No se pudo eliminar el producto.");
      });

    setBusy(false);
  };

  const submitMovement = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setFeedback(null);

    const payload: CreateInventoryMovementPayload = {
      movementType: movementForm.movementType,
      quantity: Number(movementForm.quantity || 1),
      reason: movementForm.reason,
      reference: movementForm.reference,
    };

    await createAdminInventoryMovement(movementForm.productId, payload)
      .then(async () => {
        setFeedback(
          movementForm.movementType === "out"
            ? "Uso de producto registrado."
            : "Entrada de inventario registrada.",
        );
        setMovementModal(false);
        setMovementForm({ productId: "", movementType: "out", quantity: "1", reason: "", reference: "" });
        await reload();
      })
      .catch((err: unknown) => {
        setFeedback(err instanceof Error ? err.message : "No se pudo guardar el movimiento.");
      });

    setBusy(false);
  };

  const handleProductImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFeedback("Selecciona un archivo de imagen valido.");
      return;
    }

    setBusy(true);
    setFeedback(null);

    try {
      const image = await readFileAsDataUrl(file);
      setProductForm((current) => ({ ...current, image }));
    } catch (err) {
      setFeedback(
        err instanceof Error ? err.message : "No se pudo cargar la imagen.",
      );
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  };

  return (
    <AdminPageShell
      tag="Devices"
      title="Inventario de dispositivos"
      subtitle="Productos reales, stock por bodega y movimientos para registrar uso o reabastecimiento."
      actions={
        <>
          <button onClick={openCreateProductModal} className="rounded-2xl bg-white px-4 py-2 font-semibold text-slate-900 shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5">
            Agregar producto
          </button>
          <button onClick={() => setMovementModal(true)} className="rounded-2xl border border-white/20 bg-white/8 px-4 py-2 font-semibold text-white backdrop-blur transition hover:bg-white/12">
            Registrar movimiento
          </button>
        </>
      }
    >
      <div className="space-y-6">
        {feedback && <section className="rounded-[28px] border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white px-5 py-4 text-sm text-emerald-800 shadow-sm">{feedback}</section>}
        {error && <section className="rounded-[28px] border border-rose-200 bg-gradient-to-r from-rose-50 to-white px-5 py-4 text-sm text-rose-700 shadow-sm">{error}</section>}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_20px_55px_-35px_rgba(15,23,42,0.35)]">
            <div className="inline-flex rounded-2xl bg-slate-100 p-3"><Boxes className="h-5 w-5 text-slate-700" /></div>
            <p className="mt-4 text-[11px] uppercase tracking-[0.24em] text-slate-400">Productos</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{summary.totalProducts}</p>
            <p className="mt-2 text-sm text-slate-500">Catalogo disponible para ventas e instalaciones.</p>
          </article>
          <article className="rounded-[30px] border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white p-5 shadow-[0_20px_55px_-35px_rgba(8,145,178,0.35)]">
            <div className="inline-flex rounded-2xl bg-white p-3 ring-1 ring-cyan-100"><Warehouse className="h-5 w-5 text-cyan-600" /></div>
            <p className="mt-4 text-[11px] uppercase tracking-[0.24em] text-cyan-700/70">Unidades</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{summary.totalUnits}</p>
            <p className="mt-2 text-sm text-slate-500">Stock total visible en el inventario actual.</p>
          </article>
          <article className="rounded-[30px] border border-rose-100 bg-gradient-to-br from-rose-50 to-white p-5 shadow-[0_20px_55px_-35px_rgba(225,29,72,0.28)]">
            <div className="inline-flex rounded-2xl bg-white p-3 ring-1 ring-rose-100"><ShieldAlert className="h-5 w-5 text-rose-600" /></div>
            <p className="mt-4 text-[11px] uppercase tracking-[0.24em] text-rose-700/70">Bajo stock</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{summary.lowStock}</p>
            <p className="mt-2 text-sm text-slate-500">Productos que merecen seguimiento o reposicion.</p>
          </article>
          <article className="rounded-[30px] border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-5 shadow-[0_20px_55px_-35px_rgba(79,70,229,0.28)]">
            <div className="inline-flex rounded-2xl bg-white p-3 ring-1 ring-indigo-100"><Activity className="h-5 w-5 text-indigo-600" /></div>
            <p className="mt-4 text-[11px] uppercase tracking-[0.24em] text-indigo-700/70">Valor</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{currency.format(summary.totalValue)}</p>
            <p className="mt-2 text-sm text-slate-500">Estimado basado en precio unitario y stock.</p>
          </article>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Catalogo</p>
              <h2 className="text-3xl font-semibold text-slate-950">Devices del negocio</h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-500">
                El inventario vive aqui, abierto y visible. Cada producto se muestra como card para que puedas revisar imagen, precio, stock y acciones sin esconderlos dentro de un panel.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto] lg:min-w-[420px]">
              <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <Search className="h-4 w-4 text-slate-400" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre o detalle" className="w-full bg-transparent text-sm outline-none" />
              </label>
              <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none shadow-sm">
                {categories.map((entry) => <option key={entry} value={entry}>{entry}</option>)}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/60">Productos visibles</p>
                <p className="mt-1 text-xl font-semibold">{filteredProducts.length}</p>
              </div>
              <div className="rounded-2xl bg-slate-100 px-4 py-3 text-slate-900 ring-1 ring-slate-200">
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Valor total</p>
                <p className="mt-1 text-xl font-semibold">{currency.format(summary.totalValue)}</p>
              </div>
            </div>
            <p className="text-sm text-slate-500">
              Cards abiertas, sin encapsular el catalogo en un cuadro grande.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group flex h-full flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_80px_-52px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_36px_100px_-48px_rgba(15,23,42,0.45)]"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  <img
                    src={product.image || fallbackImage}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                    <span className="rounded-full bg-black/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                      {product.subcategory}
                    </span>
                    <span className="rounded-full bg-white/92 px-3 py-1 text-sm font-semibold text-slate-900 shadow-sm">
                      {currency.format(product.price)}
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent p-4">
                    <div className={`inline-flex rounded-full bg-gradient-to-br px-3 py-1 text-[11px] font-semibold ring-1 backdrop-blur ${getStockAccent(product.stock, product.minimum)}`}>
                      Stock {product.stock}
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="line-clamp-2 text-lg font-semibold text-slate-950">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">{product.location}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-100 px-3 py-2 text-right ring-1 ring-slate-200">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Min</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{product.minimum}</p>
                    </div>
                  </div>
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                    {product.description || "Producto disponible para soporte e instalaciones."}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className={`rounded-2xl bg-gradient-to-br p-3 ring-1 ${getStockAccent(product.stock, product.minimum)}`}>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-current/65">Stock</p>
                      <p className="mt-1 text-2xl font-semibold text-slate-950">{product.stock}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Precio</p>
                      <p className="mt-1 text-lg font-semibold text-slate-950">{currency.format(product.price)}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex min-h-12 flex-wrap gap-2">
                    {product.chips.length > 0 ? product.chips.map((chip) => <span key={`${product.id}-${chip}`} className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200">{chip}</span>) : <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">Sin etiquetas</span>}
                  </div>
                  <div className="mt-5 grid gap-2">
                    <button onClick={() => { setMovementForm({ productId: product.id, movementType: "out", quantity: "1", reason: `Uso en proyecto de ${product.name}`, reference: "" }); setMovementModal(true); }} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"><ArrowUpRight className="h-4 w-4" />Registrar uso</button>
                    <button onClick={() => { setMovementForm({ productId: product.id, movementType: "in", quantity: "1", reason: `Reposicion de ${product.name}`, reference: "" }); setMovementModal(true); }} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"><ArrowDownLeft className="h-4 w-4" />Reabastecer</button>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => openEditProductModal(product)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <PencilLine className="h-4 w-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => void removeProduct(product)}
                      disabled={busy}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60"
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {!loading && filteredProducts.length === 0 && (
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-sm text-slate-500">
              No hay productos para ese filtro todavía.
            </div>
          )}
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-1">
            <article className="rounded-[30px] border border-rose-100 bg-gradient-to-br from-rose-50 to-white p-6 shadow-[0_24px_80px_-54px_rgba(225,29,72,0.35)]">
              <h2 className="text-lg font-semibold text-slate-950">Alertas de stock</h2>
              <div className="mt-4 space-y-3">
                {(alerts.length > 0 ? alerts : ["Inventario estable por ahora."]).map((alert) => (
                  <div key={alert} className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-rose-900 ring-1 ring-rose-100">{alert}</div>
                ))}
              </div>
            </article>

            <article className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-54px_rgba(15,23,42,0.35)]">
              <h2 className="text-lg font-semibold text-slate-950">Resumen de stock</h2>
              <div className="mt-4 space-y-3">
                {stockLevels.map((stock) => (
                  <article key={`${stock.material}-${stock.location}`} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 ring-1 ring-slate-100">
                    <div className="flex items-start justify-between gap-3">
                      <div><p className="font-semibold text-slate-900">{stock.material}</p><p className="text-sm text-slate-500">{stock.location}</p></div>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusClasses[stock.status] ?? "bg-slate-100 text-slate-700"}`}>{stock.status}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-2xl bg-white p-3"><p className="text-[11px] uppercase tracking-wide text-slate-400">Actual</p><p className="mt-1 text-xl font-semibold text-slate-900">{stock.current}</p></div>
                      <div className="rounded-2xl bg-white p-3"><p className="text-[11px] uppercase tracking-wide text-slate-400">Minimo</p><p className="mt-1 text-xl font-semibold text-slate-900">{stock.minimum}</p></div>
                    </div>
                  </article>
                ))}
              </div>
            </article>

            <article className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-54px_rgba(15,23,42,0.35)]">
              <h2 className="text-lg font-semibold text-slate-950">Movimientos recientes</h2>
              <div className="mt-4 space-y-3">
                {recentMovements.map((movement) => (
                  <article key={movement.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 ring-1 ring-slate-100">
                    <div className="flex items-start justify-between gap-3">
                      <div><p className="font-semibold text-slate-900">{movement.productName}</p><p className="text-sm text-slate-500">{movement.reason}</p></div>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${movement.movementType === "out" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>{movement.movementType === "out" ? "-" : "+"}{movement.quantity}</span>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">{movement.reference || "Sin referencia"}</div>
                  </article>
                ))}
                {!loading && recentMovements.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">Todavia no hay movimientos registrados.</div>}
              </div>
            </article>
          </div>
        </section>

        {productModal && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm">
            <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[32px] border border-white/50 bg-white p-6 shadow-[0_32px_120px_-45px_rgba(15,23,42,0.55)]">
              <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">{editingProductId ? "Editar producto" : "Nuevo producto"}</p><h2 className="mt-2 text-2xl font-semibold text-slate-900">{editingProductId ? "Actualizar inventario" : "Agregar al inventario"}</h2></div><button onClick={() => { setProductModal(false); setEditingProductId(null); }} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Cerrar</button></div>
              <form onSubmit={submitProduct} className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {(["name", "category", "subcategory", "price", "stock", "minimum", "location", "chips"] as const).map((key) => (
                    <label key={key} className="space-y-2">
                      <span className="text-sm font-semibold capitalize text-slate-700">{key}</span>
                      <input value={productForm[key]} onChange={(event) => setProductForm((current) => ({ ...current, [key]: event.target.value }))} required={key === "name" || key === "category"} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white" />
                    </label>
                  ))}
                </div>
                <div className="grid gap-4 md:grid-cols-[1fr_220px]">
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Imagen</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => void handleProductImageChange(event)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
                    />
                  </label>
                  <div className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Preview</span>
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                      <img
                        src={productForm.image || fallbackImage}
                        alt="Preview del producto"
                        className="h-36 w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                <label className="block space-y-2"><span className="text-sm font-semibold text-slate-700">Descripcion</span><textarea value={productForm.description} onChange={(event) => setProductForm((current) => ({ ...current, description: event.target.value }))} rows={4} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white" /></label>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={() => { setProductModal(false); setEditingProductId(null); }} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">Cancelar</button><button type="submit" disabled={busy} className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{busy ? "Guardando..." : editingProductId ? "Actualizar producto" : "Guardar producto"}</button></div>
              </form>
            </div>
          </div>
        )}

        {movementModal && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-[32px] border border-white/50 bg-white p-6 shadow-[0_32px_120px_-45px_rgba(15,23,42,0.55)]">
              <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Movimiento</p><h2 className="mt-2 text-2xl font-semibold text-slate-900">Registrar uso o entrada</h2></div><button onClick={() => setMovementModal(false)} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Cerrar</button></div>
              <form onSubmit={submitMovement} className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="space-y-2 md:col-span-2"><span className="text-sm font-semibold text-slate-700">Producto</span><select value={movementForm.productId} onChange={(event) => setMovementForm((current) => ({ ...current, productId: event.target.value }))} required className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"><option value="">Selecciona un producto</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name} · stock {product.stock}</option>)}</select></label>
                <label className="space-y-2"><span className="text-sm font-semibold text-slate-700">Tipo</span><select value={movementForm.movementType} onChange={(event) => setMovementForm((current) => ({ ...current, movementType: event.target.value as "in" | "out" }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"><option value="out">Salida / uso</option><option value="in">Entrada / reposicion</option></select></label>
                <label className="space-y-2"><span className="text-sm font-semibold text-slate-700">Cantidad</span><input value={movementForm.quantity} onChange={(event) => setMovementForm((current) => ({ ...current, quantity: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" /></label>
                <label className="space-y-2"><span className="text-sm font-semibold text-slate-700">Motivo</span><input value={movementForm.reason} onChange={(event) => setMovementForm((current) => ({ ...current, reason: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" /></label>
                <label className="space-y-2"><span className="text-sm font-semibold text-slate-700">Referencia</span><input value={movementForm.reference} onChange={(event) => setMovementForm((current) => ({ ...current, reference: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" /></label>
                <div className="flex flex-col gap-3 md:col-span-2 sm:flex-row sm:justify-end"><button type="button" onClick={() => setMovementModal(false)} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">Cancelar</button><button type="submit" disabled={busy} className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{busy ? "Guardando..." : "Guardar movimiento"}</button></div>
              </form>
            </div>
          </div>
        )}

        <section className="rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
          Ultima actualizacion: {data?.lastUpdated ?? "--"}
        </section>
      </div>
    </AdminPageShell>
  );
};

export default InventoryControl;
