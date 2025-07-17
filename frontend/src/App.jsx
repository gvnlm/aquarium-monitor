import { useEffect, useState } from 'react';

import TimeSeriesChart from './components/TimeSeriesChart';
import DateTimeRangePicker from './components/DateRangePicker';
import MaxNumOfReadingsForm from './components/MaxNumOfReadingsForm';

import tdsReadingsService from './services/tdsReadings';
import tempReadingsService from './services/tempReadings';

const App = () => {
  // Date range of readings to display
  const [startDate, setStartDate] = useState(getDateXHoursAgo(24));
  const [endDate, setEndDate] = useState(new Date());

  // Maximum number of readings (i.e., readings) displayed on each chart
  const [maxNumOfReadings, setMaxNumOfReadings] = useState(100);

  const [tdsReadings, setTdsReadings] = useState([]);
  const [tempReadings, setTempReadings] = useState([]);

  useEffect(() => {
    loadReadings();
  }, [startDate, endDate, maxNumOfReadings]);

  const loadReadings = async () => {
    try {
      await loadTdsReadings();
      await loadTempReadings();
    } catch (error) {
      console.log(error);
    }
  };

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
      const tempReadings = await tempReadingsService.getRange(startDate, endDate, maxNumOfReadings);
      setTempReadings(tempReadings);
    } catch (error) {
      console.log(error);
    }
  };

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

      <button onClick={loadReadings}>Refresh</button>

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
