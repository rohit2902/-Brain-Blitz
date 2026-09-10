export const forgotPasswordTemplate = (user, otp) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>Password Reset OTP</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #f4f7fb;
          font-family: Arial, Helvetica, sans-serif;
          color: #1f2937;
        "
      >
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="background-color: #f4f7fb; padding: 40px 15px;"
        >
          <tr>
            <td align="center">

              
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  max-width: 560px;
                  background-color: #ffffff;
                  border-radius: 16px;
                  overflow: hidden;
                  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.08);
                "
              >

            
                <tr>
                  <td
                    style="
                      padding: 28px 35px;
                      background: linear-gradient(
                        135deg,
                        #ff8a00,
                        #ff5e00
                      );
                      text-align: center;
                    "
                  >
                    <h1
                      style="
                        margin: 0;
                        color: #ffffff;
                        font-size: 26px;
                        font-weight: 700;
                      "
                    >
                      Your App
                    </h1>

                    <p
                      style="
                        margin: 8px 0 0;
                        color: #fff7ed;
                        font-size: 14px;
                      "
                    >
                      Secure account verification
                    </p>
                  </td>
                </tr>

                
                <tr>
                  <td style="padding: 40px 35px 30px;">

                    <h2
                      style="
                        margin: 0 0 12px;
                        font-size: 24px;
                        color: #111827;
                      "
                    >
                      Reset your password
                    </h2>

                    <p
                      style="
                        margin: 0 0 20px;
                        font-size: 15px;
                        line-height: 1.7;
                        color: #6b7280;
                      "
                    >
                      Hi
                      <strong style="color: #111827;">
                        ${user?.name || "there"}
                      </strong>,
                    </p>

                    <p
                      style="
                        margin: 0 0 25px;
                        font-size: 15px;
                        line-height: 1.7;
                        color: #6b7280;
                      "
                    >
                      We received a request to reset the password
                      associated with your account. Use the verification
                      code below to continue.
                    </p>

                    
                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                    >
                      <tr>
                        <td align="center">

                          <div
                            style="
                              display: inline-block;
                              padding: 18px 30px;
                              background-color: #fff7ed;
                              border: 1px solid #fed7aa;
                              border-radius: 12px;
                            "
                          >
                            <span
                              style="
                                display: block;
                                margin-bottom: 8px;
                                color: #9a3412;
                                font-size: 12px;
                                font-weight: 600;
                                letter-spacing: 1px;
                                text-transform: uppercase;
                              "
                            >
                              Verification Code
                            </span>

                            <span
                              style="
                                color: #ea580c;
                                font-size: 34px;
                                font-weight: 700;
                                letter-spacing: 8px;
                              "
                            >
                              ${otp}
                            </span>
                          </div>

                        </td>
                      </tr>
                    </table>

                
                    <p
                      style="
                        margin: 25px 0 0;
                        text-align: center;
                        font-size: 13px;
                        color: #9ca3af;
                      "
                    >
                      This OTP will expire in
                      <strong style="color: #6b7280;">
                        10 minutes
                      </strong>.
                    </p>

                   
                    <div
                      style="
                        margin-top: 30px;
                        padding: 16px;
                        background-color: #f9fafb;
                        border-radius: 10px;
                        border: 1px solid #e5e7eb;
                      "
                    >
                      <p
                        style="
                          margin: 0;
                          font-size: 13px;
                          line-height: 1.6;
                          color: #6b7280;
                        "
                      >
                        <strong style="color: #374151;">
                          Security notice:
                        </strong>
                        If you did not request a password reset,
                        you can safely ignore this email. Never share
                        this OTP with anyone.
                      </p>
                    </div>

                  </td>
                </tr>

                
                <tr>
                  <td
                    style="
                      padding: 22px 35px;
                      background-color: #f9fafb;
                      border-top: 1px solid #f3f4f6;
                      text-align: center;
                    "
                  >
                    <p
                      style="
                        margin: 0 0 8px;
                        font-size: 12px;
                        color: #9ca3af;
                      "
                    >
                      This is an automated email. Please do not reply.
                    </p>

                    <p
                      style="
                        margin: 0;
                        font-size: 12px;
                        color: #9ca3af;
                      "
                    >
                      © ${new Date().getFullYear()} Your App.
                      All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

