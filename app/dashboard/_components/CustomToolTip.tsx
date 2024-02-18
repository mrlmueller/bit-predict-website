import React from "react";

// Define the props based on what you expect to receive. This is a simplified example.
// You might want to use more specific types based on your data structure.
interface CustomToolTipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomToolTip: React.FC<CustomToolTipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    const { originalDate, value } = payload[0].payload; // Access the original date here
    const formatDateToDayMonthYear = (isoDateString: string): string => {
      const date = new Date(isoDateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // getMonth is zero-indexed
      const year = date.getFullYear();

      return `${day}.${month}.${year}`;
    };
    return (
      <div
        className="custom-tooltip rounded-lg shadow-custom"
        style={{
          backgroundColor: "#fff",
          padding: "10px",
        }}
      >
        {/* Example content - customize as needed */}
        <p>{`${formatDateToDayMonthYear(originalDate)}`}</p>
        <p>{`$ ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

export default CustomToolTip;
