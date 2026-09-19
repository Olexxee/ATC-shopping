// import { Link } from "react-router-dom";
// import { ArrowRight, Package, Plus } from "lucide-react";
// import type { ReactNode } from "react";
// import { useAdminProducts } from "../../features/admin/products/hooks/useAdminProducts";

// export function AdminDashboardPage() {
//   // Fetch a large batch of products for the summary stats. The dashboard
//   // is a read-only overview — 100 is plenty to compute counts from, and
//   // it's cheaper than issuing four separate count queries on the backend.
//   const productsQuery = useAdminProducts({ page: 1, limit: 100 });

//   const products = productsQuery.data?.products ?? [];
//   const totalProducts = productsQuery.data?.pagination?.total ?? 0;

//   const activeProducts = products.filter((p) => p.status === "ACTIVE").length;
//   const draftProducts = products.filter((p) => p.status === "DRAFT").length;

//   // NOTE: `AdminListRow` (the shape this hook returns) does NOT include
//   // variants. The low-stock count can't be computed from it. When the
//   // backend exposes a low-stock endpoint (or a variant count summary on
//   // the list row), wire it here. For now the card renders "—".
//   const lowStockProducts: number | null = null;

//   const isLoading = productsQuery.isLoading;
//   const lowStockDisplay = isLoading
//     ? "—"
//     : lowStockProducts == null
//       ? "—"
//       : lowStockProducts.toLocaleString();

//   return (
//     <div className="mx-auto max-w-7xl">
//       <div className="mb-8">
//         <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
//           Overview
//         </p>

//         <h1 className="mt-2 text-2xl font-semibold text-slate-900">
//           Dashboard
//         </h1>

//         <p className="mt-2 text-sm text-slate-500">
//           Manage your Keplex store from one place.
//         </p>
//       </div>

//       <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
//         <StatCard
//           label="Total products"
//           value={isLoading ? "—" : totalProducts.toLocaleString()}
//           icon={<Package size={18} />}
//         />

//         <StatCard
//           label="Active"
//           value={isLoading ? "—" : activeProducts.toLocaleString()}
//           icon={<Package size={18} />}
//         />

//         <StatCard
//           label="Drafts"
//           value={isLoading ? "—" : draftProducts.toLocaleString()}
//           icon={<Package size={18} />}
//         />

//         <StatCard
//           label="Low stock"
//           value={
//             isLoading || lowStockProducts === null
//               ? "—"
//               : lowStockProducts.toLocaleString()
//           }
//           icon={<Package size={18} />}
//         />
//       </div>

//       <div className="mt-8 grid gap-6 lg:grid-cols-2">
//         <section className="rounded-xl border border-slate-200 bg-white p-6">
//           <h2 className="text-base font-semibold text-slate-900">
//             Quick actions
//           </h2>

//           <div className="mt-5 space-y-3">
//             <Link
//               to="/admin/products/new"
//               className="flex items-center justify-between rounded-lg border border-slate-200 p-4 transition hover:border-slate-900"
//             >
//               <div className="flex items-center gap-3">
//                 <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
//                   <Plus size={17} />
//                 </div>

//                 <div>
//                   <p className="text-sm font-medium text-slate-900">
//                     Add product
//                   </p>

//                   <p className="mt-0.5 text-xs text-slate-500">
//                     Create a new catalog product
//                   </p>
//                 </div>
//               </div>

//               <ArrowRight size={16} className="text-slate-400" />
//             </Link>

//             <Link
//               to="/admin/products"
//               className="flex items-center justify-between rounded-lg border border-slate-200 p-4 transition hover:border-slate-900"
//             >
//               <div className="flex items-center gap-3">
//                 <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
//                   <Package size={17} />
//                 </div>

//                 <div>
//                   <p className="text-sm font-medium text-slate-900">
//                     Manage products
//                   </p>

//                   <p className="mt-0.5 text-xs text-slate-500">
//                     View and manage the catalog
//                   </p>
//                 </div>
//               </div>

//               <ArrowRight size={16} className="text-slate-400" />
//             </Link>
//           </div>
//         </section>

//         <section className="rounded-xl border border-slate-200 bg-white p-6">
//           <h2 className="text-base font-semibold text-slate-900">Catalog</h2>

//           <p className="mt-2 text-sm leading-6 text-slate-500">
//             Categories, brands and collections will be managed from this
//             administration area as those modules are added.
//           </p>

//           <div className="mt-5 grid gap-3 sm:grid-cols-3">
//             <PlaceholderLink label="Categories" />
//             <PlaceholderLink label="Brands" />
//             <PlaceholderLink label="Collections" />
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }

// function StatCard({
//   label,
//   value,
//   icon,
// }: {
//   label: string;
//   value: string;
//   icon: ReactNode;
// }) {
//   return (
//     <div className="rounded-xl border border-slate-200 bg-white p-5">
//       <div className="flex items-center justify-between">
//         <span className="text-sm text-slate-500">{label}</span>
//         <span className="text-slate-400">{icon}</span>
//       </div>

//       <p className="mt-4 text-2xl font-semibold text-slate-900">{value}</p>
//     </div>
//   );
// }

// function PlaceholderLink({ label }: { label: string }) {
//   return (
//     <div className="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-center">
//       <p className="text-xs font-medium text-slate-400">{label}</p>
//       <p className="mt-1 text-[11px] text-slate-400">Coming soon</p>
//     </div>
//   );
// }
