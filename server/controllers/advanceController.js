import Advance from "../models/advanceSchema.js";
import Finance from "../models/FinanceSchema.js";
import ApiResponse from "../utils/apiResponse.js";
import moment from "moment";

// Helper to get IST date
const getISTDate = () => new Date(Date.now() + (5.5 * 60 * 60 * 1000));

// CREATE
export const createAdvance = async (req, res) => {
  try {
    const { advanceAmount, employeeId } = req.body;
    const newAdvance = new Advance({
      advanceAmount,
      employeeId,
      createdBy: req.user.id,
    });
    await newAdvance.save();

    const istDate = getISTDate();
    const financeEntry = new Finance({
      type: "expense",
      date: istDate,
      description: 'advance',
      amount: advanceAmount,
      createdAt: istDate,
      updatedAt: istDate,
      createdBy: req.user.id,
      advanceId: newAdvance._id,
    });
    await financeEntry.save();

    res
      .status(201)
      .json(new ApiResponse(201, newAdvance, "Advance created successfully"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(500, null, error.message || "Error creating advance"));
  }
};

// READ ALL
export const getAllAdvances = async (req, res) => {
  try {
    const advances = await Advance.find().populate("employeeId");
    res
      .status(200)
      .json(new ApiResponse(200, advances, "Advances fetched successfully"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(500, null, error.message || "Error fetching advances"));
  }
};

// READ ONE
export const getAdvanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const advance = await Advance.findById(id).populate("employeeId");
    if (!advance) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Advance not found"));
    }
    res
      .status(200)
      .json(new ApiResponse(200, advance, "Advance fetched successfully"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(500, null, error.message || "Error fetching advance"));
  }
};

// UPDATE
export const updateAdvance = async (req, res) => {
  try {
    const { id } = req.params;
    const { advanceAmount } = req.body;
    const istDate = getISTDate();

    const updatedAdvance = await Advance.findByIdAndUpdate(
      id,
      { advanceAmount, updatedAt: istDate },
      { new: true }
    );
    if (!updatedAdvance) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Advance not found"));
    }


  return  res
      .status(200)
      .json(new ApiResponse(200, updatedAdvance, "Advance updated successfully"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(500, null, error.message || "Error updating advance"));
  }
};


// DELETE
export const deleteAdvance = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAdvance = await Advance.findByIdAndDelete(id);
    if (!deletedAdvance) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Advance not found"));
    }
    const createdAtIST = new Date(deletedAdvance.createdAt.getTime() + (5.5 * 60 * 60 * 1000));
    const startOfDay = moment(createdAtIST).startOf('day').toDate();
    const endOfDay = moment(createdAtIST).endOf('day').toDate();

    await Finance.deleteOne({
    advanceId: deletedAdvance._id

    });

    res
      .status(200)
      .json(new ApiResponse(200, null, "Advance and related finance entry deleted successfully"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(500, null, error.message || "Error deleting advance"));
  }
};
