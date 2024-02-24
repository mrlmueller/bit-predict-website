import { tradingdata } from "@prisma/client";

export const calculateGainsAndLosses = (trades: tradingdata[]) => {
  let totalGains = 0;
  let totalLosses = 0;

  trades.forEach((trade, index) => {
    if (index < trades.length - 1) {
      // Apply the value-choosing logic here
      const nextTradeValue =
        trades[index + 1].after_trade_open ??
        trades[index + 1].before_trade_close;
      const currentTradeValue =
        trade.after_trade_open ?? trade.before_trade_close;

      // Ensure both values are available before calculating the difference
      if (
        typeof nextTradeValue === "number" &&
        typeof currentTradeValue === "number"
      ) {
        const difference = nextTradeValue - currentTradeValue;

        if (difference > 0) {
          totalGains += difference;
        } else if (difference < 0) {
          totalLosses += Math.abs(difference);
        }
      }
    }
  });

  return {
    totalGains: parseFloat(totalGains.toFixed(2)),
    totalLosses: parseFloat(totalLosses.toFixed(2)),
  };
};

type PredictionData = {
  pred?: number | null;
};

type ActualData = {
  higher_lower?: number | null;
};

export const countMatchesAndMismatches = (
  preds: PredictionData[],
  actualData: ActualData[]
) => {
  let matches = 0;
  let mismatches = 0;

  const minLength = Math.min(preds.length, actualData.length);

  for (let i = 0; i < minLength; i++) {
    const pred = preds[i]?.pred;
    const actual = actualData[i]?.higher_lower;

    const predBinary = typeof pred === "number" ? (pred >= 0.5 ? 1 : 0) : null;

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
