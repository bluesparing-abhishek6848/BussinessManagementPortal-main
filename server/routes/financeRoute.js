import express from "express";
// import { getAdvanceSummary } from "../controllers/financeController.js";
import { getDashboardSummary } from "../controllers/dashboardController.js";
// import { getFinanceSummary } from "../controllers/financeController.js";

const router = express.Router();

// Route to get the advance summary
router.get("/advance-summary", getDashboardSummary);

// Export the router
export default router;