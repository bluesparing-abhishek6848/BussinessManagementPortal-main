import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useGet from "../../Hooks/useGet";

interface AttendanceData {
  _id: string;
  employee: string;
  date: string;
  status: string;
  // add other fields as needed
}
interface OrderData {
  _id: string;
  customer: string;
  createdAt: string;
  status: string;
  // add other fields as needed
}
interface AdvanceData {
  _id: string;
  employee: string;
  createdAt: string;
  advanceAmount: number;
  // add other fields as needed
}
interface FinanceData {
  _id: string;
  type: string;
  amount: number;
  createdAt: string;
  // add other fields as needed
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
  attendance: AttendanceData[];
  orders: OrderData[];
  advances: AdvanceData[];
  finance: FinanceData[];
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

  // Calculate summary stats from arrays
  const attendanceStats = React.useMemo(() => {
    if (!periodData) return { present: 0, absent: 0, leave: 0 };
    return periodData.attendance.reduce(
      (acc, curr) => {
        if (curr.status === "present") acc.present += 1;
        else if (curr.status === "absent") acc.absent += 1;
        else if (curr.status === "leave") acc.leave += 1;
        return acc;
      },
      { present: 0, absent: 0, leave: 0 }
    );
  }, [periodData]);

  const orderStats = React.useMemo(() => {
    if (!periodData) return { total: 0, completed: 0, pending: 0 };
    return periodData.orders.reduce(
      (acc, curr) => {
        acc.total += 1;
        if (curr.status === "completed") acc.completed += 1;
        else if (curr.status === "pending") acc.pending += 1;
        return acc;
      },
      { total: 0, completed: 0, pending: 0 }
    );
  }, [periodData]);

  const advanceStats = React.useMemo(() => {
    if (!periodData) return { total: 0, totalAmount: 0 };
    return periodData.advances.reduce(
      (acc, curr) => {
        acc.total += 1;
        acc.totalAmount += curr.advanceAmount || 0;
        return acc;
      },
      { total: 0, totalAmount: 0 }
    );
  }, [periodData]);

  const financeStats = React.useMemo(() => {
    if (!periodData) return { totalIncome: 0, totalExpense: 0, totalProfit: 0 };
    let totalIncome = 0, totalExpense = 0;
    periodData.finance.forEach(f => {
      if (f.type === "income") totalIncome += f.amount;
      else if (f.type === "expense") totalExpense += f.amount;
    });
    return {
      totalIncome,
      totalExpense,
      totalProfit: totalIncome - totalExpense,
    };
  }, [periodData]);

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
          <span className="text-2xl font-bold mt-2">₹{financeStats.totalProfit}</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-blue-600 font-semibold text-lg">Income</span>
          <span className="text-2xl font-bold mt-2">₹{financeStats.totalIncome}</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-red-600 font-semibold text-lg">Expense</span>
          <span className="text-2xl font-bold mt-2">₹{financeStats.totalExpense}</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-yellow-600 font-semibold text-lg">Advances</span>
          <span className="text-2xl font-bold mt-2">{advanceStats.total}</span>
          <span className="text-gray-500 text-sm">₹{advanceStats.totalAmount}</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-purple-600 font-semibold text-lg">Orders</span>
          <span className="text-2xl font-bold mt-2">{orderStats.total}</span>
          <div className="flex gap-2 mt-1">
            <span className="text-green-600">✔{orderStats.completed}</span>
            <span className="text-orange-500">⏳{orderStats.pending}</span>
          </div>
        </div>
        {selectedPeriod === "day" && (
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-cyan-600 font-semibold text-lg">Attendance</span>
            <div className="flex gap-3 mt-2">
              <span className="text-green-600">P:{attendanceStats.present}</span>
              <span className="text-red-600">A:{attendanceStats.absent}</span>
              <span className="text-yellow-600">L:{attendanceStats.leave}</span>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Data Tables */}
      {/* <div className="mt-8">
        <h3 className="font-bold mb-2">Attendance ({selectedPeriod})</h3>
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-2">Employee</th>
              <th className="border px-2">Date</th>
              <th className="border px-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {periodData?.attendance.map((a) => (
              <tr key={a._id}>
                <td className="border px-2">{a.employee}</td>
                <td className="border px-2">{new Date(a.date).toLocaleDateString()}</td>
                <td className="border px-2">{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}

      {/* Repeat similar tables for Orders, Advances, Finance */}

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