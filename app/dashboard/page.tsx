import prisma from "@/prisma/client";
import { Flex, Grid, Table } from "@radix-ui/themes";
import { MdOutlineAttachMoney } from "react-icons/md";
import { PiCurrencyBtc } from "react-icons/pi";
import Card from "../components/Card";
import Chart from "../components/Chart";
import CurrentPrediction from "../components/CurrentPrediction";
import FormattedDate from "../components/FormatDate";
import PieChartComponent from "../components/PieChart";
import ChartLegend from "./ChartLegend";
import InvestmentCard from "./InvestmentCard";
import TimeFrameDisplay from "./TimeFrameDisplay";
import UpDownCard from "./upDownCard";

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

  const calculateGainsAndLosses = (trades: any[]) => {
    let totalGains = 0;
    let totalLosses = 0;

    trades.forEach((trade, index) => {
      if (index < trades.length - 1) {
        const difference =
          trades[index + 1].before_trade_close - trade.before_trade_close;

        if (difference > 0) {
          totalGains += difference;
        } else if (difference < 0) {
          totalLosses += Math.abs(difference);
        }
      }
    });

    const roundedTotalGains = parseFloat(totalGains.toFixed(2));
    const roundedTotalLosses = parseFloat(totalLosses.toFixed(2));

    return { totalGains: roundedTotalGains, totalLosses: roundedTotalLosses };
  };

  const { totalGains, totalLosses } = calculateGainsAndLosses(trades);

  const returnData = [
    { name: "Losses", value: totalLosses },
    { name: "Gains", value: totalGains },
  ];

  type PredictionData = {
    pred?: number | null;
  };

  type ActualData = {
    higher_lower?: number | null;
  };

  const countMatchesAndMismatches = (
    preds: PredictionData[],
    actualData: ActualData[]
  ) => {
    let matches = 0;
    let mismatches = 0;

    const minLength = Math.min(preds.length, actualData.length);

    for (let i = 0; i < minLength; i++) {
      const pred = preds[i]?.pred;
      const actual = actualData[i]?.higher_lower;

      const predBinary =
        typeof pred === "number" ? (pred >= 0.5 ? 1 : 0) : null;

      if (predBinary !== null && typeof actual === "number") {
        if (predBinary === actual) {
          matches++;
        } else {
          mismatches++;
        }
      }
    }

    return { matches, mismatches };
  };

  // Example usage
  const { matches, mismatches } = countMatchesAndMismatches(preds, actualData);

  const accuracyData = [
    { name: "Losses", value: mismatches },
    { name: "Gains", value: matches },
  ];

  return (
    <div>
      <div className="flex flex-col lg:flex-row">
        <Flex className="order-2 lg:order-1 flex flex-col max-h-chart w-full lg:w-[60%]">
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

            <Card className="w-2/5 ml-7">
              <PieChartComponent
                data={returnData}
                labelValue={(totalGains - totalLosses).toFixed(2) + " $"}
                legendTexts={{
                  moneyLost: "Money Lost",
                  accuracy: "Money Gained",
                }}
                title="Return"
                timeFrame="Weekly" // Assuming you want to set the timeFrame to "Weekly"
              />
            </Card>
            <Card className="w-2/5 ml-7">
              <PieChartComponent
                data={accuracyData}
                labelValue={
                  ((matches / actualData.length) * 100).toFixed(1) + " %"
                }
                legendTexts={{
                  moneyLost: "Wrong Predictions",
                  accuracy: "Right Predictions",
                }}
                title="Predictions"
                timeFrame="Weekly" // Assuming you want to set the timeFrame to "Weekly"
              />
            </Card>
          </Flex>
        </Flex>
        <Grid
          className="order-1 lg:order-2 mt-8 lg:mt-0 lg:ml-8 w-full lg:w-2/5"
          columns="1"
          gap="6"
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
