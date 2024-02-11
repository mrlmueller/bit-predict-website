import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  fullWidth?: boolean;
  px?: number;
  py?: number;
}

const Card = ({ children, fullWidth = false, px = 7, py = 4 }: Props) => {
  const paddingClasses = `py-${py} px-${px}`;
  return (
    <div
      className={`shadow-custom rounded-[25px] ${paddingClasses} inline-block bg-[#fcfcfc] ${
        fullWidth ? "w-full" : ""
      }`}
    >
      {children}
    </div>
  );
};

export default Card;
