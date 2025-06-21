const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

const gradeRoutes = require('./routes/gradeRoutes');
const requestRoutes = require('./routes/requestRoutes');
const errorHandler = require('./middlewares/errorHandler');

app.use(express.json());

app.use('/GradesReviewRequest', gradeRoutes);
app.use('/GradesReviewRequest', requestRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 Microservice running on http://localhost:${port}`);
});
