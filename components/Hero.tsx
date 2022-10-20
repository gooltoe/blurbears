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

const contract = "0x480117EC34d3070FAA3DAA862FF3DD2C8881F670";

function Hero({}: Props) {
  const [count, setCount] = useState(1);
  const [totalMinted, setTotalMinted] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);

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

  const { data: maxSupplyData } = useContractRead({
    address: contract,
    abi: contractInterface,
    functionName: "maxSupply",
  });

  const { data: costData } = useContractRead({
    address: contract,
    abi: contractInterface,
    functionName: "cost",
  });

  const isMinted = txSuccess;

  useEffect(() => {
    if (totalSupplyData) {
      setTotalMinted((totalSupplyData as any).toNumber());
    }
  }, [totalSupplyData]);

  useEffect(() => {
    if (maxSupplyData) {
      setMaxSupply((maxSupplyData as any).toNumber());
    }
  }, [maxSupplyData]);

  return (
    <div className=" bg-[#0a0504] flex flex-col px-[10vw] pb-[10vh]">
      <div className="p-6"></div>
      <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
        <div className="basis-1/2">
          <img src="/BLURBEARS.png" alt="" className="" />
          <p className="text-lg font-semibold text-[#ff5600]">
            BLURBEARS: a collection of {maxSupply} BlurBears released on
            Ethereum @ 0.0069 ETH per mint, 1 free per wallet.
          </p>
          <p className="text-lg font-semibold py-6 text-[#ff5600]">
            Sweep and sell exclusively on the blur.io marketplace to be eligible
            for the incoming $BLUR airdrops!
          </p>

          {isConnected ? (
            <div>
              <p className="text-xl font-bold pb-2 text-[#ff5600]">
                {totalMinted}/{maxSupply} minted!
              </p>
              <div className="flex gap-4 items-center">
                <button
                  onClick={() => setCount(Math.max(count - 1, 1))}
                  className="rounded-xl bg-white px-4 py-2 font-bold text-xl text-[#0a0504] bg-[#ff5600]"
                >
                  -
                </button>
                <h1 className="text-3xl font-bold text-[#ff5600]">{count}</h1>
                <button
                  onClick={() => setCount(Math.min(count + 1, 5))}
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
