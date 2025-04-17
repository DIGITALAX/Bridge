"use client";

import { ModalContext } from "@/app/providers";
import { useContext } from "react";
import FullScreenVideo from "./FullScreenVideo";
import Notification from "./Notification";

export default function Modals() {
  const context = useContext(ModalContext);
  return (
    <>
      {context?.fullScreenVideo?.open && <FullScreenVideo />}
      {context?.notification && <Notification />}
    </>
  );
}
