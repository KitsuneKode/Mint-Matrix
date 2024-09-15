import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Airdrop() {
  const [balance, setBalance] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false); // Initial state should be false
  const [transactionSignature, setTransactionSignature] = useState("");
  const [amount, setAmount] = useState(0);
  const [showBalance, setShowBalance] = useState("false");
  const connection = new Connection("https://api.devnet.solana.com");
  const { connected, publicKey } = useWallet();
  const navigate = useNavigate();
  let toastIDBalance;
  const handleShowBalance = () => {
    if (amount) {
      setShowBalance(!showBalance);
    }

    toastIDBalance = toast.loading("Fetching Balance");
    console.log(toastIDBalance);
  };

  const handleAirdrop = async (amount) => {
    if (!walletConnected) {
      toast.warning("Please connect your wallet first.");

      return;
    }

    if (amount === 0) {
      toast.warning("Please select an amount to request an airdrop.");
      return;
    }

    try {
      const airdropSignature = await connection.requestAirdrop(
        publicKey,
        amount * LAMPORTS_PER_SOL
      );

      const toastID = toast.loading("Airdrop Requested");
      // alert("Airdrop in progress. Please wait for confirmation.");

      // Polling to confirm transaction status
      const checkTransaction = async () => {
        const result = await connection.getSignatureStatus(airdropSignature);
        return result.value?.confirmationStatus === "finalized";
      };

      const maxRetries = 60; // For example, retry 60 times (each 1 second)
      let retries = 0;
      let transactionConfirmed = false;

      while (!transactionConfirmed && retries < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
        transactionConfirmed = await checkTransaction();
        retries++;
      }

      if (transactionConfirmed) {
        toast.dismiss(toastID);
        toast.success(`Airdrop of ${amount} Completed `);
        // alert("Airdrop completed successfully.");
        setTransactionSignature(airdropSignature);
      } else {
        // alert("Transaction not confirmed in time. Check the Solana Explorer.");
        toast.dismiss(toastID);

        toast.warning("Transaction not confirmed in time", {
          description: "Check the Solana Explorer.",
        });
      }
    } catch (e) {
      toast.error("Airdrop failed", {
        description: `Please try again.The Error is printed in the console.`,
      });
      // alert("Airdrop failed. Please try again.", e);
      console.error(e);
    }
  };

  useEffect(() => {
    setWalletConnected(connected);
  }, [connected]);

  useEffect(() => {
    if (walletConnected && publicKey) {
      const fetchBalance = async () => {
        try {
          const balance = await connection.getBalance(publicKey);
          setBalance(balance / LAMPORTS_PER_SOL);
          toast.dismiss(toastIDBalance);
          toast.success("Balance Fetched");
        } catch (e) {
          toast.dismiss(toastIDBalance);
          toast.error("Balance Fetched Failed");
          console.error("Error fetching balance:", e);
        }
      };
      fetchBalance();
    } else {
      setBalance(0);
    }
  }, [publicKey, walletConnected, showBalance]);

  useEffect(() => {
    const firstAirdropVisit = sessionStorage.getItem("firstAirdropVisit");
    if (firstAirdropVisit === null) {
      toast.message("Welcome to Sol Faucet", {
        description:
          "You can request airdrop for development here. To navigative back to homepage, click on the icon on the top left corner.",
      });
    }
    sessionStorage.setItem("firstAirdropVisit", "true");
  }, []);
  useEffect(() => {
    if (connected) {
      toast.success("Wallet Connected");
    }
  }, [connected]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transactionSignature);
      toast.message("Transaction signature copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy transaction signature", {
        description: `Error: ${err}`,
      });

      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0B1120] to-[#0E1B2E] text-white">
      <div className="pb-6">
        <WalletMultiButton className="wallet-adapter-button wallet-adapter-button-trigger"></WalletMultiButton>
      </div>

      <div className="max-w-md w-full px-6 py-8 bg-[#0E1B2E] rounded-lg shadow-lg">
        <img
          src="/image.jpg"
          alt="logo"
          className="w-8 h-8 rounded-full hover:cursor-pointer"
          onClick={() => {
            navigate("/homepage");
          }}
        />
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Solana Faucet</h1>
          <p className="text-muted-foreground">
            Get free Solana tokens to test your dApps.
          </p>
          <div>
            <span className="text-2xl font-bold">{balance.toFixed(2)} SOL</span>
            <Button
              className="ml-4 px-6 py-2 rounded-md bg-[#4B6BFF] hover:bg-pink-500 transition-colors"
              onClick={handleShowBalance}
            >
              Refresh Balance
            </Button>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4">
          <button
            className="bg-[#1C2B44] hover:bg-[#233655] rounded-md py-2 px-4 transition-colors"
            onClick={() => setAmount(2)}
          >
            2 SOL
          </button>
          <button
            className="bg-[#1C2B44] hover:bg-[#233655] rounded-md py-2 px-4 transition-colors"
            onClick={() => setAmount(0.5)}
          >
            0.5 SOL
          </button>
          <button
            className="bg-[#1C2B44] hover:bg-[#233655] rounded-md py-2 px-4 transition-colors"
            onClick={() => setAmount(1)}
          >
            1 SOL
          </button>
          <button
            className="bg-[#1C2B44] hover:bg-[#233655] rounded-md py-2 px-4 transition-colors"
            onClick={() => setAmount(2.5)}
          >
            2.5 SOL
          </button>
        </div>
        <div className="mt-8 flex items-center">
          <input
            readOnly
            required
            value={amount + " SOL"}
            className="mr-4 bg-[#1C2B44] border-none rounded-md px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-[#4B6BFF]"
            placeholder="Select AirDrop Amount"
          />
          <button
            className="w-full px-4 py-2 rounded-md bg-[#4B6BFF] hover:bg-pink-500 transition-colors"
            onClick={() => handleAirdrop(amount)}
          >
            Request Airdrop
          </button>
        </div>

        <div className="flex items-center mt-6">
          <input
            readOnly
            value={transactionSignature}
            className="bg-[#1C2B44] border-none rounded-md px-4 py-2 min-w-0 flex-1 focus:outline-cyan focus:ring-2 focus:ring-[#4B6BFF]"
            placeholder="Transaction Signature"
          />
          <button
            onClick={copyToClipboard}
            className="ml-4 h-8 w-8 flex items-center justify-center rounded-md bg-[#4B6BFF] hover:bg-pink-500 text-white transition-colors"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
