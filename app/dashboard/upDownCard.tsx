import { Badge } from "@radix-ui/themes";
import React from "react";

type BadgeColor = "purple" | "orange";

const statusMap: Record<1 | 0, { label: string; color: BadgeColor }> = {
  1: { label: "UP", color: "purple" },
  0: { label: "DOWN", color: "orange" },
};

const UpDownCard = ({ status }: { status: 1 | 0 | null }) => {
  if (status === null) {
    return;
  }
  const statusInfo = statusMap[status];
  return <Badge color={statusInfo.color}>{statusInfo.label}</Badge>;
};

export default UpDownCard;
