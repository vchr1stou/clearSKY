const express = require('express');
const cors = require('cors');
const statRoutes = require('./routes/statisticsRoute');
const { initDB } = require('./models/index');

const app = express();

app.use(cors());
app.use(express.json());



// Define routes
app.use('/api/stats', statRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: 'Internal Server Error' });
});


async function startServer() {
    try {
        await initDB();
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Statistics service running on port ${PORT}`));
    } catch (err) {
        console.error('Database initialization failed:', err);
        process.exit(1);
    }
}

startServer().then(()=>{});