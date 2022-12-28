import { type AppType } from "next/app";
import { WagmiConfig, createClient, configureChains } from "wagmi";
import { mainnet, polygon, optimism, arbitrum } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { trpc } from "../utils/trpc";

import "../styles/globals.css";

// Wagmi configuration
// ===================
export const { chains, provider } = configureChains(
  [mainnet, polygon, optimism, arbitrum],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  provider,
});

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <WagmiConfig client={client}>
      <Component {...pageProps} />
    </WagmiConfig>
  );
};

export default trpc.withTRPC(MyApp);
