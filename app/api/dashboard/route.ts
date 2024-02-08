import { NextRequest } from "next/server";

import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
  const prisma = new PrismaClient();

  try {
    const operations = await prisma.opertationStatus.findMany();
    res.status(200).json(operations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  } finally {
    await prisma.$disconnect();
  }
}
