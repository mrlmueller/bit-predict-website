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

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Simplified version doesn't need validation logic for this example
  // but you should keep or adjust validation logic as per your needs

  const cacheKey = `data-${body.amount}`; // Unique cache key based on request parameters

  // Check if the data is cached and still valid
  const cachedEntry = cacheStore[cacheKey];
  const now = new Date();

  if (
    cachedEntry &&
    now.getTime() - cachedEntry.timestamp.getTime() < CACHE_VALIDITY_PERIOD
  ) {
    // Cache is valid, return cached data
    return NextResponse.json(cachedEntry.data, { status: 200 });
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
  };

  // Return the newly fetched data
  return NextResponse.json(
    { tradingdata, prediction, scrapeddata, isLimitedData, totalAvailable },
    { status: 201 }
  );
}
