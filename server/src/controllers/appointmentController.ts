import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma.js';
import { AuthenticatedRequest } from '../middlewares/auth.js';
import { notificationService } from '../services/notificationService.js';
import { emitQueueUpdate } from '../socket/queueSocket.js';

export const createAppointmentSchema = z.object({
  doctorId: z.string().uuid(),
  appointmentDate: z.string(), // YYYY-MM-DD
  startTime: z.string(), // "10:15"
  endTime: z.string().optional(),
  reason: z.string().min(3),
  symptoms: z.string().optional(),
  consultationType: z.enum(['IN_PERSON', 'TELECONSULT']).default('IN_PERSON'),
});

export const bookAppointment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { doctorId, appointmentDate, startTime, reason, symptoms, consultationType } = req.body;
    
    // Resolve patient profile
    let patientProfileId = req.user?.patientProfileId;
    if (!patientProfileId) {
      const patient = await prisma.patientProfile.findUnique({
        where: { userId: req.user?.id },
      });
      if (!patient) {
        return res.status(400).json({ success: false, message: 'Patient profile not found for user' });
      }
      patientProfileId = patient.id;
    }

    const apptDate = new Date(appointmentDate);
    apptDate.setHours(0, 0, 0, 0);

    // Calculate endTime (+15 min)
    const [h, m] = startTime.split(':').map(Number);
    const endMinutes = h * 60 + m + 15;
    const endH = Math.floor(endMinutes / 60);
    const endM = endMinutes % 60;
    const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    // Conflict check
    const existing = await prisma.appointment.findFirst({
      where: {
        doctorId,
        appointmentDate: apptDate,
        startTime,
        status: { notIn: ['CANCELLED'] },
      },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'This time slot was just taken. Please select another slot.',
      });
    }

    // Doctor & Department lookup for token prefix & notification
    const doctor = await prisma.doctorProfile.findUnique({
      where: { id: doctorId },
      include: {
        department: true,
        user: true,
      },
    });

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Sequence token for this doctor on this day
    const dailyTokenCount = await prisma.queueToken.count({
      where: {
        appointment: {
          doctorId,
          appointmentDate: apptDate,
        },
      },
    });

    const sequenceOrder = dailyTokenCount + 1;
    const tokenPrefix = doctor.department.code.slice(0, 3).toUpperCase();
    const tokenNumber = `${tokenPrefix}-${String(sequenceOrder).padStart(2, '0')}`;

    // Random appointment unique code
    const appointmentNumber = `APT-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    // Create appointment and queue token
    const appointment = await prisma.appointment.create({
      data: {
        appointmentNumber,
        patientId: patientProfileId,
        doctorId,
        appointmentDate: apptDate,
        startTime,
        endTime,
        reason,
        symptoms,
        consultationType,
        status: 'SCHEDULED',
        queueToken: {
          create: {
            tokenNumber,
            sequenceOrder,
            queueDate: apptDate,
            status: 'WAITING',
            estimatedWaitMinutes: sequenceOrder * 15,
          },
        },
      },
      include: {
        queueToken: true,
        doctor: {
          include: { user: true, department: true },
        },
        patient: {
          include: { user: true },
        },
      },
    });

    // Fire mock notifications
    await notificationService.notifyAppointmentBooked({
      patientName: `${req.user?.firstName} ${req.user?.lastName}`,
      patientEmail: req.user?.email,
      doctorName: `${doctor.user.firstName} ${doctor.user.lastName}`,
      department: doctor.department.name,
      date: appointmentDate,
      time: startTime,
      tokenNumber,
    });

    // Notify doctor & queue room via socket
    emitQueueUpdate(doctorId, {
      type: 'NEW_BOOKING',
      appointmentId: appointment.id,
      tokenNumber,
      sequenceOrder,
    });

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully and Queue Token assigned!',
      data: appointment,
    });
  } catch (error: any) {
    console.error('Book appointment error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyAppointments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let whereClause: any = {};

    if (req.user?.role === 'PATIENT') {
      const patient = await prisma.patientProfile.findUnique({ where: { userId: req.user.id } });
      if (!patient) return res.status(404).json({ success: false, message: 'Patient profile not found' });
      whereClause.patientId = patient.id;
    } else if (req.user?.role === 'DOCTOR') {
      const doctor = await prisma.doctorProfile.findUnique({ where: { userId: req.user.id } });
      if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });
      whereClause.doctorId = doctor.id;
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        doctor: {
          include: { user: true, department: true },
        },
        patient: {
          include: { user: true },
        },
        queueToken: true,
        consultationNote: true,
      },
      orderBy: { appointmentDate: 'desc' },
    });

    return res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelAppointment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { queueToken: true },
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        status: 'CANCELLED',
      },
    });

    if (appointment.queueToken) {
      await prisma.queueToken.update({
        where: { id: appointment.queueToken.id },
        data: { status: 'SKIPPED' },
      });
    }

    emitQueueUpdate(appointment.doctorId, {
      type: 'APPOINTMENT_CANCELLED',
      appointmentId: id,
    });

    return res.json({ success: true, message: 'Appointment cancelled successfully', data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
