const express = require('express');
const cors = require('cors');
const coursesRoutes = require('./routes/coursesRoute');
const { connectWithRetry } = require('./models/index');
const rabbitMQConsumer = require('./services/rabbitmqConsumer');
//const setupDatabase = require('../setup-database');

const app = express();

app.use(cors());
app.use(express.json());

// Json format check
app.use((req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        if (!req.is('application/json')) {
            return res.status(415).json({ message: 'Content-Type must be application/json' });
        }
    }
    next();
});

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ message: 'Invalid JSON format' });
    }
    next();
});

// Define routes
app.use('/api/courses', coursesRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: 'Internal Server Error' });
    next();
});

async function startServer() {
    try {
        /*// Setup database schema first
        try {
            await setupDatabase();
            console.log('✅ Database schema setup completed');
        } catch (setupError) {
            console.warn('⚠️ Database setup failed:', setupError.message);
            console.warn('⚠️ Continuing with existing schema...');
        }
        */
        await connectWithRetry();
        
        // Start RabbitMQ consumer
        try {
            await rabbitMQConsumer.startConsuming();
        } catch (rabbitError) {
            console.warn(' RabbitMQ consumer failed to start:', rabbitError.message);
            console.warn(' Grade sync functionality will not be available');
        }
        
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Course service running on port ${PORT}`));
    } catch (err) {
        console.error('Database initialization failed:', err);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await rabbitMQConsumer.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await rabbitMQConsumer.close();
    process.exit(0);
});

startServer().then(()=> {});