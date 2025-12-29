import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const user = await getUserOrThrow();
    if (user.role !== "MENTOR" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only mentors can access the canon." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() ?? "";
    if (!query) {
      return NextResponse.json({ products: [], brands: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { brand: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 12,
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        brand: true,
        category: true,
        imageUrl: true,
      },
    });

    const brands = Array.from(
      new Set(products.map((product) => product.brand).filter((brand): brand is string => Boolean(brand))),
    ).slice(0, 12);

    return NextResponse.json({ products, brands });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to search the canon.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
