import React from "react";

interface Props {
  timeFrame: string;
  className?: string;
}

const TimeFrameDisplay = ({ timeFrame, className }: Props) => {
  const test =
    " inline-block rounded-md bg-gray-300 px-5 py-1 text-gray-700" + className;

  return <div className={test}>{timeFrame}</div>;
};

export default TimeFrameDisplay;
