"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { WalletModalButton } from "@solana/wallet-adapter-react-ui";
import { ed25519 } from "@noble/curves/ed25519";
import { useWallet } from "@solana/wallet-adapter-react";
import { Input } from "@/components/ui/input";

import Cookie from "js-cookie";

import PropTypes from "prop-types";
import { toast } from "sonner";

export function AuthenticationModal({ setIsAuthenticated }) {
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { publicKey, signMessage } = useWallet();

  const baseStyle = {
    backgroundColor: "#8EE3FB",
    color: "#000",
    fontWeight: "600",
    fontSize: "15px",
    padding: "8px 16px",
    borderRadius: "4px",
    transition: "background-color 0.3s ease",
  };

  const signAndVerifyMsg = async () => {
    const encodedMessage = new TextEncoder().encode(message);
    const signature = await signMessage(encodedMessage);

    if (!ed25519.verify(signature, encodedMessage, publicKey.toBytes())) {
      toast("Verification Failed", {
        description: "Message signature invalid, try again",
      });

      return;
    }

    await Cookie.set("authSign", signature);
    toast("Verification successful", {
      // description: "Signature : " + signature.toString("hex"),
    });
    return signature;
  };

  const handleVerify = async () => {
    if (!message) {
      toast("Message empty", {
        description: "Please add a message to continue verifying",
      });
      return;
    }

    setIsLoading(true);

    if (!signMessage) {
      toast("Wallet does not support message signing!", {
        description: "Please connect a wallet that supports message signing.",
      });

      return;
    }

    const sign = await signAndVerifyMsg();
    if (!sign) {
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      setIsOpen(false);
      setIsAuthenticated(true);
    }, 1000);
  };

  useEffect(() => {
    if (isOpen) {
      toast("Please verify your identity");
    }
  }, [isOpen]);

  return (
    <>
      <div className="fixed inset-0  bg-black bg-opacity-90 flex items-center justify-center z-40">
        <button
          onClick={() => setIsOpen(true)}
          className={`px-4 py-2 bg-[#8EE3FB] text-gray-900 rounded-md hover:bg-[#61D8F9] transition-colors p-8 font-semibold text-lg border-2 border-[#8EE3FB] text-inherit shadow-[#91e7ff] shadow-2xl `}
        >
          AUTHENTICATE
        </button>
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-40">
          <div
            className={`bg-zinc-900 rounded-lg p-6 w-[448px] relative z-50 transition-all duration-300 ease-in-out`}
            style={{
              boxShadow: "0 0 30px 5px rgba(255, 143, 94, 0.3)", // Peach-colored shadow for accent
            }}
          >
            <div className="flex justify-between b-4 items-center">
              <div></div>
              <h2 className="text-2xl font-semibold text-peach-500 text-center ">
                Authenticate
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-peach-100 hover:text-peach-300 transition-colors "
              >
                <X size={24} />
              </button>
            </div>
            <div className="border-t border-gray-700 my-4"></div>
            <p className="text-peach-100 mb-4 text-center mx-14">
              Authenticate to prove your identity and access the platform.
            </p>
            <div className="border-t border-gray-700 my-4"></div>
            <div className="text-peach-200 text-center mb-2 pl-2">
              Your public key:
            </div>

            <div className="bg-teal-700 text-teal-200 p-3 rounded-md mb-6 break-all text-center">
              {publicKey?.toString()}
            </div>
            <div className="border-t border-gray-700 my-4"></div>

            <div className="flex flex-col mb-4 items-center">
              <div className="text-peach-200 text-left  mb-2 pl-2  ">
                Signing message:
              </div>
              <Input
                type="text"
                placeholder="Enter your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full mb-4 text-center h-12 text-peach-800 text-lg"
              ></Input>
            </div>
            <div className="flex justify-between">
              <WalletModalButton
                style={{
                  ...baseStyle,
                }}
              >
                CHANGE WALLET
              </WalletModalButton>

              <button
                onClick={handleVerify}
                disabled={isLoading}
                className="py-2 bg-[#8EE3FB] text-gray-900 font-semibold text-inherit whitespace-nowrap rounded-md hover:bg-[#61D8F9] transition-colors flex items-center justify-center w-fit px-4"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "VERIFY WALLET"
                )}
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-4 text-center">
              By connecting your wallet, you agree to MintMatrix&apos;s Terms of
              Service.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

AuthenticationModal.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
};
