"use client";
import {
  createContext,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { chains } from "@lens-chain/sdk/viem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mainnet, PublicClient } from "@lens-protocol/client";
import { polygon, mainnet as eth } from "viem/chains";
import { HEART_COLORS, THEME_COLORS } from "./lib/constants";
import { FullScreenVideo } from "./components/Common/types/common.types";

const queryClient = new QueryClient();

export const ModalContext = createContext<
  | {
      heartColor: string;
      setFullScreenVideo: (e: SetStateAction<FullScreenVideo>) => void;
      fullScreenVideo: FullScreenVideo;
      changeColor: () => void;
      rewind: RefObject<HTMLDivElement | null>;
      handleRewind: () => void;
      lensClient: PublicClient | undefined;
      notification: string | undefined;
      setNotification: (e: SetStateAction<string | undefined>) => void;
    }
  | undefined
>(undefined);

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "es" }];
}

export const config = createConfig(
  getDefaultConfig({
    appName: "DIGITALAX Bridge",
    walletConnectProjectId: process.env
      .NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
    appUrl: "https://bridge.digitalax.xyz",
    appIcon: "https://brige.digitalax.xyz/favicon.ico",
    chains: [chains.mainnet, polygon, eth],
    transports: {
      [chains.mainnet.id]: http("https://rpc.lens.xyz"),
      [polygon.id]: http(
        `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
      ),
      [eth.id]: http(
        `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
      ),
    },
    ssr: true,
  })
);

export default function Providers({ children }: { children: React.ReactNode }) {
  const rewind = useRef<null | HTMLDivElement>(null);
  const handleRewind = (): void => {
    rewind.current?.scrollIntoView({ behavior: "smooth" });
  };
  const [fullScreenVideo, setFullScreenVideo] = useState<FullScreenVideo>({
    open: false,
    allVideos: [],
    index: 0,
    volume: 0.5
  });
  const [lensClient, setLensClient] = useState<PublicClient | undefined>();
  const [notification, setNotification] = useState<string | undefined>();
  const [color, setColor] = useState<string>(THEME_COLORS[0]);
  const [heartColor, setHeartColor] = useState<string>(THEME_COLORS[0]);
  const changeColor = () => {
    if (THEME_COLORS.indexOf(color) < 9) {
      setColor(THEME_COLORS[THEME_COLORS.indexOf(color) + 1]);
      setHeartColor(HEART_COLORS[THEME_COLORS.indexOf(color) + 1]);
      localStorage.setItem(
        "digi-theme-color-bridge",
        THEME_COLORS[THEME_COLORS.indexOf(color) + 1]
      );
    } else {
      setColor(THEME_COLORS[0]);
      setHeartColor(HEART_COLORS[0]);
      localStorage.setItem("digi-theme-color-bridge", THEME_COLORS[0]);
    }
  };

  useEffect(() => {
    if (window) {
      const storageColor = localStorage.getItem("digi-theme-color-bridge");
      if (storageColor) {
        setColor(storageColor);
        setHeartColor(HEART_COLORS[THEME_COLORS.indexOf(storageColor)]);
      }
    }
  }, []);

  useEffect(() => {
    if (!lensClient) {
      setLensClient(
        PublicClient.create({
          environment: mainnet,
          storage: window.localStorage,
        })
      );
    }
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          customTheme={{
            "--ck-font-family": '"Nerd Semi", cursive',
          }}
        >
          <ModalContext.Provider
            value={{
              rewind,
              handleRewind,
              notification,
              setNotification,
              lensClient,
              heartColor,
              changeColor,
              fullScreenVideo,
              setFullScreenVideo,
            }}
          >
            <div
              className={`flex relative w-full h-full ${
                color ? `theme-${color}` : "theme-cream"
              }`}
            >
              {children}
            </div>
          </ModalContext.Provider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
