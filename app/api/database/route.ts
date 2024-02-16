import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { z } from "zod";

const issueSchema = z.object({
  amount: z.number(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = issueSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  const tradingdata = await prisma.tradingdata.findMany({
    take: parseInt(body.amount),
    orderBy: {
      id: "desc",
    },
  });

  const prediction = await prisma.prediction.findMany({
    take: parseInt(body.amount),
    orderBy: {
      id: "desc",
    },
  });

  const scrapeddata = await prisma.scrapeddata.findMany({
    take: parseInt(body.amount) - 1,
    orderBy: {
      id: "desc",
    },
  });

  return NextResponse.json([tradingdata, prediction, scrapeddata], {
    status: 201,
  });
}
