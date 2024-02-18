import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { z } from "zod";

const issueSchema = z.object({
  amount: z.number().min(2),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = issueSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const cacheKey = generateCacheKey(body.amount);
  const now = new Date();

  // Check cache first
  if (
    cacheStore[cacheKey] &&
    now.getTime() - cacheStore[cacheKey].timestamp.getTime() < 86400000
  ) {
    // 86400000ms = 24 hours
    return NextResponse.json(cacheStore[cacheKey].data, { status: 200 });
  }

  // Check the total available tradingdata records
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

  // Include a flag or additional data to indicate if the data was limited
  const isLimitedData: boolean =
    body.amount === 9999999 ? false : adjustedAmount < body.amount;

  return NextResponse.json(
    { tradingdata, prediction, scrapeddata, isLimitedData, totalAvailable },
    {
      status: 201,
    }
  );
}
