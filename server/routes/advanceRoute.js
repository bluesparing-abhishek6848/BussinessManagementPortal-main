import express from "express";

import {   createAdvance,
  getAllAdvances,
  getAdvanceById,
  updateAdvance,
  deleteAdvance } from "../controllers/advanceController.js";

const router = express.Router();


router.post("/",createAdvance);
router.get("/",getAllAdvances);
router.get("/:id",getAdvanceById);
router.put("/:id",updateAdvance);
router.delete("/:id",deleteAdvance);


export default router;
