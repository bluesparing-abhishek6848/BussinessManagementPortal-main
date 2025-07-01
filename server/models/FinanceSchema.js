import mongoose from "mongoose";

const financeSchema = new mongoose.Schema({
advanceId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Advance",
  required: false,
},
  type:{
    type: String,
    enum: ["income", "expense"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  },
}, {
  timestamps: true,
});
const Finance = mongoose.model("Finance", financeSchema);
export default Finance;
