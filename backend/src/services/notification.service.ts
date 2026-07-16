import prisma from '../prisma/client.js';
import { sendLeadAssignedEmail } from '../utils/email.js';

export const notifyLeadAssigned = async (leadId: string, assignedToId: string, leadName: string): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({ where: { id: assignedToId } });
    if (!user) return;
    await prisma.notification.create({
      data: { userId: assignedToId, type: 'LEAD_ASSIGNED', message: `Lead "${leadName}" has been assigned to you.`, leadId },
    });
    if (user.email && process.env.SMTP_USER) {
      await sendLeadAssignedEmail(user.email, user.name, leadName).catch(() => {});
    }
  } catch {}
};

export const notifyLeadUpdated = async (assignedToId: string, leadName: string, change: string, leadId: string): Promise<void> => {
  try {
    await prisma.notification.create({
      data: { userId: assignedToId, type: 'LEAD_UPDATED', message: `Lead "${leadName}": ${change}`, leadId },
    });
  } catch {}
};

export const notifyFollowUpReminder = async (userId: string, leadName: string, followUpType: string): Promise<void> => {
  try {
    await prisma.notification.create({
      data: { userId, type: 'FOLLOWUP_REMINDER', message: `Reminder: ${followUpType} follow-up for "${leadName}" is due.` },
    });
  } catch {}
};
