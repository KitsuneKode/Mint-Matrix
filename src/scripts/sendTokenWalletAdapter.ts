// Description: This file contains the function to create an associated token account for a given mint and recipient address. but not for wallletadapter usage

import {
  getAccount,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  Account,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { PublicKey, Connection, Transaction } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

export async function getOrCreateATA(
  network: string,
  mintAddress: PublicKey,
  recipientAddress: PublicKey,
  tokenProgram: "spl-token" | "spl-token-2022"
) {
  let rpcEndpoint = "";
  if (network === "mainnet-beta") {
    rpcEndpoint =
      "https://solana-mainnet.g.alchemy.com/v2/JxeseX6EEjWMsFemERtHiIEUumVqW7iG";
  } else if (network === "devnet") {
    rpcEndpoint =
      "https://solana-devnet.g.alchemy.com/v2/JxeseX6EEjWMsFemERtHiIEUumVqW7iG";
  }

  //   const rpcEndpoint = `https://api.${network}.solana.com`;

  const { sendTransaction, publicKey } = useWallet();

  const connection = new Connection(rpcEndpoint);

  const associatedToken = getAssociatedTokenAddressSync(
    new PublicKey(mintAddress),
    new PublicKey(recipientAddress),
    false,
    tokenProgram === "spl-token" ? TOKEN_PROGRAM_ID : TOKEN_2022_PROGRAM_ID
  );

  let account: Account;

  try {
    account = await getAccount(
      connection,
      associatedToken,
      "confirmed",
      tokenProgram === "spl-token" ? TOKEN_PROGRAM_ID : TOKEN_2022_PROGRAM_ID
    );
  } catch (error: unknown) {
    if (
      error instanceof TokenAccountNotFoundError ||
      error instanceof TokenInvalidAccountOwnerError
    ) {
      try {
        const programId =
          tokenProgram === "spl-token"
            ? TOKEN_PROGRAM_ID
            : TOKEN_2022_PROGRAM_ID;

        const transaction = new Transaction().add(
          createAssociatedTokenAccountInstruction(
            publicKey,
            associatedToken,
            recipientAddress,
            mintAddress,
            programId
          )
        );
        await sendTransaction(transaction, connection);
      } catch (error: unknown) {}
    }
  }
  return { account, connection };
}
