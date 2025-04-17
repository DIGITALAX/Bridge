import { useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Transaction } from "../types/bridge.types";
import { ModalContext } from "@/app/providers";

const useTransactions = (dict: any) => {
  const { address } = useAccount();
  const context = useContext(ModalContext);
  const [transactionsLoading, setTransactionsLoading] =
    useState<boolean>(false);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

  const handleAllTransactions = async () => {
    setTransactionsLoading(true);
    try {
      const res = await fetch("/api/swagger", {
        method: "POST",
        body: JSON.stringify({
          address,
        }),
      });

      const data = await res.json();

      setAllTransactions(
        (data?.data?.data || [])?.filter(
          (item: any) =>
            (item?.pathway?.srcEid == 30101 ||
              item?.pathway?.srcEid == 30373) &&
            (item?.pathway?.dstEid == 30101 || item?.pathway?.dstEid == 30373)
        )
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setTransactionsLoading(false);
  };

  useEffect(() => {
    if (
      (allTransactions?.length < 1 ||
        context?.notification == dict?.common?.bridging) &&
      address
    ) {
      handleAllTransactions();
    }
  }, [address, context?.notification]);

  return {
    allTransactions,
    transactionsLoading,
  };
};

export default useTransactions;
