import { Badge } from "@radix-ui/themes";
import React from "react";

type BadgeColor = "purple" | "orange";

const statusMap: Record<1 | 0, { label: string; color: BadgeColor }> = {
  1: { label: "UP", color: "purple" },
  0: { label: "DOWN", color: "orange" },
};

// Updated props to include null as a valid type
type UpDownCardProps = {
  prediction?: number | null;
  actual?: number | null;
};

const UpDownCard = ({ prediction, actual }: UpDownCardProps) => {
  let status: 1 | 0 | null = null;
  if (typeof prediction === "number") {
    status = parseInt(prediction.toFixed(0)) === 1 ? 1 : 0;
  } else if (typeof actual === "number") {
    status = actual === 1 ? 1 : actual === 0 ? 0 : null;
  }

  if (status === null) {
    return null;
  }
  const statusInfo = statusMap[status];
  return <Badge color={statusInfo.color}>{statusInfo.label}</Badge>;
};

export default UpDownCard;
