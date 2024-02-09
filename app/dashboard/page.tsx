import prisma from "@/prisma/client";
import { PiCurrencyBtc } from "react-icons/pi";

const Dashboard = async () => {
  const tradeData = await prisma.tradingdata.findFirst({
    orderBy: {
      id: "desc",
    },
  });
  const result = tradeData!.after_trade_open ?? tradeData!.before_trade_close;

  return (
    <div>
      <div className="mb-8 text-3xl">Dashboard</div>
      <div className="shadow-custom rounded-[25px] px-10 py-4 inline-block bg-[#fcfcfc] ">
        <div className="flex justify-center items-center">
          <div className="mr-10 xs:mr-20">
            <p className="font-semibold ">Current Investment Value</p>
            <p className="text-3xl font-bold mt-1">${result!.toFixed(2)}</p>
          </div>
          <div className=" w-16 h-16 aspect-square rounded-full flex justify-center items-center bg-[#D5B4EF]">
            <PiCurrencyBtc size={38} color="#444444" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
