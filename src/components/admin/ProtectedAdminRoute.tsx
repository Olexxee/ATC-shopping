import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../features/auth/auth.store";

export function ProtectedAdminRoute() {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const isLoading = useAuthStore(
    (state) => state.isLoading,
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

