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

  const startOfMonth = new Date(
    startOfDay.getFullYear(),
    startOfDay.getMonth(),
    1
  );
  const endOfMonth = new Date(
    startOfDay.getFullYear(),
    startOfDay.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

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
  const total = await Order.countDocuments({
    date: { $gte: range.start, $lte: range.end },
  });
  const completed = await Order.countDocuments({
    date: { $gte: range.start, $lte: range.end },
    status: "completed",
  });
  const pending = await Order.countDocuments({
    date: { $gte: range.start, $lte: range.end },
    status: "pending",
  });
  return { total, completed, pending };
}

async function getAdvanceStats(range) {
  const total = await Advance.countDocuments({
    date: { $gte: range.start, $lte: range.end },
  });
  const totalAmountAgg = await Advance.aggregate([
    { $match: { date: { $gte: range.start, $lte: range.end } } },
    { $group: { _id: null, total: { $sum: "$advanceAmount" } } },
  ]);
  const totalAmount = totalAmountAgg[0]?.total || 0;
  return { total, totalAmount };
}

async function getFinanceStats(range) {
  const summary = await Finance.aggregate([
    { $match: { date: { $gte: range.start, $lte: range.end } } },
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

// Add pagination support to data fetchers
async function getAttendanceData(range, page, limit) {
  return Attendance.find({
    date: { $gte: range.start, $lte: range.end },
  })
    .populate("employeeId") // <-- populate employeeId
    .skip((page - 1) * limit)
    .limit(limit);
}

async function getOrderData(range, page, limit) {
  return Order.find({
    date: { $gte: range.start, $lte: range.end },
  })
    .skip((page - 1) * limit)
    .limit(limit);
}

async function getAdvanceData(range, page, limit) {
  return Advance.find({
    date: { $gte: range.start, $lte: range.end },
  })
    .populate("employeeId") // <-- populate employeeId
    .skip((page - 1) * limit)
    .limit(limit);
}

async function getFinanceData(range, page, limit) {
  return Finance.find({
    date: { $gte: range.start, $lte: range.end },
  })
    .skip((page - 1) * limit)
    .limit(limit);
}

export const getDashboardSummary = async (req, res) => {
  try {
    const ranges = getDateRanges();

    // Pagination params
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit =
      parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;

    // Employees and Users (static, not by date)
    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ isActive: true });
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: "admin" });

    // For each period, get paginated data
    const periods = ["day", "week", "month", "year"];
    const dashboardData = {};

    for (const period of periods) {
      dashboardData[period] = {
        attendance: await getAttendanceData(ranges[period], page, limit),
        orders: await getOrderData(ranges[period], page, limit),
        advances: await getAdvanceData(ranges[period], page, limit),
        finance: await getFinanceData(ranges[period], page, limit),
      };
    }

    dashboardData.employees = {
      total: totalEmployees,
      active: activeEmployees,
    };
    dashboardData.users = { total: totalUsers, admins: adminUsers };

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          ...dashboardData,
          pagination: { page, limit },
        },
        "Dashboard summary fetched successfully."
      )
    );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          `Error fetching dashboard summary: ${error.message}`
        )
      );
  }
};
