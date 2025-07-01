import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useGet from "../../Hooks/useGet";

interface AttendanceStats {
  present: number;
  absent: number;
  leave: number;
}
interface OrderStats {
  total: number;
  completed: number;
  pending: number;
}
interface AdvanceStats {
  total: number;
  totalAmount: number;
}
interface FinanceStats {
  totalIncome: number;
  totalExpense: number;
  totalProfit: number;
}
interface EmployeesStats {
  total: number;
  active: number;
}
interface UsersStats {
  total: number;
  admins: number;
}
interface DashboardPeriodData {
  attendance: AttendanceStats;
  orders: OrderStats;
  advances: AdvanceStats;
  finance: FinanceStats;
}
interface DashboardData {
  day: DashboardPeriodData;
  week: DashboardPeriodData;
  month: DashboardPeriodData;
  year: DashboardPeriodData;
  employees: EmployeesStats;
  users: UsersStats;
}

const periodOptions = [
  { key: "day", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "year", label: "This Year" },
] as const;

const AdminDashboard = () => {
  const { data, isLoading, error } = useGet<{ data: DashboardData }>("finance/advance-summary");
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<keyof Omit<DashboardData, "employees" | "users">>("day");

  useEffect(() => {
    if (data && data.data) setDashboard(data.data);
    if (error) setDashboard(null);
  }, [data, error]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const periodData = dashboard?.[selectedPeriod];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold mb-2 tracking-tight">Business Management Dashboard</h2>
          <p className="text-lg opacity-90">Comprehensive overview of your business at a glance</p>
        </div>
        <div className="flex gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold">{dashboard?.employees.total ?? "--"}</div>
            <div className="text-sm opacity-80">Employees</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold">{dashboard?.users.total ?? "--"}</div>
            <div className="text-sm opacity-80">Users</div>
          </div>
        </div>
      </div>

      {/* Period Dropdown */}
      <div className="mt-8 flex justify-end">
        <select
          className="border rounded-lg px-4 py-2 text-lg"
          value={selectedPeriod}
          onChange={e => setSelectedPeriod(e.target.value as keyof Omit<DashboardData, "employees" | "users">)}
        >
          {periodOptions.map(opt => (
            <option key={opt.key} value={opt.key}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Tiles for each stat */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-green-600 font-semibold text-lg">Profit</span>
          <span className="text-2xl font-bold mt-2">₹{periodData?.finance.totalProfit ?? 0}</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-blue-600 font-semibold text-lg">Income</span>
          <span className="text-2xl font-bold mt-2">₹{periodData?.finance.totalIncome ?? 0}</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-red-600 font-semibold text-lg">Expense</span>
          <span className="text-2xl font-bold mt-2">₹{periodData?.finance.totalExpense ?? 0}</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-yellow-600 font-semibold text-lg">Advances</span>
          <span className="text-2xl font-bold mt-2">{periodData?.advances.total ?? 0}</span>
          <span className="text-gray-500 text-sm">₹{periodData?.advances.totalAmount ?? 0}</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-purple-600 font-semibold text-lg">Orders</span>
          <span className="text-2xl font-bold mt-2">{periodData?.orders.total ?? 0}</span>
          <div className="flex gap-2 mt-1">
            <span className="text-green-600">✔{periodData?.orders.completed ?? 0}</span>
            <span className="text-orange-500">⏳{periodData?.orders.pending ?? 0}</span>
          </div>
        </div>
        {selectedPeriod === "day" && (
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-cyan-600 font-semibold text-lg">Attendance</span>
            <div className="flex gap-3 mt-2">
              <span className="text-green-600">P:{periodData?.attendance.present ?? 0}</span>
              <span className="text-red-600">A:{periodData?.attendance.absent ?? 0}</span>
              <span className="text-yellow-600">L:{periodData?.attendance.leave ?? 0}</span>
            </div>
          </div>
        )}
      </div>

      {!isLoading && !dashboard && (
        <div className="mt-10 bg-yellow-100 text-yellow-800 p-6 rounded-xl shadow-sm text-center text-lg">
          No dashboard data available.
        </div>
      )}

      {isLoading && (
        <div className="mt-10 text-center text-gray-600 text-lg">Loading dashboard...</div>
      )}
    </div>
  );
};

export default AdminDashboard;