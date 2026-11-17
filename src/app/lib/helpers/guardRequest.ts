import { NextResponse } from "next/server";
import { RATE_LIMIT_WINDOW_MS } from "../constants";

const hits = new Map<string, { count: number; reset: number }>();

const hostOf = (value: string | null | undefined): string | undefined => {
  if (!value) return undefined;
  try {
    return new URL(value.includes("://") ? value : `https://${value}`).host
      .toLowerCase();
  } catch (err: any) {
    return undefined;
  }
};

export const isSameOrigin = (request: Request): boolean => {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const originHost = hostOf(origin);
  if (!originHost) return false;

  const allowed = [
    hostOf(request.headers.get("host")),
    hostOf(request.headers.get("x-forwarded-host")?.split(",")[0]?.trim()),
    hostOf(process.env.NEXT_PUBLIC_BASE_URL),
  ].filter(Boolean);

  return allowed.includes(originHost);
};

export const isRateLimited = (
  request: Request,
  scope: string,
  limit: number
): boolean => {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown";
  const key = `${scope}:${ip}`;
  const now = Date.now();

  if (hits.size > 5000) {
    hits.forEach((value, entryKey) => {
      if (value.reset <= now) hits.delete(entryKey);
    });
  }

  const entry = hits.get(key);
  if (!entry || entry.reset <= now) {
    hits.set(key, { count: 1, reset: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > limit;
};

const guardRequest = (
  request: Request,
  scope: string,
  limit: number
): NextResponse | undefined => {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (isRateLimited(request, scope, limit)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  return undefined;
};

export default guardRequest;
