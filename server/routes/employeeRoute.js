import express from 'express';

const router = express.Router();
import { getAllEmployees, createEmployee, updateEmployee, deleteEmployee, getEmployeeById } from '../controllers/employeeController.js';

// Route to create a new employee
router.post('/', createEmployee);
// Route to get all employees
router.get('/', getAllEmployees);
// Route to get a single employee by ID
router.get('/:id', getEmployeeById);
// Route to update an employee by ID
router.put('/:id', updateEmployee);
// Route to delete an employee by ID
router.delete('/:id', deleteEmployee);



export default router;