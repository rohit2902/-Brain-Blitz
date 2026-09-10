import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Error connecting to email server:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

export async function sendEmail({ to, subject, html, text }) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
        text,
    };
 
    try {
        
        const info = await transporter.sendMail(mailOptions);
        
        console.log(`✉️ Email sent successfully to ${to} (ID: ${info.messageId})`);
        return info; 
    } catch (error) {
        console.error(`❌ Error sending email to ${to}:`, error.message);
        
        throw error; 
    }
} 

export default transporter;