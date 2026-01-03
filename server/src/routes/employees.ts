import { Router } from 'express';
import {
  getAllEmployees,
  getAllEmployeesValidation,
  getEmployeeById,
  createEmployee,
  createEmployeeValidation,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employeeController';
import { authenticate, authorizeRoles } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validator';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getAllEmployeesValidation, handleValidationErrors, getAllEmployees);
router.get('/:id', getEmployeeById);
router.post('/', authorizeRoles('admin'), createEmployeeValidation, handleValidationErrors, createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', authorizeRoles('admin'), deleteEmployee);

export default router;
