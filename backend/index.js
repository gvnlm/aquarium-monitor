const cors = require('cors');
const express = require('express');
const morgan = require('morgan');

const readingsRouter = require('./routes/readings');

// Connect to MongoDB database
const connectDB = require('./config/db');
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

app.use('/', readingsRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
