const cors = require('cors');
const express = require('express');
const morgan = require('morgan');

// Connect to MongoDB database
const connectDB = require('./config/db');
connectDB();

// Mongoose models
const TdsReading = require('./models/tdsReading');
const TempReading = require('./models/tempReading');

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

app.get('/tdsReadings', async (req, res, next) => {
  try {
    const tdsReadings = await TdsReading.find({});
    return res.json(tdsReadings);
  } catch (err) {
    console.error('Failed to fetch TDS readings from database.');
    next(err);
  }
});

app.get('/tempReadings', async (req, res, next) => {
  try {
    const tempReadings = await TempReading.find({});
    return res.json(tempReadings);
  } catch (err) {
    console.error('Failed to fetch temperature readings from database.');
    next(err);
  }
});

app.post('/', async (req, res, next) => {
  const { tds_ppm, temp_c } = req.body || {};

  if (tds_ppm === undefined) {
    console.error('Failed to save readings to database: "tds_ppm" property is missing.');
    return res.status(400).json({ error: '"tds_ppm" property is missing.' });
  }

  if (temp_c === undefined) {
    console.error('Failed to save readings to database: "temp_c" property is missing.');
    return res.status(400).json({ error: '"temp_c" property is missing.' });
  }

  const newTdsReading = new TdsReading({ ppm: tds_ppm });
  const newTempReading = new TempReading({ celsius: temp_c });

  // Try save readings to database
  try {
    const savedTdsReading = await newTdsReading.save();
    const savedTempReading = await newTempReading.save();

    console.log('Successfully saved readings to database.');

    return res
      .status(201)
      .json({ savedTdsReading: savedTdsReading, savedTempReading: savedTempReading });
  } catch (err) {
    console.error('Failed to save readings to database.');
    next(err);
  }

  console.log(req.body);
  res.status(200).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
