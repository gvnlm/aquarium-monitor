import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

import TimeSeriesChart from './components/TimeSeriesChart';
import DateRangeForm from './components/DateRangeForm';
import MaxPointsForm from './components/MaxPointsForm';

import tdsReadingsService from './services/tdsReadings';
import tempReadingsService from './services/tempReadings';

import './styles/App.css';

const App = () => {
  // Date range of readings to display
  const [startDate, setStartDate] = useState(getDateXHoursAgo(24));
  const [endDate, setEndDate] = useState(new Date());

  // Maximum number of readings (i.e., readings) displayed on each chart
  const [maxNumOfReadings, setMaxNumOfReadings] = useState(100);

  const [tdsReadings, setTdsReadings] = useState([]);
  const [tempReadings, setTempReadings] = useState([]);

  const [timestampOfLatestEntry, setTimestampOfLatestEntry] = useState(null);

  useEffect(() => {
    loadReadings();
    loadTimestampOfLatestEntry();
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

  const loadTimestampOfLatestEntry = async () => {
    try {
      const latestTdsReadings = await tdsReadingsService.getLatest();
      setTimestampOfLatestEntry(new Date(latestTdsReadings.timestamp));
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
      <div className="toolbar">
        <div className="settings">
          <DateRangeForm
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />

          <MaxPointsForm
            maxNumOfReadings={maxNumOfReadings}
            onMaxNumOfReadingsChange={setMaxNumOfReadings}
          />
        </div>

        <div className="last-updated-section">
          <span>
            Last updated:{' '}
            {timestampOfLatestEntry !== null
              ? formatDistanceToNow(timestampOfLatestEntry, { addSuffix: true })
              : 'N/A'}
          </span>

          <button
            onClick={() => {
              loadReadings();
              loadTimestampOfLatestEntry();
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="charts">
        <TimeSeriesChart
          data={tdsReadings}
          yDataKey="ppm"
          yAxisTitle="ppm"
          lineColour={'green'}
          title="TDS"
        />
        <TimeSeriesChart
          data={tempReadings}
          yDataKey="celsius"
          yAxisTitle="°C"
          lineColour={'red'}
          title="Temperature"
        />
      </div>
    </div>
  );
};

const getDateXHoursAgo = (x) => {
  const now = new Date();
  now.setHours(now.getHours() - x);
  return now;
};

export default App;
