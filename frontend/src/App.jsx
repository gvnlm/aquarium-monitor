import { useEffect, useState } from 'react';

import TimeSeriesChart from './components/TimeSeriesChart';
import DateTimeRangePicker from './components/DateRangePicker';
import MaxNumOfReadingsForm from './components/MaxNumOfReadingsForm';

import tdsReadingsService from './services/tdsReadings';
import tempReadingsService from './services/tempReadings';

const App = () => {
  // Date range of readings to display
  const [startDate, setStartDate] = useState(getDateXHoursAgo(1));
  const [endDate, setEndDate] = useState(new Date());

  // Maximum number of readings (i.e., readings) displayed on each chart
  const [maxNumOfReadings, setMaxNumOfReadings] = useState(30);

  const [tdsReadings, setTdsReadings] = useState([]);
  const [tempReadings, setTempReadings] = useState([]);

  // Whenever date range is changed, get readings within date range from backend server
  useEffect(() => {
    const loadTdsReadings = async () => {
      try {
        const tdsReadings = await tdsReadingsService.getRange(startDate, endDate, maxNumOfReadings);
        setTdsReadings(tdsReadings);
      } catch (error) {
        console.log(error);
      }
    };

    const loadTempReadings = async () => {
      try {
        const tempReadings = await tempReadingsService.getRange(
          startDate,
          endDate,
          maxNumOfReadings
        );
        setTempReadings(tempReadings);
      } catch (error) {
        console.log(error);
      }
    };

    loadTdsReadings();
    loadTempReadings();
  }, [startDate, endDate, maxNumOfReadings]);

  return (
    <div className="app">
      <MaxNumOfReadingsForm
        maxNumOfReadings={maxNumOfReadings}
        setMaxNumOfReadings={setMaxNumOfReadings}
      />

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
