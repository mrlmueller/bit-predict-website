import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client"; // Adjust the import path as necessary
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
    prediction: prediction[];
    scrapeddata: ScrapedData[];
    isLimitedData: boolean;
    totalAvailable: number;
  };
  usedInSpecialWindow: boolean; // New flag
}

// Initialize the cache store
const cacheStore: Record<string, CacheEntry> = {};

// Cache validity period in milliseconds (1 hour)
const CACHE_VALIDITY_PERIOD = 3600000;

const issueSchema = z.object({
  amount: z.number().min(2),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = issueSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const currentTime = new Date();
  const currentHourUTC = currentTime.getUTCHours();
  const currentMinutesUTC = currentTime.getUTCMinutes();

  // Generate a unique cache key based on the request parameters
  const cacheKey = `data-${body.amount}`;

  // Determine if current UTC time is within the special window
  const isInSpecialWindow =
    (currentHourUTC === 23 && currentMinutesUTC >= 30) ||
    (currentHourUTC === 0 && currentMinutesUTC <= 30);

  // Check if the data is cached
  if (cacheStore[cacheKey]) {
    const cacheAge =
      currentTime.getTime() - cacheStore[cacheKey].timestamp.getTime();
    const isCacheValid = cacheAge < CACHE_VALIDITY_PERIOD;

    // Use the cache if it's valid and not flagged for refresh
    if (isCacheValid && !cacheStore[cacheKey].usedInSpecialWindow) {
      // Special window logic
      if (isInSpecialWindow) {
        cacheStore[cacheKey].usedInSpecialWindow = true;
      }
      return NextResponse.json(cacheStore[cacheKey].data, { status: 200 });
    }
  }
  // If not cached or cache is invalid, fetch the data from the database
  const totalAvailable = await prisma.tradingdata.count();
  const adjustedAmount = Math.min(body.amount, totalAvailable);

  const [tradingdata, prediction, scrapeddata] = await Promise.all([
    prisma.tradingdata.findMany({
      take: adjustedAmount,
      orderBy: {
        id: "desc",
      },
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
      orderBy: {
        id: "desc",
      },
    }),
    prisma.scrapeddata.findMany({
      take: adjustedAmount - 1,
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
        timestamp: true,
        higher_lower: true,
      },
    }),
  ]);

  const isLimitedData =
    body.amount === 9999999 ? false : adjustedAmount < body.amount;

  // Cache the new data along with the current timestamp
  cacheStore[cacheKey] = {
    timestamp: new Date(),
    data: {
      tradingdata,
      prediction,
      scrapeddata,
      isLimitedData,
      totalAvailable,
    },
    usedInSpecialWindow: isInSpecialWindow,
  };

  // Return the newly fetched data
  return NextResponse.json(
    { tradingdata, prediction, scrapeddata, isLimitedData, totalAvailable },
    { status: 201 }
  );
}
