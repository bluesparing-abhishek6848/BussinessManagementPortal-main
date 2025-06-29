import Order from "../models/orderSchema.js";
import Finance from "../models/FinanceSchema.js";
import ApiResponse from "../utils/apiResponse.js";

// Helper to get IST date
const getISTDate = () => new Date(Date.now() + 5.5 * 60 * 60 * 1000);

export const createOrder = async (req, res, next) => {
  const {
    itemName,
    itemImage,
    itemDescription,
    quantity,
    amountRecieved,
    expenseCost,
    price,
  } = req.body;

  // Validate required fields
  if (
    !itemName ||
    !itemDescription ||
    !quantity ||
    !price ||
    !req.user ||
    !req.user.id
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Missing required fields or user."));
  }

  try {
    const createdBy = req.user.id;

    // Create the order
    const newOrder = new Order({
      itemName,
      itemImage,
      itemDescription,
      quantity,
      amountRecieved,
      expenseCost,
      price,
      createdBy,
    });

    const savedOrder = await newOrder.save();

    // Create Finance entries
    const istDate = getISTDate();
    const financeEntries = [];

    if (amountRecieved && amountRecieved > 0) {
      financeEntries.push(
        new Finance({
          type: "income",
          date: istDate,
          description: `Order income: ${itemName}`,
          amount: amountRecieved,
          createdAt: istDate,
          updatedAt: istDate,
        })
      );
    }

    if (expenseCost && expenseCost > 0) {
      financeEntries.push(
        new Finance({
          type: "expense",
          date: istDate,
          description: `Order expense: ${itemName}`,
          amount: expenseCost,
          createdAt: istDate,
          updatedAt: istDate,
        })
      );
    }

    if (financeEntries.length > 0) {
      await Finance.insertMany(financeEntries);
    }

    return res
      .status(201)
      .json(new ApiResponse(201, savedOrder, "Order created successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to create order: " + error.message));
  }
};


// READ: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res
      .status(200)
      .json(new ApiResponse(200, orders, "Orders fetched successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to fetch orders: " + error.message));
  }
};

export const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Order not found."));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, order, "Order fetched successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to fetch order: " + error.message));
  }
};

// UPDATE: Update an order and related finance entries
export const updateOrder = async (req, res) => {
  const { id } = req.params;
  const {
    itemName,
    itemImage,
    itemDescription,
    quantity,
    amountRecieved,
    expenseCost,
    price,
  } = req.body;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json(new ApiResponse(404, null, "Order not found."));
    }

    // Update order fields
    order.itemName = itemName ?? order.itemName;
    order.itemImage = itemImage ?? order.itemImage;
    order.itemDescription = itemDescription ?? order.itemDescription;
    order.quantity = quantity ?? order.quantity;
    order.amountRecieved = amountRecieved ?? order.amountRecieved;
    order.expenseCost = expenseCost ?? order.expenseCost;
    order.price = price ?? order.price;

    const updatedOrder = await order.save();

    // Remove old finance entries for this order
    await Finance.deleteMany({ description: { $regex: order.itemName, $options: "i" } });

    // Add new finance entries
    const istDate = getISTDate();
    const financeEntries = [];
    if (amountRecieved && amountRecieved > 0) {
      financeEntries.push(
        new Finance({
          type: "income",
          date: istDate,
          description: `Order income: ${order.itemName}`,
          amount: amountRecieved,
          createdAt: istDate,
          updatedAt: istDate,
        })
      );
    }
    if (expenseCost && expenseCost > 0) {
      financeEntries.push(
        new Finance({
          type: "expense",
          date: istDate,
          description: `Order expense: ${order.itemName}`,
          amount: expenseCost,
          createdAt: istDate,
          updatedAt: istDate,
        })
      );
    }
    if (financeEntries.length > 0) {
      await Finance.insertMany(financeEntries);
    }

    return res
      .status(200)
      .json(new ApiResponse(200, updatedOrder, "Order updated successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to update order: " + error.message));
  }
};

// DELETE: Delete an order and related finance entries
export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json(new ApiResponse(404, null, "Order not found."));
    }

    // Remove related finance entries
    await Finance.deleteMany({ description: { $regex: order.itemName, $options: "i" } });

    return res
      .status(200)
      .json(new ApiResponse(200, order, "Order deleted successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to delete order: " + error.message));
  }
};
