import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCurrentUser } from "../../features/auth/auth.queries";

export default function ProtectedRoute() {
  const location = useLocation();

  const { data: user, isLoading, isError } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{
          from: {
            pathname: location.pathname,
            search: location.search,
          },
        }}
      />
    );
  }

  return <Outlet />;
}
