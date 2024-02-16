"use client";
import { prediction, scrapeddata, tradingdata } from "@prisma/client";
import { Button, Flex, Grid, Table } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { MdOutlineAttachMoney } from "react-icons/md";
import { PiCurrencyBtc } from "react-icons/pi";
import Card from "../components/Card";
import Chart from "./_components/Chart";
import CurrentPrediction from "./_components/CurrentPrediction";
import FormattedDate from "../components/FormatDate";
import PieChartComponent from "./_components/PieChart";
import ChartLegend from "./_components/ChartLegend";
import InvestmentCard from "./_components/InvestmentCard";
import TimeFrameDisplay from "./_components/TimeFrameDisplay";
import UpDownCard from "./_components/upDownCard";

const Dashboard = () => {
  const [amount, setAmount] = useState<number>(7); // Adjust based on your actual needs

  const [trades, setTrades] = useState<tradingdata[]>([]);
  const [preds, setPreds] = useState<prediction[]>([]);
  const [actualData, setActualData] = useState<scrapeddata[]>([]);
  const [currentPred, setCurrentPred] = useState<prediction | null>(null);
  const [result, setResult] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      if (response.ok) {
        const [tradingDataResponse, predictionResponse, scrapedDataResponse] =
          await response.json();

        // Assuming your original logic required reversing the data arrays
        // Reverse them only if it aligns with your original data handling logic
        const reversedTradingData = tradingDataResponse.reverse();
        const reversedPrediction = predictionResponse.reverse();
        const reversedScrapedData =
          scrapedDataResponse.length > 1
            ? scrapedDataResponse.reverse()
            : scrapedDataResponse;

        setTrades(reversedTradingData);
        setPreds(reversedPrediction);
        setActualData(reversedScrapedData);

        // Set currentPred based on the reversedPrediction which aligns with the initial latest fetch logic
        setCurrentPred(
          reversedPrediction[reversedPrediction.length - 1] ?? null
        );

        // Handle result calculation similar to your initial logic
        const initialTrade =
          tradingDataResponse[tradingDataResponse.length - 1];
        setResult(
          initialTrade
            ? initialTrade.after_trade_open ?? initialTrade.before_trade_close
            : null
        );
      } else {
        // Handle fetch error
        console.error("Failed to fetch data from API");
      }
      setIsLoading(false);
    };

    fetchData();
  }, [amount]);

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

  if (isLoading) {
    return <div>Loading...</div>; // Or any other loading indicator you prefer
  }

  return (
    <div className="max-w-[2000px] mx-auto">
      <Button onClick={() => setAmount(4)}>4 Days</Button>
      <Button onClick={() => setAmount(8)}>8 Days</Button>
      <Button onClick={() => setAmount(16)}>14 Days</Button>

      <div className="flex flex-col lg:flex-row">
        <Flex className="order-2 lg:order-1 flex flex-col max-h-chart w-full lg:w-[60%]">
          <Card fullWidth={true} className="mb-8 mt-8 pl-0 md:mt-0 md:pl-4">
            <div className="flex justify-between items-center pb-3 mt-2">
              <h2 className="text-xl font-medium ml-6 md:ml-4">
                Money Made/Lost
              </h2>
              <TimeFrameDisplay
                timeFrame="Weekly"
                className="shrink-0"
              ></TimeFrameDisplay>
            </div>
            <div className="flex items-center pb-9 mt-2">
              <div className="ml-6 flex space-x-4 md:ml-4">
                <ChartLegend color="purple">Portfolio Value</ChartLegend>
                <ChartLegend color="orange">Break even</ChartLegend>
              </div>
            </div>
            <Chart dateFormat="day.month" trades={trades}></Chart>
          </Card>

          <div className="flex flex-col md:flex-row md:space-x-4">
            <Card className="flex-1 md:flex-none md:w-1/5">
              <h2 className="text-xl font-medium mb-4">Prediction</h2>
              <CurrentPrediction
                currentPred={parseInt(currentPred!.pred.toFixed(0))}
              ></CurrentPrediction>
            </Card>

            <Card className="flex-1 md:w-2/5 mt-8 md:mt-0">
              <PieChartComponent
                data={returnData}
                labelValue={(totalGains - totalLosses).toFixed(2) + " $"}
                legendTexts={{
                  moneyLost: "Money Lost",
                  accuracy: "Money Gained",
                }}
                title="Return"
                timeFrame="Weekly"
              />
            </Card>

            <Card className="flex-1 md:w-2/5 mt-8 mb-40 md:mt-0 md:mb-0">
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
                timeFrame="Weekly"
              />
            </Card>
          </div>
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
