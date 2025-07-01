import { useEffect, useState } from "react";
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

const periodLabels: Record<keyof Omit<DashboardData, "employees" | "users">, string> = {
  day: "Today",
  week: "This Week",
  month: "This Month",
  year: "This Year",
};

const AdminDashboard = () => {
  const { data, isLoading, error } = useGet<{ data: DashboardData }>("finance/advance-summary");
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (data && data.data) setDashboard(data.data);
    if (error) setDashboard(null);
  }, [data, error]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

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

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {(["day", "week", "month", "year"] as const).map((period) => (
          <div key={period} className="bg-white rounded-2xl shadow-lg p-6 border-t-8 border-gradient-to-r from-blue-400 to-indigo-400 hover:scale-105 transition-transform duration-200">
            <h3 className="text-xl font-bold mb-4 text-indigo-700">{periodLabels[period]}</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-semibold">Profit:</span>
                <span className="font-bold">₹{dashboard?.[period].finance.totalProfit ?? 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-semibold">Income:</span>
                <span>₹{dashboard?.[period].finance.totalIncome ?? 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-600 font-semibold">Expense:</span>
                <span>₹{dashboard?.[period].finance.totalExpense ?? 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-600 font-semibold">Advances:</span>
                <span>
                  {dashboard?.[period].advances.total ?? 0} (₹{dashboard?.[period].advances.totalAmount ?? 0})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-600 font-semibold">Orders:</span>
                <span>
                  {dashboard?.[period].orders.total ?? 0} | 
                  <span className="ml-1 text-green-600">✔{dashboard?.[period].orders.completed ?? 0}</span> | 
                  <span className="ml-1 text-orange-500">⏳{dashboard?.[period].orders.pending ?? 0}</span>
                </span>
              </div>
              {period === "day" && (
                <div className="flex items-center gap-2">
                  <span className="text-cyan-600 font-semibold">Attendance:</span>
                  <span>
                    <span className="text-green-600">P:{dashboard?.[period].attendance.present ?? 0}</span>{" "}
                    <span className="text-red-600">A:{dashboard?.[period].attendance.absent ?? 0}</span>{" "}
                    <span className="text-yellow-600">L:{dashboard?.[period].attendance.leave ?? 0}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
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