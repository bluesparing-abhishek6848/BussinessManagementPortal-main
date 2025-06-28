import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useGet from "../../Hooks/useGet";

interface FinanceControllerDetails {
  totalIncome: number;
  totalExpense: number;
  totalProfit: number;
  controllerName?: string;
  controllerEmail?: string;
}

const AdminDashboard = () => {
  const [financeDetails, setFinanceDetails] = useState<FinanceControllerDetails | null>(null);
  const { data, isLoading, error } = useGet<{ data: FinanceControllerDetails }>("finance/advance-summary");

  useEffect(() => {
    if (data && data?.data) {
      setFinanceDetails(data?.data);
    }
    if (error) {
      setFinanceDetails(null);
    }
  }, [data, error]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-2">Finance Controller Dashboard</h2>
        <p className="text-sm opacity-90">Comprehensive overview of today's finance summary</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-green-400">
          <p className="text-gray-500 text-sm">Total Profit</p>
          <h3 className="text-2xl font-bold text-green-600 mt-1">₹{financeDetails?.totalProfit ?? 0}</h3>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-400">
          <p className="text-gray-500 text-sm">Total Income</p>
          <h3 className="text-2xl font-bold text-blue-600 mt-1">₹{financeDetails?.totalIncome ?? 0}</h3>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-red-400">
          <p className="text-gray-500 text-sm">Total Expense</p>
          <h3 className="text-2xl font-bold text-red-600 mt-1">₹{financeDetails?.totalExpense ?? 0}</h3>
        </div>
      </div>

      {!isLoading && !financeDetails && (
        <div className="mt-6 bg-yellow-100 text-yellow-800 p-4 rounded-xl shadow-sm">
          No finance controller details available.
        </div>
      )}

      {isLoading && (
        <div className="mt-6 text-center text-gray-600">Loading...</div>
      )}
    </div>
  );
};

export default AdminDashboard;