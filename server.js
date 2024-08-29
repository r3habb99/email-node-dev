const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // Import the cors package
const indexRoutes = require('./src/routes/index');
const logger = require('./src/utils/logger.utils');
require('dotenv').config();
require('./src/utils/cronJobs.utils');

const app = express();
const PORT = process.env.PORT || 3000;
const PROTOCOL = process.env.PROTOCOL || 'http://localhost';
const DATABASE_URL = process.env.URL;


// Enable CORS for all routes and origins
app.use(
  cors({
    origin: 'http://localhost:5173', // Allow requests from your React frontend
    credentials: true, // If you need to send cookies or authentication headers
  })
);

app.set('view engine', 'ejs');
app.use(express.static('views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', indexRoutes);

mongoose
  .connect(DATABASE_URL)
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`=================================`);
      logger.info(`🎮 Server connected to database...`);
      logger.info(`🚀 App running on this port ${PORT}`);
      logger.info(`🎮 ${PROTOCOL}:${PORT}`);
      logger.info(`=================================`);
    });
  })
  .catch((err) => {
    logger.error('Could not connect to MongoDB', err);
  });
