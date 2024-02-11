import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  fullWidth?: boolean;
  className?: string;
}

const Card = ({ className, children, fullWidth = false }: Props) => {
  return (
    <div
      className={`shadow-custom rounded-[25px] py-4 px-7 inline-block bg-[#fcfcfc] ${className} ${
        fullWidth ? "w-full" : ""
      }`}
    >
      {children}
    </div>
  );
};

export default Card;
