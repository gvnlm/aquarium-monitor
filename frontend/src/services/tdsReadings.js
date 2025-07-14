import axios from 'axios';

const BASE_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:3001/tdsReadings' // Local server
    : 'https://aquarium-monitor-server.onrender.com/tdsReadings'; // Production server

const getRange = async (startDate, endDate) => {
  const response = await axios.get(BASE_URL, {
    params: {
      startDate,
      endDate,
    },
  });
  return response.data;
};

export default {
  getRange,
};
