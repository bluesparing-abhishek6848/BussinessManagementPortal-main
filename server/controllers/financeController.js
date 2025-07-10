import Finance from "../models/FinanceSchema.js";
import apiResponse from "../utils/apiResponse.js";

import moment from "moment-timezone";
export const getFinanceSummary = async (req, res) => {
  try {
    console.log("Fetching finance summary...");
    const financeSummary = await Finance.aggregate([
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
            },
          },
          totalExpense: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
            },
          },
        },
      },
      {
        $addFields: {
          totalProfit: { $subtract: ["$totalIncome", "$totalExpense"] },
        },
      },
    ]);

    // Convert any date fields to IST (if present)
    if (financeSummary[0] && financeSummary[0].date) {
      financeSummary[0].date = financeSummary[0].date
    }

    return res
      .status(200)
      .json(
        new apiResponse(
          200,
          financeSummary[0],
          "Finance summary retrieved successfully"
        )
      );
  } catch (error) {
    console.error("Error retrieving finance summary:", error);
    return res
      .status(500)
      .json(new apiResponse(500, null, "Internal server error"));
  }
};


export const getFinanceEntries = async (req, res) => {
  try {
    // Only fetch entries with description starting with [FINANCE]
    const financeEntries = await Finance.find({
      description: { $regex: /^\[FINANCE\]/ }
    }).sort({ date: -1 });

    // Remove the prefix from description before sending response
    const cleanedEntries = financeEntries.map(entry => {
      const entryObj = entry.toObject();
      entryObj.description = entryObj.description.replace(/^\[FINANCE\]\s?/, "");
      return entryObj;
    });

    if (cleanedEntries.length === 0) {
      return res
        .status(200)
        .json(new apiResponse(200, null, "No finance entries found"));
    }
    return res
      .status(200)
      .json(
        new apiResponse(
          200,
          cleanedEntries,
          "Finance entries retrieved successfully"
        )
      );
  } catch (error) {
    console.error("Error retrieving finance entries:", error);
    return res
      .status(500)
      .json(new apiResponse(500, null, "Internal server error"));
  }
}

// Adds a new finance entry to the database with a prefixed description for filtering
export const addFinanceEntry = async (req, res) => {
  try {
    // Add prefix to description for easy filtering
    const prefixedDescription = `[FINANCE] ${req.body.description || ""}`;
    const financeEntry = new Finance({
      ...req.body,
      description: prefixedDescription,
    });
    await financeEntry.save();
    return res
      .status(201)
      .json(new apiResponse(201, financeEntry, "Finance entry added successfully"));
  } catch (error) {
    console.error("Error adding finance entry:", error);
    return res
      .status(500)
      .json(new apiResponse(500, null, "Internal server error"));
  }
};

export const deleteFinanceEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEntry = await Finance.findByIdAndDelete(id);
    if (!deletedEntry) {
      return res
        .status(404)
        .json(new apiResponse(404, null, "Finance entry not found"));
    }
    return res
      .status(200)
      .json(new apiResponse(200, deletedEntry, "Finance entry deleted successfully"));
  } catch (error) {
    console.error("Error deleting finance entry:", error);
    return res
      .status(500)
      .json(new apiResponse(500, null, "Internal server error"));
  }
};