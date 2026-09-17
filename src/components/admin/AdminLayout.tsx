import { useState } from "react";
import { Menu } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "../../features/auth/auth.store";
import { AdminSidebar } from "../../components/admin/AdminSidebar";


export function AdminLayout() {
const reset = useAuthStore((state) => state.reset);
const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

return ( <div className="min-h-screen bg-slate-50"> <header className="sticky top-0 z-40 h-16 border-b border-slate-200 bg-white"> <div className="flex h-full items-center justify-between px-4 sm:px-6"> <div className="flex items-center gap-3">
{/* Mobile menu button */}
<button
type="button"
onClick={() => setMobileSidebarOpen(true)}
className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
aria-label="Open navigation menu"
> <Menu size={21} /> </button>
        <div>
          <span className="font-semibold tracking-tight text-slate-900">
            Keplex
          </span>

          <span className="ml-2 text-sm text-slate-400">Admin</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-900">
            Administrator
          </p>
        </div>

        <button
          type="button"
          onClick={reset}
          className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          Logout
        </button>
      </div>
    </div>
  </header>

  <AdminSidebar
    mobileOpen={mobileSidebarOpen}
    onMobileClose={() => setMobileSidebarOpen(false)}
  />

  <div className="flex min-h-[calc(100vh-4rem)]">
    {/* Desktop sidebar occupies layout space */}
    <div className="hidden lg:block">
      <AdminSidebar />
    </div>

    <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
      <Outlet />
    </main>
  </div>
</div>

);
}
