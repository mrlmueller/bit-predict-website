"use client";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import TimeFrameDisplay from "../dashboard/TimeFrameDisplay";

interface PieChartData {
  name: string;
  value: number;
}

interface PieChartComponentProps {
  data: PieChartData[];
  rotation?: number; // Optional prop to rotate the chart
}

const COLORS = ["#A668D8", "#FF8A4F"];

const PieChartComponent: React.FC<PieChartComponentProps> = ({
  data,
  rotation = 90,
}) => {
  return (
    <div style={{ padding: 0, margin: 0 }}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Return</h2>
        <TimeFrameDisplay timeFrame="Weekly"></TimeFrameDisplay>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={67}
            outerRadius={80}
            cornerRadius={100}
            fill="#8884d8"
            paddingAngle={4}
            dataKey="value"
            startAngle={360 + rotation} // Rotate the chart using startAngle
            endAngle={rotation} // and endAngle
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
