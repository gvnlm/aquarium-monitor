import axios from 'axios';

const BASE_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:3001/tdsReadings' // Local server
    : 'https://aquarium-monitor-backend-c4hzfra3ckbdhqdu.newzealandnorth-01.azurewebsites.net/tdsReadings'; // Production server

const getRange = async (startDate, endDate, maxNumOfReadings) => {
  const response = await axios.get(BASE_URL, {
    params: {
      startDate,
      endDate,
      maxNumOfReadings,
    },
  });
  return response.data;
};

const getLatest = async () => {
  const response = await axios.get(`${BASE_URL}/latest`);
  return response.data;
};

const getOldest = async () => {
  const response = await axios.get(`${BASE_URL}/oldest`);
  return response.data;
};

export default {
  getRange,
  getLatest,
  getOldest,
};
