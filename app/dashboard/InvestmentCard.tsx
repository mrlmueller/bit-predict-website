import React, { ReactNode } from "react";
import { TbArrowBadgeUpFilled } from "react-icons/tb";

interface Props {
  title: string;
  value: string;
  children: ReactNode;
}

const InvestmentCard = ({ title, children, value }: Props) => {
  const percentageChange = (((parseInt(value) - 70) / 70) * 100).toFixed(2);
  const color = parseFloat(percentageChange) < 0 ? "#FF8A4F" : "#A668D8";
  const rotationClass = parseFloat(percentageChange) < 0 ? "rotate-180" : "";
  const visibilityClass = parseFloat(percentageChange) === 0 ? "hidden" : "";

  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="font-semibold">{title}</p>
        <div className="flex">
          <p className="text-3xl font-bold mt-1">${value}</p>
          <div className={`flex ml-3 mt-4 ${visibilityClass}`}>
            <TbArrowBadgeUpFilled
              className={`mt-1 ${rotationClass} ${visibilityClass}`}
              color={color}
            />
            <p
              className={`text-[#A668D8] ${visibilityClass}`}
              style={{ color }}
            >
              {percentageChange} %
            </p>
          </div>
        </div>
      </div>
      <div className="w-16 h-16 aspect-square rounded-full flex justify-center items-center bg-[#D5B4EF]">
        {children}
      </div>
    </div>
  );
};

export default InvestmentCard;
