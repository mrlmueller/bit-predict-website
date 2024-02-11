import React from "react";

interface Props {
  timeFrame: string;
}

const TimeFrameDisplay = ({ timeFrame }: Props) => {
  return (
    <div className=" inline-block rounded-md bg-gray-300 px-5 py-1 text-gray-700">
      {timeFrame}
    </div>
  );
};

export default TimeFrameDisplay;
