import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './lib/db.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import messageRouter from './routes/message.route.js';



dotenv.config();
console.log(process.env.JWT_SECRET);

const app = express();

// Middleware - code that runs before our routes
app.use(express.json()); // Allows server to understand JSON data
app.use(cors("*")); // Allows frontend to communicate with backend
app.use(cookieParser()); // Parses cookies attached to the client request object

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use("/api/message", messageRouter); // Route for messages
app.use("/api/auth", authRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} ✅✅`);
  connectDB();
});