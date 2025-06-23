const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userManagementRoute');
const { connectWithRetry} = require('./models/index');

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
app.use('/api/userManagement', userRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: 'Internal Server Error' });
});


async function startServer() {
    try {
        await connectWithRetry();
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`User management service running on port ${PORT}`));
    } catch (err) {
        console.error('Database initialization failed:', err);
        process.exit(1);
    }
}

startServer();