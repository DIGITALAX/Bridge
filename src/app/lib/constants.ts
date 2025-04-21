import { Chain } from "../components/Bridge/types/bridge.types";

export const INFURA_GATEWAY: string = "https://thedial.infura-ipfs.io";
export const CHROMADIN: `0x${string}` =
  "0x16a362A10C1f6Bc0565C8fFAd298f1c2761630C5";
export const LAYER_ZERO: string =
  "https://scan.layerzero-api.com/v1/messages/wallet/";
export const OAPP_ETH: `0x${string}` =
  "0xeB50d8181cEd62CeE237B9729fe597F3B2526eb7";

export const idToImage: { [key in number]: string } = {
  [30101]: "QmYJ6cpGRgQAr2d5hJDJ9CaJukt2szcHc1AqFBy9m6knUw",
  [30373]: "QmYCDxCv7mJyjn49n84kP6d3ADgGp422ukKzRyd2ZcGEsW",
  [0]: "QmVGXLdFvTxRhPB9Vc57GHHFDcVfd1YLUjdSVFSjMwRzSa",
};

export const idToExplorer: { [key in number]: string } = {
  [30373]: "https://explorer.lens.xyz/tx/",
  [30101]: "https://etherscan.io/tx/",
};

export const CHAINS: Chain[] = [
  {
    name: "Ethereum",
    id: 1,
    address: "0x275f5Ad03be0Fa221B4C6649B8AeE09a42D9412A",
    dstEid: 30101,
    image: "QmYJ6cpGRgQAr2d5hJDJ9CaJukt2szcHc1AqFBy9m6knUw",
  },
  {
    name: "Lens",
    id: 232,
    address: "0x28547B5b6B405A1444A17694AC84aa2d6A03b3Bd",
    dstEid: 30373,
    image: "QmYCDxCv7mJyjn49n84kP6d3ADgGp422ukKzRyd2ZcGEsW",
  },
  {
    name: "Polygon",
    id: 137,
    address: "0x6968105460f67c3bf751be7c15f92f5286fd0ce5",
    dstEid: 0,
    image: "QmVGXLdFvTxRhPB9Vc57GHHFDcVfd1YLUjdSVFSjMwRzSa",
  },
];

export const THEME_COLORS = [
  "cream",
  "dark",
  "blue",
  "green",
  "purple",
  "heart",
  "plum",
  "lime",
  "sea",
  "hot",
];
export const HEART_COLORS = [
  "#131313",
  "#FAF4E8",
  "#FAF4E8",
  "#131313",
  "#4b0082",
  "#2f25a7",
  "#3cfdf6",
  "#090d12",
  "#c3e0c3",
  "#ce02cb",
];

export enum Idiomas {
  Ingles = "en",
  Español = "es",
  Árabe = "ع",
  Hebreo = "א",
  Portugués = "br",
  Ucraniano = "ук",
  Farsi = "د",
  Japonés = "あ",
  Yiddish = "yi",
  Francés = "fr",
  Turco = "ç",
  Húngaro = "ű",
  Yolŋu = "ŋ",
}

export const idiomaAImagen: { [key in Idiomas]: string } = {
  ["en"]: "QmXdyvCYjZ7FkPjgFX5BPi98WTpPdJT5FHhzhtbyzkJuNs",
  ["es"]: "QmY43U5RovVkoGrkLiFyA2VPMnGxf5e3NgYZ95u9aNJdem",
  ["ع"]: "Qmb2rQi84hLXtiY673VaBHMTB32Lo1Xe1ah4Q7mG2fKf4J",
  ["א"]: "Qmdyd6iUPYNruEi5BJaYnoJ8H4FDwqxJF4EAzLvYZfxgXE",
  ["br"]: "QmQce4gWKLj9xWySjxUVsHKorX5rDL45JiaU4y1TBqjLVa",
  ["ук"]: "QmW1QzS8AfYEaV4Kc6YtwXSUXRUatP6VozLy1HB61DTy27",
  ["د"]: "QmTchZ7B2vrTnkKKBpqoYcmLQ8H9wxiNet7DWtmQeVzMdM",
  ["あ"]: "QmYz9Van9EVEZSLcnbMXS9bG5FzuL3jvEe5Hy5fcs361RK",
  ["yi"]: "QmVjE8UDvswAGXRCVFdqzwAHAMTjS1UjotfojFMqxWaVdg",
  ["fr"]: "QmNZgw6NCiV4wU9h1R5DkaZGWwHXVKthRP45xtQYy4wtp5",
  ["ç"]: "QmNUBhcEpjjyHnsoR4ViowP3oNvh4trZ5H6snFD7Hm1hdy",
  ["ű"]: "QmSJJkCDMN3bTdD3T6j1B2hfCzhnycpbitYAfMsSKNUohd",
  ["ŋ"]: "Qmf11oxoyAe5vUbZAwHSTCCfRSWTMYijruBeABLrW4rhp7",
};

export const indiceAIdioma: { [key in number]: string } = {
  [0]: "en",
  [1]: "es",
  [2]: "ع",
  [3]: "א",
  [4]: "br",
  [5]: "ук",
  [6]: "د",
  [7]: "あ",
  [8]: "yi",
  [9]: "fr",
  [10]: "ç",
  [11]: "ű",
  [12]: "ŋ",
};

export const idiomaAIndice: { [key in Idiomas]: number } = {
  ["en"]: 0,
  ["es"]: 1,
  ["ع"]: 2,
  ["א"]: 3,
  ["br"]: 4,
  ["ук"]: 5,
  ["د"]: 6,
  ["あ"]: 7,
  ["yi"]: 8,
  ["fr"]: 9,
  ["ç"]: 10,
  ["ű"]: 11,
  ["ŋ"]: 12,
};

export const LOCALES: string[] = ["en", "es"];
