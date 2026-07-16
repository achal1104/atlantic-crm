import { Router } from 'express';
import { registerUser, loginUser, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import { registerValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator } from '../validators/auth.validator.js';

const router = Router();

router.post('/register', registerValidator, registerUser);
router.post('/login', loginValidator, loginUser);
router.post('/forgot-password', forgotPasswordValidator, forgotPassword);
router.post('/reset-password', resetPasswordValidator, resetPassword);

export default router;