import prismadb from "@/lib/prismadb";

import { SizesColumn } from "./components/columns";
import {format} from "date-fns";
import SizesClient from "./components/client";

const Sizes = async ({ params }: { params: Promise<{ storeId: string }> }) => {
  const {storeId} = await params
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSizes: SizesColumn[] = sizes.map((item)=>({
    id: item.id,
    name:item.name,
    value:item.value,
    createdAt: format(item.createdAt,"MMMM do,yyyy")
  })) 

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt=6">
        <SizesClient data={formattedSizes}/>
      </div>
    </div>
  );
};

export default Sizes;
