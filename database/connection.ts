// Database initialization and connection file
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME || 'hrms_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
  }
);

// Test the connection
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connection successful');
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    return false;
  }
};

// Sync all models with database
export const syncDatabase = async (force: boolean = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✓ Database sync successful');
    return true;
  } catch (error) {
    console.error('✗ Database sync failed:', error);
    return false;
  }
};

// Close database connection
export const closeConnection = async () => {
  try {
    await sequelize.close();
    console.log('✓ Database connection closed');
  } catch (error) {
    console.error('✗ Error closing database connection:', error);
  }
};

export default sequelize;
