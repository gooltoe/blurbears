import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useContractRead,
} from "wagmi";
import contractInterface from "../contract-abi.json";
import { CustomButton } from "./CustomButton";

type Props = {};

const contract = "0xe5a1de87a0f03adc2cb0fb6d84898bd0d01d03e0";

function Hero({}: Props) {
  const [count, setCount] = useState(1);
  const [totalMinted, setTotalMinted] = useState(0);
  const [live, setSaleLive] = useState(false);

  const { isConnected, address } = useAccount();

  let { config }: any = usePrepareContractWrite({
    address: contract,
    args: [count],
    abi: contractInterface,
    functionName: "mint",
    overrides: {
      from: address,
      value: ethers.utils.parseEther("0.0069"),
    },
  });

  const {
    data: mintData,
    write: mint,
    isLoading: isMintLoading,
    isSuccess: isMintStarted,
  } = useContractWrite(config);

  const { isSuccess: txSuccess } = useWaitForTransaction({
    hash: mintData?.hash,
  });

  const { data: totalSupplyData } = useContractRead({
    address: contract,
    abi: contractInterface,
    functionName: "totalSupply",
    watch: true,
  });

  const { data: saleActive } = useContractRead({
    address: contract,
    abi: contractInterface,
    functionName: "saleActive",
    watch: true,
  });

  const isMinted = txSuccess;

  useEffect(() => {
    if (totalSupplyData) {
      setTotalMinted((totalSupplyData as any).toNumber());
      if ((totalSupplyData as any).toNumber() >= 3333) {
        setSaleLive(false);
      }
    }
  }, [totalSupplyData]);

  useEffect(() => {
    if (saleActive) {
      setSaleLive(saleActive as any);
    }
  }, [saleActive]);

  return (
    <div className=" bg-[#0a0504] flex flex-col px-[10vw] py-[10vh]">
      <div className="p-6"></div>
      <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
        <div className="basis-1/2">
          <img src="/BLURBEARS.png" alt="" className="" />
          <p className="text-lg font-semibold text-[#ff5600]">
            BLURBEARS: a collection of 3333 BLURBEARS released on Ethereum @
            0.0069 ETH per mint. 5 per tx, 10 per wallet.
          </p>
          <p className="text-lg font-semibold py-6 text-[#ff5600]">
            Sweep and sell exclusively on the blur.io marketplace to be eligible
            for the incoming $BLUR airdrops!
          </p>
          <p className="text-lg font-semibold text-[#ff5600]">
            Disclaimer: BLURBEARS cannot be listed on Opensea, LooksRare,
            Sudoswap, or X2Y2. Please use{" "}
            <a href="https://blur.io/" className="underline">
              blur.io
            </a>
            .
          </p>

          <div className="flex gap-4 py-2 pb-4 items-center">
            <div className="w-8">
              <a
                href="https://twitter.com/BlurBears"
                target="_blank"
                rel="noreferrer"
              >
                <img src="/twitter.png" alt="" />
              </a>
            </div>
            <div className="w-8">
              <a href="https://etherscan.io/" target="_blank" rel="noreferrer">
                <img src="/etherscan.png" alt="" />
              </a>
            </div>
            <div className="w-16">
              <a
                href="https://blur.io/collection/blurbears"
                target="_blank"
                rel="noreferrer"
              >
                <img src="/logo.gif" alt="" />
              </a>
            </div>
          </div>

          {isConnected ? (
            <div>
              <p className="text-xl font-bold pb-2 text-[#ff5600]">
                {totalMinted}/3333 minted!
              </p>
              <div className="flex gap-4 items-center">
                <button
                  onClick={() => setCount(Math.max(count - 1, 1))}
                  className="rounded-xl px-4 py-2 font-bold text-xl text-[#0a0504] bg-[#ff5600]"
                >
                  -
                </button>
                <h1 className="text-3xl font-bold text-[#ff5600]">{count}</h1>
                <button
                  onClick={() => setCount(Math.min(count + 1, 5))}
                  className="rounded-xl px-4 py-2 font-bold text-xl text-[#0a0504] bg-[#ff5600]"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => {
                  mint?.();
                }}
                className="rounded-xl px-10 py-4 font-bold text-xl my-4 shadow-xl uppercase text-[#0a0504] bg-[#ff5600]"
                disabled={isMintLoading || !saleActive}
                data-mint-loading={isMintLoading}
                data-mint-started={isMintStarted}
              >
                {isMintLoading && "Minting..."}
                {!isMintLoading && "Mint "}
                {!saleActive && "Not Live"}
              </button>
            </div>
          ) : (
            // <div>
            //   <p className="text-xl font-bold pb-2 text-[#ff5600]">
            //     {totalMinted}/3333 minted!
            //   </p>
            //   <div className="flex gap-4 items-center">
            //     <button
            //       onClick={() => setCount(Math.max(count - 1, 1))}
            //       className="rounded-xl px-4 py-2 font-bold text-xl text-[#0a0504] bg-[#ff5600]"
            //     >
            //       -
            //     </button>
            //     <h1 className="text-3xl font-bold text-[#ff5600]">{count}</h1>
            //     <button
            //       onClick={() => setCount(Math.min(count + 1, 5))}
            //       className="rounded-xl px-4 py-2 font-bold text-xl text-[#0a0504] bg-[#ff5600]"
            //     >
            //       +
            //     </button>
            //   </div>
            //   <button
            //     onClick={() => {
            //       mint?.();
            //     }}
            //     className="rounded-xl px-10 py-4 font-bold text-xl my-4 shadow-xl uppercase text-[#0a0504] bg-[#ff5600]"
            //     disabled={isMintLoading}
            //     data-mint-loading={isMintLoading}
            //     data-mint-started={isMintStarted}
            //   >
            //     {isMintLoading && "Minting..."}
            //     {!isMintLoading && "Mint"}
            //   </button>
            // </div>
            ""
          )}

          {/* <ConnectButton /> */}
          <CustomButton />
          {isMinted && (
            <div className="text-lg font-semibold py-6 text-[#ff5600]">
              Transaction successful! Thanks for minting a BlurBear! {isMinted}
            </div>
          )}
        </div>
        <div className="rounded-xl shadow-xl border-2 border-[#ff5600] p-6 basis-2/5">
          <img src="/blurtest.gif" alt="" className="rounded-xl shadow-xl" />
        </div>
      </div>
    </div>
  );
}

export default Hero;
