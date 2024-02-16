"use client";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";
import TimeFrameDisplay from "../dashboard/TimeFrameDisplay";
import ChartLegend from "../dashboard/ChartLegend";
import { BsQuestionCircleFill } from "react-icons/bs";

interface PieChartData {
  name: string;
  value: number;
}

interface PieChartComponentProps {
  data: PieChartData[];
  rotation?: number; // Optional prop to rotate the chart
  labelValue: string; // Value to display in the center label
  legendTexts: { moneyLost: string; accuracy: string }; // Texts for the ChartLegend
  title: string; // Text for the h2 element
  timeFrame: string; // Time frame for TimeFrameDisplay
}

const COLORS = ["#FF8A4F", "#A668D8"];

const PieChartComponent: React.FC<PieChartComponentProps> = ({
  data,
  rotation = 90,
  labelValue,
  legendTexts,
  title,
  timeFrame,
}) => {
  return (
    <div style={{ padding: 0, margin: 0 }}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">{title}</h2>

        <TimeFrameDisplay timeFrame={timeFrame}></TimeFrameDisplay>
      </div>
      <ResponsiveContainer width="100%" height={250}>
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
            startAngle={360 + rotation}
            endAngle={rotation}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}

            <Label
              value={labelValue}
              position="center"
              className="text-center"
              style={{ fill: "gray", fontSize: 35 }}
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="flex justify-between items-center">
        <div>
          <ChartLegend color="purple">{legendTexts.moneyLost}</ChartLegend>
          <ChartLegend color="orange">{legendTexts.accuracy}</ChartLegend>
        </div>
        <BsQuestionCircleFill size={30} className="text-gray-300" />
      </div>
    </div>
  );
};

export default PieChartComponent;
