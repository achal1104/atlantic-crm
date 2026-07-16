import { Response } from 'express';
import prisma from '../prisma/client.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { notifyFollowUpReminder } from '../services/notification.service.js';

export const getFollowUps = async (req: AuthRequest, res: Response): Promise<void> => {
  const { leadId } = req.query as { leadId?: string };

  try {
    const followUps = await prisma.followUp.findMany({
      where: leadId ? { leadId } : {},
      orderBy: { scheduledAt: 'desc' },
      include: {
        lead: { select: { name: true } },
        user: { select: { name: true } },
      },
    });

    res.json({ success: true, data: followUps });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch follow-ups.' });
  }
};

export const createFollowUp = async (req: AuthRequest, res: Response): Promise<void> => {
  const { leadId, type, notes, scheduledAt } = req.body;

  try {
    const followUp = await prisma.followUp.create({
      data: {
        leadId,
        type,
        notes: notes || null,
        scheduledAt: new Date(scheduledAt),
        userId: req.user!.id,
      },
    });

    await prisma.activityLog.create({
      data: {
        leadId,
        action: 'Follow-up Scheduled',
        description: `${type} on ${new Date(scheduledAt).toLocaleDateString()}`,
      },
    });

    const lead = await prisma.lead.findUnique({ where: { id: leadId }, select: { name: true } });
    if (lead) {
      await notifyFollowUpReminder(req.user!.id, lead.name, type);
    }

    res.status(201).json({ success: true, data: followUp });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Failed to create follow-up.' });
  }
};

export const completeFollowUp = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const followUp = await prisma.followUp.update({
      where: { id: req.params.id },
      data: { isCompleted: true },
    });

    res.json({ success: true, data: followUp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to update follow-up.' });
  }
};
