import prisma from "@/prisma/client";
import { Table } from "@radix-ui/themes";
import { PiCurrencyBtc } from "react-icons/pi";
import UpDownCard from "./upDownCard";

const Dashboard = async () => {
  const tradeData = await prisma.tradingdata.findFirst({
    orderBy: {
      id: "desc",
    },
  });
  const result = tradeData!.after_trade_open ?? tradeData!.before_trade_close;

  const trades = await prisma.tradingdata.findMany();

  const preds = await prisma.prediction.findMany({
    take: trades.length,
    orderBy: {
      id: "desc",
    },
  });

  const actualData = await prisma.scrapeddata.findMany({
    take: trades.length - 1,
    orderBy: {
      id: "desc",
    },
  });

  // Reverse the lists
  preds.reverse();
  actualData.reverse();

  const results = trades.map((trade, index) => {
    if (index < trades.length - 1) {
      const directionChanged = trades[index + 1].after_trade_close !== null;
      let difference;
      if (directionChanged) {
        difference =
          trades[index + 1].after_trade_open! - trade.before_trade_close!;
      } else {
        difference =
          trades[index + 1].before_trade_close! - trade.before_trade_close!;
      }
      const roundedDifference = parseFloat(difference.toFixed(2));
      const sign = roundedDifference < 0 ? "-" : "+";
      const formattedDifference = `${sign} ${Math.abs(
        roundedDifference
      ).toFixed(2)}`;
      return formattedDifference;
    } else {
      return null;
    }
  });

  return (
    <div>
      <div className="mb-8 text-3xl">Dashboard</div>
      <div>
        <div className="shadow-custom rounded-[25px] px-10 py-4 inline-block bg-[#fcfcfc] ">
          <div className="flex justify-center items-center">
            <div className="mr-10 xs:mr-[7rem]">
              <p className="font-semibold ">Current Investment Value</p>
              <p className="text-3xl font-bold mt-1">${result!.toFixed(2)}</p>
            </div>
            <div className=" w-16 h-16 aspect-square rounded-full flex justify-center items-center bg-[#D5B4EF]">
              <PiCurrencyBtc size={38} color="#444444" />
            </div>
          </div>
        </div>
        <div className="shadow-custom rounded-[25px] px-10 py-4 inline-block bg-[#fcfcfc] mt-10">
          <Table.Root variant="ghost">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Prediction</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Actual</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Result</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {trades.map((trade, index) => (
                <Table.Row key={trade.id}>
                  <Table.Cell>{trade.timestamp.toDateString()}</Table.Cell>
                  <Table.Cell>
                    <UpDownCard
                      status={
                        parseInt((preds[index]?.pred).toFixed(0)) === 1
                          ? 1
                          : parseInt((preds[index]?.pred).toFixed(0)) === 0
                          ? 0
                          : 1
                      }
                    ></UpDownCard>
                  </Table.Cell>
                  <Table.Cell>
                    <UpDownCard
                      status={
                        actualData[index]?.higher_lower === 1
                          ? 1
                          : actualData[index]?.higher_lower === 0
                          ? 0
                          : null // Provide null as the fallback instead of 1
                      }
                    ></UpDownCard>
                  </Table.Cell>
                  <Table.Cell>
                    {results[index] !== null ? `${results[index]} $` : ""}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
