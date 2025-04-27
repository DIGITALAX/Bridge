import {
  idiomaAImagen,
  Idiomas,
  indiceAIdioma,
  INFURA_GATEWAY,
} from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext } from "react";
import {
  PiArrowFatLinesLeftFill,
  PiArrowFatLinesRightFill,
} from "react-icons/pi";
import Heart from "./Heart";
import { BarProps } from "../types/common.types";
import { useAccount } from "wagmi";
import { useModal } from "connectkit";

const Bar: FunctionComponent<BarProps> = ({
  dict,
  setChosenLanguage,
  chosenLanguage,
  changeLanguage
}): JSX.Element => {
  const context = useContext(ModalContext);
  const { isConnected } = useAccount();
  const { openOnboarding, openProfile } = useModal();

  return (
    <div className="relative w-full h-fit flex sm:flex-nowrap flex-wrap flex-row gap-4 justify-center sm:justify-between items-center">
      <div className="relative w-full h-fit flex flex-row gap-4 items-center justify-center sm:justify-start">
        <div className="relative w-fit h-fit flex items-center justify-center">
          <div
            className={`border border-2 rounded-md text-sm w-fit h-fit px-5 py-2 flex items-center justify-center cursor-sewingHS border-mainText font-firaL`}
            onClick={() => (!isConnected ? openOnboarding() : openProfile())}
          >
            {!isConnected ? dict?.common?.connect : dict?.common?.disconnect}
          </div>
        </div>
        <div className="relative w-fit h-fit flex flex-col sm:flex-row items-center justify-center gap-2">
          <div
            className={`relative w-fit h-fit flex items-center justify-center hover:-rotate-12 cursor-sewingHS`}
            onClick={() => {
              context?.setFullScreenVideo({
                open: context?.fullScreenVideo?.open ? false : true,
                time: context?.fullScreenVideo?.time,
                duration: context?.fullScreenVideo?.duration,
                isPlaying: context?.fullScreenVideo?.isPlaying,
                volume: context?.fullScreenVideo?.volume,
                volumeOpen: context?.fullScreenVideo?.volumeOpen,
                allVideos: context?.fullScreenVideo?.allVideos,
                cursor: context?.fullScreenVideo?.cursor,
                index: context?.fullScreenVideo?.index,
              });
            }}
          >
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmYVHgyAQLxcoP5o23n3jXNnA9N9C93WqpM2heAegty7hU`}
              height={20}
              width={60}
              priority
              draggable={false}
            />
          </div>
          <div className="relative w-fit h-fit items-center justify-center flex whitespace-nowrap font-firaL">
            {dict?.common?.bend}
          </div>
        </div>
      </div>
      <div className="relative w-full h-fit flex mr-0 flex-row gap-4 items-center justify-center sm:justify-end">
        <div className="relative w-fit h-fit flex items-center justify-center flex flex-row gap-3">
          <div className="relative w-fit h-fit flex items-center justify-center flex-col text-center font-pot uppercase">
            <div className="text-base flex items-center justify-center">
              {dict?.common?.select}
            </div>
            <div className="relative w-fit h-fit flex items-center justify-center flex-row gap-2">
              <div
                className="relative flex items-center justify-center w-fit h-fit active:scale-95 cursor-sewingHS"
                onClick={() =>
                  setChosenLanguage((prev) =>
                    prev > 0 ? prev - 1 : Object.keys(idiomaAImagen).length - 1
                  )
                }
              >
                <PiArrowFatLinesLeftFill size={20} />
              </div>
              <div className="relative w-fit h-fit flex items-center justify-center">
                {indiceAIdioma[chosenLanguage]}
              </div>
              <div
                className="relative flex items-center justify-center w-fit h-fit active:scale-95 cursor-sewingHS"
                onClick={() =>
                  setChosenLanguage((prev) =>
                    prev < Object.keys(idiomaAImagen).length - 1 ? prev + 1 : 0
                  )
                }
              >
                <PiArrowFatLinesRightFill size={20} />
              </div>
            </div>
            <div
              onClick={() => {
                if (chosenLanguage === 0 || chosenLanguage === 1) {
                  changeLanguage(indiceAIdioma[chosenLanguage]);
                }
              }}
              className={`text-xxs flex items-center justify-center px-2 border border-mainText rounded-sm h-6 w-full ${
                (chosenLanguage === 0 || chosenLanguage === 1) &&
                "cursor-sewingHS active:scale-95"
              }`}
            >
              ~*{" "}
              {chosenLanguage !== 0 && chosenLanguage !== 1
                ? dict?.common?.soon
                : dict?.common?.ve}{" "}
              *~
            </div>
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center">
            <div className="relative w-8 h-10 flex items-center justify-center">
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/${
                  idiomaAImagen[indiceAIdioma[chosenLanguage] as Idiomas]
                }`}
                draggable={false}
              />
            </div>
          </div>
        </div>
        <div className="relative w-fit h-fit flex items-center justify-center">
          <Heart
            changeColor={() => context?.changeColor()}
            heartColor={context?.heartColor!}
          />
        </div>
      </div>
    </div>
  );
};

export default Bar;
