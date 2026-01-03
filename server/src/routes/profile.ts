import { Router } from 'express';
import { getCurrentUserProfile, updateProfilePicture, uploadEmployeeResume } from '../controllers/profileController';
import { authenticate } from '../middleware/auth';
import { uploadProfilePicture as uploadPicture, uploadResume } from '../utils/upload';

const router = Router();

router.use(authenticate);

router.get('/me', getCurrentUserProfile);
router.post('/picture', uploadPicture, updateProfilePicture);
router.post('/resume', uploadResume, uploadEmployeeResume);

export default router;
