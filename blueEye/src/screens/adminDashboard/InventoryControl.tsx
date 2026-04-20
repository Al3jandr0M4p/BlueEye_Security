import React, { useMemo, useState } from "react";
import { Activity, Boxes, PackagePlus, Search, ShieldAlert, Warehouse } from "lucide-react";
import { useAdminInventoryOverview } from "../../hooks/use-admin-dashboard";
import AdminPageShell from "../../components/AdminPageShell";
import { createAdminInventoryMovement, createAdminInventoryProduct } from "../../service/service";
import type { CreateInventoryMovementPayload, CreateInventoryProductPayload } from "../../types/types";

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

const InventoryControl: React.FC = () => {
  const { data, error, loading, reload } = useAdminInventoryOverview();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [productModal, setProductModal] = useState(false);
  const [movementModal, setMovementModal] = useState(false);
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

    await createAdminInventoryProduct(payload)
      .then(async () => {
        setFeedback("Producto agregado al inventario.");
        setProductModal(false);
        setProductForm(emptyProductForm);
        await reload();
      })
      .catch((err: unknown) => {
        setFeedback(err instanceof Error ? err.message : "No se pudo guardar el producto.");
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

  return (
    <AdminPageShell
      tag="Devices"
      title="Inventario de dispositivos"
      subtitle="Productos reales, stock por bodega y movimientos para registrar uso o reabastecimiento."
      actions={
        <>
          <button onClick={() => setProductModal(true)} className="rounded-2xl bg-white px-4 py-2 font-semibold text-slate-900">
            Agregar producto
          </button>
          <button onClick={() => setMovementModal(true)} className="rounded-2xl border border-white/30 px-4 py-2 font-semibold text-white">
            Registrar movimiento
          </button>
        </>
      }
    >
      <div className="space-y-6">
        {feedback && <section className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">{feedback}</section>}
        {error && <section className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">{error}</section>}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><Boxes className="h-5 w-5 text-slate-700" /><p className="mt-4 text-xs uppercase tracking-wide text-slate-500">Productos</p><p className="mt-2 text-3xl font-semibold text-slate-900">{summary.totalProducts}</p></article>
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><Warehouse className="h-5 w-5 text-cyan-600" /><p className="mt-4 text-xs uppercase tracking-wide text-slate-500">Unidades</p><p className="mt-2 text-3xl font-semibold text-slate-900">{summary.totalUnits}</p></article>
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><ShieldAlert className="h-5 w-5 text-rose-600" /><p className="mt-4 text-xs uppercase tracking-wide text-slate-500">Bajo stock</p><p className="mt-2 text-3xl font-semibold text-slate-900">{summary.lowStock}</p></article>
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><Activity className="h-5 w-5 text-indigo-600" /><p className="mt-4 text-xs uppercase tracking-wide text-slate-500">Valor</p><p className="mt-2 text-3xl font-semibold text-slate-900">{currency.format(summary.totalValue)}</p></article>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Catalogo</p>
                <h2 className="text-2xl font-semibold text-slate-900">Productos del negocio</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar" className="w-full bg-transparent text-sm outline-none" />
                </label>
                <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none">
                  {categories.map((entry) => <option key={entry} value={entry}>{entry}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <article key={product.id} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                  <div className="p-3"><img src={product.image || fallbackImage} alt={product.name} className="h-44 w-full rounded-2xl object-cover" /></div>
                  <div className="space-y-4 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div><p className="text-xs uppercase tracking-[0.22em] text-slate-400">{product.subcategory}</p><h3 className="mt-1 text-lg font-semibold text-slate-900">{product.name}</h3></div>
                      <span className="text-sm font-semibold text-emerald-600">{currency.format(product.price)}</span>
                    </div>
                    <p className="text-sm leading-6 text-slate-600">{product.description || "Producto disponible para soporte e instalaciones."}</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-slate-50 p-3"><p className="text-[11px] uppercase tracking-wide text-slate-400">Stock</p><p className="mt-1 text-2xl font-semibold text-slate-900">{product.stock}</p></div>
                      <div className="rounded-2xl bg-slate-50 p-3"><p className="text-[11px] uppercase tracking-wide text-slate-400">Minimo</p><p className="mt-1 text-2xl font-semibold text-slate-900">{product.minimum}</p></div>
                    </div>
                    <p className="text-sm text-slate-600"><span className="font-semibold text-slate-900">Ubicacion:</span> {product.location}</p>
                    <div className="flex flex-wrap gap-2">
                      {product.chips.map((chip) => <span key={`${product.id}-${chip}`} className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">{chip}</span>)}
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <button onClick={() => { setMovementForm({ productId: product.id, movementType: "out", quantity: "1", reason: `Uso en proyecto de ${product.name}`, reference: "" }); setMovementModal(true); }} className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">Registrar uso</button>
                      <button onClick={() => { setMovementForm({ productId: product.id, movementType: "in", quantity: "1", reason: `Reposicion de ${product.name}`, reference: "" }); setMovementModal(true); }} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">Reabastecer</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {!loading && filteredProducts.length === 0 && (
              <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
                No hay productos para ese filtro todavía.
              </div>
            )}
          </article>

          <div className="space-y-6">
            <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Alertas de stock</h2>
              <div className="mt-4 space-y-3">
                {(alerts.length > 0 ? alerts : ["Inventario estable por ahora."]).map((alert) => (
                  <div key={alert} className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-800">{alert}</div>
                ))}
              </div>
            </article>

            <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Stock por bodega</h2>
              <div className="mt-4 space-y-3">
                {stockLevels.map((stock) => (
                  <article key={`${stock.material}-${stock.location}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
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

            <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Movimientos recientes</h2>
              <div className="mt-4 space-y-3">
                {recentMovements.map((movement) => (
                  <article key={movement.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
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
            <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[32px] bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Nuevo producto</p><h2 className="mt-2 text-2xl font-semibold text-slate-900">Agregar al inventario</h2></div><button onClick={() => setProductModal(false)} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Cerrar</button></div>
              <form onSubmit={submitProduct} className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {(["name", "category", "subcategory", "price", "stock", "minimum", "location", "image", "chips"] as const).map((key) => (
                    <label key={key} className="space-y-2">
                      <span className="text-sm font-semibold text-slate-700">{key}</span>
                      <input value={productForm[key]} onChange={(event) => setProductForm((current) => ({ ...current, [key]: event.target.value }))} required={key === "name" || key === "category"} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
                    </label>
                  ))}
                </div>
                <label className="block space-y-2"><span className="text-sm font-semibold text-slate-700">Descripcion</span><textarea value={productForm.description} onChange={(event) => setProductForm((current) => ({ ...current, description: event.target.value }))} rows={4} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" /></label>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={() => setProductModal(false)} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">Cancelar</button><button type="submit" disabled={busy} className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{busy ? "Guardando..." : "Guardar producto"}</button></div>
              </form>
            </div>
          </div>
        )}

        {movementModal && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-[32px] bg-white p-6 shadow-2xl">
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
