import dotenv from "dotenv";

dotenv.config();
import {Server, Socket} from "socket.io"

let io;

export async function initSocket (httpServer) {
    io = new Server(httpServer , {
        cors:{
            origin: process.env.FRONTED_URL,
            credentials:true
        }
    })
    console.log("Socket server is RUNINIG")

    io.on("connection",(Socket) =>{
        console.log("A user connect:" + Socket.id)
    })
    
}

export function getIO() {
    if (!io) {
        throw new Error("Socket.io not initialized")
    }

    return io
}