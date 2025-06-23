const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const { initDB } = require('./models/index');
const messageConsumer = require('./services/messageConsumer');
const {connectWithRetry} = require("./models");

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
    next(err);
});

// Define routes
app.use('/api/auth', authRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: 'Internal Server Error' });
});

async function startServer() {
    try {
        await connectWithRetry();
        
        // Start the message consumer
        try {
            await messageConsumer.startConsuming();
        } catch (error) {
            console.error('Failed to start message consumer:', error);
            // Don't exit the server if RabbitMQ is not available
        }
        
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Auth service running on port ${PORT}`));
    } catch (err) {
        console.error('Database initialization failed:', err);
        process.exit(1);
    }
}

startServer();