"use client";

import Head from "next/head";
import Bridge from "../../Bridge/modules/Bridge";
import Bar from "./Bar";
import useHeader from "../hooks/useHeader";
import { ModalContext } from "@/app/providers";
import { useContext } from "react";
import Transactions from "../../Bridge/modules/Transactions";

export default function Entry({ dict }: { dict: any }) {
  const context = useContext(ModalContext);
  const { chosenLanguage, setChosenLanguage, changeLanguage } = useHeader();
  return (
    <div
      className="w-full h-full flex flex-col gap-2 items-center justify-start py-4 px-3"
      ref={context?.rewind}
    >
      <div className="w-full h-full flex flex-col gap-12 items-center justify-start">
        <Bar
          dict={dict}
          setChosenLanguage={setChosenLanguage}
          chosenLanguage={chosenLanguage}
          changeLanguage={changeLanguage}
        />
        <Head>
          <title>DIGITALAX Bridge</title>
          <meta
            name="description"
            content="We write prompts, design styles & build code for protocol-ecosystems where web3 fashion & latent machines draw distances between ideas & reality closer each day."
          />
          <link rel="icon" href="/favicon.ico" />
          <meta property="og:site_name" content="DIGITALAX" />
          <meta
            property="og:image"
            content="https://bridge.digitalax.xyz/card.png/"
          />
          <meta property="og:type" content="website" />
        </Head>
        <Bridge dict={dict} />
        <Transactions dict={dict} />
      </div>
    </div>
  );
}
