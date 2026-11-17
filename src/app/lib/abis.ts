export const BALANCE_ABI = [
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
] as const;

export const ALLOWANCE_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const APPROVE_ABI = [
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
] as const;

export const QUOTE_SEND_ABI = [
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
] as const;

export const SEND_ABI = [
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
] as const;
