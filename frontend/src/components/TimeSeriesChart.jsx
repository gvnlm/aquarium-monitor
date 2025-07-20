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

const fontSize = 16;

const TimeSeriesChart = ({ data, yDataKey, yAxisTitle, lineColour, title }) => {
  // Convert data's timestamp strings to numeric representation (since Recharts requires numeric values for
  // accurate time axis scaling)
  const processedData = data.map((datum) => ({
    ...datum,
    timestamp: new Date(datum.timestamp).getTime(),
  }));

  // Dot component for Recharts' LineChart - shows only the last data point, and labels it
  const ShowLastDot = ({ cx, cy, payload, index }) => {
    // If this isn't the last data point
    if (index !== processedData.length - 1) {
      return null;
    }

    return (
      <g>
        <text x={cx} y={cy + fontSize} textAnchor="middle" fill={lineColour}>
          {payload[yDataKey]}
        </text>
        <circle cx={cx} cy={cy} r={2} fill={lineColour} />
      </g>
    );
  };

  return (
    <div className="time-series-chart">
      <h1>{title}</h1>
      <ResponsiveContainer className="responsive-container" width="100%" height="100%">
        <LineChart data={processedData} margin={{ right: fontSize * 1.5 }}>
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

          <Line type="basis" dataKey={yDataKey} stroke={lineColour} dot={<ShowLastDot />} />

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
