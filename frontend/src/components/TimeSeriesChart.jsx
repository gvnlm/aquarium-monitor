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
const darkestGreen = 'rgb(10, 40, 40)';
const darkGreen = 'rgb(10, 55, 60)';
const green = 'rgb(25, 190, 140)';
const lightGreen = 'rgb(225, 255, 205)';

const dotRadius = 4;

const TimeSeriesChart = ({ data, yDataKey, yAxisTitle, title, lineColour = green }) => {
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
        <text x={cx} y={cy + dotRadius + fontSize} textAnchor="middle" fill={lineColour}>
          {payload[yDataKey]}
        </text>
        <circle cx={cx} cy={cy} r={dotRadius} fill={lineColour} />
      </g>
    );
  };

  return (
    <div className="time-series-chart">
      <h1>{title}</h1>
      <ResponsiveContainer className="responsive-container" width="100%" height="100%">
        <LineChart data={processedData} margin={{ right: fontSize * 1.5 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={lightGreen} strokeOpacity={0.33} />

          <XAxis
            dataKey="timestamp"
            type="number"
            scale="time"
            domain={['auto', 'auto']}
            tickFormatter={unixTimeMsToString}
            axisLine={{ stroke: lightGreen }}
            tickLine={{ stroke: lightGreen }}
            tick={{ fill: lightGreen }}
          />

          <YAxis
            domain={[0, 'auto']}
            label={{
              value: yAxisTitle,
              position: 'insideLeft',
              angle: -90,
              offset: 8,
              fill: green,
            }}
            axisLine={{ stroke: lightGreen }}
            tickLine={{ stroke: lightGreen }}
            tick={{ fill: lightGreen }}
          />

          <Line
            type="basis"
            dataKey={yDataKey}
            stroke={lineColour}
            dot={<ShowLastDot />}
            activeDot={{
              r: dotRadius,
              stroke: green,
              fill: green,
            }}
          />

          <Tooltip
            labelFormatter={unixTimeMsToString}
            contentStyle={{
              backgroundColor: darkestGreen,
              border: `1px solid ${lightGreen}`,
              borderRadius: fontSize / 2,
            }}
            cursor={false}
          />
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
