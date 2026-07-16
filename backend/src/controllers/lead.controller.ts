import { Response } from 'express';
import prisma from '../prisma/client.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { generateCSV } from '../utils/csvExport.js';
import { notifyLeadAssigned, notifyLeadUpdated } from '../services/notification.service.js';

const ALLOWED_SORT_FIELDS = ['createdAt', 'name', 'status', 'source', 'leadScore', 'budget'];

export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  const {
    page = '1',
    limit = '10',
    search = '',
    status,
    source,
    assignedToId,
    sortBy = 'createdAt',
    order = 'desc',
  } = req.query as Record<string, string>;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const sortField = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'createdAt';
  const sortOrder = order === 'asc' ? 'asc' : 'desc';

  const where: any = { AND: [] };

  if (req.user!.role === 'SALES_EXECUTIVE') {
    where.AND.push({ assignedToId: req.user!.id });
  } else if (assignedToId) {
    where.AND.push({ assignedToId });
  }

  if (search) {
    where.AND.push({
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    });
  }
  if (status) where.AND.push({ status });
  if (source) where.AND.push({ source });

  try {
    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { [sortField]: sortOrder },
        include: { assignedTo: { select: { id: true, name: true, email: true } } },
      }),
      prisma.lead.count({ where }),
    ]);

    res.json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch leads.' });
  }
};

export const getLeadById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: req.params.id as string },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        followUps: { orderBy: { scheduledAt: 'desc' } },
        activityLogs: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found.' });
      return;
    }

    res.json({ success: true, data: lead });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch lead.' });
  }
};

export const createLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = { ...req.body };
    if (!data.assignedToId) delete data.assignedToId;

    const lead = await prisma.lead.create({ data });

    await prisma.activityLog.create({
      data: {
        leadId: lead.id,
        action: 'Lead Created',
        description: `${lead.name} was added to the system`,
      },
    });

    if (lead.assignedToId) {
      await notifyLeadAssigned(lead.id, lead.assignedToId, lead.name);
    }

    res.status(201).json({ success: true, data: lead });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Failed to create lead.' });
  }
};

export const updateLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const existing = await prisma.lead.findUnique({ where: { id: req.params.id as string } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Lead not found.' });
      return;
    }

    const updateData = { ...req.body };
    if (updateData.assignedToId === '' || updateData.assignedToId === null) updateData.assignedToId = null;

    const lead = await prisma.lead.update({ where: { id: req.params.id as string }, data: updateData });

    if (updateData.status && updateData.status !== existing.status) {
      await prisma.activityLog.create({
        data: {
          leadId: lead.id,
          action: 'Status Updated',
          description: `${existing.status} → ${lead.status}`,
        },
      });
      if (lead.assignedToId) {
        await notifyLeadUpdated(lead.assignedToId, lead.name, `Status changed to ${lead.status}`, lead.id);
      }
    }

    if (updateData.assignedToId && updateData.assignedToId !== existing.assignedToId) {
      await notifyLeadAssigned(lead.id, updateData.assignedToId, lead.name);
    }

    res.json({ success: true, data: lead });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to update lead.' });
  }
};

export const deleteLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const existing = await prisma.lead.findUnique({ where: { id: req.params.id as string } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Lead not found.' });
      return;
    }
    await prisma.lead.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Lead deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to delete lead.' });
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Export failed.' });
  }
};