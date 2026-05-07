// ============================================================
// config/mailer.js
// Nodemailer configuration for sending confirmation emails
// Uses Ethereal Mail (fake SMTP) for development/college use
// No real Gmail account needed!
// ============================================================

import nodemailer from 'nodemailer';

// ============================================================
// createTransporter()
// Creates an Ethereal test account automatically
// In production, replace with Gmail or real SMTP credentials
// ============================================================
let transporter = null;

const getTransporter = async () => {
  if (transporter) return transporter; // Reuse existing transporter

  try {
    // Ethereal generates a fake email account for testing
    // Every email sent will appear in the Ethereal inbox at https://ethereal.email
    const testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // false = use STARTTLS
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });

    console.log('📧 Email transporter ready (Ethereal test account created)');
    console.log(`   Preview emails at: https://ethereal.email`);
    console.log(`   User: ${testAccount.user}`);
    console.log(`   Pass: ${testAccount.pass}`);

    return transporter;
  } catch (error) {
    console.error('❌ Failed to create email transporter:', error.message);
    return null;
  }
};

// ============================================================
// sendApplicationConfirmation(options)
// Sends a confirmation email to the job applicant
// Called from job.controller.js after successful application
// ============================================================
const sendApplicationConfirmation = async ({ to, applicantName, jobTitle, companyName }) => {
  const transport = await getTransporter();

  if (!transport) {
    throw new Error('Email transporter not available');
  }

  // --- Build the email HTML body ---
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; }
        .container { max-width: 600px; margin: 30px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .body { padding: 30px; color: #333; }
        .highlight { background: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; border-radius: 4px; margin: 20px 0; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        .btn { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Application Received!</h1>
          <p>Job Portal — Your Career Partner</p>
        </div>
        <div class="body">
          <p>Dear <strong>${applicantName}</strong>,</p>
          <p>We are pleased to confirm that your job application has been successfully submitted!</p>

          <div class="highlight">
            <p><strong>📋 Job Title:</strong> ${jobTitle}</p>
            <p><strong>🏢 Company:</strong> ${companyName}</p>
            <p><strong>📅 Application Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
          </div>

          <p>The recruiter at <strong>${companyName}</strong> will review your application and resume. If your profile matches their requirements, they will reach out to you directly.</p>

          <p><strong>What happens next?</strong></p>
          <ul>
            <li>The recruiter reviews your resume</li>
            <li>If shortlisted, you'll be contacted for an interview</li>
            <li>The process typically takes 1-2 weeks</li>
          </ul>

          <p>Good luck with your application! 🍀</p>
          <p>Best regards,<br><strong>Job Portal Team</strong></p>
        </div>
        <div class="footer">
          <p>This is an automated confirmation email. Please do not reply.</p>
          <p>© 2024 Job Portal — College Project</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // --- Send the email ---
  const info = await transport.sendMail({
    from: '"Job Portal" <noreply@jobportal.com>',
    to: to,
    subject: `✅ Application Confirmed: ${jobTitle} at ${companyName}`,
    html: htmlContent,
    text: `Dear ${applicantName}, Your application for ${jobTitle} at ${companyName} has been received. Good luck!`
  });

  // Log the Ethereal preview URL (where you can see the "sent" email)
  console.log(`📧 Email sent: ${nodemailer.getTestMessageUrl(info)}`);

  return info;
};

export { sendApplicationConfirmation };
