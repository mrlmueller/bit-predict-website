import { useState } from "react";

interface Props {
  setAmount: (amount: number) => void;
  setTimeFrame: (timeFrame: string) => void;
}

const TimeFrameComponent = ({ setAmount, setTimeFrame }: Props) => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("Weekly");
  const timeFrames = ["Weekly", "Monthly", "Max"];
  const amount = [7, 30, 9999999];

  return (
    <div className="flex justify-between items-center w-full">
      {timeFrames.map((timeFrame, index) => (
        <div
          key={timeFrame}
          className={`inline-block cursor-pointer rounded-full px-5 py-2 text-center
            ${
              selectedTimeFrame === timeFrame
                ? "bg-customGray text-gray-900"
                : "bg-gray-100 text-gray-900"
            }`}
          onClick={() => {
            setSelectedTimeFrame(timeFrame);
            setTimeFrame(timeFrame);
            setAmount(amount[index]);
          }}
        >
          {timeFrame}
        </div>
      ))}
    </div>
  );
};

export default TimeFrameComponent;
