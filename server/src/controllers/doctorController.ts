import { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';

export const getDoctors = async (req: Request, res: Response) => {
  try {
    const { departmentId, search, isAvailable } = req.query;

    const whereClause: any = {};
    if (departmentId) whereClause.departmentId = String(departmentId);
    if (isAvailable !== undefined) whereClause.isAvailable = isAvailable === 'true';

    const doctors = await prisma.doctorProfile.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatarUrl: true,
          },
        },
        department: true,
        schedules: {
          where: { isActive: true },
        },
      },
    });

    const filtered = search
      ? doctors.filter(
          (doc) =>
            `${doc.user.firstName} ${doc.user.lastName}`
              .toLowerCase()
              .includes(String(search).toLowerCase()) ||
            doc.specialization.toLowerCase().includes(String(search).toLowerCase()) ||
            doc.department.name.toLowerCase().includes(String(search).toLowerCase())
        )
      : doctors;

    return res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getDoctorById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const doctor = await prisma.doctorProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        department: true,
        schedules: true,
      },
    });

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    return res.json({ success: true, data: doctor });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAvailableSlots = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { date } = req.query; // YYYY-MM-DD

    if (!date) {
      return res.status(400).json({ success: false, message: 'Date query param is required (YYYY-MM-DD)' });
    }

    const queryDate = new Date(String(date));
    const dayOfWeek = queryDate.getDay();

    const schedule = await prisma.doctorSchedule.findFirst({
      where: {
        doctorId: id,
        dayOfWeek,
        isActive: true,
      },
    });

    if (!schedule) {
      return res.json({
        success: true,
        available: false,
        message: 'Doctor does not practice on this day of the week',
        slots: [],
      });
    }

    // Existing booked appointments for this date
    const startOfDay = new Date(String(date));
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(String(date));
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointments = await prisma.appointment.findMany({
      where: {
        doctorId: id,
        appointmentDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: { notIn: ['CANCELLED'] },
      },
      select: { startTime: true },
    });

    const bookedSlots = new Set(existingAppointments.map((a) => a.startTime));

    // Generate intervals (15 mins)
    const [startHour, startMin] = schedule.startTime.split(':').map(Number);
    const [endHour, endMin] = schedule.endTime.split(':').map(Number);

    const slots: { time: string; isAvailable: boolean }[] = [];
    let currentMins = startHour * 60 + startMin;
    const endMins = endHour * 60 + endMin;

    while (currentMins < endMins) {
      const h = Math.floor(currentMins / 60);
      const m = currentMins % 60;
      const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

      // Check if slot falls in break
      let inBreak = false;
      if (schedule.breakStart && schedule.breakEnd) {
        const [bsh, bsm] = schedule.breakStart.split(':').map(Number);
        const [beh, bem] = schedule.breakEnd.split(':').map(Number);
        const breakStartMin = bsh * 60 + bsm;
        const breakEndMin = beh * 60 + bem;
        if (currentMins >= breakStartMin && currentMins < breakEndMin) {
          inBreak = true;
        }
      }

      if (!inBreak) {
        slots.push({
          time: timeStr,
          isAvailable: !bookedSlots.has(timeStr),
        });
      }

      currentMins += 15; // 15-minute standard healthcare appointment slot
    }

    return res.json({
      success: true,
      available: true,
      date,
      slots,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
