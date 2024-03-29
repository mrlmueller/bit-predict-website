"use client";
import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CustomToolTip from "./CustomToolTip";

const formatYAxis = (tickItem: number): string => {
  if (tickItem >= 1000) {
    return `${(tickItem / 1000).toFixed(1)}k`;
  } else {
    return tickItem.toString();
  }
};

interface Trade {
  id: number;
  before_trade_close: number | null;
  after_trade_close: number | null;
  close_fees: number | null;
  after_trade_open: number | null;
  before_trade_open: number | null;
  open_fees: number | null;
  leverage: number | null;
  timestamp: Date;
}

interface ChartComponentProps {
  trades: Trade[];
  dateFormat: "day.month" | "day"; // Prop to choose date format
}

const ChartComponent: React.FC<ChartComponentProps> = ({
  trades,
  dateFormat,
}) => {
  // Helper function to format date based on prop
  const formatDate = (date: Date): string => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      // Check if date is a Date object and is valid
      return "Invalid Date"; // Placeholder for handling invalid dates
    }
    const day = date.getDate();
    const month = date.getMonth() + 1; // JavaScript months are 0-indexed
    if (dateFormat === "day.month") {
      return `${day}.${month}`;
    } else {
      return `${day}`;
    }
  };

  // Transform trades to chart data format
  const data = trades.map((trade) => ({
    name: formatDate(new Date(trade.timestamp)), // For the X-axis
    originalDate: trade.timestamp, // For the tooltip
    value:
      trade.after_trade_open !== null && trade.after_trade_open !== undefined
        ? trade.after_trade_open.toFixed(2)
        : trade.before_trade_close !== null
        ? trade.before_trade_close.toFixed(2)
        : "0",
  }));

  return (
    <div className="mt-5">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#BB8CE1" stopOpacity={0.8} />
              <stop offset="20%" stopColor="#BB8CE1" stopOpacity={0.6} />
              <stop offset="40%" stopColor="#BB8CE1" stopOpacity={0.4} />
              <stop offset="70%" stopColor="#BB8CE1" stopOpacity={0.16} />
              <stop offset="100%" stopColor="#BB8CE1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tickMargin={10} // Increase tick margin to push axis description away
            tick={{ fontSize: 14 }} // Decrease font size to make text smaller
          />
          <YAxis
            tickFormatter={formatYAxis}
            axisLine={false}
            tickLine={false}
            domain={["auto", "auto"]}
            tickMargin={14} // Increase tick margin to push axis description away
            tick={{ fontSize: 14 }} // Decrease font size to make text smaller
          />
          <Tooltip cursor={false} content={<CustomToolTip />} />
          <Area
            type="monotone"
            dataKey="value"
            strokeWidth={2.5}
            stroke="#9544D7"
            fill="url(#colorUv)"
          />
          <ReferenceLine
            y={70}
            stroke="#FF732C"
            strokeWidth={1.7}
            strokeDasharray="41 41"
            strokeLinecap="round"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent;
