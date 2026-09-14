import dotenv from "dotenv";
dotenv.config();
import { sendEmail } from "./src/services/mail.service.js";

async function testMail() {
    try {
        console.log("Testing email with user:", process.env.EMAIL_USER);
        await sendEmail({
            to: "sumitra.rfj9955@gmail.com",
            subject: "Test Email",
            html: "<h1>This is a test email</h1>",
            text: "This is a test email",
        });
        console.log("Mail sent successfully!");
    } catch (e) {
        console.error("Mail failed:", e);
    }
}
testMail();