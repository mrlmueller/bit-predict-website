import { Callout, Card, Flex, Grid, Table } from "@radix-ui/themes";
import result from "postcss/lib/result";
import React from "react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { MdOutlineAttachMoney } from "react-icons/md";
import { PiCurrencyBtc } from "react-icons/pi";
import CurrentPrediction from "./CurrentPrediction";
import InvestmentCard from "./InvestmentCard";
import MoneyMadeLostContent from "./MoneyMadeLostContent";
import PieChartComponent from "./PieChart";
import TimeframeSelector from "./TimeframeSelector";
import TradesTable from "./TradesTable";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const DashboardloadingSkeleton = () => {
  const trades = [1, 2, 3, 4, 5, 6, 7];
  return (
    <>
      <div className="max-w-[2000px] mx-auto">
        <Card className="flex max-w-full shadow-custom mb-0 px-[1rem] lg:mb-5 md:max-w-80 ">
          <Skeleton
            className="mr-2"
            count={3}
            inline
            width={"30%"}
            height={41}
            borderRadius={30}
          />
        </Card>

        <div className="flex flex-col lg:flex-row">
          <Flex className="order-2 lg:order-1 flex flex-col max-h-chart w-full lg:w-[60%]">
            <Card className="shadow-custom mb-8 mt-8 pl-0 lg:mt-0 md:pl-4">
              <Skeleton className="mt-3" width={170} height={30}></Skeleton>
              <Skeleton className="mt-5" width={270} height={15}></Skeleton>
              <Skeleton
                className="mt-5 mb-4"
                width={"99%"}
                height={343}
              ></Skeleton>
            </Card>

            <div className="flex flex-col md:flex-col 2xl:flex-row 2xl:w-full">
              <Card className="shadow-custom flex-1 md:flex-none md:w-full md:max-h-28 2xl:w-1/5">
                <Skeleton
                  className="mb-2 ml-2"
                  height={30}
                  width={"48%"}
                ></Skeleton>
                <Skeleton
                  className="mb-10 ml-2"
                  width={"55%"}
                  height={40}
                ></Skeleton>
              </Card>

              <div className="flex flex-col md:flex-row md:mt-7 md:mb-11 md:ml-4 md:justify-between 2xl:w-full 2xl:mt-0 2xl:ml-7">
                <Card className="shadow-custom md:ml-[-12px] md:w-[49%] mt-8 md:mt-0  2xl:ml-0 2xl:w-[48%]">
                  <Skeleton
                    className="mt-2 ml-2"
                    width={70}
                    height={30}
                  ></Skeleton>
                  <div className="grid place-content-center">
                    <Skeleton
                      className="mt-10"
                      circle
                      width={150}
                      height={150}
                    ></Skeleton>
                  </div>
                  <Skeleton
                    className="mt-12 ml-2 mb-2"
                    height={50}
                    width={130}
                  ></Skeleton>
                </Card>

                <Card className="shadow-custom md:w-[49%] mt-8 mb-40 md:mt-0 md:mb-0 2xl:w-[48%]">
                  <Skeleton
                    className="mt-2 ml-2"
                    width={70}
                    height={30}
                  ></Skeleton>
                  <div className="grid place-content-center">
                    <Skeleton
                      className="mt-10"
                      circle
                      width={150}
                      height={150}
                    ></Skeleton>
                  </div>
                  <Skeleton
                    className="mt-12 ml-2 mb-2"
                    height={50}
                    width={160}
                  ></Skeleton>
                </Card>
              </div>
            </div>
          </Flex>
          <Grid
            className="order-1 lg:order-2 mt-8 lg:mt-0 lg:ml-8 w-full lg:w-2/5"
            columns="1"
            gap="6"
          >
            <Card className="shadow-custom max-h-24 px-4">
              <div className="flex justify-between items-center">
                <div>
                  <Skeleton width={200}></Skeleton>
                  <div className="flex">
                    <Skeleton width={150} height={40}></Skeleton>
                  </div>
                </div>
                <Skeleton width={70} height={70} circle></Skeleton>
              </div>
            </Card>

            <Card className="px-[18px] xs:px-7 shadow-custom">
              <Table.Root variant="ghost">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell className="font-semibold hidden xs:block">
                      Date
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell className="font-semibold xs:hidden">
                      Date
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell className="font-semibold">
                      {typeof window !== "undefined" && window.innerWidth < 420
                        ? "Pred"
                        : "Prediction"}
                    </Table.ColumnHeaderCell>

                    <Table.ColumnHeaderCell className="font-semibold ">
                      Actual
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell className="font-semibold ">
                      Result
                    </Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body className="max-h-[400px] overflow-auto">
                  {trades.map((trade) => (
                    <Table.Row key={trade}>
                      <Table.Cell className="hidden xs:block">
                        <Skeleton></Skeleton>
                      </Table.Cell>
                      <Table.Cell className="xs:hidden">
                        <Skeleton></Skeleton>
                      </Table.Cell>
                      <Table.Cell>
                        <Skeleton></Skeleton>
                      </Table.Cell>
                      <Table.Cell>
                        <Skeleton></Skeleton>
                      </Table.Cell>
                      <Table.Cell>
                        <Skeleton></Skeleton>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Card>

            <Card className="shadow-custom max-h-24 px-4">
              <div className="flex justify-between items-center">
                <div>
                  <Skeleton width={200}></Skeleton>
                  <div className="flex">
                    <Skeleton width={150} height={40}></Skeleton>
                  </div>
                </div>
                <Skeleton width={70} height={70} circle></Skeleton>
              </div>
            </Card>
          </Grid>
        </div>
      </div>
    </>
  );
};

export default DashboardloadingSkeleton;
