import { LAYER_ZERO } from "@/app/lib/constants";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const reqBody = await req.json();

    const response = await fetch(`${LAYER_ZERO}${reqBody.address}?limit=100`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error from Layerzero:", reqBody.address, errorText);
      throw new Error("Failed to get transactions");
    }

    const data = await response.json();

    return NextResponse.json({ data });
  } catch (err: any) {
    console.error(err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
