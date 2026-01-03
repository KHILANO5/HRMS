import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import sequelize, { syncDatabase, testConnection } from '../../database/connection';
import { initializeModels, Models } from '../../database';
import authRoutes from './routes/auth';
import employeeRoutes from './routes/employees';
import attendanceRoutes from './routes/attendance';
import leaveRoutes from './routes/leaves';
import salaryRoutes from './routes/salary';
import profileRoutes from './routes/profile';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const SHOULD_SYNC = (process.env.DB_SYNC || 'true').toLowerCase() === 'true';

app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// API v1 routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/leaves', leaveRoutes);
app.use('/api/v1/salary', salaryRoutes);
app.use('/api/v1/profile', profileRoutes);

app.get('/health', async (_req, res) => {
  const dbStatus = await testConnection();

  res.json({
    success: true,
    message: 'Server is running',
    data: {
      uptime: process.uptime(),
      database: dbStatus ? 'connected' : 'unreachable',
    },
    error: null,
  });
});

const bootstrap = async () => {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('Database connection failed. Check credentials and availability.');
      process.exit(1);
    }

    const models: Models = initializeModels(sequelize);
    app.locals.sequelize = sequelize;
    app.locals.models = models;

    if (SHOULD_SYNC) {
      await syncDatabase(false);
    }

    app.listen(PORT, () => {
      console.log(`API server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Server bootstrap failed:', error);
    process.exit(1);
  }
};

void bootstrap();

export default app;
