import { Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../prisma/client.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatar: true,
  createdAt: true,
} as const;

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: USER_SELECT,
    });

    if (!user) { res.status(404).json({ success: false, message: 'User not found.' }); return; }
    res.json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch profile.' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, avatar } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { name, avatar },
      select: USER_SELECT,
    });

    res.json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) { res.status(404).json({ success: false, message: 'User not found.' }); return; }

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      return;
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

    res.json({ success: true, message: 'Password updated.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to change password.' });
  }
};

export const getAllUsers = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({ select: USER_SELECT });
    res.json({ success: true, data: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch users.' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
<<<<<<< HEAD
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to delete user.' });
=======
    await prisma.user.delete({ where: { id: req.params.id as string } });
    sendSuccess(res, { message: 'User deleted successfully' });
  } catch {
    sendError(res, 'Failed to delete user');
>>>>>>> 6a95c8e (fix: resolve TypeScript build errors for Render deployment)
  }
};