import { Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { AuthenticatedRequest } from '../middlewares/auth.js';

export const getAdminAnalytics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const totalPatients = await prisma.patientProfile.count();
    const totalDoctors = await prisma.doctorProfile.count();
    const totalAppointments = await prisma.appointment.count();
    const totalDepartments = await prisma.department.count();

    // Today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endToday = new Date(today);
    endToday.setHours(23, 59, 59, 999);

    const todayAppointments = await prisma.appointment.count({
      where: {
        appointmentDate: { gte: today, lte: endToday },
      },
    });

    const completedToday = await prisma.appointment.count({
      where: {
        appointmentDate: { gte: today, lte: endToday },
        status: 'COMPLETED',
      },
    });

    // Department breakdown
    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: { doctors: true },
        },
      },
    });

    return res.json({
      success: true,
      data: {
        summary: {
          totalPatients,
          totalDoctors,
          totalAppointments,
          totalDepartments,
          todayAppointments,
          completedToday,
        },
        departments,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createDepartment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, code, description, icon } = req.body;

    const department = await prisma.department.create({
      data: { name, code: code.toUpperCase(), description, icon },
    });

    return res.status(201).json({ success: true, message: 'Department created', data: department });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getDepartments = async (req: any, res: Response) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        _count: { select: { doctors: true } },
      },
    });
    return res.json({ success: true, data: departments });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const saveConsultationNotes = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { appointmentId, chiefComplaint, diagnosis, clinicalNotes, prescription, labOrders, followUpDate } = req.body;

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    const note = await prisma.consultationNote.upsert({
      where: { appointmentId },
      update: {
        chiefComplaint,
        diagnosis,
        clinicalNotes,
        prescription: typeof prescription === 'string' ? prescription : JSON.stringify(prescription),
        labOrders,
        followUpDate: followUpDate ? new Date(followUpDate) : null,
      },
      create: {
        appointmentId,
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        chiefComplaint,
        diagnosis,
        clinicalNotes,
        prescription: typeof prescription === 'string' ? prescription : JSON.stringify(prescription),
        labOrders,
        followUpDate: followUpDate ? new Date(followUpDate) : null,
      },
    });

    // Mark appointment as COMPLETED
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'COMPLETED' },
    });

    // Mark token as FINISHED
    await prisma.queueToken.updateMany({
      where: { appointmentId },
      data: { status: 'FINISHED', completedAt: new Date() },
    });

    return res.json({ success: true, message: 'Consultation notes recorded successfully', data: note });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
