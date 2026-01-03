import { Router } from 'express';
import { getAdminStats, getEmployeeStats } from '../controllers/dashboardController';
import { authenticate, authorizeRoles } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/admin/stats', authorizeRoles('admin'), getAdminStats);
router.get('/employee/stats', getEmployeeStats);

export default router;
