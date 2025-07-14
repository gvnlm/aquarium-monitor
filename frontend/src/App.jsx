import { useEffect, useState } from 'react';

import TimeSeriesChart from './components/TimeSeriesChart';
import DateTimeRangePicker from './components/DateRangePicker';

import tdsReadingsService from './services/tdsReadings';
import tempReadingsService from './services/tempReadings';

const App = () => {
  // Date range of readings to display
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [tdsReadings, setTdsReadings] = useState([]);
  const [tempReadings, setTempReadings] = useState([]);

  // On mount, get all readings from backend server
  useEffect(() => {
    const logTdsReadings = async () => {
      try {
        const tdsReadings = await tdsReadingsService.getAll();
        setTdsReadings(tdsReadings);
      } catch (error) {
        console.log(error);
      }
    };

    const logTempReadings = async () => {
      try {
        const tempReadings = await tempReadingsService.getAll();
        setTempReadings(tempReadings);
      } catch (error) {
        console.log(error);
      }
    };

    logTdsReadings();
    logTempReadings();
  }, []);

  return (
    <div className="app">
      <DateTimeRangePicker
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

      <TimeSeriesChart data={tdsReadings} yDataKey="ppm" yAxisTitle="ppm" lineColour={'green'} />
      <TimeSeriesChart data={tempReadings} yDataKey="celsius" yAxisTitle="°C" lineColour={'red'} />
    </div>
  );
};

export default App;
