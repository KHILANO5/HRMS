import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { successResponse, errorResponse } from '../utils/response';
import { getFileUrl } from '../utils/upload';
import path from 'path';

export const getCurrentUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { User, Employee, EmployeeAddress, EmergencyContact } = req.app.locals.models;

    const user = await User.findByPk(req.user?.userId, {
      attributes: ['id', 'email', 'role'],
      include: [
        {
          model: Employee,
          as: 'employee',
          include: [
            {
              model: EmployeeAddress,
              as: 'address',
            },
            {
              model: EmergencyContact,
              as: 'emergencyContact',
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json(errorResponse('User not found', 'AUTH_001'));
    }

    res.json(successResponse('Profile retrieved successfully', user));
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json(errorResponse('Failed to retrieve profile', 'GEN_003'));
  }
};

export const updateProfilePicture = async (req: AuthRequest, res: Response) => {
  try {
    const { Employee } = req.app.locals.models;

    if (!req.file) {
      return res.status(400).json(errorResponse('Profile picture file is required', 'FILE_001'));
    }

    const employee = await Employee.findOne({ where: { userId: req.user?.userId } });
    if (!employee) {
      return res.status(404).json(errorResponse('Employee not found', 'EMP_001'));
    }

    // Generate file URL
    const profilePictureUrl = getFileUrl(req, req.file.path);

    // Update employee profile picture
    await employee.update({ profilePicture: profilePictureUrl });

    res.json(
      successResponse('Profile picture updated successfully', {
        profilePictureUrl,
      })
    );
  } catch (error: any) {
    console.error('Update profile picture error:', error);
    res.status(500).json(errorResponse('Failed to update profile picture', 'GEN_003'));
  }
};

export const uploadEmployeeResume = async (req: AuthRequest, res: Response) => {
  try {
    const { Employee } = req.app.locals.models;

    if (!req.file) {
      return res.status(400).json(errorResponse('Resume file is required', 'FILE_001'));
    }

    const employee = await Employee.findOne({ where: { userId: req.user?.userId } });
    if (!employee) {
      return res.status(404).json(errorResponse('Employee not found', 'EMP_001'));
    }

    // Generate file URL
    const resumeUrl = getFileUrl(req, req.file.path);

    // Update employee resume
    await employee.update({ resumeUrl });

    res.json(
      successResponse('Resume uploaded successfully', {
        resumeUrl,
      })
    );
  } catch (error: any) {
    console.error('Upload resume error:', error);
    res.status(500).json(errorResponse('Failed to upload resume', 'GEN_003'));
  }
};
