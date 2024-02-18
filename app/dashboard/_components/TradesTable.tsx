import FormattedDate from "@/app/components/FormatDate";
import { Table } from "@radix-ui/themes";
import React from "react";
import UpDownCard from "./upDownCard";

import { prediction, scrapeddata, tradingdata } from "@prisma/client";

interface Props {
  trades: tradingdata[];
  preds: prediction[];
  actualData: scrapeddata[];
  results: (string | null)[];
}

const TradesTable = ({ trades, preds, actualData, results }: Props) => {
  return (
    <>
      <h2 className="text-xl mb-4 font-medium">Trades</h2>
      <Table.Root variant="ghost">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell className="font-semibold hidden xs:block">
              Date
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-semibold ">
              Prediction
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-semibold ">
              Actual
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-semibold ">
              Result
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {trades.map((trade, index) => (
            <Table.Row key={trade.id}>
              <Table.Cell className="hidden xs:block">
                <FormattedDate>{trade.timestamp}</FormattedDate>
              </Table.Cell>
              <Table.Cell>
                <UpDownCard prediction={preds[index]?.pred} />
              </Table.Cell>
              <Table.Cell>
                <UpDownCard actual={actualData[index]?.higher_lower} />
              </Table.Cell>
              <Table.Cell>
                {results[index] !== null ? `${results[index]} $` : ""}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  );
};

export default TradesTable;
