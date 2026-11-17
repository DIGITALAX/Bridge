import { CHAINS, MONA_DECIMALS, OAPP_ETH } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import { useContext, useEffect, useRef, useState } from "react";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { chains as lensChains } from "@lens-chain/sdk/viem";
import { useAccount, useConfig, useSwitchChain } from "wagmi";
import { getWalletClient } from "wagmi/actions";
import { Chain } from "../types/bridge.types";
import { addressToBytes32 } from "@/app/lib/helpers/addressToBytes32";
import { parseAmount } from "@/app/lib/helpers/parseAmount";
import {
  ALLOWANCE_ABI,
  APPROVE_ABI,
  BALANCE_ABI,
  QUOTE_SEND_ABI,
  SEND_ABI,
} from "@/app/lib/abis";

const useBridge = (dict: any) => {
  const context = useContext(ModalContext);
  const config = useConfig();
  const { chainId, address } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const refreshId = useRef<number>(0);
  const [amount, setAmount] = useState<string>("1");
  const [allowance, setAllowance] = useState<bigint | undefined>();
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

  const amountWei = parseAmount(amount, MONA_DECIMALS);
  const supported =
    (chains.from.id == 1 && chains.to.id == 232) ||
    (chains.from.id == 232 && chains.to.id == 1);
  const needsApproval = supported && chains.from.id == 1;
  const isApproved =
    !needsApproval ||
    (allowance !== undefined &&
      amountWei !== undefined &&
      allowance >= amountWei);

  const getSourceClient = () =>
    createPublicClient({
      chain: chains.from.id == 232 ? lensChains.mainnet : mainnet,
      transport:
        chains.from.id == 232
          ? http("https://rpc.lens.xyz")
          : http(
              `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
            ),
    });

  const readAllowance = async (
    publicClient: ReturnType<typeof getSourceClient>,
    owner: `0x${string}`
  ): Promise<bigint> => {
    return await publicClient.readContract({
      address: chains.from.address as `0x${string}`,
      abi: ALLOWANCE_ABI,
      functionName: "allowance",
      args: [owner, OAPP_ETH],
    });
  };

  const handleError = (err: any) => {
    console.error(err?.message);
    if (
      /user rejected|user denied|rejected the request/i.test(
        `${err?.shortMessage ?? ""} ${err?.message ?? ""}`
      )
    ) {
      return;
    }
    context?.setNotification?.(dict?.common?.error);
  };

  const handleBridgeCheck = async (): Promise<
    | {
        publicClient: ReturnType<typeof getSourceClient>;
        walletClient: Awaited<ReturnType<typeof getWalletClient>>;
        owner: `0x${string}`;
        value: bigint;
      }
    | undefined
  > => {
    if (!address) {
      return undefined;
    }

    if (chains.from.id == chains.to.id) {
      context?.setNotification?.(dict?.common?.chain);
      return undefined;
    }

    if (!supported) {
      return undefined;
    }

    if (amountWei === undefined) {
      context?.setNotification?.(dict?.common?.amount);
      return undefined;
    }

    const sourceId = chains.from.id as 1 | 232;

    if (chainId !== sourceId) {
      try {
        await switchChainAsync({ chainId: sourceId });
      } catch (err: any) {
        console.error(err?.message);
        context?.setNotification?.(dict?.common?.switch);
        return undefined;
      }
    }

    const walletClient = await getWalletClient(config, {
      chainId: sourceId,
      account: address,
    });

    const walletChainId = await walletClient.getChainId();

    if (
      walletChainId !== sourceId ||
      walletClient?.account?.address?.toLowerCase() !== address.toLowerCase()
    ) {
      context?.setNotification?.(dict?.common?.switch);
      return undefined;
    }

    const publicClient = getSourceClient();

    const code = await publicClient.getCode({ address });
    if (code && code !== "0x" && !code.toLowerCase().startsWith("0xef0100")) {
      context?.setNotification?.(dict?.common?.contract);
      return undefined;
    }

    const balance = await publicClient.readContract({
      address: chains.from.address as `0x${string}`,
      abi: BALANCE_ABI,
      functionName: "balanceOf",
      args: [address],
      account: address,
    });

    if (balance < amountWei) {
      context?.setNotification?.(dict?.common?.tokens);
      return undefined;
    }

    return { publicClient, walletClient, owner: address, value: amountWei };
  };

  const handleAllowance = async () => {
    const id = ++refreshId.current;

    if (!address || !needsApproval) {
      setAllowance(undefined);
      return;
    }

    try {
      const current = await readAllowance(getSourceClient(), address);
      if (id === refreshId.current) {
        setAllowance(current);
      }
    } catch (err: any) {
      console.error(err?.message);
      if (id === refreshId.current) {
        setAllowance(undefined);
      }
    }
  };

  const handleApprove = async () => {
    if (bridgeLoading) return;

    if (chains.from.id == chains.to.id) {
      context?.setNotification?.(dict?.common?.chain);
      return;
    }

    if (!needsApproval) {
      return;
    }

    setBridgeLoading(true);

    try {
      const checked = await handleBridgeCheck();
      if (!checked) {
        setBridgeLoading(false);
        return;
      }
      const { publicClient, walletClient, owner, value } = checked;

      const current = await readAllowance(publicClient, owner);
      refreshId.current++;
      setAllowance(current);

      if (current >= value) {
        setBridgeLoading(false);
        return;
      }

      const { request } = await publicClient.simulateContract({
        address: chains.from.address,
        abi: APPROVE_ABI,
        functionName: "approve",
        args: [OAPP_ETH, value],
        account: owner,
      });

      const res = await walletClient.writeContract(request);
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: res,
      });

      if (receipt.status !== "success") {
        throw new Error("Approval reverted");
      }

      const updated = await readAllowance(publicClient, owner);
      refreshId.current++;
      setAllowance(updated);
    } catch (err: any) {
      handleError(err);
    }

    setBridgeLoading(false);
  };

  const handleBridgeAmount = async () => {
    if (bridgeLoading) return;

    setBridgeLoading(true);

    try {
      const checked = await handleBridgeCheck();
      if (!checked) {
        setBridgeLoading(false);
        return;
      }
      const { publicClient, walletClient, owner, value } = checked;

      if (needsApproval) {
        const current = await readAllowance(publicClient, owner);
        refreshId.current++;
        setAllowance(current);

        if (current < value) {
          setBridgeLoading(false);
          return;
        }
      }

      const sendParam = {
        dstEid: chains.to.dstEid,
        to: addressToBytes32(owner) as `0x${string}`,
        amountLD: value,
        minAmountLD: (value * BigInt(95)) / BigInt(100),
        extraOptions: "0x" as `0x${string}`,
        composeMsg: "0x" as `0x${string}`,
        oftCmd: "0x" as `0x${string}`,
      };

      const oapp =
        chains.from.id == 232
          ? (chains.from.address as `0x${string}`)
          : OAPP_ETH;

      const feeQuote = await publicClient.readContract({
        address: oapp,
        abi: QUOTE_SEND_ABI,
        functionName: "quoteSend",
        args: [sendParam, false],
        account: owner,
      });

      const nativeFee = feeQuote.nativeFee;
      const lzTokenFee = feeQuote.lzTokenFee;

      const { request } = await publicClient.simulateContract({
        address: oapp,
        abi: SEND_ABI,
        functionName: "send",
        args: [sendParam, { nativeFee, lzTokenFee }, owner],
        value: nativeFee,
        account: owner,
      });

      const res = await walletClient.writeContract(request);
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: res,
      });

      if (receipt.status !== "success") {
        throw new Error("Bridge transaction reverted");
      }

      context?.setNotification?.(dict?.common?.bridging);
    } catch (err: any) {
      handleError(err);
    }

    await handleAllowance();
    setBridgeLoading(false);
  };

  useEffect(() => {
    handleAllowance();
  }, [address, chains.from.id, chains.to.id]);

  return {
    amount,
    setAmount,
    handleBridgeAmount,
    bridgeLoading,
    openChains,
    setOpenChains,
    handleApprove,
    isApproved,
    supported,
    chains,
    setChains,
  };
};

export default useBridge;
