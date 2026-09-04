import { Navigate, Outlet } from "react-router-dom";
import { useCurrentAdmin } from "../features/admin/auth/useAdminAuth";

export function AdminRoute() {
  const { data: admin, isLoading, isError } = useCurrentAdmin();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-gray-500">Checking authentication...</div>
      </div>
    );
  }

  if (isError || !admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
