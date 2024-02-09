import React from "react";

type FormattedDateProps = {
  children: Date | string | number;
};

const FormattedDate: React.FC<FormattedDateProps> = ({ children }) => {
  // Function to format date with explicit type for 'date' parameter
  const formatDate = (date: Date | string | number): string => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1; // Months are 0-indexed
    const year = d.getFullYear();
    // Format day and month to ensure they are in 'DD' and 'MM' format
    const formattedDay = day < 10 ? `0${day}` : day.toString();
    const formattedMonth = month < 10 ? `0${month}` : month.toString();
    return `${formattedDay}.${formattedMonth}.${year}`;
  };

  return <span>{formatDate(children)}</span>;
};

export default FormattedDate;
