import express from 'express';
import { getMessages, sendMessage } from '../controllers/message.controllers.js';
import auth from '../middleware/auth.middleware.js'; // Ensure auth middleware is imported




const messageRouter = express.Router();


messageRouter.post('/send', auth, sendMessage); // Route to send a new message

messageRouter.get("/:userId", getMessages);                  // Get messages with specific user
// messageRouter.delete("/:messageId", deleteMessage);          // Delete a message
// messageRouter.messageRouterget("/conversations", getConversations); 

 export default messageRouter;
