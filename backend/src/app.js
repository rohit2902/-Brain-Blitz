import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import AuthRoutes from './routes/auth.route.js';
import morgan from "morgan";
import chatRoute from './routes/chat..route.js';
import helmet from 'helmet';
import errorHandler from './middlewares/errorHandler.middleware.js';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import path from 'path';
import { fileURLToPath } from "url";


dotenv.config();

const app = express();


app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet()); 
app.use(passport.initialize());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "..", "public")));


const allowedOrigins = [
  process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.trim() : null,
  'https://brain-blitz-1.onrender.com',
  'http://localhost:5174',
  'http://localhost:5173'
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
     
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); 
    },
    credentials: true,
    exposedHeaders: ["X-Chat-Id", "X-Chat-Title"],
  })
);



// Routes
app.use('/api/auth', AuthRoutes);

app.use("/api/chats",chatRoute)
passport.use(new GoogleStrategy(
  {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
     callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
  },
  (accessToken, refreshToken, profile, done) => {
 
    done(null, profile);
  }
));

app.get("*name", (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "public", "index.html")
  );
});

app.use(errorHandler);

app.set("etag", false);

export default app;
