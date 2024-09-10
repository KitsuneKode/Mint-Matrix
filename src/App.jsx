import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

import { Homepage } from "./components/HomePage";
import { MyTokens } from "./components/MyTokensPage";
import Airdrop from "./components/Airdrop";

function App() {
  const network = "devnet"; // You can change this to 'devnet' or 'mainnet-beta' for different networks

  return (
    <ConnectionProvider endpoint={`https://api.${network}.solana.com`}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Navigate to="/homepage" />}></Route>
              <Route path="/homepage" element={<Homepage />}></Route>
              <Route path="/airdrop" element={<Airdrop />}></Route>
              <Route path="/mytokens" element={<MyTokens />}></Route>
              <Route path="*" element={<Homepage />}></Route>
            </Routes>
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
