import React, { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import contractInterface from "../contract-abi.json";

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
    <div className="md:h-screen bg-blue-300 flex px-[10vw] py-[10vh]">
      <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
        <div className="basis-1/2">
          <h1 className="font-bold text-3xl uppercase">blur bear</h1>
          <p className="text-lg font-semibold py-6">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            placeat possimus tempore deserunt dolores? Impedit itaque, officiis
            et ab sapiente repellendus obcaecati officia nemo vero?
          </p>

          {isConnected ? (
            <div>
              <div className="flex gap-4 items-center">
                <button
                  onClick={() => setCount(Math.max(count - 1, 1))}
                  className="rounded-xl bg-white px-4 py-2 font-bold text-xl"
                >
                  -
                </button>
                <h1 className="text-3xl font-bold">{count}</h1>
                <button
                  onClick={() => setCount(Math.min(count + 1, 10))}
                  className="rounded-xl bg-white px-4 py-2 font-bold text-xl"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => {
                  mint?.();
                }}
                className="rounded-xl bg-white px-10 py-4 font-bold text-xl my-4 shadow-xl uppercase"
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

          <ConnectButton />
          {isMinted && (
            <div className="text-lg font-semibold py-6">
              Transaction successful! Thanks for minting a Blur Bear!
            </div>
          )}
        </div>
        <div className="">
          <img src="/bear.png" alt="" />
        </div>
      </div>
    </div>
  );
}

export default Hero;
