export const addressToBytes32 = (addr: string): string => {
  if (addr.startsWith("0x")) {
    addr = addr.slice(2);
  }
  if (addr.length !== 40) {
    throw new Error("Dirección inválida");
  }
  const padded = addr.padStart(64, "0");
  return "0x" + padded;
};
