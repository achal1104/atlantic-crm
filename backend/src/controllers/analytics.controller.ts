import { Response } from 'express';
import prisma from '../prisma/client.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [bySource, byStatus, recentLeads, totalLeads, wonLeads] = await Promise.all([
      prisma.lead.groupBy({ by: ['source'], _count: { id: true } }),
      prisma.lead.groupBy({ by: ['status'], _count: { id: true } }),
      prisma.lead.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'WON' } }),
    ]);

    // Group daily leads for chart
    const dailyMap: Record<string, number> = {};
    recentLeads.forEach((l) => {
      const day = l.createdAt.toISOString().split('T')[0];
      dailyMap[day] = (dailyMap[day] || 0) + 1;
    });
    const dailyLeads = Object.entries(dailyMap).map(([date, count]) => ({ date, count }));

    sendSuccess(res, {
      data: {
        bySource: bySource.map((s) => ({ source: s.source, count: s._count.id })),
        byStatus: byStatus.map((s) => ({ status: s.status, count: s._count.id })),
        dailyLeads,
        conversionRate: totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : '0',
      },
    });
  } catch {
    sendError(res, 'Failed to fetch analytics');
  }
};
