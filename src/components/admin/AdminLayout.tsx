import { Outlet } from "react-router-dom";
import { useAuthStore } from "../../features/auth/auth.store";
import { AdminSidebar } from "../../components/admin/AdminSidebar";

export function AdminLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 h-16 border-b border-slate-200 bg-white">
        <div className="flex h-full items-center justify-between px-6">
          <div>
            <span className="font-semibold tracking-tight text-slate-900">
              Keplex
            </span>

            <span className="ml-2 text-sm text-slate-400">Admin</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-900">
                {user?.fullName ?? "Administrator"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => void logout()}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        <AdminSidebar />

        <main className="min-w-0 flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
