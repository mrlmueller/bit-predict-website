import { tradingdata, prediction, scrapeddata } from "@prisma/client";
import { useState, useEffect } from "react";
import prisma from "@/prisma/client";

export const useDashboardData = (dataCount: number) => {
  const [trades, setTrades] = useState<tradingdata[]>([]);
  const [preds, setPreds] = useState<prediction[]>([]);
  const [actualData, setActualData] = useState<scrapeddata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [currentPred, setCurrentPred] = useState<prediction | null>(null);
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Example of fetching trades, adjust according to your schema
      try {
        setLoading(true);
        const fetchedTrades = await prisma.tradingdata.findMany({
          take: dataCount,
          orderBy: {
            id: "desc",
          },
        });

        setTrades(fetchedTrades);

        // To set the result variable use this logic but be aware that tradeData does not exist but we need to use the first item from the trades object
        setResult(
          fetchedTrades[0]?.after_trade_open ??
            fetchedTrades[0]?.before_trade_close
        );

        const fetchedPreds = await prisma.prediction.findMany({
          take: dataCount,
          orderBy: {
            id: "desc",
          },
        });

        setPreds(fetchedPreds.reverse());
        setCurrentPred(fetchedPreds[0] || null);

        const fetchedActualData = await prisma.scrapeddata.findMany({
          take: dataCount - 1,
          orderBy: {
            id: "desc",
          },
        });
        setActualData(fetchedActualData.reverse());
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataCount]);

  return { trades, preds, actualData, result, currentPred, loading, error };
};
