import { type AppType } from "next/app";
import { WagmiConfig, createClient, configureChains } from "wagmi";
import { mainnet, polygon, optimism, arbitrum } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { trpc } from "../utils/trpc";
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";

import "@rainbow-me/rainbowkit/styles.css";

import "../styles/globals.css";

// Wagmi configuration
// ===================
export const { chains, provider } = configureChains(
  [polygon],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const client = createClient({
  autoConnect: false,
  connectors,
  provider,
});

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider
        chains={chains}
        theme={darkTheme()}
        modalSize={"compact"}
      >
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default trpc.withTRPC(MyApp);
