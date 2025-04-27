import {  idiomaAIndice, Idiomas } from "@/app/lib/constants";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const useHeader = () => {
  const path = usePathname();
  const router = useRouter();

  const [chosenLanguage, setChosenLanguage] = useState<number>(
    idiomaAIndice[path.match(/(?<=\/)(en|es)(?=\/)/)?.[0] as Idiomas]
  );

  const changeLanguage = (lang: string) => {
    const segments = path.split("/");
    segments[1] = lang;
    const newPath = segments.join("/");

    document.cookie = `NEXT_LOCALE=${lang}; path=/; SameSite=Lax`;

    router.push(newPath);
  };

  return {
    chosenLanguage,
    setChosenLanguage,
    changeLanguage,
  };
};

export default useHeader;
