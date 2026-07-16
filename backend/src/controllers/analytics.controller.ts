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

    // Daily leads chart
    const dailyMap: Record<string, number> = {};
    recentLeads.forEach((l) => {
      const day = l.createdAt.toISOString().split('T')[0];
      dailyMap[day] = (dailyMap[day] || 0) + 1;
    });
    const dailyLeads = Object.entries(dailyMap).map(([date, count]) => ({ date, count }));

    // Monthly leads (last 12 months) via raw query
    const monthlyRaw = await prisma.$queryRaw<{ month: string; count: bigint }[]>`
      SELECT TO_CHAR(DATE_TRUNC('month', "createdAt"), 'YYYY-MM') AS month, COUNT(*) AS count
      FROM "Lead"
      WHERE "createdAt" >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY DATE_TRUNC('month', "createdAt") ASC
    `;
    const monthlyLeads = monthlyRaw.map((r) => ({ month: r.month, count: Number(r.count) }));

    // Sales performance: WON leads per assigned user
    const salesRaw = await prisma.$queryRaw<{ name: string; won: bigint; total: bigint }[]>`
      SELECT u.name, 
        COUNT(CASE WHEN l.status = 'WON' THEN 1 END) AS won,
        COUNT(l.id) AS total
      FROM "User" u
      LEFT JOIN "Lead" l ON l."assignedToId" = u.id
      GROUP BY u.id, u.name
      ORDER BY won DESC
      LIMIT 10
    `;
    const salesPerformance = salesRaw.map((r) => ({
      name: r.name,
      won: Number(r.won),
      total: Number(r.total),
    }));

    sendSuccess(res, {
      data: {
        bySource: bySource.map((s) => ({ source: s.source, count: s._count.id })),
        byStatus: byStatus.map((s) => ({ status: s.status, count: s._count.id })),
        dailyLeads,
        monthlyLeads,
        salesPerformance,
        conversionRate: totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : '0',
      },
    });
  } catch (err) {
    console.error(err);
    sendError(res, 'Failed to fetch analytics');
  }
};
