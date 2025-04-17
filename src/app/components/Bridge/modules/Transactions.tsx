import { FunctionComponent, JSX } from "react";
import { TransactionsProps } from "../types/bridge.types";
import useTransactions from "../hooks/useTransactions";
import Transaction from "./Transaction";

const Transactions: FunctionComponent<TransactionsProps> = ({
  dict,
}): JSX.Element => {
  const { allTransactions, transactionsLoading } = useTransactions(dict);
  return (
    <div
      className={`relative w-full h-fit sm:px-10 flex items-center justify-start font-aud ${
        transactionsLoading && "animate-pulse"
      }`}
    >
      <div className="relative px-2 py-6 w-full h-[50vh] border-2 border-mainHighlight rounded-md flex flex-col gap-6 items-center justify-start flex-col font-aud">
        <div className="relative w-1/2 h-fit flex items-center justify-center gap-2 flex-col">
          <div className="relative w-fit h-fit flex text-center">
            {dict?.common?.tran}
          </div>
          <div className="relative bg-mainText h-px w-full flex"></div>
        </div>
        <div className="relative w-full h-full flex overflow-y-scroll items-start justify-start">
          {!transactionsLoading && allTransactions?.length < 1 ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative w-fit h-fit flex text-center">
                {dict?.common?.notran}
              </div>
            </div>
          ) : (
            <div className="relative w-full h-fit flex items-start justify-start flex-col gap-8">
              {allTransactions?.map((transaction, indice) => {
                return (
                  <Transaction
                    dict={dict}
                    transaction={transaction}
                    key={indice}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
