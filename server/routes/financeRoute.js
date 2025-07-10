import express from "express";
// import { getAdvanceSummary } from "../controllers/financeController.js";
import { getDashboardSummary } from "../controllers/dashboardController.js";
// import { getFinanceSummary } from "../controllers/financeController.js";
import { addFinanceEntry,getFinanceEntries,deleteFinanceEntry } from "../controllers/financeController.js";


const router = express.Router();

// Route to get the advance summary
router.get("/advance-summary", getDashboardSummary);


// Route to get the finance summary
// router.get("/", getFinanceEntries);
router.get("/", getFinanceEntries);



// Route to add a new finance entry
router.post("/", addFinanceEntry);

// Route to delete a finance entry by ID
router.delete("/:id", deleteFinanceEntry);
// Export the router
export default router;