/**
 * Email service using Nodemailer (optional)
 * Configure SMTP in .env to enable email features
 */
let transporter = null;

const initTransporter = () => {
  const nodemailer = require('nodemailer');
  if (!process.env.SMTP_HOST) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendPasswordReset = async (email, token) => {
  if (!transporter) transporter = initTransporter();
  if (!transporter) {
    console.warn('Email service not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS in .env');
    return;
  }

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"ShaadiBio" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'ShaadiBio — Password Reset Request',
    html: `
      <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #8b1a1a;">Password Reset</h2>
        <p>You requested a password reset for your ShaadiBio account.</p>
        <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#c8873a;color:white;border-radius:6px;text-decoration:none;">Reset Password</a>
        <p style="color:#9a7a5a;font-size:12px;margin-top:16px;">This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
      </div>
    `,
  });
};

module.exports = { sendPasswordReset };
