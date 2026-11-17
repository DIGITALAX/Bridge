import { parseUnits } from "viem";

export const parseAmount = (
  value: string,
  decimals: number
): bigint | undefined => {
  const trimmed = (value ?? "").trim();
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return undefined;
  const fraction = trimmed.split(".")[1] ?? "";
  if (fraction.length > decimals) return undefined;
  try {
    const parsed = parseUnits(trimmed, decimals);
    return parsed > BigInt(0) ? parsed : undefined;
  } catch (err: any) {
    return undefined;
  }
};
