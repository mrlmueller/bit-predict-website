import { Flex } from "@radix-ui/themes";
import React from "react";
import { FaArrowUp } from "react-icons/fa";

interface Props {
  currentPred: number;
}

const CurrentPrediction = ({ currentPred }: Props) => {
  const color = currentPred === 1 ? "#D5B4EF" : "#FFBF9E";
  const text = currentPred === 1 ? "UP" : "DOWN";

  const iconContainerClass = currentPred === 0 ? "rotate-180" : "";

  return (
    <Flex className="flex items-center justify-between">
      <p className="text-4xl font-medium " style={{ color: color }}>
        {text}
      </p>

      {/*     <div
        className={`w-12 h-12 rounded-full flex justify-center items-center ${iconContainerClass}`}
        style={{ backgroundColor: color }}
      >
        <FaArrowUp size={25} color="#444444" />
  </div>*/}
    </Flex>
  );
};

export default CurrentPrediction;
