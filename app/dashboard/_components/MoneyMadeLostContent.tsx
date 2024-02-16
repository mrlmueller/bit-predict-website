import React from "react";
import Chart from "./Chart";
import ChartLegend from "./ChartLegend";
import TimeFrameDisplay from "./TimeFrameDisplay";
import { tradingdata } from "@prisma/client";

interface Props {
  trades: tradingdata[];
}

const MoneyMadeLostContent = ({ trades }: Props) => {
  return (
    <>
      <div className="flex justify-between items-center pb-3 mt-2">
        <h2 className="text-xl font-medium ml-6 md:ml-4">Money Made/Lost</h2>
        <TimeFrameDisplay
          timeFrame="Weekly"
          className="shrink-0"
        ></TimeFrameDisplay>
      </div>
      <div className="flex items-center pb-9 mt-2">
        <div className="ml-6 flex space-x-4 md:ml-4">
          <ChartLegend color="purple">Portfolio Value</ChartLegend>
          <ChartLegend color="orange">Break even</ChartLegend>
        </div>
      </div>
      <Chart dateFormat="day.month" trades={trades}></Chart>
    </>
  );
};

export default MoneyMadeLostContent;
