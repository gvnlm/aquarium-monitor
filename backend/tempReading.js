const mongoose = require('mongoose');

const tempReadingSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
    celsius: {
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

const TempReading = mongoose.model('TempReading', tempReadingSchema, 'tempReadings');

module.exports = TempReading;
