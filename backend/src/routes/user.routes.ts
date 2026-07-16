import { Router } from 'express';
import { getProfile, updateProfile, changePassword, getAllUsers, deleteUser } from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.get('/', getAllUsers);
router.delete('/:id', authorize('ADMIN'), deleteUser);

export default router;
