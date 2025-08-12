import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> } // ✅ Promise type
) {
  try {
    const { storeId } = await params; // ✅ Await params
    const { userId } = await auth();
    const body = await req.json();

    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name Required", { status: 400 });
    }
    if (!value) {
      return new NextResponse("Value Required", { status: 400 });
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

    const size = await prismadb.size.create({
      data: {
        name,
        value,
        storeId,
      },
    });

    return NextResponse.json(size);
  } catch (e) {
    console.log("[SIZES_POST]", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> } // ✅ Promise type
) {
  try {
    const { storeId } = await params; // ✅ Await params

    if (!storeId) {
      return new NextResponse("Store ID Required", { status: 400 });
    }

    const size = await prismadb.size.findMany({
      where: {
        storeId,
      },
    });

    return NextResponse.json(size);
  } catch (e) {
    console.log("[SIZE_GET]", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
