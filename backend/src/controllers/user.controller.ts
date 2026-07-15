import { Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../prisma/client.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, name: true, email: true, role: true, avatar: true, createdAt: true },
    });
    if (!user) { sendError(res, 'User not found', 404); return; }
    sendSuccess(res, { data: user });
  } catch {
    sendError(res, 'Failed to fetch profile');
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, avatar } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { name, avatar },
      select: { id: true, name: true, email: true, role: true, avatar: true },
    });
    sendSuccess(res, { data: user, message: 'Profile updated successfully' });
  } catch {
    sendError(res, 'Failed to update profile');
  }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) { sendError(res, 'User not found', 404); return; }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) { sendError(res, 'Current password is incorrect', 400); return; }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: req.user!.id }, data: { password: hashed } });
    sendSuccess(res, { message: 'Password changed successfully' });
  } catch {
    sendError(res, 'Failed to change password');
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, avatar: true, createdAt: true },
    });
    sendSuccess(res, { data: users });
  } catch {
    sendError(res, 'Failed to fetch users');
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    sendSuccess(res, { message: 'User deleted successfully' });
  } catch {
    sendError(res, 'Failed to delete user');
  }
};
