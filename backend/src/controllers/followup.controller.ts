import { Response } from 'express';
import prisma from '../prisma/client.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getFollowUps = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { leadId } = req.query as { leadId?: string };
    const followUps = await prisma.followUp.findMany({
      where: leadId ? { leadId } : {},
      orderBy: { scheduledAt: 'desc' },
      include: { lead: { select: { name: true } }, user: { select: { name: true } } },
    });
    sendSuccess(res, { data: followUps });
  } catch {
    sendError(res, 'Failed to fetch follow-ups');
  }
};

export const createFollowUp = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { leadId, type, notes, scheduledAt } = req.body;
    const followUp = await prisma.followUp.create({
      data: { leadId, type, notes, scheduledAt: new Date(scheduledAt), userId: req.user!.id },
    });
    await prisma.activityLog.create({
      data: { leadId, action: 'Follow-up Scheduled', description: `${type} scheduled for ${new Date(scheduledAt).toLocaleDateString()}` },
    });
    sendSuccess(res, { data: followUp, message: 'Follow-up created' }, 201);
  } catch (err: any) {
    sendError(res, err.message || 'Failed to create follow-up');
  }
};

export const completeFollowUp = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const followUp = await prisma.followUp.update({
      where: { id: req.params.id },
      data: { isCompleted: true },
    });
    sendSuccess(res, { data: followUp, message: 'Follow-up marked as completed' });
  } catch {
    sendError(res, 'Failed to update follow-up');
  }
};
