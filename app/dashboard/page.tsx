import prisma from "@/prisma/client";
import { Box, Grid, Table } from "@radix-ui/themes";
import { PiCurrencyBtc } from "react-icons/pi";
import UpDownCard from "./upDownCard";
import FormattedDate from "../components/FormatDate";
import Card from "../components/Card";
import InvestmentCard from "./InvestmentCard";
import { MdOutlineAttachMoney } from "react-icons/md";

// Change how caching works
const Dashboard = async () => {
  const tradeData = await prisma.tradingdata.findFirst({
    orderBy: {
      id: "desc",
    },
  });
  const result = tradeData!.after_trade_open ?? tradeData!.before_trade_close;

  const trades = await prisma.tradingdata.findMany();

  const preds = await prisma.prediction.findMany({
    take: trades.length,
    orderBy: {
      id: "desc",
    },
  });

  const actualData = await prisma.scrapeddata.findMany({
    take: trades.length - 1,
    orderBy: {
      id: "desc",
    },
  });

  preds.reverse();
  actualData.reverse();

  const results = trades.map((trade, index) => {
    if (index < trades.length - 1) {
      const directionChanged = trades[index + 1].after_trade_close !== null;
      let difference;
      if (directionChanged) {
        difference =
          trades[index + 1].after_trade_open! - trade.before_trade_close!;
      } else {
        difference =
          trades[index + 1].before_trade_close! - trade.before_trade_close!;
      }
      const roundedDifference = parseFloat(difference.toFixed(2));
      const sign = roundedDifference < 0 ? "-" : "+";
      const formattedDifference = `${sign} ${Math.abs(
        roundedDifference
      ).toFixed(2)}`;
      return formattedDifference;
    } else {
      return null;
    }
  });

  return (
    <div>
      <div className="mb-8 text-3xl">Dashboard</div>
      <Grid columns="1" gap="6" className="w-5/5 xl:w-2/5 md:w-3/5">
        <Card>
          <InvestmentCard change={false} title="Total Investment" value="70.01">
            <MdOutlineAttachMoney size={38} color="#444444" />
          </InvestmentCard>
        </Card>
        <Card>
          <h2 className="text-xl mb-4 font-medium">Trades</h2>
          <Table.Root variant="ghost">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell className="font-semibold ">
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
                  <Table.Cell>
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
        </Card>
        <Card>
          <InvestmentCard
            title="Current Investment Value"
            value={result!.toFixed(2)}
          >
            <PiCurrencyBtc size={38} color="#444444" />
          </InvestmentCard>
        </Card>
      </Grid>
    </div>
  );
};

export default Dashboard;
