import { Router } from 'express';
import {
  getSalary,
  updateSalary,
  updateSalaryValidation,
} from '../controllers/salaryController';
import { authenticate, authorizeRoles } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validator';

const router = Router();

router.use(authenticate);

router.get('/:employeeId', getSalary);
router.put('/:employeeId', authorizeRoles('admin'), updateSalaryValidation, handleValidationErrors, updateSalary);

export default router;
