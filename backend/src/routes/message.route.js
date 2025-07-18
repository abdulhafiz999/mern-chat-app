import express from 'express';
import { deleteMessage, getConversations, getMessageDetails, getMessages, sendMessage } from '../controllers/message.controllers.js';
import auth from '../middleware/auth.middleware.js'; // Ensure auth middleware is imported




const messageRouter = express.Router();


messageRouter.post('/send', auth, sendMessage); // Route to send a new message
messageRouter.get("/getConversations", auth, getConversations); 

messageRouter.get("/:userId", auth, getMessages);                  // Get messages with specific user
messageRouter.delete("/:messageId", auth, deleteMessage);        // Delete a message
messageRouter.get("/details/:messageId", auth, getMessageDetails) // Get message Details


 export default messageRouter;
