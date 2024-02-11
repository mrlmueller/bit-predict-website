"use client";
import { PureComponent } from "react";
import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    name: "01",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "05",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "10",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "15",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "20",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "25",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "30",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const formatYAxis = (tickItem: number): string => {
  // Format numbers less than 1000 with one decimal place
  // and numbers in thousands with 'k' representation
  if (tickItem >= 1000) {
    return `${(tickItem / 1000).toFixed(1)}k`; // Converts to 'k' format and retains one decimal place
  } else {
    return tickItem.toString(); // Keeps the number as is
  }
};

export default class Example extends PureComponent {
  render() {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 0,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9544D7" stopOpacity={0.95} />
              <stop offset="70%" stopColor="#9544D7" stopOpacity={0.12} />
              <stop offset="99%" stopColor="#9544D7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis
            tickFormatter={formatYAxis}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="uv"
            strokeWidth={2.5}
            stroke="#9544D7"
            fill="url(#colorUv)"
          />
          <ReferenceLine
            y={2000}
            stroke="#FF732C"
            strokeWidth={2}
            strokeDasharray="41 41"
            strokeLinecap="round"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }
}
