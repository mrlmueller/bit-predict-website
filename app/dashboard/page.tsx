import prisma from "@/prisma/client";

const Dashboard = async () => {
  const issues = await prisma.tradingdata.findMany();

  return (
    <>
      <div>Dashboard</div>
    </>
  );
};

export default Dashboard;
