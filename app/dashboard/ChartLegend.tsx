import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  color: "purple" | "orange";
}

const ChartLegend: React.FC<Props> = ({ children, color }) => {
  const backgroundColor =
    color === "purple" ? "bg-purple-600" : "bg-orange-500";

  // Alternatively, if you have specific color codes not available in Tailwind by default,
  // you could define them in your Tailwind config and use the generated class names here.
  // For the given hex codes, you would add them to the Tailwind configuration like so:
  // theme: {
  //   extend: {
  //     colors: {
  //       purple: '#9544D7',
  //       orange: '#FFA500',
  //     },
  //   },
  // },
  // Then, you would use `bg-purple` or `bg-orange` as your `backgroundColor` value based on the prop.

  return (
    <div className="flex items-center">
      <div className={`${backgroundColor} w-2.5 h-2.5 rounded-full mr-2`}></div>
      <div className="mr-6">{children}</div>
    </div>
  );
};

export default ChartLegend;
