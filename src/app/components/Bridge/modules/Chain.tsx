import { CHAINS } from "@/app/lib/constants";
import { FunctionComponent, JSX } from "react";
import { ChainProps } from "../types/bridge.types";

const Chain: FunctionComponent<ChainProps> = ({
  chains,
  setChains,
  setOpenChains,
}): JSX.Element => {
  return (
    <div className="absolute -bottom-16 bg-mainBg w-fit h-fit flex items-center justify-center z-10">
      <div className="relative w-28 text-sm flex items-center justify-center h-fit flex-col border border-mainText rounded-md">
        {CHAINS.filter((ch) => ch !== chains).map((chain, indice) => {
          return (
            <div
              key={indice}
              className={`hover:opacity-70 p-1 cursor-sewingHS relative w-full items-center justify-center h-fit flex uppercase ${
                indice !== 0 && "border-t"
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setChains(chain);
                setOpenChains();
              }}
            >
              {chain.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Chain;
