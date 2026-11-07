import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json(
      { status: "invalid_request", message: "A product search query is required." },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      status: "provider_not_connected",
      message: "The eBay Browse API connection is pending developer account approval. No live product listings are available yet.",
      products: []
    },
    { status: 503 }
  );
}
