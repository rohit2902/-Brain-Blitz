import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { initSocket } from "./src/sockets/server.socket.js";

const PORT = process.env.PORT || 3000;

let httpServer;


process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION! Shutting down...");
    console.error(err.name, err.message, err.stack);
    process.exit(1);
});


process.on("unhandledRejection", (reason) => {
    console.error("UNHANDLED REJECTION! Shutting down...");
    console.error(reason);

    if (httpServer) {
        httpServer.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});

async function startServer() {
    try {
        
        await connectDB();
        console.log("MongoDB connected successfully");

        httpServer = http.createServer(app);
        initSocket(httpServer);

        httpServer.listen(PORT, () => {
            console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
        });

        httpServer.on("error", (err) => {
            if (err.code === "EADDRINUSE") {
                console.error(`Port ${PORT} is already in use.`);
            } else {
                console.error("HTTP server error:", err);
            }
            process.exit(1);
        });
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
}


function gracefulShutdown(signal) {
    console.log(`${signal} received. Shutting down gracefully...`);

    if (!httpServer) {
        process.exit(0);
        return;
    }

    httpServer.close(() => {
        console.log("HTTP server closed.");
        
        process.exit(0);
    });

    
    setTimeout(() => {
        console.error("Forcing shutdown after timeout.");
        process.exit(1);
    }, 10000).unref();
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

startServer();