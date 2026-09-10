import express from "express"
import { sendMessage ,getChats , getMessages ,deleteChat} from "../controllers/chat.controller.js"
import { identifyUser } from "../middlewares/identifyUser.js"

const chatRoute = express.Router()


chatRoute.post("/message", identifyUser,sendMessage)
chatRoute.get("/",    identifyUser,  getChats)

chatRoute.get("/:chatId/messages", identifyUser, getMessages)

chatRoute.delete("/delete/:chatId", identifyUser, deleteChat)

export  default chatRoute
