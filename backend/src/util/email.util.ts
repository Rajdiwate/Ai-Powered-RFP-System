import nodemailer from 'nodemailer';

import { AppError } from '@core/app-error';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions) => {
  const smtpUser = process.env.ZOHO_SMTP_USER;
  const smtpPass = process.env.ZOHO_SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    console.error('SMTP credentials are missing in environment variables');
    throw AppError.InternalServerError(null, 'SMTP credentials are missing');
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.in', // SMTP_HOST
    port: 465, // SMTP_PORT
    secure: true,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const mailOptions = {
    from: smtpUser, // This should match your SMTP auth user
    ...options,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info.response;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw AppError.InternalServerError(null, error.message);
    }
    console.error(error);
    throw AppError.InternalServerError(null, 'Failed to send email');
  }
};
