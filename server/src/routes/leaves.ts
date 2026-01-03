import { Router } from 'express';
import {
  getLeaveBalance,
  getLeaveBalanceValidation,
  getLeaveRequests,
  getLeaveRequestsValidation,
  createLeaveRequest,
  createLeaveRequestValidation,
  updateLeaveRequestStatus,
  updateLeaveRequestValidation,
  deleteLeaveRequest,
  getLeaveHistory,
  getLeaveHistoryValidation,
} from '../controllers/leaveController';
import { authenticate, authorizeRoles } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validator';

const router = Router();

router.use(authenticate);

router.get('/balance', getLeaveBalanceValidation, handleValidationErrors, getLeaveBalance);
router.get('/requests', getLeaveRequestsValidation, handleValidationErrors, getLeaveRequests);
router.get('/history', getLeaveHistoryValidation, handleValidationErrors, getLeaveHistory);
router.post('/requests', createLeaveRequestValidation, handleValidationErrors, createLeaveRequest);
router.patch('/requests/:id', authorizeRoles('admin'), updateLeaveRequestValidation, handleValidationErrors, updateLeaveRequestStatus);
router.delete('/requests/:id', deleteLeaveRequest);

export default router;
