import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const TimeSeriesChart = ({ data, yDataKey, yAxisTitle, lineColour }) => {
  // Convert data's timestamp strings to numeric representation (since Recharts requires numeric values for
  // accurate time axis scaling)
  const processedData = data.map((datum) => ({
    ...datum,
    timestamp: new Date(datum.timestamp).getTime(),
  }));

  return (
    <ResponsiveContainer width="50%" height={500}>
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
          domain={([min, max]) => [min - 1, max + 1]}
          label={{ value: yAxisTitle, position: 'insideLeft', angle: -90 }}
        />

        <Line type="linear" dataKey={yDataKey} stroke={lineColour} />

        <Tooltip labelFormatter={unixTimeMsToString} />
      </LineChart>
    </ResponsiveContainer>
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
