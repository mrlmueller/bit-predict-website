import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Card = ({ children }: Props) => {
  return (
    <div className="shadow-custom rounded-[25px] py-4 px-7 inline-block bg-[#fcfcfc]">
      {children}
    </div>
  );
};

export default Card;
