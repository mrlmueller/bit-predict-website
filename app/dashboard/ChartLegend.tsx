import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  color: "purple" | "orange";
}

const ChartLegend = ({ children, color }: Props) => {
  const colors = {
    purple: "#9544D7",
    orange: "#FFA500",
  };

  const backgroundColor = colors[color];
  return (
    <>
      {color === "purple" && (
        <div
          style={{
            width: "10px",
            height: "10px",
            backgroundColor,
            borderRadius: "50%",
            marginRight: "0.5rem",
          }}
        ></div>
      )}
      {color === "orange" && (
        <div
          style={{
            width: "10px",
            height: "10px",
            backgroundColor,
            borderRadius: "50%",
            marginRight: "0.5rem",
          }}
        ></div>
      )}

      <div className="mr-6">{children}</div>
    </>
  );
};
export default ChartLegend;
