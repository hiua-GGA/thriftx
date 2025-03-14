import nodemailer from 'nodemailer';
import { IUser } from '../models/User';
import cryptoRandomString from 'crypto-random-string';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (user: IUser) => {
  const token = cryptoRandomString({ length: 32, type: 'url-safe' });
  
  user.emailVerificationToken = token;
  user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  await user.save();

  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@thriftx.com',
    to: user.email,
    subject: 'Verify your email address',
    html: `
      <h1>Welcome to ThriftX!</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (user: IUser) => {
  const token = cryptoRandomString({ length: 32, type: 'url-safe' });
  
  user.passwordResetToken = token;
  user.passwordResetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@thriftx.com',
    to: user.email,
    subject: 'Reset your password',
    html: `
      <h1>Password Reset Request</h1>
      <p>You requested to reset your password. Click the link below to create a new password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendVendorVerificationEmail = async (user: IUser) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@thriftx.com',
    to: process.env.ADMIN_EMAIL,
    subject: 'New Vendor Verification Request',
    html: `
      <h1>New Vendor Verification Request</h1>
      <h2>Vendor Details:</h2>
      <ul>
        <li>Store Name: ${user.vendor?.storeName}</li>
        <li>Business Email: ${user.vendor?.businessEmail}</li>
        <li>Business Phone: ${user.vendor?.businessPhone}</li>
        <li>Tax ID: ${user.vendor?.taxId}</li>
      </ul>
      <p>Please review the vendor's information and verify their account.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}; 