import { useEffect, useState } from 'react';

import TimeSeriesChart from './components/TimeSeriesChart';
import DateTimeRangePicker from './components/DateRangePicker';

import tdsReadingsService from './services/tdsReadings';
import tempReadingsService from './services/tempReadings';

const App = () => {
  // Date range of readings to display
  const [startDate, setStartDate] = useState(getDateXHoursAgo(1));
  const [endDate, setEndDate] = useState(new Date());

  const [tdsReadings, setTdsReadings] = useState([]);
  const [tempReadings, setTempReadings] = useState([]);

  // Whenever date range is changed, get readings within date range from backend server
  useEffect(() => {
    const loadTdsReadings = async () => {
      try {
        const tdsReadings = await tdsReadingsService.getRange(startDate, endDate);
        setTdsReadings(tdsReadings);
      } catch (error) {
        console.log(error);
      }
    };

    const loadTempReadings = async () => {
      try {
        const tempReadings = await tempReadingsService.getRange(startDate, endDate);
        setTempReadings(tempReadings);
      } catch (error) {
        console.log(error);
      }
    };

    loadTdsReadings();
    loadTempReadings();
  }, [startDate, endDate]);

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

const getDateXHoursAgo = (x) => {
  const now = new Date();
  now.setHours(now.getHours() - x);
  return now;
};

export default App;
