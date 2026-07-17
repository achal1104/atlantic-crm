import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  const { error } = await resend.emails.send({
    from: 'Atlantic AI CRM <onboarding@resend.dev>',
    to,
    subject,
    html,
  });

  if (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email');
  }
};

export const sendPasswordResetEmail = async (to: string, resetUrl: string): Promise<void> => {
  await sendEmail(to, 'Reset Your Password — Atlantic AI CRM', `
    <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
      <h2 style="color:#1d4ed8;">Reset Your Password</h2>
      <p>Click the button below to reset your password. This link expires in <strong>1 hour</strong>.</p>
      <a href="${resetUrl}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">Reset Password</a>
      <p style="color:#6b7280;font-size:13px;">If you didn't request this, ignore this email.</p>
    </div>
  `);
};

export const sendLeadAssignedEmail = async (to: string, userName: string, leadName: string): Promise<void> => {
  await sendEmail(to, 'New Lead Assigned — Atlantic AI CRM', `
    <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
      <h2 style="color:#1d4ed8;">New Lead Assigned</h2>
      <p>Hi <strong>${userName}</strong>, lead <strong>${leadName}</strong> has been assigned to you.</p>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/leads" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">View Lead</a>
    </div>
  `);
};