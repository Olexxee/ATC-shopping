interface CheckoutNotesProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CheckoutNotes({ value, onChange }: CheckoutNotesProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-semibold text-gray-900">Delivery instructions</h2>

      <p className="mt-1 text-sm text-gray-500">
        Optional notes for your order.
      </p>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        maxLength={500}
        placeholder="For example: Please call when you arrive."
        className="mt-4 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
      />

      <div className="mt-1 text-right text-xs text-gray-400">
        {value.length}/500
      </div>
    </section>
  );
}
