const express = require('express');

// Mongoose models
const TdsReading = require('../models/tdsReading');
const TempReading = require('../models/tempReading');

const emailAlert = require('../utils/mailer');

// Thresholds for email alert
const TDS_PPM_MIN_LIM = 200;
const TDS_PPM_MAX_LIM = 250;
const TEMP_C_MIN_LIM = 24.5;
const TEMP_C_MAX_LIM = 27;

// Sentinel value returned by DS18B20 temperature sensor when disconnected or malfunctioning
const TEMP_C_SENTINEL = -127;

const router = express.Router();

router.get('/tdsReadings', async (req, res, next) => {
  const startDate = new Date(req.query.startDate);
  const endDate = new Date(req.query.endDate);
  const maxNumOfReadings = req.query.maxNumOfReadings;

  if (isNaN(maxNumOfReadings) || maxNumOfReadings < 1) {
    console.error('Missing/invalid max number of readings to return.');
    return res.status(400).end();
  }

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.error('Missing/invalid start date and/or end date.');
    return res.status(400).end();
  }

  try {
    let tdsReadings = [];

    const numOfReadings = await TdsReading.countDocuments({
      timestamp: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    if (numOfReadings <= maxNumOfReadings) {
      tdsReadings = await TdsReading.find({
        timestamp: {
          $gte: startDate,
          $lte: endDate,
        },
      });
    } else {
      // Aggregate readings into `maxNumOfReadings` buckets

      const dateRangeDurationMs = endDate.getTime() - startDate.getTime();
      // Round up to ensure the number of buckets does not exceed `MAX_NUM_OF_BUCKETS`
      const bucketDurationMs = Math.ceil(dateRangeDurationMs / (maxNumOfReadings - 1));

      tdsReadings = await TdsReading.aggregate([
        // Find all readings within the date range
        {
          $match: {
            timestamp: { $gte: startDate, $lte: endDate },
          },
        },
        // Assign each reading a bucket number based on their timestamp
        {
          $addFields: {
            bucket: {
              $floor: {
                $divide: [{ $toLong: '$timestamp' }, bucketDurationMs],
              },
            },
          },
        },
        // Aggregate readings within the same bucket (i.e., have the same bucket number)
        {
          $group: {
            _id: '$bucket',
            ppm: { $avg: '$ppm' },
            timestamp: { $avg: { $toLong: '$timestamp' } },
          },
        },
        {
          $project: {
            _id: 0,
            ppm: { $round: ['$ppm'] },
            timestamp: { $toDate: '$timestamp' },
          },
        },
        { $sort: { timestamp: 1 } },
      ]);
    }

    return res.json(tdsReadings);
  } catch (err) {
    console.error('Failed to fetch TDS readings from database.');
    next(err);
  }
});

router.get('/tempReadings', async (req, res, next) => {
  const startDate = new Date(req.query.startDate);
  const endDate = new Date(req.query.endDate);
  const maxNumOfReadings = req.query.maxNumOfReadings;

  if (isNaN(maxNumOfReadings) || maxNumOfReadings < 1) {
    console.error('Missing/invalid max number of readings to return.');
    return res.status(400).end();
  }

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.error('Missing/invalid start date and/or end date.');
    return res.status(400).end();
  }

  try {
    let tempReadings = [];

    const numOfReadings = await TempReading.countDocuments({
      timestamp: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    if (numOfReadings <= maxNumOfReadings) {
      tempReadings = await TempReading.find({
        timestamp: {
          $gte: startDate,
          $lte: endDate,
        },
      });
    } else {
      // Aggregate readings into `maxNumOfReadings` buckets

      const dateRangeDurationMs = endDate.getTime() - startDate.getTime();
      // Round up to ensure the number of buckets does not exceed `MAX_NUM_OF_BUCKETS`
      const bucketDurationMs = Math.ceil(dateRangeDurationMs / (maxNumOfReadings - 1));

      tempReadings = await TempReading.aggregate([
        // Find all readings within the date range
        {
          $match: {
            timestamp: { $gte: startDate, $lte: endDate },
          },
        },
        // Assign each reading a bucket number based on their timestamp
        {
          $addFields: {
            bucket: {
              $floor: {
                $divide: [{ $toLong: '$timestamp' }, bucketDurationMs],
              },
            },
          },
        },
        // Aggregate readings within the same bucket (i.e., have the same bucket number)
        {
          $group: {
            _id: '$bucket',
            celsius: { $avg: '$celsius' },
            timestamp: { $avg: { $toLong: '$timestamp' } },
          },
        },
        {
          $project: {
            _id: 0,
            celsius: { $round: ['$celsius', 1] },
            timestamp: { $toDate: '$timestamp' },
          },
        },
        { $sort: { timestamp: 1 } },
      ]);
    }

    return res.json(tempReadings);
  } catch (err) {
    console.error('Failed to fetch temperature readings from database.');
    next(err);
  }
});

router.get('/tdsReadings/latest', async (req, res, next) => {
  try {
    const latestTdsReading = await TdsReading.findOne().sort({ timestamp: -1 }); // Sort in descending order (i.e., latest to oldest)
    return res.status(200).json(latestTdsReading);
  } catch (err) {
    console.error('Failed to fetch latest TDS reading from database.');
    next(err);
  }
});

router.get('/tempReadings/latest', async (req, res, next) => {
  try {
    const latestTempReading = await TempReading.findOne().sort({ timestamp: -1 }); // Sort in descending order (i.e., latest to oldest)
    return res.status(200).json(latestTempReading);
  } catch (err) {
    console.error('Failed to fetch latest temperature reading from database.');
    next(err);
  }
});

router.get('/tdsReadings/oldest', async (req, res, next) => {
  try {
    const latestTdsReading = await TdsReading.findOne().sort({ timestamp: 1 }); // Sort in ascending order (i.e., oldest to latest)
    return res.status(200).json(latestTdsReading);
  } catch (err) {
    console.error('Failed to fetch oldest TDS reading from database.');
    next(err);
  }
});

router.get('/tempReadings/oldest', async (req, res, next) => {
  try {
    const latestTempReading = await TempReading.findOne().sort({ timestamp: 1 }); // Sort in ascending order (i.e., oldest to latest)
    return res.status(200).json(latestTempReading);
  } catch (err) {
    console.error('Failed to fetch oldest temperature reading from database.');
    next(err);
  }
});

// Saves received valid readings to MongoDB, and sends an email alert if a reading is outside its set threshold
router.post('/', async (req, res, next) => {
  const { tds_ppm, temp_c } = req.body || {};

  if (tds_ppm === undefined) {
    console.error('Failed to save readings to database: "tds_ppm" property is missing.');
    return res.status(400).json({ error: '"tds_ppm" property is missing.' });
  }

  if (temp_c === undefined) {
    console.error('Failed to save readings to database: "temp_c" property is missing.');
    return res.status(400).json({ error: '"temp_c" property is missing.' });
  }

  // Check if readings are within set thresholds, if not, alert via email

  if (tds_ppm < TDS_PPM_MIN_LIM || tds_ppm > TDS_PPM_MAX_LIM) {
    emailAlert({
      subject: `Aquarium TDS alert: ${tds_ppm} ppm`,
      text: `Aquarium TDS is out of range.\nCurrent reading: ${tds_ppm} ppm\nSafe range: ${TDS_PPM_MIN_LIM} - ${TDS_PPM_MAX_LIM} ppm`,
    });
  }

  if (temp_c === TEMP_C_SENTINEL) {
    emailAlert({
      subject: 'Aquarium temperature read failed',
      text: 'Temperature sensor failed to read - check wiring.',
    });
  } else if (temp_c < TEMP_C_MIN_LIM || temp_c > TEMP_C_MAX_LIM) {
    emailAlert({
      subject: `Aquarium temperature alert: ${temp_c} °C`,
      text: `Aquarium temperature is out of range.\nCurrent reading: ${temp_c} °C\nSafe range: ${TEMP_C_MIN_LIM} - ${TEMP_C_MAX_LIM} °C`,
    });
  }

  // Try save readings to database

  const newTdsReading = new TdsReading({ ppm: tds_ppm });
  const newTempReading = new TempReading({ celsius: temp_c });

  try {
    const savedTdsReading = await newTdsReading.save();
    console.log('Successfully saved TDS reading to database.');

    let savedTempReading = null;
    if (temp_c !== TEMP_C_SENTINEL) {
      savedTempReading = await newTempReading.save();
      console.log('Successfully saved temperature reading to database.');
    }

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

module.exports = router;
