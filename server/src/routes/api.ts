import { Router } from 'express';
import { register, login, getMe, registerSchema, loginSchema } from '../controllers/authController.js';
import { getDoctors, getDoctorById, getAvailableSlots } from '../controllers/doctorController.js';
import { bookAppointment, getMyAppointments, cancelAppointment, createAppointmentSchema } from '../controllers/appointmentController.js';
import { getDoctorDailyQueue, updateQueueTokenStatus, getLiveTokenStatus } from '../controllers/queueController.js';
import { getAdminAnalytics, createDepartment, getDepartments, saveConsultationNotes } from '../controllers/adminController.js';
import { authenticateToken, requireRole } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';

const router = Router();

// ---------------- AUTH ROUTES ----------------
router.post('/auth/register', validateRequest(registerSchema), register);
router.post('/auth/login', validateRequest(loginSchema), login);
router.get('/auth/me', authenticateToken, getMe);

// ---------------- DOCTOR & DEPARTMENTS ----------------
router.get('/departments', getDepartments);
router.post('/departments', authenticateToken, requireRole(['ADMIN']), createDepartment);
router.get('/doctors', getDoctors);
router.get('/doctors/:id', getDoctorById);
router.get('/doctors/:id/slots', getAvailableSlots);

// ---------------- APPOINTMENT ENGINE ----------------
router.post('/appointments', authenticateToken, validateRequest(createAppointmentSchema), bookAppointment);
router.get('/appointments/my', authenticateToken, getMyAppointments);
router.patch('/appointments/:id/cancel', authenticateToken, cancelAppointment);

// ---------------- REAL-TIME QUEUE SYSTEM ----------------
router.get('/queue/doctor/:doctorId', getDoctorDailyQueue);
router.patch('/queue/token/:tokenId/status', authenticateToken, requireRole(['DOCTOR', 'ADMIN']), updateQueueTokenStatus);
router.get('/queue/token/:tokenNumber', getLiveTokenStatus);

// ---------------- CLINICAL & DOCTOR WORKSPACE ----------------
router.post('/consultations', authenticateToken, requireRole(['DOCTOR']), saveConsultationNotes);

// ---------------- ADMIN ANALYTICS & ONBOARDING ----------------
router.get('/admin/analytics', authenticateToken, requireRole(['ADMIN']), getAdminAnalytics);

export default router;
