import Employee from "../models/employeeSchema.js";
import Attendance from "../models/atttendanceSchema.js";
import Order from "../models/orderSchema.js";
import Advance from "../models/advanceSchema.js";
import Finance from "../models/FinanceSchema.js";
import User from "../models/userSchema.js";
import ApiResponse from "../utils/apiResponse.js";

// Helper to get date ranges
function getDateRanges() {
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const endOfDay = new Date(now.setHours(23, 59, 59, 999));

  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const startOfMonth = new Date(startOfDay.getFullYear(), startOfDay.getMonth(), 1);
  const endOfMonth = new Date(startOfDay.getFullYear(), startOfDay.getMonth() + 1, 0, 23, 59, 59, 999);

  const startOfYear = new Date(startOfDay.getFullYear(), 0, 1);
  const endOfYear = new Date(startOfDay.getFullYear(), 11, 31, 23, 59, 59, 999);

  return {
    day: { start: startOfDay, end: endOfDay },
    week: { start: startOfWeek, end: endOfWeek },
    month: { start: startOfMonth, end: endOfMonth },
    year: { start: startOfYear, end: endOfYear },
  };
}

async function getAttendanceStats(range) {
  const present = await Attendance.countDocuments({
    date: { $gte: range.start, $lte: range.end },
    status: "present",
  });
  const absent = await Attendance.countDocuments({
    date: { $gte: range.start, $lte: range.end },
    status: "absent",
  });
  const leave = await Attendance.countDocuments({
    date: { $gte: range.start, $lte: range.end },
    status: "leave",
  });
  return { present, absent, leave };
}

async function getOrderStats(range) {
  const total = await Order.countDocuments({ createdAt: { $gte: range.start, $lte: range.end } });
  const completed = await Order.countDocuments({
    createdAt: { $gte: range.start, $lte: range.end },
    status: "completed",
  });
  const pending = await Order.countDocuments({
    createdAt: { $gte: range.start, $lte: range.end },
    status: "pending",
  });
  return { total, completed, pending };
}

async function getAdvanceStats(range) {
  const total = await Advance.countDocuments({ createdAt: { $gte: range.start, $lte: range.end } });
  const totalAmountAgg = await Advance.aggregate([
    { $match: { createdAt: { $gte: range.start, $lte: range.end } } },
    { $group: { _id: null, total: { $sum: "$advanceAmount" } } },
  ]);
  const totalAmount = totalAmountAgg[0]?.total || 0;
  return { total, totalAmount };
}

async function getFinanceStats(range) {
  const summary = await Finance.aggregate([
    { $match: { createdAt: { $gte: range.start, $lte: range.end } } },
    {
      $group: {
        _id: null,
        totalIncome: {
          $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
        },
        totalExpense: {
          $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
        },
      },
    },
    {
      $addFields: {
        totalProfit: { $subtract: ["$totalIncome", "$totalExpense"] },
      },
    },
  ]);
  return summary[0] || { totalIncome: 0, totalExpense: 0, totalProfit: 0 };
}

export const getDashboardSummary = async (req, res) => {
  try {
    const ranges = getDateRanges();

    // Employees and Users (static, not by date)
    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ isActive: true });
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: "admin" });

    // For each period, get stats
    const periods = ["day", "week", "month", "year"];
    const dashboardData = {};

    for (const period of periods) {
      dashboardData[period] = {
        attendance: await getAttendanceStats(ranges[period]),
        orders: await getOrderStats(ranges[period]),
        advances: await getAdvanceStats(ranges[period]),
        finance: await getFinanceStats(ranges[period]),
      };
    }

    dashboardData.employees = { total: totalEmployees, active: activeEmployees };
    dashboardData.users = { total: totalUsers, admins: adminUsers };

    return res
      .status(200)
      .json(new ApiResponse(200, dashboardData, "Dashboard summary fetched successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, `Error fetching dashboard summary: ${error.message}`));
  }
};