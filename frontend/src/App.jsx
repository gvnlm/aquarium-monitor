import { useEffect } from 'react';

import tdsReadingsService from './services/tdsReadings';
import tempReadingsService from './services/tempReadings';

const App = () => {
  // On mount, get all readings from backend server, then log them
  useEffect(() => {
    const logTdsReadings = async () => {
      try {
        const tdsReadings = await tdsReadingsService.getAll();
        console.log(tdsReadings);
      } catch (error) {
        console.log(error);
      }
    };

    const logTempReadings = async () => {
      try {
        const tempReadings = await tempReadingsService.getAll();
        console.log(tempReadings);
      } catch (error) {
        console.log(error);
      }
    };

    logTdsReadings();
    logTempReadings();
  }, []);
};

export default App;
