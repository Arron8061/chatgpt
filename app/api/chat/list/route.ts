import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const param = request.nextUrl.searchParams.get("page");
  const page = param ? parseInt(param) : 1;

  console.log("当前页码:", page);

  // 先获取总数据量
  const count = await prisma.chat.count();
  console.log("总数据条数:", count);

  // 如果请求的页码超出数据范围，返回空列表
  if (page < 1 || (page - 1) * 20 >= count) {
    return NextResponse.json({ code: 0, data: { list: [], hasMore: false } });
  }

  const list = await prisma.chat.findMany({
    skip: (page - 1) * 20,
    take: 20,
    orderBy: {
      updateTime: "desc",
    },
  });

  console.log("查询到的数据条数:", list.length);

  const hasMore = count > page * 20;
  console.log("是否还有更多:", hasMore);

  return NextResponse.json({ code: 0, data: { list, hasMore } });
}
