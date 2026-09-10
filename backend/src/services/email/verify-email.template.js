

 const verifyEmailTemplate = (user, emailVerifyToken) => {
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Verify your email</title>
</head>
<body style="margin:0; padding:0; background-color:#fff4ec; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fff4ec; padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 18px rgba(255,122,26,0.12);">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#FF7A1A; padding:32px 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:middle;">
                    <div style="width:36px; height:36px; background-color:#ffffff; border-radius:8px; display:inline-block; text-align:center; line-height:36px; font-size:20px;">⚡</div>
                  </td>
                  <td style="vertical-align:middle; padding-left:10px;">
                    <span style="color:#ffffff; font-size:22px; font-weight:700; letter-spacing:0.5px;">BrainBlitz</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 36px 24px 36px;">
              <h1 style="margin:0 0 16px 0; font-size:22px; color:#1a1a1a; font-weight:700;">Verify your email address</h1>
              <p style="margin:0 0 20px 0; font-size:15px; line-height:1.6; color:#555555;">
                Hi there,
              </p>
              <p style="margin:0 0 28px 0; font-size:15px; line-height:1.6; color:#555555;">
                Thanks for signing up for <strong>BrainBlitz</strong>! To start blitzing through quizzes and challenges, please confirm your email address by clicking the button below.
              </p>

              <!-- Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding:8px 0 28px 0;">
                    <a href="${process.env.BACKEND_URL}/api/auth/verify/${emailVerifyToken}" target="_blank" style="background-color:#FF7A1A; color:#ffffff; text-decoration:none; font-size:15px; font-weight:600; padding:14px 36px; border-radius:8px; display:inline-block;">
                      Verify Email
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px 0; font-size:13px; line-height:1.6; color:#888888;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin:0 0 28px 0; font-size:13px; line-height:1.6; word-break:break-all;">
                <a href="{{verification_link}}" style="color:#FF7A1A; text-decoration:none;">{{verification_link}}</a>
              </p>

              <p style="margin:0 0 8px 0; font-size:13px; line-height:1.6; color:#999999;">
                This link will expire in 24 hours. If you didn't create an account with BrainBlitz, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 36px;">
              <hr style="border:none; border-top:1px solid #f0e4da; margin:0;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:24px 36px 32px 36px;">
              <p style="margin:0 0 8px 0; font-size:12px; color:#aaaaaa;">
                © 2026 BrainBlitz. All rights reserved.
              </p>
              <p style="margin:0; font-size:12px; color:#aaaaaa;">
                Need help? <a href="mailto:support@brainblitz.com" style="color:#FF7A1A; text-decoration:none;">Contact support</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
 }

 export default verifyEmailTemplate;