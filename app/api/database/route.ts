import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { z } from "zod";
import { prediction, scrapeddata, tradingdata } from "@prisma/client";

// Define types for your database records
interface TradingData {
  id: number;
  before_trade_close: number | null;
  after_trade_close: number | null;
  after_trade_open: number | null;
  timestamp: Date;
}

interface ScrapedData {
  id: number;
  timestamp: Date;
  higher_lower: number | null;
}

// Define a type for the cache entry
interface CacheEntry {
  timestamp: Date;
  data: {
    tradingdata: TradingData[];
    prediction: any[]; // Adjust according to your prediction type
    scrapeddata: ScrapedData[];
    isLimitedData: boolean;
    totalAvailable: number;
  };
}

// Initialize the cache store
const cacheStore: Record<string, CacheEntry> = {};

// Cache validity period in milliseconds (1 hour)
const CACHE_VALIDITY_PERIOD = 3600000; // 1 hour in milliseconds

// Assuming other imports and interface definitions remain unchanged...

export async function POST(request: NextRequest) {
  const body = await request.json();
  const cacheKey = `data-${body.amount}`; // Unique cache key based on request parameters
  const cachedEntry = cacheStore[cacheKey];
  const now = new Date();

  if (
    cachedEntry &&
    now.getTime() - cachedEntry.timestamp.getTime() < CACHE_VALIDITY_PERIOD
  ) {
    return NextResponse.json(cachedEntry.data, { status: 200 });
  }

  // Fetch the total available data count for handling the amount adjustment
  const totalAvailable = await prisma.tradingdata.count();
  const adjustedAmount = Math.min(body.amount, totalAvailable);

  // Fetch trading data and predictions as before, no changes here
  const [tradingdata, prediction] = await Promise.all([
    prisma.tradingdata.findMany({
      take: adjustedAmount,
      orderBy: { id: "desc" },
      select: {
        id: true,
        before_trade_close: true,
        after_trade_close: true,
        after_trade_open: true,
        timestamp: true,
      },
    }),
    prisma.prediction.findMany({
      take: adjustedAmount,
      orderBy: { id: "desc" },
    }),
  ]);

  // Fetching scraped data with adjustment for rows missing btc_open values
  let scrapedDataFetchAmount = adjustedAmount;
  let scrapedDataWithCheck = await prisma.scrapeddata.findMany({
    take: scrapedDataFetchAmount + 1, // Fetch an extra record to check for btc_open
    orderBy: { id: "desc" },
    select: {
      id: true,
      timestamp: true,
      higher_lower: true /* Add btc_open if needed for your logic */,
    },
  });

  // Check if the latest row needs to be skipped (mocking btc_open check as your schema might differ)
  if (scrapedDataWithCheck[0] /* and some condition to check btc_open */) {
    scrapedDataWithCheck.shift(); // Remove the first element if it doesn't meet the criteria
  }

  // Limit the scraped data to the adjusted amount if it exceeds
  const scrapeddata = scrapedDataWithCheck.slice(0, adjustedAmount);

  const isLimitedData =
    body.amount === 9999999 ? false : adjustedAmount < body.amount;

  // Cache and return the new data as before
  cacheStore[cacheKey] = {
    timestamp: new Date(),
    data: {
      tradingdata,
      prediction,
      scrapeddata,
      isLimitedData,
      totalAvailable,
    },
  };

  return NextResponse.json(
    { tradingdata, prediction, scrapeddata, isLimitedData, totalAvailable },
    { status: 201 }
  );
}
