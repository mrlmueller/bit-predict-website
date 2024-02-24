"use client";
import { prediction, scrapeddata, tradingdata } from "@prisma/client";
import { Callout, Flex, Grid } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { MdOutlineAttachMoney } from "react-icons/md";
import { PiCurrencyBtc } from "react-icons/pi";
import Card from "../components/Card";
import {
  calculateGainsAndLosses,
  countMatchesAndMismatches,
} from "../utils/dashboardCalculations";
import CurrentPrediction from "./_components/CurrentPrediction";
import DashboardloadingSkeleton from "./_components/DashboardloadingSkeleton";
import InvestmentCard from "./_components/InvestmentCard";
import MoneyMadeLostContent from "./_components/MoneyMadeLostContent";
import PieChartComponent from "./_components/PieChart";
import TimeframeSelector from "./_components/TimeframeSelector";
import TradesTable from "./_components/TradesTable";

interface ApiResponse {
  tradingdata: tradingdata[];
  prediction: prediction[];
  scrapeddata: scrapeddata[];
  isLimitedData: boolean;
  totalAvailable: number;
}

const Dashboard = () => {
  const [amount, setAmount] = useState<number>(7);
  const [timeFrame, setTimeFrame] = useState<string>("Weekly");
  const [isLimitedDataPopupOpen, setIsLimitedDataPopupOpen] = useState(false);
  const [availableAmount, setAvailableAmount] = useState<number>(0);

  const [trades, setTrades] = useState<tradingdata[]>([]);
  const [preds, setPreds] = useState<prediction[]>([]);
  const [actualData, setActualData] = useState<scrapeddata[]>([]);
  const [currentPred, setCurrentPred] = useState<prediction | null>(null);
  const [result, setResult] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const cacheKey = `data-${amount}`;
      const cachedData = localStorage.getItem(cacheKey);

      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        const isCacheValid = new Date().getTime() - timestamp < 3600000; // 1 hour cache validity

        if (isCacheValid) {
          updateStateWithFetchedData(data);
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      if (response.ok) {
        const data: ApiResponse = await response.json();

        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data,
            timestamp: new Date().getTime(),
          })
        );

        updateStateWithFetchedData(data);
      } else {
        console.error("Failed to fetch data from API");
      }
      setIsLoading(false);
    };

    fetchData();
  }, [amount]);

  function updateStateWithFetchedData({
    tradingdata,
    prediction,
    scrapeddata,
    isLimitedData,
    totalAvailable,
  }: ApiResponse) {
    // Reverse data if necessary, apply any transformations
    const reversedTradingData = tradingdata.reverse();
    const reversedPrediction = prediction.reverse();
    const reversedScrapedData = scrapeddata.reverse();

    // Update state
    setTrades(reversedTradingData);
    setPreds(reversedPrediction);
    setActualData(reversedScrapedData);

    setCurrentPred(reversedPrediction[reversedPrediction.length - 1] ?? null);

    const initialTrade = reversedTradingData[reversedTradingData.length - 1];
    setResult(
      initialTrade
        ? initialTrade.after_trade_open ?? initialTrade.before_trade_close
        : null
    );

    setAvailableAmount(totalAvailable);

    if (isLimitedData) {
      setIsLimitedDataPopupOpen(true);
      setTimeout(() => {
        setIsLimitedDataPopupOpen(false);
      }, 4000);
    }
  }

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

  // Calculate total gains and losses and create the obj for the PieChartComponent
  const { totalGains, totalLosses } = calculateGainsAndLosses(trades);
  const returnData = [
    { name: "Losses", value: totalLosses },
    { name: "Gains", value: totalGains },
  ];

  // Count matches and mismatches and create the obj for the PieChartComponent
  const { matches, mismatches } = countMatchesAndMismatches(preds, actualData);
  const accuracyData = [
    { name: "Losses", value: mismatches },
    { name: "Gains", value: matches },
  ];

  if (isLoading) {
    return <DashboardloadingSkeleton></DashboardloadingSkeleton>;
  }

  return (
    <>
      {isLimitedDataPopupOpen && timeFrame !== "Max" && (
        <div className="absolute top-36 md:top-8 left-1/2 transform -translate-x-1/2">
          <Callout.Root
            className="max-w-xs mx-auto p-4 rounded-lg"
            style={{ backgroundColor: "rgba(149, 68, 215, 0.6)" }}
          >
            <Callout.Icon>
              <IoIosInformationCircleOutline color="#FFFFFF" size={17} />
            </Callout.Icon>
            <Callout.Text className="text-white">
              There is not enough data, {availableAmount} days will be displayed
            </Callout.Text>
          </Callout.Root>
        </div>
      )}
      <div className="max-w-[2000px] mx-auto">
        <Card className="flex max-w-full mb-0 px-[1rem] lg:mb-5 md:max-w-80">
          <TimeframeSelector
            setAmount={setAmount}
            setTimeFrame={setTimeFrame}
          ></TimeframeSelector>
        </Card>
        <div className="flex flex-col lg:flex-row">
          <Flex className="order-2 lg:order-1 flex flex-col max-h-chart w-full lg:w-[60%]">
            <Card fullWidth={true} className="mb-8 mt-8 pl-1 lg:mt-0 md:pl-4">
              <MoneyMadeLostContent
                trades={trades}
                timeFrame={timeFrame}
              ></MoneyMadeLostContent>
            </Card>

            <div className="flex flex-col md:flex-col 2xl:flex-row 2xl:w-full">
              <Card className="flex-1 md:flex-none md:w-full md:max-h-28 2xl:w-1/5">
                <h2 className="text-xl font-medium mb-4">Prediction</h2>
                <CurrentPrediction
                  currentPred={parseInt(currentPred!.pred.toFixed(0))}
                ></CurrentPrediction>
              </Card>

              <div className="flex flex-col md:flex-row md:mt-7 md:mb-11 md:ml-4 md:justify-between 2xl:w-full 2xl:mt-0 2xl:ml-7">
                <Card className="md:ml-[-12px] md:w-[49%] mt-8 md:mt-0  2xl:ml-0 2xl:w-[48%]">
                  <PieChartComponent
                    data={returnData}
                    labelValue={(totalGains - totalLosses).toFixed(2) + " $"}
                    legendTexts={{
                      moneyLost: "Money Gained",
                      accuracy: "Money Lost",
                    }}
                    title="Return"
                    timeFrame={timeFrame}
                  />
                </Card>

                <Card className="md:w-[49%] mt-8 mb-40 md:mt-0 md:mb-0 2xl:w-[48%]">
                  <PieChartComponent
                    data={accuracyData}
                    labelValue={
                      ((matches / actualData.length) * 100).toFixed(1) + " %"
                    }
                    legendTexts={{
                      moneyLost: "Right Predictions",
                      accuracy: "Wrong Predictions",
                    }}
                    title="Predictions"
                    timeFrame={timeFrame}
                  />
                </Card>
              </div>
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
            <Card className="px-[18px] xs:px-7">
              <TradesTable
                trades={trades}
                preds={preds}
                actualData={actualData}
                results={results}
              ></TradesTable>
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
    </>
  );
};

export default Dashboard;
