import { Router } from 'express';
import { getLeads, getLeadById, createLead, updateLead, deleteLead, exportLeadsCSV } from '../controllers/lead.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { createLeadValidator, updateLeadValidator } from '../validators/lead.validator.js';

const router = Router();

router.use(protect);

router.get('/', getLeads);
router.get('/export/csv', exportLeadsCSV);
router.get('/:id', getLeadById);
router.post('/', createLeadValidator, createLead);
router.put('/:id', updateLeadValidator, updateLead);
router.delete('/:id', deleteLead);

export default router;
