import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

import '../styles/TimeSeriesChart.css';

const TimeSeriesChart = ({ data, yDataKey, yAxisTitle, lineColour, title }) => {
  // Convert data's timestamp strings to numeric representation (since Recharts requires numeric values for
  // accurate time axis scaling)
  const processedData = data.map((datum) => ({
    ...datum,
    timestamp: new Date(datum.timestamp).getTime(),
  }));

  return (
    <div className="time-series-chart">
      <h1>{title}</h1>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={processedData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="timestamp"
            type="number"
            scale="time"
            domain={['auto', 'auto']}
            tickFormatter={unixTimeMsToString}
          />

          <YAxis
            domain={[0, 'auto']}
            label={{ value: yAxisTitle, position: 'insideLeft', angle: -90, offset: 8 }}
          />

          <Line type="basis" dataKey={yDataKey} stroke={lineColour} dot={false} />

          <Tooltip labelFormatter={unixTimeMsToString} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Converts time represented by milliseconds since UNIX epoch, to a formatted string
const unixTimeMsToString = (timestamp) =>
  new Date(timestamp).toLocaleString([], {
    year: '2-digit',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

export default TimeSeriesChart;
