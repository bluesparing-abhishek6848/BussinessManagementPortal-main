import express from 'express';
import employeeRoute from './routes/employeeRoute.js';
import userRoute from './routes/userRoute.js';
import advanceRoute from './routes/advanceRoute.js';
import financeRoute from './routes/financeRoute.js';
import orderRoute from './routes/orderRoute.js';
import checkUserAuth from './middleware/auth.js'; // Import authentication middleware
import './config/db.js'; // Import the database connection configuration
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = process.env.CLIENT_URI?.split(",") || [];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users',userRoute);
app.use("/api/advances",checkUserAuth,advanceRoute);
app.use('/api/employees',checkUserAuth,employeeRoute);
app.use("/api/finance",checkUserAuth, financeRoute)
app.use('/api/orders',checkUserAuth,orderRoute)



app.listen(PORT, (err) => {
  if (err) {
    console.error(`Error starting server: ${err.message}`);
    return;
  }
    console.log(`Server is running on http://localhost:${PORT}`);
});



export default app;