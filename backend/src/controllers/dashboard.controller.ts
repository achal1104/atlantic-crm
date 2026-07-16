import { Response } from 'express';
import prisma from '../prisma/client.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const now = new Date();

    const [total, todayLeads, converted, lost, appointments, recentActivity] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.lead.count({ where: { status: 'WON' } }),
      prisma.lead.count({ where: { status: 'LOST' } }),
      prisma.followUp.count({ where: { isCompleted: false, scheduledAt: { gte: now } } }),
      prisma.activityLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { lead: { select: { name: true } } },
      }),
    ]);

    const revenue = await prisma.lead.aggregate({
      _sum: { budget: true },
      where: { status: 'WON' },
    });

    sendSuccess(res, {
      data: {
        totalLeads: total,
        todayLeads,
        convertedLeads: converted,
        lostLeads: lost,
        appointments,
        revenue: revenue._sum.budget ?? 0,
        recentActivity,
      },
    });
  } catch {
    sendError(res, 'Failed to fetch dashboard stats');
  }
};
