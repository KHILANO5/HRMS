// Database initialization script
import sequelize, { testConnection, syncDatabase } from './connection';
import { initializeModels } from './index';

const runInitialization = async () => {
  console.log('🚀 Initializing Dayflow HRMS Database...\n');

  try {
    // Test database connection
    console.log('📡 Testing database connection...');
    const isConnected = await testConnection();

    if (!isConnected) {
      console.error('❌ Failed to connect to database. Please check your credentials.');
      process.exit(1);
    }

    // Initialize models and associations
    console.log('\n📝 Initializing models and associations...');
    initializeModels(sequelize);
    console.log('✓ Models initialized successfully');

    // Sync database (create tables)
    console.log('\n🔄 Syncing database schema...');
    await syncDatabase(false); // Set to true only for development reset
    console.log('✓ Database schema synced');

    console.log('\n✅ Database initialization completed successfully!');
    console.log('\nDatabase Details:');
    console.log(`  - Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`  - Port: ${process.env.DB_PORT || '3306'}`);
    console.log(`  - Database: ${process.env.DB_NAME || 'hrms_db'}`);

    await sequelize.close();
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

// Run only if this script is executed directly
if (require.main === module) {
  runInitialization();
}

export default runInitialization;
