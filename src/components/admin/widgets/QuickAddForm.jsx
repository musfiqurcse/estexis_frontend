import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

const initialForm = { title: "", location: "", price: "", type: "apartments" };

export function QuickAddForm() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm(initialForm);
    }, 3000);
  }

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <h2 className="mb-4 text-sm font-semibold text-gray-900">Quick Add Property</h2>
      {submitted ? (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          Property draft saved successfully.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="input-field"
            placeholder="Property title"
            value={form.title}
            onChange={set("title")}
            required
          />
          <input
            className="input-field"
            placeholder="Location (city, country)"
            value={form.location}
            onChange={set("location")}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              className="input-field"
              type="number"
              placeholder="Price (€)"
              value={form.price}
              onChange={set("price")}
              required
              min="0"
            />
            <select className="input-field" value={form.type} onChange={set("type")}>
              <option value="apartments">Apartment</option>
              <option value="villas">Villa</option>
              <option value="family">Family Home</option>
              <option value="beach">Beach House</option>
              <option value="city">City Home</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>
          <button type="submit" className="btn-primary w-full">
            Save Draft
          </button>
        </form>
      )}
    </div>
  );
}
