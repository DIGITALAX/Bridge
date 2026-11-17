import {
  LAYER_ZERO,
  MAX_SWAGGER_BODY_BYTES,
  RATE_LIMIT_SWAGGER,
} from "@/app/lib/constants";
import guardRequest from "@/app/lib/helpers/guardRequest";
import { NextResponse } from "next/server";
import { isAddress } from "viem";

export async function POST(req: Request) {
  const blocked = guardRequest(req, "swagger", RATE_LIMIT_SWAGGER);
  if (blocked) return blocked;

  try {
    const raw = await req.text();
    if (raw.length > MAX_SWAGGER_BODY_BYTES) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    let reqBody: any;
    try {
      reqBody = JSON.parse(raw);
    } catch (err: any) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const address = reqBody?.address;
    if (
      typeof address !== "string" ||
      !/^0x[0-9a-fA-F]{40}$/.test(address) ||
      !isAddress(address, { strict: false })
    ) {
      return NextResponse.json({ error: "Invalid address" }, { status: 400 });
    }

    const response = await fetch(
      `${LAYER_ZERO}${encodeURIComponent(address)}?limit=100`,
      { signal: AbortSignal.timeout(15000) }
    );

    if (!response.ok) {
      console.error("Error from Layerzero:", response.status);
      return NextResponse.json(
        { error: "Failed to get transactions" },
        { status: 502 }
      );
    }

    const data = await response.json();

    return NextResponse.json({ data });
  } catch (err: any) {
    console.error(err.message);
    return NextResponse.json(
      { error: "Failed to get transactions" },
      { status: 500 }
    );
  }
}
