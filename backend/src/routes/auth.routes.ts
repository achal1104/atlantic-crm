import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller.js';
import { registerValidator, loginValidator } from '../validators/auth.validator.js';

const router = Router();

// POST /api/auth/register
router.post('/register', registerValidator, registerUser);

// POST /api/auth/login
router.post('/login', loginValidator, loginUser);

export default router;