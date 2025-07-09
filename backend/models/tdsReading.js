const mongoose = require('mongoose');

const tdsReadingSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
    ppm: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const TdsReading = mongoose.model('TdsReading', tdsReadingSchema, 'tdsReadings');

module.exports = TdsReading;
