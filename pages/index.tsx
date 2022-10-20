import type { NextPage } from "next";
import Head from "next/head";
import Hero from "../components/Hero";

const Home: NextPage = () => {
  return (
    <div className="h-screen bg-[#0a0504]">
      <Head>
        <title>BLURBEARS NFT</title>
        <meta
          name="description"
          content="BLURBEARS NFT | Trade only on blur.io"
        />
        <link rel="icon" href="/blurbearnobg.png" />
      </Head>
      <Hero />
    </div>
  );
};

export default Home;
