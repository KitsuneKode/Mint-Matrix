"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Wallet, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { useToast } from "@/hooks/use-toast";

export function Homepage() {
  const { connected } = useWallet();
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 3;

  const nextSlide = () => setCurrentSlide((prev) => (prev % totalSlides) + 1);
  const prevSlide = () =>
    setCurrentSlide((prev) => ((prev - 2 + totalSlides) % totalSlides) + 1);
  const navigate = useNavigate();
  const { toast } = useToast();
  useEffect(() => {
    toast({
      variant: "default",
      title: "Welcome to Mint Matrix",
      description: "Learn and earn with Web3 technologies",
    });
  }, [toast]);

  useEffect(() => {
    if (connected) {
      toast({
        variant: "default",
        title: "Wallet Connected",
      });
    } else {
      toast({
        variant: "default",
        title: "Wallet Not Connected",
        description: "Connect your wallet to continue",
      });
    }
  }, [connected, toast]);

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 p-8 font-sans">
      <div className="max-w-4xl mt-40 mx-auto bg-stone-50 shadow-lg rounded-lg overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-red-500 rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-red-500 rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-red-500 rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-red-500 rounded-br-lg"></div>
        </div>
        <header className=" p-6 border-b border-stone-200 flex justify-between items-center relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-red-500 rounded-full">
              <img
                src="/image.jpg"
                alt="logo"
                className=" rounded-full hover:cursor-pointer"
              />
            </div>
            <nav className="space-x-4 text-sm">
              <a href="#" className="hover:underline">
                about
              </a>
              <a href="#" className="hover:underline">
                learn
              </a>
            </nav>
          </div>
          {!connected ? (
            <WalletMultiButton className="wallet-adapter-button wallet-adapter-dropdown"></WalletMultiButton>
          ) : (
            <WalletDisconnectButton className="wallet-adapter-button"></WalletDisconnectButton>
          )}
        </header>

        <main className="p-6 relative z-10">
          <h1
            className="text-5xl font-bold mb-6 tracking-tight text-center"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            WEB3 WORLD
          </h1>

          <div className="mb-8 bg-white p-6 rounded-lg shadow-inner">
            <h2 className="text-2xl font-semibold mb-4 text-red-500">
              {currentSlide === 1 && "BLOCKCHAIN - THE FOUNDATION"}
              {currentSlide === 2 && "SMART CONTRACTS - THE LOGIC"}
              {currentSlide === 3 && "DEFI - THE REVOLUTION"}
            </h2>
            <p className="text-sm leading-relaxed mb-4">
              {currentSlide === 1 &&
                "Blockchain is a decentralized, distributed ledger technology that records all transactions across a network of computers. It ensures transparency, security, and immutability of data."}
              {currentSlide === 2 &&
                "Smart contracts are self-executing contracts with the terms of the agreement directly written into code. They automatically enforce and execute the terms when predetermined conditions are met."}
              {currentSlide === 3 &&
                "Decentralized Finance (DeFi) is an emerging financial technology based on secure distributed ledgers similar to those used by cryptocurrencies. It eliminates intermediaries in financial transactions."}
            </p>
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={prevSlide}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextSlide}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm font-semibold">
                {currentSlide} / {totalSlides}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              className="flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white py-3 transition-all ease-in-out hover:scale-105 duration-300"
              onClick={() => navigate("/airdrop")}
            >
              <ExternalLink className="w-4 h-4" />
              <span>Go to Solana Faucet</span>
            </Button>
            <Button
              className="flex items-center justify-center space-x-2 bg-stone-800 hover:bg-stone-950 text-white py-3 transition-all ease-in-out hover:scale-105 duration-300"
              onClick={() => navigate("/mytokens")}
            >
              <Wallet className="w-4 h-4" />
              <span>View Your Assets</span>
            </Button>
          </div>
        </main>

        <footer className="p-6 border-t border-stone-200 text-center text-sm text-stone-600  relative z-10">
          <span>
            Made by{" "}
            <a
              className="font-bold text-sm text-red-500 hover:text-red-600 transition-all ease-in-out hover:text-lg"
              href="https://github.com/kitsunekode"
            >
              KitsuneKode
            </a>
          </span>
        </footer>
      </div>
    </div>
  );
}
