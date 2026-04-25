import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import invitationRoutes from './routes/invitationRoutes';
import dashboardRoutes from './routes/dashboardRoutes';

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: '*' }));

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'E-Commerce API is running', status: 'active' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
