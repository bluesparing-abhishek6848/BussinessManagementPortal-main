import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useGet from "../../Hooks/useGet";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import usePut from "../../Hooks/usePut";
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

const PAGE_SIZE = 10;

const AdminDashboard = () => {
  const { data, isLoading, error } = useGet<{ data: DashboardData }>(
    "finance/advance-summary"
  );
  const { putData, isLoading: isPutLoading } = usePut<any>();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [selectedPeriod, setSelectedPeriod] =
    useState<keyof Omit<DashboardData, "employees" | "users">>("day");

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
    let totalIncome = 0,
      totalExpense = 0;
    periodData.finance.forEach((f) => {
      if (f.type === "income") totalIncome += f.amount;
      else if (f.type === "expense") totalExpense += f.amount;
    });
    return {
      totalIncome,
      totalExpense,
      totalProfit: totalIncome - totalExpense,
    };
  }, [periodData]);

  // Modal state
  const [openModal, setOpenModal] = useState<
    | null
    | "attendance"
    | "orders"
    | "advances"
    | "finance"
    | "income"
    | "expense"
  >(null);
  const [modalPage, setModalPage] = useState(1);

  // Get the correct data array for the open modal and selected period
  const modalFullData = React.useMemo(() => {
    if (!dashboard || !openModal) return [];
    const periodData = dashboard[selectedPeriod];
    if (!periodData) return [];
    if (openModal === "finance") {
      // Show all finance entries for "Profit"
      return periodData.finance;
    }
    if (openModal === "income") {
      // Only income entries
      return periodData.finance.filter((f) => f.type === "income");
    }
    if (openModal === "expense") {
      // Only expense entries
      return periodData.finance.filter((f) => f.type === "expense");
    }
    return periodData[openModal] || [];
  }, [dashboard, openModal, selectedPeriod]);
  // Paginate the data
  const modalData = React.useMemo(() => {
    const start = (modalPage - 1) * PAGE_SIZE;
    return modalFullData.slice(start, start + PAGE_SIZE);
  }, [modalFullData, modalPage]);

  const modalTotalPages = Math.ceil(modalFullData.length / PAGE_SIZE);

  // Open modal and reset page
  const handleOpenModal = (
    type:
      | "attendance"
      | "orders"
      | "advances"
      | "finance"
      | "income"
      | "expense"
  ) => {
    setOpenModal(type);
    setModalPage(1);
  };

  // Handle page change in modal
  const handleModalPageChange = (newPage: number) => {
    setModalPage(newPage);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold mb-2 tracking-tight">
            Business Management Dashboard
          </h2>
          <p className="text-lg opacity-90">
            Comprehensive overview of your business at a glance
          </p>
        </div>
        <div className="flex gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold">
              {dashboard?.employees.total ?? "--"}
            </div>
            <div className="text-sm opacity-80">Employees</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold">
              {dashboard?.users.total ?? "--"}
            </div>
            <div className="text-sm opacity-80">Users</div>
          </div>
        </div>
      </div>

      {/* Period Dropdown */}
      <div className="mt-8 flex justify-end">
        <select
          className="border rounded-lg px-4 py-2 text-lg"
          value={selectedPeriod}
          onChange={(e) =>
            setSelectedPeriod(
              e.target.value as keyof Omit<DashboardData, "employees" | "users">
            )
          }
        >
          {periodOptions.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tiles for each stat */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          className="bg-white rounded-xl shadow p-6 flex flex-col items-center cursor-pointer hover:bg-indigo-50"
          onClick={() => handleOpenModal("finance")}
        >
          <span className="text-green-600 font-semibold text-lg">Profit</span>
          <span className="text-2xl font-bold mt-2">
            ₹{financeStats.totalProfit}
          </span>
        </div>
        <div
          className="bg-white rounded-xl shadow p-6 flex flex-col items-center cursor-pointer hover:bg-blue-50"
          onClick={() => handleOpenModal("income")}
        >
          <span className="text-blue-600 font-semibold text-lg">Income</span>
          <span className="text-2xl font-bold mt-2">
            ₹{financeStats.totalIncome}
          </span>
        </div>
        <div
          className="bg-white rounded-xl shadow p-6 flex flex-col items-center cursor-pointer hover:bg-red-50"
          onClick={() => handleOpenModal("expense")}
        >
          <span className="text-red-600 font-semibold text-lg">Expense</span>
          <span className="text-2xl font-bold mt-2">
            ₹{financeStats.totalExpense}
          </span>
        </div>
        <div
          className="bg-white rounded-xl shadow p-6 flex flex-col items-center cursor-pointer hover:bg-yellow-50"
          onClick={() => handleOpenModal("advances")}
        >
          <span className="text-yellow-600 font-semibold text-lg">
            Advances
          </span>
          <span className="text-2xl font-bold mt-2">{advanceStats.total}</span>
          <span className="text-gray-500 text-sm">
            ₹{advanceStats.totalAmount}
          </span>
        </div>
        <div
          className="bg-white rounded-xl shadow p-6 flex flex-col items-center cursor-pointer hover:bg-purple-50"
          onClick={() => handleOpenModal("orders")}
        >
          <span className="text-purple-600 font-semibold text-lg">Orders</span>
          <span className="text-2xl font-bold mt-2">{orderStats.total}</span>
          <div className="flex gap-2 mt-1">
            <span className="text-green-600">✔{orderStats.completed}</span>
            <span className="text-orange-500">⏳{orderStats.pending}</span>
          </div>
        </div>
        {selectedPeriod === "day" && (
          <div
            className="bg-white rounded-xl shadow p-6 flex flex-col items-center cursor-pointer hover:bg-cyan-50"
            onClick={() => handleOpenModal("attendance")}
          >
            <span className="text-cyan-600 font-semibold text-lg">
              Attendance
            </span>
            <div className="flex gap-3 mt-2">
              <span className="text-green-600">
                P:{attendanceStats.present}
              </span>
              <span className="text-red-600">A:{attendanceStats.absent}</span>
              <span className="text-yellow-600">L:{attendanceStats.leave}</span>
            </div>
          </div>
        )}
      </div>

      {/* Modal for tile details */}
      <Modal open={!!openModal} onClose={() => setOpenModal(null)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            minWidth: 700, // wider modal
            maxWidth: "90vw",
            minHeight: 400,
            maxHeight: "90vh",
            borderRadius: 2,
            overflow: "auto",
          }}
        >
          <h2 style={{ marginBottom: 16 }}>
            {openModal === "attendance" && "Attendance List"}
            {openModal === "orders" && "Orders List"}
            {openModal === "advances" && "Advances List"}
            {openModal === "finance" && "Profit List"}
            {openModal === "income" && "Income List"}
            {openModal === "expense" && "Expense List"}
          </h2>
          <div style={{ maxHeight: "60vh", overflow: "auto" }}>
            <div style={{ overflowX: "auto" }}>
              <table className="min-w-full border text-sm">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    {openModal === "attendance" && (
                      <>
                        <th className="border px-2">Employee</th>
                        <th className="border px-2">Date</th>
                        <th className="border px-2">Status</th>
                        <th className="border px-2">Check-In</th>
                        <th className="border px-2">Check-Out</th>
                      </>
                    )}
                    {openModal === "orders" && (
                      <>
                        <th className="border px-2">Customer</th>
                        <th className="border px-2">Date</th>
                        <th className="border px-2">Status</th>
                        <th className="border px-2">Amount</th>
                        <th className="border px-2">Amount Received</th>
                        <th className="border px-2">Expense Cost</th>
                        <th className="border px-2" style={{ minWidth: 120 }}>
                          Item Description
                        </th>
                        <th className="border px-2">Action</th>
                      </>
                    )}
                    {openModal === "advances" && (
                      <>
                        <th className="border px-2">Employee</th>
                        <th className="border px-2">Amount</th>
                        <th className="border px-2">Date</th>
                      </>
                    )}
                    {["finance", "income", "expense"].includes(
                      openModal as string
                    ) && (
                      <>
                        <th className="border px-2">Type</th>
                        <th className="border px-2">Amount</th>
                        <th className="border px-2">Date</th>
                        <th className="border px-2">Description</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {modalData.map((item: any) => (
                    <tr key={item._id}>
                      {openModal === "attendance" && (
                        <>
                          <td className="border px-2">
                            {item.employeeId?.name || "--"}
                          </td>
                          <td className="border px-2">
                            {new Date(item.date).toLocaleDateString()}
                          </td>
                          <td className="border px-2">{item.status}</td>
                          <td className="border px-2">
                            {item.checkInTime
                              ? new Date(item.checkInTime).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" }
                                )
                              : "--"}
                          </td>
                          <td className="border px-2">
                            {item.checkOutTime
                              ? new Date(item.checkOutTime).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" }
                                )
                              : "--"}
                          </td>
                        </>
                      )}
                      {openModal === "orders" && (
                        <>
                          <td className="border px-2">
                            {item.customerName || "--"}
                          </td>
                          <td className="border px-2">
                            {new Date(item.date).toLocaleDateString()}
                          </td>
                          <td className="border px-2">{item.status}</td>
                          <td className="border px-2">{item.price || "--"}</td>
                          <td className="border px-2">
                            {item.amountRecieved ?? "--"}
                          </td>
                          <td className="border px-2">
                            {item.expenseCost ?? "--"}
                          </td>
                          <td
                            className="border px-2"
                            style={{
                              maxWidth: 180,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              cursor: "pointer",
                            }}
                            title={item.itemDescription}
                          >
                            {item.itemDescription}
                          </td>
                       <td className="border px-2">
  <select
    value={item.status}
    onChange={async (e) => {
      const newStatus = e.target.value;
      try {
        const payload = {
          orderId: item._id,
          status: newStatus,
        };
        const res = await putData(payload, `orders/updateOrder`);
        if (res && res.success) {
          toast.success("Order status updated!");
            await new Promise((resolve) => setTimeout(resolve, 2000));
         
          // Optionally refresh data here
          //refresh
          // 
          window.location.reload();

        } else if (res && res.error) {
          toast.error(res.error);

        } else {
          toast.error("Failed to update status");
        }
      } catch (err) {
        toast.error("Error updating status");
      }
    }}
    className="border rounded px-1"
    disabled={isPutLoading}
  >
    <option value="recieved">Recieved</option>
    <option value="making">Making</option>
    <option value="completed">Completed</option>
    <option value="pending">Pending</option>
  </select>
</td>
                        </>
                      )}
                      {openModal === "advances" && (
                        <>
                          <td className="border px-2">
                            {item.employeeId?.name || "--"}
                          </td>
                          <td className="border px-2">{item.advanceAmount}</td>
                          <td className="border px-2">
                            {new Date(item.date).toLocaleDateString()}
                          </td>
                        </>
                      )}
                      {["finance", "income", "expense"].includes(
                        openModal as string
                      ) && (
                        <>
                          <td className="border px-2">{item.type}</td>
                          <td className="border px-2">{item.amount}</td>
                          <td className="border px-2">
                            {new Date(item.date).toLocaleDateString()}
                          </td>
                          <td className="border px-2">
                            {item.description || "--"}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
                {/* <tbody>
  {modalData.map((item: any) => (
    <tr key={item._id}>
      {openModal === "attendance" && (
        <>
          <td className="border px-2">{item.employeeId || "--"}</td>
          <td className="border px-2">
            {new Date(item.date).toLocaleDateString()}
          </td>
          <td className="border px-2">{item.status}</td>
        </>
      )}
      {openModal === "orders" && (
        <>
          <td className="border px-2">{item.customerName || "--"}</td>
          <td className="border px-2">
            {new Date(item.date).toLocaleDateString()}
          </td>
          <td className="border px-2">{item.status}</td>
        </>
      )}
      {openModal === "advances" && (
        <>
          <td className="border px-2">{item.employeeId || "--"}</td>
          <td className="border px-2">{item.advanceAmount}</td>
          <td className="border px-2">
            {new Date(item.date).toLocaleDateString()}
          </td>
        </>
      )}
      {["finance", "income", "expense"].includes(openModal as string) && (
        <>
          <td className="border px-2">{item.type}</td>
          <td className="border px-2">{item.amount}</td>
          <td className="border px-2">
            {new Date(item.date).toLocaleDateString()}
          </td>
        </>
      )}
    </tr>
  ))}
</tbody>  */}
              </table>
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outlined"
                disabled={modalPage === 1}
                onClick={() => handleModalPageChange(modalPage - 1)}
              >
                Previous
              </Button>
              <span>
                Page {modalPage} of {modalTotalPages}
              </span>
              <Button
                variant="outlined"
                disabled={
                  modalPage === modalTotalPages || modalTotalPages === 0
                }
                onClick={() => handleModalPageChange(modalPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </Box>
      </Modal>

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
        <div className="mt-10 text-center text-gray-600 text-lg">
          Loading dashboard...
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
