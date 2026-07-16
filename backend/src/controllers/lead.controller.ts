import { Response } from 'express';
import prisma from '../prisma/client.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { generateCSV } from '../utils/csvExport.js';
import { notifyLeadAssigned, notifyLeadUpdated } from '../services/notification.service.js';

export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      page = '1', limit = '10', search = '',
      status, source, assignedToId, sortBy = 'createdAt', order = 'desc',
    } = req.query as Record<string, string>;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where: any = {
      AND: [
        search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        } : {},
        status ? { status } : {},
        source ? { source } : {},
        assignedToId ? { assignedToId } : {},
      ],
    };

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where, skip, take: parseInt(limit),
        orderBy: { [sortBy]: order },
        include: { assignedTo: { select: { id: true, name: true, email: true } } },
      }),
      prisma.lead.count({ where }),
    ]);

    sendSuccess(res, {
      data: leads,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    sendError(res, 'Failed to fetch leads');
  }
};

export const getLeadById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: req.params.id },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        followUps: { orderBy: { scheduledAt: 'desc' } },
        activityLogs: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!lead) { sendError(res, 'Lead not found', 404); return; }
    sendSuccess(res, { data: lead });
  } catch {
    sendError(res, 'Failed to fetch lead');
  }
};

export const createLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const body = { ...req.body };
    if (!body.assignedToId) delete body.assignedToId;
    const lead = await prisma.lead.create({ data: body });
    await prisma.activityLog.create({
      data: { leadId: lead.id, action: 'Lead Created', description: `Lead "${lead.name}" was created` },
    });
    if (lead.assignedToId) {
      await notifyLeadAssigned(lead.id, lead.assignedToId, lead.name);
    }
    sendSuccess(res, { data: lead, message: 'Lead created successfully' }, 201);
  } catch (err: any) {
    sendError(res, err.message || 'Failed to create lead');
  }
};

export const updateLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const existing = await prisma.lead.findUnique({ where: { id: req.params.id } });
    if (!existing) { sendError(res, 'Lead not found', 404); return; }

    const updateData = { ...req.body };
    if (updateData.assignedToId === '' || updateData.assignedToId === null) updateData.assignedToId = null;
    const lead = await prisma.lead.update({ where: { id: req.params.id }, data: updateData });

    if (req.body.status && req.body.status !== existing.status) {
      await prisma.activityLog.create({
        data: { leadId: lead.id, action: 'Status Changed', description: `Status changed from ${existing.status} to ${lead.status}` },
      });
      if (lead.assignedToId) {
        await notifyLeadUpdated(lead.assignedToId, lead.name, `Status changed to ${lead.status}`, lead.id);
      }
    }
    // Notify new assignee if assignment changed
    if (req.body.assignedToId && req.body.assignedToId !== existing.assignedToId) {
      await notifyLeadAssigned(lead.id, req.body.assignedToId, lead.name);
    }
    sendSuccess(res, { data: lead, message: 'Lead updated successfully' });
  } catch {
    sendError(res, 'Failed to update lead');
  }
};

export const deleteLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const existing = await prisma.lead.findUnique({ where: { id: req.params.id } });
    if (!existing) { sendError(res, 'Lead not found', 404); return; }
    await prisma.lead.delete({ where: { id: req.params.id } });
    sendSuccess(res, { message: 'Lead deleted successfully' });
  } catch {
    sendError(res, 'Failed to delete lead');
  }
};

export const exportLeadsCSV = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const leads = await prisma.lead.findMany({
      include: { assignedTo: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    const csv = generateCSV(leads);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
    res.send(csv);
  } catch {
    sendError(res, 'Failed to export leads');
  }
};
