import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  position: { type: String, required: true },
  department: { type: String, required: true ,default: "General"},
  salary: { type: Number, required: true },
  dateOfJoining: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true }
  }
}, {
  timestamps: true,
});
const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;