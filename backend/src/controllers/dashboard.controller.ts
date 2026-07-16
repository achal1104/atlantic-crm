import { Response } from 'express';
import prisma from '../prisma/client.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export const getDashboardStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [total, todayLeads, converted, lost, appointments, recentActivity, revenue] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.lead.count({ where: { status: 'WON' } }),
      prisma.lead.count({ where: { status: 'LOST' } }),
      prisma.followUp.count({ where: { isCompleted: false, scheduledAt: { gte: new Date() } } }),
      prisma.activityLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { lead: { select: { name: true } } },
      }),
      prisma.lead.aggregate({ _sum: { budget: true }, where: { status: 'WON' } }),
    ]);

    res.json({
      success: true,
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to load dashboard.' });
  }
};
