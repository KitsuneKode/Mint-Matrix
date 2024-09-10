"use client";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { getTokenAccounts } from "@/scripts/tokens";
import { useWallet } from "@solana/wallet-adapter-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useNavigate } from "react-router-dom";
import { Switch } from "./ui/switch";

const mockTokens = [
  {
    id: 1,
    name: "Ethereum",
    symbol: "ETH",
    balance: 2.5,
    price: 2000,
    change24h: 5.2,
    mintAddress: "0x1234...5678",
    decimals: 18,
    tokenAddress: "0x1234...5678",
    uri: "https://example.com/ethereum-image.json", // Add URI here
  },
  {
    id: 2,
    name: "Bitcoin",
    symbol: "BTC",
    balance: 0.5,
    price: 30000,
    change24h: -2.1,
    mintAddress: "0xabcd...efgh",
    decimals: 8,
    tokenAddress: "0xabcd...efgh",
    uri: "https://example.com/bitcoin-image.json", // Add URI here
  },
  {
    id: 3,
    name: "Cardano",
    symbol: "ADA",
    balance: 1000,
    price: 0.5,
    change24h: 1.8,
    mintAddress: "0x9876...5432",
    decimals: 6,
    tokenAddress: "0x9876...5432",
    uri: "https://example.com/cardano-image.json", // Add URI here
  },
  {
    id: 4,
    name: "Solana",
    symbol: "SOL",
    balance: 50,
    price: 20,
    change24h: 7.5,
    mintAddress: "0xijkl...mnop",
    decimals: 9,
    tokenAddress: "0xijkl...mnop",
    uri: "https://example.com/solana-image.json", // Add URI here
  },
];

export function MyTokens() {
  const [tokens, setTokens] = useState(mockTokens);
  const [refresh, setRefresh] = useState(false);
  const [expandedToken, setExpandedToken] = useState(null);
  const [network, setNetwork] = useState("");
  const { connected, publicKey } = useWallet();

  const [images, setImages] = useState({}); // State to store fetched images
  const { toast } = useToast();
  const handlefetch = async (token) => {
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    try {
      const response = await fetch(proxyUrl + token.uri);
      if (response.ok) {
        const json = await response.json();
        setImages((prevImages) => ({
          ...prevImages,
          [token.id]: json.image, // Store image by token ID
        }));
      }
    } catch (error) {
      console.error(`Failed to fetch image for token ${token.name}:`, error);
      toast({
        variant: "default",
        title: "Failed to fetch token image",
        description: `Open the console to see the error message. Go to https://cors-anywhere.herokuapp.com/ and click on "Request temporary access to the demo server" to fix this issue. 
        if the issue persists, the uri doesnot allow CORS.`,
        action: (
          <ToastAction
            altText="Link"
            className="hover:bg-red-600"
            // ref={<Navigate to="https://cors-anywhere.herokuapp.com/" />}
            onClick={() => window.open("https://cors-anywhere.herokuapp.com/")}
          >
            Link
          </ToastAction>
        ),
      });
    }
  };

  useEffect(() => {
    if (
      localStorage.network === "devnet" ||
      localStorage.network === "mainnet-beta"
    ) {
      localStorage.network === "devnet"
        ? setNetwork("devnet")
        : setNetwork("mainnet-beta");
    } else {
      setNetwork("mainnet-beta");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("network", network);
  }, [network]);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const handleSend = () => {
    // Handle send logic here
    toast({
      variant: "default",
      title: "Feature on Production",
      description: "This feature will be implemented on the next update",
    });
  };

  const handleExpand = (id) => {
    setExpandedToken(expandedToken === id ? null : id);
  };
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

  useEffect(() => {
    const fetchTokens = async () => {
      if (!connected) {
        setTokens(mockTokens); // Mock tokens if not connected
        return;
      }

      try {
        const tokenAccounts = await getTokenAccounts(publicKey, network);

        setTokens(tokenAccounts); // Set the token data in state
      } catch (error) {
        console.error("Error fetching token accounts:", error);
      }
    };

    // Set placeholder image initially for all tokens
    const placeholderImage =
      "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg";

    const initialImages = mockTokens.reduce((acc, token) => {
      acc[token.id] = placeholderImage;
      return acc;
    }, {});

    setImages(initialImages);

    fetchTokens(); // Call the async function
  }, [publicKey, connected, refresh, network]);

  // Fetch the images when tokens are expanded
  useEffect(() => {
    tokens.forEach((token) => {
      handlefetch(token); // Fetch each token's image
    });
  }, [tokens]);

  useEffect(() => {
    toast({
      variant: "default",
      title: "Welcome to Tokens Page",
      description:
        "You can view your tokens here. To navigative to homepage, click on the icon on the top left corner.",
    });
  }, [toast]);

  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 to-stone-200 text-stone-900 p-8 font-sans">
      <Card className="w-full max-w-4xl mx-auto relative overflow-hidden bg-white/80 backdrop-blur-sm">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-red-500 rounded-tl-3xl"></div>
          <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-red-500 rounded-tr-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-red-500 rounded-bl-3xl"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-red-500 rounded-br-3xl"></div>
        </div>
        <CardHeader className="border-b border-stone-200 relative z-10 bg-red-400 text-white">
          <div className="flex items-center space-x-2 justify-between ">
            <img
              src="/image.jpg"
              alt="logo"
              className="w-20 h-20  rounded-full hover:cursor-pointer"
              onClick={() => {
                navigate("/homepage");
              }}
            />
            <div className="border border-gray-200 border-opacity-40 rounded-full p-3 bg-gray-800">
              <Switch
                id="network"
                className="m-2 data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                checked={network === "devnet"}
                onCheckedChange={(checked) => {
                  setNetwork(checked ? "devnet" : "mainnet-beta");
                }}
              />
              <Label htmlFor="network" className="text-lg font-bold mx-2">
                Use Devnet
              </Label>
            </div>
          </div>
          <CardTitle className="text-5xl font-bold tracking-tight text-center py-6 pt-0 mt-0 ">
            YOUR TOKENS
          </CardTitle>
        </CardHeader>
        <div className=" mt-4 flex justify-center ">
          <WalletMultiButton className="wallet-adapter-button"></WalletMultiButton>
          <Button
            className="bg-red-500 rounded-xl font-bold h-13 text-sm px-6  mx-4"
            onClick={handleRefresh}
          >
            Refresh Assets{" "}
          </Button>
          {tokens.length < 1 && (
            <WalletDisconnectButton className="wallet-adapter-button "></WalletDisconnectButton>
          )}
        </div>
        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-4 h-[2px] w-full" />
        {!connected && (
          <>
            <div className="text-center text-2xl font-bold text-stone-500">
              These are mock tokens for demonstration purposes
            </div>
            <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-4 h-[2px] w-full" />
          </>
        )}
        <CardContent className="p-8 relative z-10">
          {tokens.length === 0 && (
            <div className="text-center text-2xl font-bold text-stone-500">
              You have 0 tokens
            </div>
          )}

          {tokens.map((token) => (
            <div key={token.id} className="mb-6 last:mb-0 token-card">
              <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleExpand(token.id)}
                    className="rounded-full w-10 h-10 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-300"
                  >
                    {expandedToken === token.id ? (
                      <ChevronUp className="h-6 w-6" />
                    ) : (
                      <ChevronDown className="h-6 w-6" />
                    )}
                  </Button>
                  <div>
                    <h3 className="text-xl font-semibold">{token.name}</h3>
                    <p className="text-sm text-stone-500">{token.symbol}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-medium">
                    {token.balance} {token.symbol}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full w-10 h-10 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-300 overflow-hidden"
                  >
                    <img
                      className="h-9 w-9 object-cover"
                      src={images[token.id]} // Access the image from state
                      alt={`${token.name} logo`}
                    />
                  </Button>
                </div>
              </div>
              {expandedToken === token.id && (
                <div className="mt-4 p-6 bg-stone-50 rounded-xl shadow-inner">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                      <span className="text-sm font-medium text-stone-500">
                        Current Price:
                      </span>
                      <span className="text-lg font-bold ml-2">
                        ${token.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <span className="text-sm font-medium text-stone-500">
                        24h Change:
                      </span>
                      <span
                        className={`text-lg font-bold ml-2 ${
                          token.change24h >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {token.change24h >= 0 ? "+" : ""}
                        {token.change24h}%
                      </span>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow col-span-2">
                      <span className="text-sm font-medium text-stone-500">
                        Token Address:
                      </span>
                      <Input
                        className="text-center text-lg font-bold ml-2"
                        value={token.tokenAddress}
                      ></Input>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow col-span-2">
                      <span className="text-sm font-medium text-stone-500">
                        Mint Address:
                      </span>
                      <Input
                        className=" text-lg text-center font-bold ml-2 overflow-hidden "
                        value={token.mintAddress}
                      ></Input>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <span className="text-sm font-medium text-stone-500">
                        Decimals:
                      </span>
                      <span className="text-lg font-bold ml-2">
                        {token.decimals}
                      </span>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <span className="text-sm font-medium text-stone-500">
                        Balance:
                      </span>
                      <span className="text-lg font-bold ml-2">
                        {token.balance} {token.symbol}
                      </span>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-red-500 hover:bg-red-600 text-white text-lg py-6 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105">
                        Send {token.symbol}
                        <Send className="ml-2 h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-center text-red-500">
                          Send {token.name} ({token.symbol})
                        </DialogTitle>
                        <DialogDescription className="text-center text-opacity-70 pt-2 text-gray-600 border border-red-300 border-opacity-60 ">
                          Enter the recipient address and the amount of{" "}
                          {token.symbol} you want to send.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="recipient"
                            className="text-right font-medium"
                          >
                            Recipient
                          </Label>
                          <Input
                            id="recipient"
                            placeholder="Recipient address"
                            className="col-span-3 rounded-lg"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="amount"
                            className="text-right font-medium"
                          >
                            Amount
                          </Label>
                          <Input
                            id="amount"
                            placeholder="Amount to send"
                            className="col-span-3 rounded-lg"
                          />
                        </div>
                      </div>
                      <Button
                        className="w-full bg-red-500 hover:bg-red-600 text-white text-lg py-6 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105"
                        onClick={handleSend}
                      >
                        Confirm Send
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
