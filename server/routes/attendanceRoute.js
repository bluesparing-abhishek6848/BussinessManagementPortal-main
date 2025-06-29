import express from "express";
import {
  createAttendance,
  getAllAttendances,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
} from "../controllers/attendanceController.js";

// If you have authentication middleware, import it here
// import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

// router.use(authenticate); // Uncomment if you want to protect all routes

// Create attendance
router.post("/", createAttendance);

// Get all attendances
router.get("/", getAllAttendances);

// Get attendance by ID
router.get("/:id", getAttendanceById);

// Update attendance
router.put("/:id", updateAttendance);

// Delete attendance
router.delete("/:id", deleteAttendance);

export default router;