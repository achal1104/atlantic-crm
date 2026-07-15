import { Router } from 'express';
import { getFollowUps, createFollowUp, completeFollowUp } from '../controllers/followup.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);

router.get('/', getFollowUps);
router.post('/', createFollowUp);
router.put('/:id/complete', completeFollowUp);

export default router;
