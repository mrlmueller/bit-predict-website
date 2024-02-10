"use client";
import { PureComponent } from "react";
import { Cell, Pie, PieChart } from "recharts";

const data = [
  { name: "Group A", value: 8 },
  { name: "Group B", value: 12 },
];
const COLORS = ["#A668D8", "#FF8A4F"];

export default class Example extends PureComponent {
  static demoUrl =
    "https://codesandbox.io/s/pie-chart-with-padding-angle-7ux0o";

  render() {
    return (
      <PieChart width={800} height={400}>
        <Pie
          data={data}
          cx={120}
          cy={200}
          innerRadius={67}
          outerRadius={80}
          cornerRadius={100}
          fill="#8884d8"
          paddingAngle={4}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    );
  }
}
