const nodemailer = require('nodemailer');

// Email service for sending verification emails
class EmailService {
  constructor() {
    // For development, we'll use a test account
    // In production, you would use a real SMTP service like SendGrid, AWS SES, etc.
    this.transporter = null;
    this.initializeTransporter();
  }

  async initializeTransporter() {
    try {
      // Create a test account for development
      const testAccount = await nodemailer.createTestAccount();
      
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      console.log('Email service initialized with test account');
    } catch (error) {
      console.error('Failed to initialize email service:', error);
      
      // Fallback to a mock transporter for development
      this.transporter = {
        sendMail: async (mailOptions) => {
          console.log('Mock email sent:', {
            to: mailOptions.to,
            subject: mailOptions.subject,
            text: mailOptions.text
          });
          return { messageId: 'mock-message-id' };
        }
      };
    }
  }

  async sendVerificationEmail(email, verificationCode, userName) {
    try {
      if (!this.transporter) {
        await this.initializeTransporter();
      }

      const mailOptions = {
        from: '"LingoLink" <noreply@lingolink.com>',
        to: email,
        subject: 'Verify Your Email Address - LingoLink',
        text: `
Hello ${userName},

Welcome to LingoLink! Please verify your email address by entering the following code:

Verification Code: ${verificationCode}

This code will expire in 10 minutes.

If you didn't create an account with LingoLink, please ignore this email.

Best regards,
The LingoLink Team
        `,
        html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .code { background: #e3f2fd; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0; }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>LingoLink</h1>
            <p>Professional Translation Services</p>
        </div>
        <div class="content">
            <h2>Hello ${userName},</h2>
            <p>Welcome to LingoLink! Please verify your email address by entering the following code:</p>
            <div class="code">${verificationCode}</div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't create an account with LingoLink, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>Best regards,<br>The LingoLink Team</p>
        </div>
    </div>
</body>
</html>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Verification email sent:', info.messageId);
      
      // For development with Ethereal, log the preview URL
      if (info.messageId !== 'mock-message-id') {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      }
      
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending verification email:', error);
      return { success: false, error: error.message };
    }
  }

  async sendPasswordResetEmail(email, resetToken, userName) {
    try {
      if (!this.transporter) {
        await this.initializeTransporter();
      }

      const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3001'}/reset-password?token=${resetToken}`;

      const mailOptions = {
        from: '"LingoLink" <noreply@lingolink.com>',
        to: email,
        subject: 'Reset Your Password - LingoLink',
        text: `
Hello ${userName},

You requested to reset your password for your LingoLink account.

Click the following link to reset your password:
${resetUrl}

This link will expire in 1 hour.

If you didn't request a password reset, please ignore this email.

Best regards,
The LingoLink Team
        `,
        html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>LingoLink</h1>
            <p>Professional Translation Services</p>
        </div>
        <div class="content">
            <h2>Hello ${userName},</h2>
            <p>You requested to reset your password for your LingoLink account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>Or copy and paste this link into your browser:</p>
            <p>${resetUrl}</p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request a password reset, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>Best regards,<br>The LingoLink Team</p>
        </div>
    </div>
</body>
</html>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent:', info.messageId);
      
      if (info.messageId !== 'mock-message-id') {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      }
      
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return { success: false, error: error.message };
    }
  }

  async sendWelcomeEmail(email, userName, userType) {
    try {
      if (!this.transporter) {
        await this.initializeTransporter();
      }

      const mailOptions = {
        from: '"LingoLink" <noreply@lingolink.com>',
        to: email,
        subject: 'Welcome to LingoLink!',
        text: `
Hello ${userName},

Welcome to LingoLink - the premier platform for professional translation services!

Your account has been successfully created as a ${userType}.

${userType === 'translator' ? 
  'As a translator, you can now browse available translation jobs, apply for projects, and start building your reputation on our platform.' :
  'As a client, you can now post translation requests, browse our network of professional translators, and get your documents translated quickly and accurately.'
}

To get started:
1. Complete your profile verification
2. ${userType === 'translator' ? 'Browse available translation jobs' : 'Post your first translation request'}
3. ${userType === 'translator' ? 'Apply for projects that match your expertise' : 'Connect with qualified translators'}

If you have any questions, our support team is here to help.

Best regards,
The LingoLink Team
        `,
        html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .steps { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #3b82f6; }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to LingoLink!</h1>
            <p>Professional Translation Services</p>
        </div>
        <div class="content">
            <h2>Hello ${userName},</h2>
            <p>Welcome to LingoLink - the premier platform for professional translation services!</p>
            <p>Your account has been successfully created as a <strong>${userType}</strong>.</p>
            
            ${userType === 'translator' ? 
              '<p>As a translator, you can now browse available translation jobs, apply for projects, and start building your reputation on our platform.</p>' :
              '<p>As a client, you can now post translation requests, browse our network of professional translators, and get your documents translated quickly and accurately.</p>'
            }
            
            <h3>To get started:</h3>
            <div class="steps">
                <p><strong>1.</strong> Complete your profile verification</p>
                <p><strong>2.</strong> ${userType === 'translator' ? 'Browse available translation jobs' : 'Post your first translation request'}</p>
                <p><strong>3.</strong> ${userType === 'translator' ? 'Apply for projects that match your expertise' : 'Connect with qualified translators'}</p>
            </div>
            
            <p>If you have any questions, our support team is here to help.</p>
        </div>
        <div class="footer">
            <p>Best regards,<br>The LingoLink Team</p>
        </div>
    </div>
</body>
</html>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent:', info.messageId);
      
      if (info.messageId !== 'mock-message-id') {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      }
      
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error: error.message };
    }
  }

  async sendPasswordResetEmail(email, userName, resetToken) {
    try {
      if (!this.transporter) {
        await this.initializeTransporter();
      }

      const resetUrl = `http://localhost:3001/forgot-password?token=${resetToken}`;

      const mailOptions = {
        from: '"LingoLink" <noreply@lingolink.com>',
        to: email,
        subject: 'Reset Your LingoLink Password',
        text: `
Hello ${userName},

You have requested to reset your password for your LingoLink account.

To reset your password, please click the link below or copy and paste it into your browser:
${resetUrl}

Alternatively, you can use this reset token manually: ${resetToken}

This link will expire in 1 hour for security reasons.

If you did not request this password reset, please ignore this email and your password will remain unchanged.

Best regards,
The LingoLink Team
        `,
        html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .reset-button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .token-box { background: #e5e7eb; padding: 15px; margin: 15px 0; border-radius: 5px; font-family: monospace; word-break: break-all; }
        .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0; }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
            <p>LingoLink Account Security</p>
        </div>
        <div class="content">
            <h2>Hello ${userName},</h2>
            <p>You have requested to reset your password for your LingoLink account.</p>
            
            <p>To reset your password, please click the button below:</p>
            <a href="${resetUrl}" class="reset-button">Reset My Password</a>
            
            <p>Or copy and paste this link into your browser:</p>
            <div class="token-box">${resetUrl}</div>
            
            <p>Alternatively, you can use this reset token manually on the forgot password page:</p>
            <div class="token-box">${resetToken}</div>
            
            <div class="warning">
                <strong>Important:</strong> This link will expire in 1 hour for security reasons.
            </div>
            
            <p>If you did not request this password reset, please ignore this email and your password will remain unchanged.</p>
        </div>
        <div class="footer">
            <p>Best regards,<br>The LingoLink Team</p>
        </div>
    </div>
</body>
</html>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent:', info.messageId);
      
      if (info.messageId !== 'mock-message-id') {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      }
      
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
