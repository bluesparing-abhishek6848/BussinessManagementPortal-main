import Employee from "../models/employeeSchema.js";
import ApiResponse from "../utils/apiResponse.js";

// Create a new employee
export const createEmployee = async (req, res) => {
  try {
    const employeeData = {
      ...req.body,
      createdBy: req.user ? req.user._id : null
    };
    console.log("Creating employee with data:", employeeData);
    const employee = new Employee(employeeData);
    const savedEmployee = await employee.save();
    res
      .status(201)
      .json(
        new ApiResponse(201, savedEmployee, "Employee created successfully.")
      );
  } catch (error) {
    res.status(400).json(new ApiResponse(400, null, error.message));
  }
};

// Get all employees
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res
      .status(200)
      .json(new ApiResponse(200, employees, "Employees fetched successfully."));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

// Get a single employee by ID
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Employee not found"));
    }
    res
      .status(200)
      .json(new ApiResponse(200, employee, "Employee fetched successfully."));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

// Update an employee by ID
export const updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEmployee) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Employee not found"));
    }
    res
      .status(200)
      .json(
        new ApiResponse(200, updatedEmployee, "Employee updated successfully.")
      );
  } catch (error) {
    res.status(400).json(new ApiResponse(400, null, error.message));
  }
};

// Delete an employee by ID
export const deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Employee not found"));
    }
    res
      .status(200)
      .json(new ApiResponse(200, null, "Employee deleted successfully"));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};
