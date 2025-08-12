import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  const {storeId} = await params
  try {
    const { userId } = await auth();
    const body = await req.json();

    const {
      name,
      price,
      description,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name Required", { status: 400 });
    }
    if (!description) {
      return new NextResponse("Description Required", { status: 400 });
    }
    if (!price) {
      return new NextResponse("Price Required", { status: 400 });
    }
    if (!categoryId) {
      return new NextResponse("Category Required", { status: 400 });
    }
    if (!sizeId) {
      return new NextResponse("Size Required", { status: 400 });
    }
    if (!colorId) {
      return new NextResponse("Color Required", { status: 400 });
    }
    if (!images || !images.length) {
      return new NextResponse("Images Required", { status: 400 });
    }

    if (!storeId) {
      return new NextResponse("Store ID Required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const product = await prismadb.product.create({
      data: {
        name,
        description,
        price,
        categoryId,
        sizeId,
        colorId,
        isArchived,
        isFeatured,
        images: {
          createMany: {
            data: images.map((image: { url: string }) => ({ url: image.url }))
          },
        },
        storeId: storeId,
      },
    });

    return NextResponse.json(product);
  } catch (e) {
    console.log("[PRODUCTS_POST]", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
   const {storeId} = await params
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!storeId) {
      return new NextResponse("Store ID Required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured:isFeatured? true : undefined,
        isArchived: false
      },
      include:{
        images:true,
        category:true,
        color:true,
        size:true
      },
      orderBy:{
        createdAt:'desc'
      }
    });

    return NextResponse.json(products);
  } catch (e) {
    console.log("[PRODUCTS_GET]", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
