import { Router } from 'express';
import { getNotifications, markAllRead, markOneRead } from '../controllers/notification.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();
router.use(protect);
router.get('/', getNotifications);
router.put('/read-all', markAllRead);
router.put('/:id/read', markOneRead);

export default router;
