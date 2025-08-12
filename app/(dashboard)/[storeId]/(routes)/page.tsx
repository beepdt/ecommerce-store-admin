import prismadb from "@/lib/prismadb";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ArrowUpIcon, Package, ShoppingCart, Activity } from "lucide-react";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getTotalSales } from "@/actions/get-total-sales";
import { getStock } from "@/actions/get-stock";
import { Overview } from "@/components/ui/overview";
import { getGraphData } from "@/actions/get-graph-data";

interface DashboardPageProps {
  params: Promise<{ storeId: string }>;
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const {storeId} = await params
  const totalRevenue =  await getTotalRevenue(storeId)
  const totalSales = await getTotalSales(storeId)
  const productStock = await getStock(storeId)
  const graphData = await getGraphData(storeId)
  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <p className="text-2xl tracking-tight font-bold">
          Store summary
        </p>
        <p className="text-sm font-semibold text-neutral-500">
          Manage your store
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
               ₹
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹ {totalRevenue}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products in Stock</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{productStock}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+ {totalSales}</div>
              
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview data={graphData}/>
            </CardContent>
          </Card>
          
        </div>
    </div>
    
  );
};

export default DashboardPage;
