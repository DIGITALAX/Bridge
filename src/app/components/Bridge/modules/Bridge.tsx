import { FunctionComponent, JSX, useContext } from "react";
import { BridgeProps } from "../types/bridge.types";
import useBridge from "../hooks/useBridge";
import { AiOutlineLoading } from "react-icons/ai";
import { ModalContext } from "@/app/providers";
import { TiArrowSortedDown } from "react-icons/ti";
import Chain from "./Chain";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/app/lib/constants";

const Bridge: FunctionComponent<BridgeProps> = ({ dict }): JSX.Element => {
  const context = useContext(ModalContext);
  const {
    amount,
    setAmount,
    handleBridgeAmount,
    bridgeLoading,
    openChains,
    setOpenChains,
    isApproved,
    handleApprove,
    chains,
    setChains,
  } = useBridge(dict);
  return (
    <div className="relative w-full h-fit flex items-center justify-center font-aud">
      <div className="relative sm:w-96 w-full px-2 py-6 gap-10 border border-mainText rounded-md items-center justify-between flex flex-col">
        <div className="relative underline underline-offset-4 uppercase flex w-fit h-fit text-2xl">
          {dict?.common?.bridgeM}
        </div>

        <div className="relative w-full h-fit flex flex-col gap-5 items-center justify-start">
          <div className="relative w-full h-fit flex flex-row flex-wrap gap-6 items-center justify-center">
            <div className="relative w-fit h-fit flex items-center justify-center gap-2">
              <div className="relative w-fit h-fit flex">
                {dict?.common?.source}
              </div>
              <div
                className="relative w-fit h-fit flex flex-row gap-px cursor-sewingHS items-center justify-center"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenChains((prev) => ({
                    ...prev,
                    from: !prev.from,
                  }));
                }}
              >
                <div className="relative w-fit h-fit flex underline underline-offset-3">
                  {chains.from.name}
                </div>
                <div className="relative w-fit h-fit flex">
                  <TiArrowSortedDown color={context?.heartColor} size={15} />
                </div>
                {openChains.from && (
                  <Chain
                    chains={chains.from}
                    setChains={(chain) =>
                      setChains((prev) => ({
                        ...prev,
                        from: chain,
                      }))
                    }
                    setOpenChains={() =>
                      setOpenChains((prev) => ({
                        ...prev,
                        from: false,
                      }))
                    }
                  />
                )}
              </div>
            </div>
            <div className="relative w-fit h-fit flex">
              <div className="relative flex w-5 h-5 rounded-full">
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/QmZSDyGYYy9hn8RAUC1vZeZXC5y2H3YimzajJRngCTu5Fq`}
                  layout="fill"
                  draggable={false}
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
            </div>
            <div className="relative w-fit h-fit flex items-center justify-center gap-2">
              <div className="relative w-fit h-fit flex">
                {dict?.common?.dest}
              </div>
              <div
                className="relative w-fit h-fit flex flex-row gap-px cursor-sewingHS items-center justify-center"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenChains((prev) => ({
                    ...prev,
                    to: !prev.to,
                  }));
                }}
              >
                <div className="relative w-fit h-fit flex underline underline-offset-3">
                  {chains.to.name}
                </div>
                <div className="relative w-fit h-fit flex">
                  <TiArrowSortedDown color={context?.heartColor} size={15} />
                </div>
                {openChains.to && (
                  <Chain
                    chains={chains.to}
                    setChains={(chain) =>
                      setChains((prev) => ({
                        ...prev,
                        to: chain,
                      }))
                    }
                    setOpenChains={() =>
                      setOpenChains((prev) => ({
                        ...prev,
                        to: false,
                      }))
                    }
                  />
                )}
              </div>
            </div>
          </div>

          {(chains?.from?.id == 137 && chains?.to?.id == 232) ||
          (chains?.from?.id == 232 && chains?.to?.id == 137) ? (
            <div className="relative w-full h-fit flex flex-col gap-5 items-center justify-start">
              <div className="relative w-fit h-10 flex uppercase">
                {dict?.common?.coming}...
              </div>
            </div>
          ) : (
            <div className="relative w-full h-fit flex flex-row gap-3 items-center justify-center">
              <div className="relative w-fit h-fit flex">
                <input
                  className="relative rounded-md w-28 h-10 focus:outline-none flex border border-mainText text-sm p-3"
                  type="number"
                  min={0}
                  step={1}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>
              <div className="relative w-fit h-fit flex text-xl">$MONA</div>
            </div>
          )}
        </div>

        <div
          className={`relative w-fit h-fit flex ${
            !bridgeLoading && "cursor-sewingHS hover:opacity-70"
          }`}
          onClick={() =>
            !bridgeLoading &&
            (!isApproved ? handleApprove() : handleBridgeAmount())
          }
        >
          <div className="relative w-28 h-10 flex items-center justify-center rounded-md border border-mainText text-sm">
            {bridgeLoading ? (
              <AiOutlineLoading
                className="animate-spin"
                color={context?.heartColor}
                size={15}
              />
            ) : !isApproved ? (
              dict?.common?.approve
            ) : (
              dict?.common?.bridge
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bridge;
