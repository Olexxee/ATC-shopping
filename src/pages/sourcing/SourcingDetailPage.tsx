import {
  ArrowLeft,
  Loader2,
  TriangleAlert,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { SourcingRequestDetail } from "../../features/sourcing/components/SourcingRequestDetail";
import { useMySourcingRequest } from "../../features/sourcing/sourcing.queries";

export default function SourcingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: request,
    isLoading,
    isError,
    error,
    refetch,
  } = useMySourcingRequest(id);

  if (!id) {
    return (
      <SourcingPageError
        title="Request not found"
        message="No sourcing request ID was provided."
        onRetry={() => navigate("/sourcing")}
      />
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
        <Link
          to="/sourcing"
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to sourcing
        </Link>

        {isLoading && (
          <div className="mt-8 flex min-h-96 items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="flex flex-col items-center gap-3 text-center">
              <Loader2
                size={28}
                className="animate-spin text-slate-400"
              />

              <p className="text-sm font-medium text-slate-700">
                Loading request...
              </p>
            </div>
          </div>
        )}

        {isError && (
          <div className="mt-8">
            <SourcingPageError
              title="Unable to load request"
              message={
                error instanceof Error
                  ? error.message
                  : "The sourcing request could not be loaded."
              }
              onRetry={() => {
                void refetch();
              }}
            />
          </div>
        )}

        {!isLoading && !isError && request && (
          <div className="mt-8">
            <SourcingRequestDetail request={request} />
          </div>
        )}
      </div>
    </main>
  );
}

interface SourcingPageErrorProps {
  title: string;
  message: string;
  onRetry: () => void;
}

function SourcingPageError({
  title,
  message,
  onRetry,
}: SourcingPageErrorProps) {
  return (
    <div className="flex min-h-96 items-center justify-center rounded-2xl border border-red-200 bg-red-50">
      <div className="max-w-md px-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
          <TriangleAlert size={22} />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-slate-900">
          {title}
        </h2>

        <p className="mt-2 text-sm text-slate-600">{message}</p>

        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Try again
          </button>

          <Link
            to="/sourcing"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            New request
          </Link>
        </div>
      </div>
    </div>
  );
}
