import { Router } from 'express';
import {
  login,
  loginValidation,
  changePassword,
  changePasswordValidation,
  changePasswordFirstLogin,
  refreshToken,
  refreshTokenValidation,
  logout,
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validator';

const router = Router();

// Public routes
router.post('/login', loginValidation, handleValidationErrors, login);
router.post('/refresh-token', refreshTokenValidation, handleValidationErrors, refreshToken);

// Protected routes
router.post('/change-password', authenticate, changePasswordValidation, handleValidationErrors, changePassword);
router.post('/change-password-first-login', authenticate, changePasswordValidation, handleValidationErrors, changePasswordFirstLogin);
router.post('/logout', authenticate, logout);

export default router;
