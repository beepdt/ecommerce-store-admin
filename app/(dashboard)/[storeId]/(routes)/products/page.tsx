import prismadb from "@/lib/prismadb";
import { ProductColumn } from "./components/columns";
import {format} from "date-fns";
import { formatter } from "@/lib/utils";
import ProductsClient from "./components/client";

const Products = async ({ params }: { params: Promise<{ storeId: string }> }) => {
  const {storeId} = await params
  const products = await prismadb.product.findMany({
    where: {
      storeId: storeId,
    },
    include:{
      category:true,
      size:true,
      color:true
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item)=>({
    id: item.id,
    name:item.name,
    description:item.description,
    isFeatured:item.isFeatured,
    isArchived:item.isArchived,
    price: formatter.format(item.price.toNumber()),
    category:item.category.name,
    size:item.size.value,
    color:item.color.value,
    createdAt: format(item.createdAt,"MMMM do,yyyy")
  })) 

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt=6">
        <ProductsClient data={formattedProducts}/>
      </div>
    </div>
  );
};

export default Products;
