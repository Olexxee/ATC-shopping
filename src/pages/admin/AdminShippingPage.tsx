import { useState } from "react";
import { Truck } from "lucide-react";
import {
  useShippingConfigurations,
  useShippingRules,
} from "../../features/admin/shipping/shipping.queries";
import { useDeleteShippingRule } from "../../features/admin/shipping/shipping.mutations";
import { ShippingConfigurationForm } from "../../features/admin/shipping/components/ShippingConfigurationForm";
import { ShippingRulesTable } from "../../features/admin/shipping/components/ShippingRulesTable";
import { ShippingRuleForm } from "../../features/admin/shipping/components/ShippingRuleForm";
import type { ShippingRule } from "../../features/admin/shipping/shipping.types";
import { AdminConfirmDialog } from "../../components/admin/AdminConfirmDialog";



export function AdminShippingPage() {
  const {
    data: configurations,
    isLoading: configurationsLoading,
    isError: configurationsError,
  } = useShippingConfigurations();

  const configuration =
    configurations?.find((item) => item.status === "ACTIVE") ??
    configurations?.[0];

  const { data: rules = [], isLoading: rulesLoading } = useShippingRules(
    configuration?.id,
  );

  const deleteMutation = useDeleteShippingRule();

  const [editingRule, setEditingRule] = useState<ShippingRule | null>(null);

  const [showRuleForm, setShowRuleForm] = useState(false);

  const [deletingRule, setDeletingRule] = useState<ShippingRule | null>(null);

  function handleCreateRule() {
    setEditingRule(null);
    setShowRuleForm(true);
  }

  function handleEditRule(rule: ShippingRule) {
    setEditingRule(rule);
    setShowRuleForm(true);
  }

  function handleCloseRuleForm() {
    setShowRuleForm(false);
    setEditingRule(null);
  }

  async function handleDeleteRule() {
    if (!deletingRule) return;

    await deleteMutation.mutateAsync(deletingRule.id);

    setDeletingRule(null);
  }

  if (configurationsLoading) {
    return (
      <div className="p-6">
        <div className="h-8 w-48 animate-pulse rounded bg-neutral-200" />

        <div className="mt-6 h-64 animate-pulse rounded-xl bg-neutral-100" />
      </div>
    );
  }

  if (configurationsError) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h1 className="font-semibold text-red-900">
            Unable to load shipping settings
          </h1>

          <p className="mt-1 text-sm text-red-700">
            The shipping configuration could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8 p-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-950 text-white">
              <Truck size={20} />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-950">
                Shipping
              </h1>

              <p className="mt-1 text-sm text-neutral-500">
                Configure shipping rates and rules for your store.
              </p>
            </div>
          </div>
        </div>

        {!configuration ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-8">
            <h2 className="text-lg font-semibold text-neutral-950">
              No shipping configuration
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Create a shipping configuration before adding shipping rules.
            </p>
          </div>
        ) : (
          <>
            <section className="rounded-xl border border-neutral-200 bg-white p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-neutral-950">
                  Shipping Configuration
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  These values are used as the default shipping calculation.
                </p>
              </div>

              <ShippingConfigurationForm configuration={configuration} />
            </section>

            <section className="rounded-xl border border-neutral-200 bg-white p-6">
              {rulesLoading ? (
                <div className="h-40 animate-pulse rounded-lg bg-neutral-100" />
              ) : (
                <ShippingRulesTable
                  rules={rules}
                  onCreate={handleCreateRule}
                  onEdit={handleEditRule}
                  onDelete={setDeletingRule}
                />
              )}
            </section>
          </>
        )}
      </div>

      {showRuleForm && configuration && (
        <ShippingRuleForm
          configurationId={configuration.id}
          rule={editingRule}
          onClose={handleCloseRuleForm}
        />
      )}

      {deletingRule && (
        <AdminConfirmDialog
          open={Boolean(deletingRule)}
          title="Delete shipping rule"
          description={`Are you sure you want to delete "${deletingRule.name}"? This action cannot be undone.`}
          confirmLabel="Delete rule"
          onConfirm={handleDeleteRule}
          onCancel={() => setDeletingRule(null)}
          loading={deleteMutation.isPending}
        />
      )}
    </>
  );
}
