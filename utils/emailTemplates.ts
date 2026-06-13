interface EmailConfig {
  title: string;
  messageHtml: string;
  buttonText?: string;
  buttonUrl?: string;
  footerText?: string;
}

export function buildEmailTemplate({ title, messageHtml, buttonText, buttonUrl, footerText }: EmailConfig): string {
  const buttonHtml = buttonText && buttonUrl ? `
    <div style="text-align: center; margin: 32px 0;">
      <a href="${buttonUrl}" style="background-color: #2563EB; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
        ${buttonText}
      </a>
    </div>
  ` : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
    .header { background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%); padding: 32px 24px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
    .content { padding: 32px 24px; color: #374151; font-size: 16px; line-height: 1.6; }
    .content p { margin-top: 0; margin-bottom: 16px; }
    .footer { text-align: center; padding: 24px; color: #6b7280; font-size: 14px; }
    .highlight-box { background-color: #eff6ff; border-left: 4px solid #2563EB; padding: 16px; border-radius: 4px; margin: 24px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <h1>Sessionly</h1>
      </div>
      <div class="content">
        <h2 style="color: #111827; margin-top: 0; font-size: 20px;">${title}</h2>
        ${messageHtml}
        ${buttonHtml}
        <p style="margin-top: 32px; font-size: 14px; color: #6b7280;">Best regards,<br>The Sessionly Team</p>
      </div>
    </div>
    <div class="footer">
      ${footerText || '© ' + new Date().getFullYear() + ' Sessionly. All rights reserved.'}
    </div>
  </div>
</body>
</html>
  `;
}

// 1. For Supabase Auth: Welcome Email
export function getWelcomeEmailHtml(): string {
  return buildEmailTemplate({
    title: "Welcome to Sessionly! 🚀",
    messageHtml: `
      <p>Hi there,</p>
      <p>We are thrilled to have you join Sessionly—the premier platform for B2B expert consultation and 1-on-1 sessions.</p>
      <p>Whether you're here to share your expertise or learn from the best, you are now part of a growing community of professionals.</p>
    `,
    buttonText: "Complete Your Profile",
    buttonUrl: "{{ .SiteURL }}/expert/dashboard", // Supabase magic variable
    footerText: "You received this email because you recently signed up for Sessionly."
  });
}

// 2. For Supabase Auth: Forgot Password
export function getForgotPasswordEmailHtml(): string {
  return buildEmailTemplate({
    title: "Password Reset Request 🔒",
    messageHtml: `
      <p>Hi there,</p>
      <p>We received a request to reset the password for your Sessionly account. If you didn't make this request, you can safely ignore this email.</p>
      <p>To choose a new password, click the secure link below:</p>
    `,
    buttonText: "Reset Password",
    buttonUrl: "{{ .ConfirmationURL }}", // Supabase magic variable
    footerText: "This link will expire securely in 24 hours."
  });
}

// 3. For Custom Backend: Booking Confirmation (Mentee)
export function getBookingConfirmationEmailHtml(expertName: string, dateStr: string, timeStr: string, roomUrl: string): string {
  return buildEmailTemplate({
    title: "Booking Confirmed! 🎉",
    messageHtml: `
      <p>Great news! Your 1-on-1 session with <strong>${expertName}</strong> has been successfully booked and confirmed.</p>
      
      <div class="highlight-box">
        <strong>Session Details:</strong><br>
        📅 Date: ${dateStr}<br>
        ⏰ Time: ${timeStr}
      </div>

      <p>When it's time for your session, simply click the button below to join the secure video room. The expert will meet you there!</p>
    `,
    buttonText: "Join Video Room",
    buttonUrl: roomUrl,
  });
}

// 4. For Custom Backend: Booking Notification (Expert)
export function getExpertBookingNotificationHtml(menteeId: string, dateStr: string, timeStr: string, roomUrl: string): string {
  return buildEmailTemplate({
    title: "New Booking Received! 💰",
    messageHtml: `
      <p>Congratulations! You just received a new booking from a mentee.</p>
      
      <div class="highlight-box">
        <strong>Session Details:</strong><br>
        📅 Date: ${dateStr}<br>
        ⏰ Time: ${timeStr}
      </div>

      <p>Please make sure you are on time. When the session begins, use the link below to enter the video room.</p>
    `,
    buttonText: "View Video Room",
    buttonUrl: roomUrl,
  });
}
