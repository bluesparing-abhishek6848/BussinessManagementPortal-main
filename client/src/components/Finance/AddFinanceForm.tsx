import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import usePost from "../../Hooks/usePost";

const initialState = {
  type: "",
  amount: "",
  date: "",
  description: "",
};
interface FinanceFormData {
  type: string;
  amount: number | string;
  date: string;
  description?: string;
}
const AddFinanceForm = () => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
const { postData } = usePost<FinanceFormData>();

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
   await postData({
  ...form,
  amount: Number(form.amount),
}, "finance");
      navigate(-1); // Go back to the finance table
    } catch (error) {
      // Handle error (toast, etc.)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6">Add Finance Entry</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Type</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Amount</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
            min={0}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          {loading ? "Saving..." : "Add Finance"}
        </button>
      </form>
    </div>
  );
};

export default AddFinanceForm;