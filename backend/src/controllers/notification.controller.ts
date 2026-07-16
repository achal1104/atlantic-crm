import { Response } from 'express';
import prisma from '../prisma/client.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    const unreadCount = await prisma.notification.count({ where: { userId: req.user!.id, isRead: false } });
    sendSuccess(res, { data: notifications, unreadCount });
  } catch {
    sendError(res, 'Failed to fetch notifications');
  }
};

export const markAllRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.notification.updateMany({ where: { userId: req.user!.id, isRead: false }, data: { isRead: true } });
    sendSuccess(res, { message: 'All notifications marked as read' });
  } catch {
    sendError(res, 'Failed to update notifications');
  }
};

export const markOneRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.notification.updateMany({
      where: { id: req.params.id, userId: req.user!.id },
      data: { isRead: true },
    });
    sendSuccess(res, { message: 'Notification marked as read' });
  } catch {
    sendError(res, 'Failed to update notification');
  }
};
