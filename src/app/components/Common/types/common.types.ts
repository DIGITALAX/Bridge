import { Post } from "@lens-protocol/client";
import { SetStateAction } from "react";

export type FooterProps = {
  dict: any;
};

export type HeartProps = {
  changeColor?: () => void;
  heartColor: string;
};

export type BarProps = {
  dict: any;
  setChosenLanguage: (e: SetStateAction<number>) => void;
  chosenLanguage: number;
  changeLanguage: (lang: string) => void;

};

export type HeaderProps = {
  dict: any;
};

export interface FullScreenVideo {
  open: boolean;
  time?: number;
  duration?: number;
  isPlaying?: boolean;
  volume?: number;
  volumeOpen?: boolean;
  allVideos: Post[];
  cursor?: string | undefined;
  index: number;
}
