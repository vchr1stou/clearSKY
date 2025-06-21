const express = require('express');
const dotenv = require('dotenv');
const gradesRoutes = require('./routes/grades.routes');
const errorHandler = require('./middlewares/error_handler');

dotenv.config();

const app = express();
app.use(express.json());

app.use('/GradingService', gradesRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Grading microservice running on port ${PORT}`));
