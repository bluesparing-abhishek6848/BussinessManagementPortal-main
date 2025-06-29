import Attendance from "../models/atttendanceSchema.js";
import ApiResponse from "../utils/apiResponse.js";


function toISTDate(dateString) {
  const date = new Date(dateString);
  // Convert to IST by adding 5 hours 30 minutes
  date.setMinutes(date.getMinutes() + 330);
  // Set to midnight IST
  date.setHours(0, 0, 0, 0);
  return date;
}

// CREATE
export const createAttendance = async (req, res) => {
  const { employeeId, date, status, checkInTime, checkOutTime } = req.body;

  if (!employeeId || !date || !status) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Employee ID, date, and status are required."));
  }

  try {
    const istDate = toISTDate(date);

    // Check if attendance for this employee on this date already exists
    const existingAttendance = await Attendance.findOne({ employeeId, date: istDate });
    if (existingAttendance) {
      return res
        .status(409)
        .json(new ApiResponse(409, null, "Attendance for this date already exists."));
    }

    const newAttendance = new Attendance({
      employeeId,
      date: istDate,
      status,
      checkInTime,
      checkOutTime,
      createdBy: req.user?._id,
    });
    await newAttendance.save();

    return res
      .status(201)
      .json(new ApiResponse(201, newAttendance, "Attendance created successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, `Error saving attendance. ${error.message}`));
  }
};

// READ ALL
export const getAllAttendances = async (req, res) => {
  try {
    const attendances = await Attendance.find().populate("employeeId").populate("createdBy");
    return res
      .status(200)
      .json(new ApiResponse(200, attendances, "Attendances fetched successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, `Error fetching attendances. ${error.message}`));
  }
};

// READ ONE
export const getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id).populate("employeeId").populate("createdBy");
    if (!attendance) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Attendance not found."));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, attendance, "Attendance fetched successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, `Error fetching attendance. ${error.message}`));
  }
};

// UPDATE
export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: Date.now() };
    const updatedAttendance = await Attendance.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedAttendance) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Attendance not found."));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, updatedAttendance, "Attendance updated successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, `Error updating attendance. ${error.message}`));
  }
};

// DELETE
export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAttendance = await Attendance.findByIdAndDelete(id);
    if (!deletedAttendance) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Attendance not found."));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Attendance deleted successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, `Error deleting attendance. ${error.message}`));
  }
};