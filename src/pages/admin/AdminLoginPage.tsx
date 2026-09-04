import type { FormEvent } from "react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAdminLogin } from "../../features/admin/auth/useAdminLogin";
import { useCurrentAdmin } from "../../features/admin/auth/useAdminAuth";

export function AdminLoginPage() {
  const navigate = useNavigate();

  const { data: admin, isLoading: checkingAuth } =
    useCurrentAdmin();

  const login = useAdminLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-sm text-gray-500">
          Loading...
        </span>
      </div>
    );
  }

  if (admin) {
    return <Navigate to="/admin/products" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await login.mutateAsync({
        email,
        password,
      });

      navigate("/admin/products", {
        replace: true,
      });
    } catch {
      // Error is exposed through login.error.
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            Administration
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-gray-900">
            Sign in
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to manage your store.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900"
            />
          </div>

          {login.isError && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              Unable to sign in. Check your credentials and try again.
            </p>
          )}

          <button
            type="submit"
            disabled={login.isPending}
            className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {login.isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}