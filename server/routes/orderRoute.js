import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js";
// import auth from "../middleware/auth.js"; // Uncomment if you have authentication

const router = express.Router();

// Create a new order
router.post("/", /*auth,*/ createOrder);

// Get all orders
router.get("/", getAllOrders);

// Get order by ID
router.get("/:id", getOrderById);

// Update order by ID
router.put("/:id", /*auth,*/ updateOrder);

// Delete order by ID
router.delete("/:id", /*auth,*/ deleteOrder);

export default router;