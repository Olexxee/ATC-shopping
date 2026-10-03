export interface FlexPayCalculationInput {
  subtotal: number;
  installmentCount: number;
  installmentIntervalDays: number;
  startDate?: Date;
}

export interface FlexPayInstallmentPreview {
  sequence: number;
  amount: number;
  dueDate: Date;
}

export interface FlexPayCalculation {
  subtotal: number;
  installmentCount: number;
  installmentIntervalDays: number;
  firstPaymentAmount: number;
  totalScheduled: number;
  balanceAfterFirstPayment: number;
  installments: FlexPayInstallmentPreview[];
}

const toKobo = (amount: number) => Math.round(amount * 100);

const fromKobo = (amount: number) => amount / 100;

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export function calculateFlexPayPlan({
  subtotal,
  installmentCount,
  installmentIntervalDays,
  startDate = new Date(),
}: FlexPayCalculationInput): FlexPayCalculation {
  const safeSubtotal = Number.isFinite(subtotal) ? subtotal : 0;

  if (!Number.isInteger(installmentCount) || installmentCount < 2) {
    throw new Error("FlexPay must have at least two payments.");
  }

  if (
    !Number.isInteger(installmentIntervalDays) ||
    installmentIntervalDays < 1
  ) {
    throw new Error("FlexPay payment interval must be valid.");
  }

  // Empty/initial checkout state.
  if (safeSubtotal <= 0) {
    return {
      subtotal: 0,
      installmentCount,
      installmentIntervalDays,
      firstPaymentAmount: 0,
      totalScheduled: 0,
      balanceAfterFirstPayment: 0,
      installments: [],
    };
  }

  const subtotalKobo = toKobo(safeSubtotal);

  const baseAmount = Math.floor(subtotalKobo / installmentCount);

  const remainder = subtotalKobo % installmentCount;

  const installments: FlexPayInstallmentPreview[] = [];

  for (let index = 0; index < installmentCount; index += 1) {
    const amountKobo = baseAmount + (index < remainder ? 1 : 0);

    installments.push({
      sequence: index + 1,
      amount: fromKobo(amountKobo),
      dueDate:
        index === 0
          ? new Date(startDate)
          : addDays(startDate, installmentIntervalDays * index),
    });
  }

  const firstPaymentAmount = installments[0]?.amount ?? 0;

  return {
    subtotal: safeSubtotal,
    installmentCount,
    installmentIntervalDays,
    firstPaymentAmount,
    totalScheduled: installments.reduce(
      (total, installment) => total + installment.amount,
      0,
    ),
    balanceAfterFirstPayment: Math.max(0, safeSubtotal - firstPaymentAmount),
    installments,
  };
}
