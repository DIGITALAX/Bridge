import { FunctionComponent, JSX } from "react";
import { TransactionProps } from "../types/bridge.types";
import moment from "moment";
import Image from "next/legacy/image";
import { idToExplorer, idToImage, INFURA_GATEWAY } from "@/app/lib/constants";
import { IoIosArrowRoundForward } from "react-icons/io";
import { MdArrowOutward } from "react-icons/md";

const Transaction: FunctionComponent<TransactionProps> = ({
  transaction,
  dict,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex text-sm px-2 flex-col gap-5 sm:gap-2 items-start justify-start">
      <div className="relative w-full h-fit flex">
        <div className="relative w-full h-fit sm:h-10 flex items-center justify-center sm:justify-between gap-5 sm:flex-nowrap flex-wrap">
          <div className="relative w-fit h-fit flex">
            {moment(transaction?.created).fromNow()}
          </div>
          <div className="relative w-fit h-fit gap-2 flex flex-row">
            <div className="relative w-fit h-fit flex">
              <div className="relative flex w-5 h-5 rounded-full">
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/${
                    idToImage[transaction?.pathway?.srcEid]
                  }`}
                  layout="fill"
                  draggable={false}
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
            </div>
            <IoIosArrowRoundForward size={15} className="fill-mainText" />
            <div className="relative w-fit h-fit flex">
              <div className="relative flex w-5 h-5 rounded-full">
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/${
                    idToImage[transaction?.pathway?.dstEid]
                  }`}
                  layout="fill"
                  draggable={false}
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full h-fit flex flex-col gap-5 sm:gap-2">
        <div className="relative w-full h-fit flex gap-2 sm:gap-5 items-center justify-center sm:justify-between sm:flex-nowrap flex-wrap">
          <div className="relative w-fit gap-3 flex items-center justify-center flex-row">
            <div className="relative w-fit h-fit flex">
              {dict?.common?.source}
            </div>
            <div
              className={`"relative w-fit h-fit flex uppercase ${
                transaction?.source?.status
                  ?.toLowerCase()
                  ?.includes("succeeded")
                  ? "text-[#19ef12]"
                  : transaction?.source?.status
                      ?.toLowerCase()
                      ?.includes("reverted")
                  ? "text-[#ef211a]"
                  : "text-[#ef7a1a]"
              }`}
            >
              {transaction?.source?.status}
            </div>
          </div>
          <div className="relative w-fit gap-3 flex items-center justify-center flex-row">
            <div className="relative w-fit h-fit flex">
              {transaction?.source?.tx?.txHash?.slice(0, 10) + "..."}
            </div>
            <MdArrowOutward
              size={15}
              className="fill-mainText cursor-sewingHS"
              onClick={() =>
                window.open(
                  `${idToExplorer[transaction?.pathway?.srcEid]}${
                    transaction?.source?.tx?.txHash
                  }`
                )
              }
            />
          </div>
        </div>
        <div
          className={`relative w-full h-fit flex gap-2 sm:gap-5  items-center justify-center sm:justify-between sm:flex-nowrap flex-wrap ${
            transaction?.destination?.status
              ?.toLowerCase()
              ?.includes("waiting") && "animate-pulse"
          }`}
        >
          <div className="relative w-fit gap-3 flex items-center justify-center flex-row">
            <div className="relative w-fit h-fit flex">
              {dict?.common?.dest}
            </div>
            <div
              className={`"relative w-fit h-fit flex uppercase ${
                transaction?.destination?.status
                  ?.toLowerCase()
                  ?.includes("succeeded")
                  ? "text-[#19ef12]"
                  : transaction?.destination?.status
                      ?.toLowerCase()
                      ?.includes("reverted")
                  ? "text-[#ef211a]"
                  : "text-[#ef7a1a]"
              }`}
            >
              {transaction?.destination?.status}
            </div>
          </div>
          <div className="relative w-fit gap-3 flex items-center justify-center flex-row">
            <div className="relative w-fit h-fit flex">
              {transaction?.destination?.tx?.txHash
                ? transaction?.destination?.tx?.txHash?.slice(0, 10) + "..."
                : "...."}
            </div>
            <MdArrowOutward
              size={15}
              className="fill-mainText cursor-sewingHS"
              onClick={() =>
                transaction?.destination?.tx?.txHash &&
                window.open(
                  `${idToExplorer[transaction?.pathway?.dstEid]}${
                    transaction?.destination?.tx?.txHash
                  }`
                )
              }
            />
          </div>
        </div>
      </div>
      <div className="relative w-full h-px bg-mainText"></div>
    </div>
  );
};

export default Transaction;
