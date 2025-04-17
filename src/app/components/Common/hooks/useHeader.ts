import { CHAINS, idiomaAIndice, Idiomas } from "@/app/lib/constants";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Chain } from "../../Bridge/types/bridge.types";

const useHeader = () => {
  const path = usePathname();

  const [chosenLanguage, setChosenLanguage] = useState<number>(
    idiomaAIndice[path.match(/(?<=\/)(en|es)(?=\/)/)?.[0] as Idiomas]
  );

  return {
    chosenLanguage,
    setChosenLanguage,

  };
};

export default useHeader;
