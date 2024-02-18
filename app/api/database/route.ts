import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { z } from "zod";

const issueSchema = z.object({
  amount: z.number().max(100).min(2),
});

export async function POST(request: NextRequest) {
  const startTime = new Date(); // Start time measurement

  const body = await request.json();
  const validation = issueSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  const [tradingdata, prediction, scrapeddata] = await Promise.all([
    prisma.tradingdata.findMany({
      take: parseInt(body.amount),
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
      take: parseInt(body.amount),
      orderBy: {
        id: "desc",
      },
    }),
    prisma.scrapeddata.findMany({
      take: parseInt(body.amount) - 1,
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

  const endTime = new Date(); // End time measurement
  const executionTime = endTime.getTime() - startTime.getTime(); // Calculate execution time

  //console.log("Execution time: " + executionTime + "ms");

  return NextResponse.json([tradingdata, prediction, scrapeddata], {
    status: 201,
  });
}
