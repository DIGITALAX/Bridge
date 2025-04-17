import { SetStateAction } from "react";

export type BridgeProps = {
  dict: any;
};

export type TransactionsProps = {
  dict: any;
};

export type ChainProps = {
  chains: Chain;
  setChains: (e: Chain) => void;
  setOpenChains: () => void;
};

export interface Chain {
  name: string;
  id: number;
  address: `0x${string}`;
  dstEid: number;
  image: string;
}

export interface Transaction {
  created: string;
  pathway: { srcEid: number; dstEid: number };
  source: {
    status: string;
    tx: {
      txHash: string;
    };
  };
  destination: {
    status: string;
    tx: {
      txHash: string;
    };
  };
}

export type TransactionProps = {
  transaction: Transaction;
  dict: any;
};
