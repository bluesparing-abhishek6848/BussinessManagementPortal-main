import express from "express";
// import { getAdvanceSummary } from "../controllers/financeController.js";
import { getFinanceSummary } from "../controllers/financeController.js";

const router = express.Router();

// Route to get the advance summary
router.get("/advance-summary", getFinanceSummary);

// Export the router
export default router;