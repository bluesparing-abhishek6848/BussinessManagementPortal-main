import Finance from "../models/FinanceSchema.js";
import apiResponse from "../utils/apiResponse.js";

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

    // if (financeSummary.length === 0) {
    //   return res
    //     .status(404)
    //     .json(new apiResponse(404, null, "No finance data found"));
    // }

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