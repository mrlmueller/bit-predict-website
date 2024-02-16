import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  color: "purple" | "orange";
}

const ChartLegend: React.FC<Props> = ({ children, color }) => {
  const backgroundColor =
    color === "purple" ? "bg-purple-600" : "bg-orange-500";

  return (
    <div className="flex items-center">
      <div className={`${backgroundColor} w-2.5 h-2.5 rounded-full mr-2`}></div>
      <div className="mr-6">{children}</div>
    </div>
  );
};

export default ChartLegend;
