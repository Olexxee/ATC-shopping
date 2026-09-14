import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

interface AuthContainerProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export default function AuthContainer({
  title,
  subtitle,
  children,
  footer,
}: AuthContainerProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-gray-900 no-underline"
          >
            <ShoppingBag className="h-6 w-6" />
            <span>Keplex</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            {/* Heading */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                {title}
              </h1>

              <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
            </div>

            {/* Form */}
            {children}

            {/* Footer */}
            <div className="mt-6 border-t border-gray-100 pt-6 text-center text-sm text-gray-500">
              {footer}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Keplex. All rights reserved.
      </footer>
    </div>
  );
}
