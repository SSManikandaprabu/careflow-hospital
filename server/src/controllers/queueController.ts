import { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { AuthenticatedRequest } from '../middlewares/auth.js';
import { emitQueueUpdate, emitTokenStatusChange } from '../socket/queueSocket.js';
import { notificationService } from '../services/notificationService.js';

export const getDoctorDailyQueue = async (req: Request, res: Response) => {
  try {
    const doctorId = String(req.params.doctorId);
    const { date } = req.query; // YYYY-MM-DD (defaults to today)

    const queryDate = date ? new Date(String(date)) : new Date();
    queryDate.setHours(0, 0, 0, 0);

    const endOfDay = new Date(queryDate);
    endOfDay.setHours(23, 59, 59, 999);

    const queueTokens = await prisma.queueToken.findMany({
      where: {
        appointment: {
          doctorId,
          appointmentDate: {
            gte: queryDate,
            lte: endOfDay,
          },
        },
      },
      include: {
        appointment: {
          include: {
            patient: {
              include: { user: true },
            },
          },
        },
      },
      orderBy: { sequenceOrder: 'asc' },
    });

    const activeToken = queueTokens.find((t) => t.status === 'CALLED' || t.status === 'IN_PROGRESS');
    const waitingTokens = queueTokens.filter((t) => t.status === 'WAITING');
    const completedTokens = queueTokens.filter((t) => t.status === 'FINISHED');

    return res.json({
      success: true,
      data: {
        currentServing: activeToken || null,
        totalInQueue: queueTokens.length,
        waitingCount: waitingTokens.length,
        completedCount: completedTokens.length,
        tokens: queueTokens,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateQueueTokenStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tokenId = String(req.params.tokenId);
    const { status } = req.body; // "WAITING" | "CALLED" | "IN_PROGRESS" | "FINISHED" | "SKIPPED"

    const existingToken = await prisma.queueToken.findUnique({
      where: { id: tokenId },
      include: {
        appointment: {
          include: {
            doctor: { include: { user: true } },
            patient: { include: { user: true } },
          },
        },
      },
    });

    if (!existingToken) {
      return res.status(404).json({ success: false, message: 'Queue token not found' });
    }

    const updateData: any = { status };
    if (status === 'CALLED') updateData.calledAt = new Date();
    if (status === 'FINISHED') updateData.completedAt = new Date();

    const updatedToken = await prisma.queueToken.update({
      where: { id: tokenId },
      data: updateData,
    });

    // Update appointment status mirror
    let apptStatus = existingToken.appointment.status;
    if (status === 'CALLED' || status === 'IN_PROGRESS') apptStatus = 'IN_CONSULTATION';
    if (status === 'FINISHED') apptStatus = 'COMPLETED';
    if (status === 'SKIPPED') apptStatus = 'NO_SHOW';

    await prisma.appointment.update({
      where: { id: existingToken.appointmentId },
      data: { status: apptStatus },
    });

    // Send notifications if called
    if (status === 'CALLED') {
      await notificationService.notifyQueueTurnApproaching({
        patientName: `${existingToken.appointment.patient.user.firstName} ${existingToken.appointment.patient.user.lastName}`,
        patientPhone: existingToken.appointment.patient.user.phone || undefined,
        patientEmail: existingToken.appointment.patient.user.email,
        doctorName: `${existingToken.appointment.doctor.user.firstName} ${existingToken.appointment.doctor.user.lastName}`,
        roomNumber: existingToken.appointment.doctor.roomNumber,
        tokenNumber: existingToken.tokenNumber,
        waitingAhead: 0,
      });
    }

    // Broadcast WebSocket updates
    emitQueueUpdate(existingToken.appointment.doctorId, {
      type: 'TOKEN_STATUS_UPDATED',
      tokenId,
      tokenNumber: existingToken.tokenNumber,
      status,
    });

    emitTokenStatusChange(existingToken.tokenNumber, {
      tokenId,
      status,
      roomNumber: existingToken.appointment.doctor.roomNumber,
    });

    return res.json({
      success: true,
      message: `Token ${existingToken.tokenNumber} marked as ${status}`,
      data: updatedToken,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getLiveTokenStatus = async (req: Request, res: Response) => {
  try {
    const tokenNumber = String(req.params.tokenNumber);

    const token = await prisma.queueToken.findFirst({
      where: { tokenNumber },
      include: {
        appointment: {
          include: {
            doctor: {
              include: {
                user: true,
                department: true,
              },
            },
            patient: {
              include: { user: true },
            },
          },
        },
      },
    });

    if (!token) {
      return res.status(404).json({ success: false, message: 'Token not found' });
    }

    // Calculate how many people ahead of this token
    const waitingAhead = await prisma.queueToken.count({
      where: {
        appointment: {
          doctorId: token.appointment.doctorId,
          appointmentDate: token.appointment.appointmentDate,
        },
        sequenceOrder: { lt: token.sequenceOrder },
        status: { in: ['WAITING', 'CALLED', 'IN_PROGRESS'] },
      },
    });

    const estimatedWaitMinutes = waitingAhead * token.appointment.doctor.slotDurationMins;

    return res.json({
      success: true,
      data: {
        token,
        waitingAhead,
        estimatedWaitMinutes,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
