import { CHAINS, OAPP_ETH } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import { useModal } from "connectkit";
import { useContext, useEffect, useState } from "react";
import {
  createPublicClient,
  createWalletClient,
  http,
  WalletClient,
} from "viem";
import { mainnet } from "viem/chains";
import { chains as lensChains } from "@lens-chain/sdk/viem";
import { custom, useAccount } from "wagmi";
import { Chain } from "../types/bridge.types";
import { addressToBytes32 } from "@/app/lib/helpers/addressToBytes32";

const useBridge = (dict: any) => {
  const { openSwitchNetworks } = useModal();
  const context = useContext(ModalContext);
  const { chainId, address } = useAccount();
  const [amount, setAmount] = useState<number>(1);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [bridgeLoading, setBridgeLoading] = useState<boolean>(false);
  const [openChains, setOpenChains] = useState<{ from: boolean; to: boolean }>({
    from: false,
    to: false,
  });
  const [chains, setChains] = useState<{
    from: Chain;
    to: Chain;
  }>({
    from: CHAINS[0],
    to: CHAINS[1],
  });

  const handleBridgeCheck = async (): Promise<boolean> => {
    if (!address) {
      return false;
    }
    if (chains.from == chains.to) {
      context?.setNotification?.(dict?.common?.chain);
      return false;
    }

    if (chains.from.id == 137 || chains.to.id == 137) {
      return false;
    }

    if (chainId !== chains.from.id) {
      openSwitchNetworks();
      return false;
    }

    try {
      if (!(await handleBalance())) {
        context?.setNotification?.(dict?.common?.tokens);

        return false;
      }
    } catch (err: any) {
      console.error(err.message);
      return false;
    }

    return true;
  };

  const handleBalance = async () => {
    try {
      const publicClient = createPublicClient({
        chain: chains.from.id == 232 ? lensChains.mainnet : mainnet,
        transport:
          chains.from.id == 232
            ? http("https://rpc.lens.xyz")
            : http(
                `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
              ),
      });
      const balance = await publicClient.readContract({
        address: chains.from.address as `0x${string}`,
        abi: [
          {
            constant: true,
            inputs: [
              {
                name: "_owner",
                type: "address",
              },
            ],
            name: "balanceOf",
            outputs: [
              {
                name: "balance",
                type: "uint256",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
        ],
        functionName: "balanceOf",
        args: [address as `0x${string}`],
        account: address,
      });

      if (balance < BigInt(amount * 10 ** 18)) {
        setIsApproved(false);
        return false;
      } else {
        setIsApproved(true);
        return true;
      }
    } catch (err: any) {
      console.error(err.message);
      return false;
    }
  };

  const handleApprove = async () => {
    if (chains.from == chains.to) {
      context?.setNotification?.(dict?.common?.chain);
    }

    if (chainId !== chains.from.id) {
      openSwitchNetworks();
    }

    setBridgeLoading(true);

    try {
      const clientWallet = createWalletClient({
        chain: chains.from.id == 232 ? lensChains.mainnet : mainnet,
        transport: custom((window as any).ethereum),
      });

      const publicClient = createPublicClient({
        chain: chains.from.id == 232 ? lensChains.mainnet : mainnet,
        transport:
          chains.from.id == 232
            ? http("https://rpc.lens.xyz")
            : http(
                `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
              ),
      });
      const { request } = await publicClient.simulateContract({
        address: chains.from.address,
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "tokens",
                type: "uint256",
              },
            ],
            name: "approve",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        functionName: "approve",
        args: [
          chains.from.id == 1 ? OAPP_ETH : chains.from.address,
          BigInt(amount * 10 ** 18),
        ],
        account: address,
      });

      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });

      setIsApproved(true);
    } catch (err: any) {
      console.error(err.message);
    }

    setBridgeLoading(false);
  };

  const handleBridgeAmount = async () => {
    setBridgeLoading(true);

    if (!(await handleBridgeCheck())) {
      setBridgeLoading(false);
      return;
    }

    const clientWallet = createWalletClient({
      chain: chains.from.id == 232 ? lensChains.mainnet : mainnet,
      transport: custom((window as any).ethereum),
    });

    try {
      const sendParam = {
        dstEid: chains.to.dstEid,
        to: addressToBytes32(address!) as `0x${string}`,
        amountLD: BigInt(amount * 10 ** 18),
        minAmountLD: BigInt(0.95 * amount * 10 ** 18),
        extraOptions: "0x" as `0x${string}`,
        composeMsg: "0x" as `0x${string}`,
        oftCmd: "0x" as `0x${string}`,
      };
      const publicClient = createPublicClient({
        chain: chains.from.id == 232 ? lensChains.mainnet : mainnet,
        transport:
          chains.from.id == 232
            ? http("https://rpc.lens.xyz")
            : http(
                `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
              ),
      });
      const feeQuote = await publicClient.readContract({
        address:
          chains.from.id == 232
            ? (chains.from.address as `0x${string}`)
            : OAPP_ETH,
        abi: [
          {
            type: "function",
            name: "quoteSend",
            inputs: [
              {
                name: "_sendParam",
                type: "tuple",
                internalType: "struct SendParam",
                components: [
                  { name: "dstEid", type: "uint32", internalType: "uint32" },
                  { name: "to", type: "bytes32", internalType: "bytes32" },
                  {
                    name: "amountLD",
                    type: "uint256",
                    internalType: "uint256",
                  },
                  {
                    name: "minAmountLD",
                    type: "uint256",
                    internalType: "uint256",
                  },
                  {
                    name: "extraOptions",
                    type: "bytes",
                    internalType: "bytes",
                  },
                  { name: "composeMsg", type: "bytes", internalType: "bytes" },
                  { name: "oftCmd", type: "bytes", internalType: "bytes" },
                ],
              },
              { name: "_payInLzToken", type: "bool", internalType: "bool" },
            ],
            outputs: [
              {
                name: "",
                type: "tuple",
                components: [
                  { name: "nativeFee", type: "uint256" },
                  { name: "lzTokenFee", type: "uint256" },
                ],
              },
            ],
            stateMutability: "view",
          },
        ],
        functionName: "quoteSend",
        args: [sendParam, false],
        account: address,
      });

      const nativeFee = feeQuote.nativeFee;
      const lzTokenFee = feeQuote.lzTokenFee;


      const { request } = await publicClient.simulateContract({
        address:
          chains.from.id == 232
            ? (chains.from.address as `0x${string}`)
            : OAPP_ETH,
        abi: [
          {
            type: "function",
            name: "send",
            inputs: [
              {
                name: "_sendParam",
                type: "tuple",
                internalType: "struct SendParam",
                components: [
                  { name: "dstEid", type: "uint32", internalType: "uint32" },
                  { name: "to", type: "bytes32", internalType: "bytes32" },
                  {
                    name: "amountLD",
                    type: "uint256",
                    internalType: "uint256",
                  },
                  {
                    name: "minAmountLD",
                    type: "uint256",
                    internalType: "uint256",
                  },
                  {
                    name: "extraOptions",
                    type: "bytes",
                    internalType: "bytes",
                  },
                  { name: "composeMsg", type: "bytes", internalType: "bytes" },
                  { name: "oftCmd", type: "bytes", internalType: "bytes" },
                ],
              },
              {
                name: "_fee",
                type: "tuple",
                internalType: "struct MessagingFee",
                components: [
                  {
                    name: "nativeFee",
                    type: "uint256",
                    internalType: "uint256",
                  },
                  {
                    name: "lzTokenFee",
                    type: "uint256",
                    internalType: "uint256",
                  },
                ],
              },
              {
                name: "_refundAddress",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "msgReceipt",
                type: "tuple",
                internalType: "struct MessagingReceipt",
                components: [
                  { name: "guid", type: "bytes32", internalType: "bytes32" },
                  { name: "nonce", type: "uint64", internalType: "uint64" },
                  {
                    name: "fee",
                    type: "tuple",
                    internalType: "struct MessagingFee",
                    components: [
                      {
                        name: "nativeFee",
                        type: "uint256",
                        internalType: "uint256",
                      },
                      {
                        name: "lzTokenFee",
                        type: "uint256",
                        internalType: "uint256",
                      },
                    ],
                  },
                ],
              },
              {
                name: "oftReceipt",
                type: "tuple",
                internalType: "struct OFTReceipt",
                components: [
                  {
                    name: "amountSentLD",
                    type: "uint256",
                    internalType: "uint256",
                  },
                  {
                    name: "amountReceivedLD",
                    type: "uint256",
                    internalType: "uint256",
                  },
                ],
              },
            ],
            stateMutability: "payable",
          },
        ],
        functionName: "send",
        args: [sendParam, { nativeFee, lzTokenFee }, address!],
        value: nativeFee,
        account: address,
      });

      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });

      setIsApproved(false);
      context?.setNotification?.(dict?.common?.bridging);
    } catch (err: any) {
      console.error(err.message);
    }
    setBridgeLoading(false);
  };

  useEffect(() => {
    if (address && amount > 0) {
      handleBalance();
    }
  }, [address, amount]);

  return {
    amount,
    setAmount,
    handleBridgeAmount,
    bridgeLoading,
    openChains,
    setOpenChains,
    handleApprove,
    isApproved,
    chains,
    setChains,
  };
};

export default useBridge;
