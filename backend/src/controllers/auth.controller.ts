import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../prisma/client.js';
import { sendPasswordResetEmail } from '../utils/email.js';

const JWT_SECRET = process.env.JWT_SECRET!;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const signToken = (id: string, role: string) =>
  jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '1d' });

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } }).catch(() => null);
  if (existing) {
    res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    return;
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, password: hashed } });
    const token = signToken(user.id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Registration failed.' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = signToken(user.id, user.role);
    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Login failed.' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  const successMsg = { success: true, message: 'If that email exists, a reset link has been sent.' };

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) { res.json(successMsg); return; }

    const token = crypto.randomBytes(32).toString('hex');
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;
    await sendPasswordResetEmail(user.email, resetUrl).catch((err: any) => {
      console.error('Failed to send reset email');
    });

    res.json(successMsg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: { resetToken: token, resetTokenExpiry: { gt: new Date() } },
    });

    if (!user) {
      res.status(400).json({ success: false, message: 'Reset link is invalid or has expired.' });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed, resetToken: null, resetTokenExpiry: null },
    });

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
};
