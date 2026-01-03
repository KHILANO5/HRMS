import { Response } from 'express';
import { body } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { successResponse, errorResponse } from '../utils/response';
import { comparePassword, generateAccessToken, generateRefreshToken, hashPassword, verifyToken } from '../utils/auth';

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    const { User, Employee } = req.app.locals.models;

    // Find user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json(errorResponse('Invalid credentials', 'AUTH_001'));
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json(errorResponse('Account is disabled', 'AUTH_004'));
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json(errorResponse('Invalid credentials', 'AUTH_001'));
    }

    // Check if first login
    if (user.isFirstLogin) {
      const tempToken = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return res.json({
        success: true,
        message: 'First time login. Password change required',
        data: {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            isFirstLogin: true,
          },
          requirePasswordChange: true,
          tempToken,
        },
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({ userId: user.id });

    // Update last login
    await user.update({ lastLogin: new Date() });

    res.json(
      successResponse('Login successful', {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          isFirstLogin: false,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      })
    );
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json(errorResponse('Login failed', 'GEN_003'));
  }
};

export const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and number'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
];

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user!.userId;
    const { User } = req.app.locals.models;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json(errorResponse('User not found', 'AUTH_001'));
    }

    // Verify current password
    const isPasswordValid = await comparePassword(currentPassword, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json(errorResponse('Current password is incorrect', 'AUTH_001'));
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password and first login flag
    await user.update({
      passwordHash: hashedPassword,
      isFirstLogin: false,
    });

    res.json(successResponse('Password changed successfully'));
  } catch (error: any) {
    console.error('Change password error:', error);
    res.status(500).json(errorResponse('Failed to change password', 'GEN_003'));
  }
};

export const changePasswordFirstLogin = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user!.userId;
    const { User } = req.app.locals.models;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json(errorResponse('User not found', 'AUTH_001'));
    }

    // Verify current password
    const isPasswordValid = await comparePassword(currentPassword, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json(errorResponse('Current password is incorrect', 'AUTH_001'));
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password and first login flag
    await user.update({
      passwordHash: hashedPassword,
      isFirstLogin: false,
    });

    // Generate new tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({ userId: user.id });

    res.json(
      successResponse('Password changed successfully', {
        tokens: {
          accessToken,
          refreshToken,
        },
      })
    );
  } catch (error: any) {
    console.error('Change password first login error:', error);
    res.status(500).json(errorResponse('Failed to change password', 'GEN_003'));
  }
};

export const refreshTokenValidation = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
];

export const refreshToken = async (req: AuthRequest, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const { User } = req.app.locals.models;

    const decoded = verifyToken(refreshToken);

    if (!decoded) {
      return res.status(401).json(errorResponse('Invalid or expired refresh token', 'AUTH_002'));
    }

    const user = await User.findByPk(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json(errorResponse('User not found or inactive', 'AUTH_004'));
    }

    // Generate new access token
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json(successResponse('Token refreshed successfully', { accessToken }));
  } catch (error: any) {
    console.error('Refresh token error:', error);
    res.status(500).json(errorResponse('Failed to refresh token', 'GEN_003'));
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    // In a production app, you'd invalidate the token here (e.g., add to blacklist)
    res.json(successResponse('Logged out successfully'));
  } catch (error: any) {
    console.error('Logout error:', error);
    res.status(500).json(errorResponse('Logout failed', 'GEN_003'));
  }
};
