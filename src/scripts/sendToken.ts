import {
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import {
  Keypair,
  Connection,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";

export const sendToken = async (
  signerKeypair: Keypair,
  network: string,
  destinationAddress: string,
  mintAddress: string,
  decimal: number,
  amount: number,
  tokenProgram: "spl-token" | "spl-token-2022"
) => {
  // let rpcEndpoint = "";

  const rpcEndpoint = `https://api.${network}.solana.com`;

  // if (network === "mainnet-beta") {
  //   rpcEndpoint =
  //     "https://solana-mainnet.g.alchemy.com/v2/JxeseX6EEjWMsFemERtHiIEUumVqW7iG";
  // } else if (network === "devnet") {
  //   rpcEndpoint =
  //     "https://solana-devnet.g.alchemy.com/v2/JxeseX6EEjWMsFemERtHiIEUumVqW7iG";
  // }

  const connection = new Connection(rpcEndpoint, "confirmed");

  // Fetch the latest blockhash as close as possible to transaction creation
  const latestBlockhash = await connection.getLatestBlockhash("finalized");

  let sourceAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    signerKeypair,
    new PublicKey(mintAddress),
    signerKeypair.publicKey,
    false, // Set allowOwnerOffCurve to false
    undefined, // Remove commitment parameter
    undefined, // Remove confirmOptions parameter
    tokenProgram === "spl-token" ? TOKEN_PROGRAM_ID : TOKEN_2022_PROGRAM_ID
  );

  let destinationAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    signerKeypair,
    new PublicKey(mintAddress),
    new PublicKey(destinationAddress),
    false, // Set allowOwnerOffCurve to false
    undefined, // Remove commitment parameter
    undefined, // Remove confirmOptions parameter
    tokenProgram === "spl-token" ? TOKEN_PROGRAM_ID : TOKEN_2022_PROGRAM_ID
  );

  // Debugging information
  console.log("Source Account Address: ", sourceAccount.address.toBase58());
  console.log(
    "Destination Account Address: ",
    destinationAccount.address.toBase58()
  );

  // Convert amount to proper format
  let amountInLamports = BigInt(amount) * BigInt(Math.pow(10, decimal));

  console.log(`4 - Creating and Sending Transaction`);

  const tx = new Transaction().add(
    createTransferInstruction(
      sourceAccount.address,
      destinationAccount.address,
      signerKeypair.publicKey,
      amountInLamports,
      [],
      tokenProgram === "spl-token" ? TOKEN_PROGRAM_ID : TOKEN_2022_PROGRAM_ID
    )
  );

  tx.recentBlockhash = latestBlockhash.blockhash;

  // Set fee payer and sign transaction
  tx.feePayer = signerKeypair.publicKey;

  const signature = await sendAndConfirmTransaction(
    connection,
    tx,
    [signerKeypair],
    {
      skipPreflight: false, // Preflight transaction checks
      commitment: "confirmed", // Confirmation strategy
      maxRetries: 8, // Retry up to 5 times if the transaction fails
    }
  );

  console.log(
    "\x1b[32m", // Green Text
    `   Transaction Success! 🎉`,
    `\n    https://explorer.solana.com/tx/${signature}?cluster=devnet`
  );
};
