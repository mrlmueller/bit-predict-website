import { Badge } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { FaArrowCircleUp } from "react-icons/fa";

type BadgeColor = "purple" | "orange";

const statusMap: Record<1 | 0, { label: string; color: BadgeColor }> = {
  1: { label: "UP", color: "purple" },
  0: { label: "DOWN", color: "orange" },
};

type UpDownCardProps = {
  prediction?: number | null;
  actual?: number | null;
};

const UpDownCard = ({ prediction, actual }: UpDownCardProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia("(max-width: 425px)").matches);
    };

    // Check on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let status: 1 | 0 | null = null;
  if (typeof prediction === "number") {
    status = parseInt(prediction.toFixed(0)) === 1 ? 1 : 0;
  } else if (typeof actual === "number") {
    status = actual === 1 ? 1 : actual === 0 ? 0 : null;
  }

  if (status === null) {
    return null;
  }

  if (isMobile) {
    const iconColor = status === 1 ? "#D09FF6" : "#FFA679";
    const iconClass = status === 0 ? "rotate-180" : "";
    return (
      <FaArrowCircleUp size={20} color={iconColor} className={iconClass} />
    );
  } else {
    const statusInfo = statusMap[status];
    return <Badge color={statusInfo.color}>{statusInfo.label}</Badge>;
  }
};

export default UpDownCard;
