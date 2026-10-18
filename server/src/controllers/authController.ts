import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../utils/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'careflow-super-secret-healthcare-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  role: z.enum(['PATIENT', 'DOCTOR', 'ADMIN']).default('PATIENT'),
  // Optional doctor specifics if onboarding as Doctor
  specialization: z.string().optional(),
  qualification: z.string().optional(),
  departmentId: z.string().optional(),
  roomNumber: z.string().optional(),
  consultationFee: z.number().optional(),
  // Optional patient specifics
  bloodGroup: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

export const register = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role,
        ...(data.role === 'PATIENT'
          ? {
              patientProfile: {
                create: {
                  bloodGroup: data.bloodGroup,
                  gender: data.gender,
                  dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
                },
              },
            }
          : {}),
        ...(data.role === 'DOCTOR' && data.departmentId
          ? {
              doctorProfile: {
                create: {
                  departmentId: data.departmentId,
                  specialization: data.specialization || 'General Physician',
                  qualification: data.qualification || 'MBBS, MD',
                  roomNumber: data.roomNumber || 'Room 101',
                  consultationFee: data.consultationFee || 50,
                },
              },
            }
          : {}),
      },
      include: {
        patientProfile: true,
        doctorProfile: true,
      },
    });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        doctorProfileId: user.doctorProfile?.id,
        patientProfileId: user.patientProfile?.id,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        doctorProfileId: user.doctorProfile?.id,
        patientProfileId: user.patientProfile?.id,
      },
    });
  } catch (error: any) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        patientProfile: true,
        doctorProfile: {
          include: { department: true },
        },
      },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        doctorProfileId: user.doctorProfile?.id,
        patientProfileId: user.patientProfile?.id,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        doctorProfile: user.doctorProfile,
        patientProfile: user.patientProfile,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        patientProfile: true,
        doctorProfile: {
          include: { department: true },
        },
      },
    });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        doctorProfile: user.doctorProfile,
        patientProfile: user.patientProfile,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
