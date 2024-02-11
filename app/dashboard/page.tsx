import prisma from "@/prisma/client";
import { Button, Flex, Grid, Table } from "@radix-ui/themes";
import { MdOutlineAttachMoney } from "react-icons/md";
import { PiCurrencyBtc } from "react-icons/pi";
import Card from "../components/Card";
import Chart from "../components/Chart";
import FormattedDate from "../components/FormatDate";
import InvestmentCard from "./InvestmentCard";
import UpDownCard from "./upDownCard";
import ChartLegend from "./ChartLegend";
import CurrentPrediction from "../components/CurrentPrediction";
import TimeFrameDisplay from "./TimeFrameDisplay";
import dynamic from "next/dynamic";
import PieChartComponent from "../components/PieChart";

const PieChart = dynamic(() => import("../components/PieChart"), {
  ssr: false,
});
// Change how caching works
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

  const currentPred = await prisma.prediction.findFirst({
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

  const data = [
    { name: "Group A", value: 5 },
    { name: "Group B", value: 7 },
  ];

  return (
    <div>
      <div className="flex flex-col lg:flex-row">
        <Flex className="flex flex-col max-h-chart w-full lg:w-[60%]">
          <Card fullWidth={true} className="pl-0 mb-8">
            <div className="flex justify-between items-center pb-9 mt-2">
              <h2 className="ml-7 text-xl font-medium">Money Made/Lost</h2>
              <div className="flex items-center">
                <ChartLegend color="purple">Portfolio Value</ChartLegend>
                <ChartLegend color="orange">Break even</ChartLegend>
                <TimeFrameDisplay timeFrame="Weekly"></TimeFrameDisplay>
              </div>
            </div>
            <Chart dateFormat="day.month" trades={trades}></Chart>
          </Card>
          <Flex>
            <Card className="w-1/5 ">
              <h2 className="text-xl font-medium mb-4">Prediciton</h2>
              <CurrentPrediction
                currentPred={parseInt(currentPred!.pred.toFixed(0))}
              ></CurrentPrediction>
            </Card>
            {}
            {}
            {}
            {}
            {}
            {}
            {}
            <Card className="w-2/5 ml-7">
              <PieChartComponent
                data={data}
                labelValue="Return"
                legendTexts={{
                  moneyLost: "Money Lost",
                  accuracy: "Money Gained",
                }}
                title="Return Title"
                timeFrame="Weekly" // Assuming you want to set the timeFrame to "Weekly"
              />
            </Card>
            {}
            {}
            {}
            {}
            {}

            <Card className="w-2/5 ml-7">
              <h2 className="text-xl font-medium mb-4">Accuracy</h2>
            </Card>
            {}
            {}
            {}
            {}
            {}
            {}
            {}
            {}
          </Flex>
        </Flex>
        <Grid
          columns="1"
          gap="6"
          className="mt-8 lg:mt-0 lg:ml-8 w-full lg:w-2/5"
        >
          <Card>
            <InvestmentCard
              change={false}
              title="Total Investment"
              value="70.01"
            >
              <MdOutlineAttachMoney size={38} color="#444444" />
            </InvestmentCard>
          </Card>
          <Card>
            <h2 className="text-xl mb-4 font-medium">Trades</h2>
            <Table.Root variant="ghost">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="font-semibold  hidden xs:block">
                    Date
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="font-semibold ">
                    Prediction
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="font-semibold ">
                    Actual
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="font-semibold ">
                    Result
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {trades.map((trade, index) => (
                  <Table.Row key={trade.id}>
                    <Table.Cell className="hidden xs:block">
                      <FormattedDate>{trade.timestamp}</FormattedDate>
                    </Table.Cell>
                    <Table.Cell>
                      <UpDownCard prediction={preds[index]?.pred} />
                    </Table.Cell>
                    <Table.Cell>
                      <UpDownCard actual={actualData[index]?.higher_lower} />
                    </Table.Cell>
                    <Table.Cell>
                      {results[index] !== null ? `${results[index]} $` : ""}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Card>
          <Card>
            <InvestmentCard
              title="Current Investment Value"
              value={result!.toFixed(2)}
            >
              <PiCurrencyBtc size={38} color="#444444" />
            </InvestmentCard>
          </Card>
        </Grid>
      </div>
    </div>
  );
};

export const revalidate = 60;

export default Dashboard;
