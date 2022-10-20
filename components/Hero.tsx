import React, { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import contractInterface from "../contract-abi.json";
import { CustomButton } from "./CustomButton";

type Props = {};

function Hero({}: Props) {
  const [count, setCount] = useState(1);

  const { isConnected } = useAccount();
  const { config }: any = usePrepareContractWrite({
    address: "0xe8e322e5CA0a89dD522C6FedE9665056A286260c",
    args: [count],
    abi: contractInterface,
    functionName: "mint",
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

  const isMinted = txSuccess;

  return (
    <div className="md:h-screen bg-[#0a0504] flex flex-col px-[10vw] py-[10vh]">
      <div className="p-6"></div>
      <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
        <div className="basis-1/2">
          <img src="/BLURBEARS.png" alt="" className="" />
          <p className="text-lg font-semibold py-6 text-[#ff5600]">
            BLURBEARS: a collection of 7777 BlurBears released on Ethereum @
            0.0069 ETH per mint, 1 free per wallet.
          </p>
          <p className="text-lg font-semibold py-6 text-[#ff5600]">
            Sweep and sell exclusively on the blur.io marketplace to be eligible
            for the incoming $BLUR airdrops!
          </p>

          {isConnected ? (
            <div>
              <div className="flex gap-4 items-center">
                <button
                  onClick={() => setCount(Math.max(count - 1, 1))}
                  className="rounded-xl bg-white px-4 py-2 font-bold text-xl text-[#0a0504] bg-[#ff5600]"
                >
                  -
                </button>
                <h1 className="text-3xl font-bold text-[#ff5600]">{count}</h1>
                <button
                  onClick={() => setCount(Math.min(count + 1, 10))}
                  className="rounded-xl bg-white px-4 py-2 font-bold text-xl text-[#0a0504] bg-[#ff5600]"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => {
                  mint?.();
                }}
                className="rounded-xl bg-white px-10 py-4 font-bold text-xl my-4 shadow-xl uppercase text-[#0a0504] bg-[#ff5600]"
                disabled={isMintLoading}
                data-mint-loading={isMintLoading}
                data-mint-started={isMintStarted}
              >
                {isMintLoading && "Minting..."}
                {!isMintLoading && "Mint"}
              </button>
            </div>
          ) : (
            <div className="hidden">
              <div className="flex gap-4 items-center">
                <button className="rounded-xl bg-white px-4 py-2 font-bold text-xl">
                  -
                </button>
                <h1 className="text-3xl font-bold">{count}</h1>
                <button className="rounded-xl bg-white px-4 py-2 font-bold text-xl">
                  +
                </button>
              </div>
              <button
                onClick={() => {
                  mint?.();
                }}
                className="rounded-xl bg-white px-10 py-4 font-bold text-xl my-4 shadow-xl uppercase"
              >
                Mint
              </button>
            </div>
          )}

          {/* <ConnectButton /> */}
          <CustomButton />
          {isMinted && (
            <div className="text-lg font-semibold py-6 text-[#ff5600]">
              Transaction successful! Thanks for minting a Blur Bear!
            </div>
          )}
        </div>
        <div className="rounded-xl shadow-xl border-2 border-[#ff5600] p-6 basis-2/5">
          <img
            src="/blurbearnobg.png"
            alt=""
            className="rounded-xl shadow-xl"
          />
        </div>
      </div>
    </div>
  );
}

export default Hero;
