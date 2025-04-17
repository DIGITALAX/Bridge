import { CHAINS, OAPP_ETH } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import { useModal } from "connectkit";
import { useContext, useState } from "react";
import {
  createPublicClient,
  createWalletClient,
  http,
  PublicClient,
  WalletClient,
} from "viem";
import { mainnet, polygon } from "viem/chains";
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

  const publicClient = createPublicClient({
    chain:
      chains.from.id == 232
        ? lensChains.mainnet
        : chains.from.id == 137
        ? polygon
        : mainnet,
    transport: http("https://rpc.lens.xyz"),
  });

  const handleBridgeCheck = async (
    publicClient: PublicClient
  ): Promise<boolean> => {
    if (!address) {
      return false;
    }
    if (chains.from == chains.to) {
      context?.setNotification?.(dict?.common?.chain);
      return false;
    }

    if (chainId !== chains.from.id) {
      openSwitchNetworks();
      return false;
    }

    try {
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
        context?.setNotification?.(dict?.common?.tokens);
        return false;
      }
    } catch (err: any) {
      console.error(err.message);
      return false;
    }

    return true;
  };

  const handleApprove = async () => {
    setBridgeLoading(true);

    try {
      const clientWallet = createWalletClient({
        chain:
          chains.from.id == 232
            ? lensChains.mainnet
            : chains.from.id == 137
            ? polygon
            : mainnet,
        transport: custom((window as any).ethereum),
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
            outputs: [{ internalType: "bool", name: "success", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        functionName: "approve",
        args: [
          chains.from.id == 1 ? OAPP_ETH : chains.from.address,
          BigInt(amount),
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

  const handleBridgeEthPoly = async (walletClient: WalletClient) => {
    try {
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleBridgeEthLens = async (walletClient: WalletClient) => {
    try {
      const sendParam = {
        dstEid: chains.from.dstEid,
        to: addressToBytes32(
          "0xAA3e5ee4fdC831e5274FE7836c95D670dC2502e6"
        ) as `0x${string}`,
        amountLD: BigInt("1000000000000000"),
        minAmountLD: BigInt("299950000000000"),
        extraOptions: "0x" as `0x${string}`,
        composeMsg: "0x" as `0x${string}`,
        oftCmd: "0x" as `0x${string}`,
      };

      const feeQuote = await publicClient.readContract({
        address: chains.from.address as `0x${string}`,
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
                name: "msgFee",
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
        address: chains.from.address,
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

      const res = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleBridgeAmount = async () => {
    setBridgeLoading(true);

    if (!(await handleBridgeCheck(publicClient))) {
      setBridgeLoading(false);
      return;
    }

    const clientWallet = createWalletClient({
      chain:
        chains.from.id == 232
          ? lensChains.mainnet
          : chains.from.id == 137
          ? polygon
          : mainnet,
      transport: custom((window as any).ethereum),
    });

    try {
      if (chains.from.id == 137 || chains.to.id == 137) {
        await handleBridgeEthPoly(clientWallet);
      } else {
        await handleBridgeEthLens(clientWallet);
      }

      setIsApproved(false);
      context?.setNotification?.(dict?.common?.bridging);
    } catch (err: any) {
      console.error(err.message);
    }
    setBridgeLoading(false);
  };

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
