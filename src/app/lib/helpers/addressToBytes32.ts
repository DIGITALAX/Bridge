import { isAddress } from "viem";

export const addressToBytes32 = (addr: string): string => {
  if (!isAddress(addr, { strict: false })) {
    throw new Error("Dirección inválida");
  }
  const padded = addr.slice(2).padStart(64, "0");
  return "0x" + padded;
};
