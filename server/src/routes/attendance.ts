import { Router } from 'express';
import {
  getAttendance,
  getAttendanceValidation,
  getAttendanceByDate,
  checkIn,
  checkOut,
} from '../controllers/attendanceController';
import { authenticate, authorizeRoles } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validator';

const router = Router();

router.use(authenticate);

router.get('/', getAttendanceValidation, handleValidationErrors, getAttendance);
router.get('/date/:date', authorizeRoles('admin'), getAttendanceByDate);
router.post('/checkin', checkIn);
router.post('/checkout', checkOut);

export default router;
