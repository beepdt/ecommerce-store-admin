import prismadb from "@/lib/prismadb";

import { ColorsColumn } from "./components/columns";
import {format} from "date-fns";
import SizesClient from "./components/client";
import ColorsClient from "./components/client";

const Colors = async ({ params }: { params: Promise<{ storeId: string }> }) => {
  const {storeId} = await params
  const colors = await prismadb.color.findMany({
    where: {
      storeId: storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColors: ColorsColumn[] = colors.map((item)=>({
    id: item.id,
    name:item.name,
    value:item.value,
    createdAt: format(item.createdAt,"MMMM do,yyyy")
  })) 

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt=6">
        <ColorsClient data={formattedColors}/>
      </div>
    </div>
  );
};

export default Colors;
