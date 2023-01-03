import { type AppType } from "next/app";
import { WagmiConfig, createClient, configureChains } from "wagmi";
import { polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { trpc } from "../utils/trpc";
import type { AuthenticationStatus } from "@rainbow-me/rainbowkit";
import { createAuthenticationAdapter } from "@rainbow-me/rainbowkit";
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";

import "@rainbow-me/rainbowkit/styles.css";

import "../styles/globals.css";
import { useSession } from "../hooks/useSession";
import { useMemo } from "react";
import { SiweMessage } from "siwe";

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
  let sessionStatus: AuthenticationStatus = "unauthenticated";
  const utils = trpc.useContext();
  const { authenticated, loading } = useSession();

  const { refetch: fetchNonce } = trpc.auth.nonce.useQuery(undefined, {
    enabled: false,
  });

  const { mutateAsync: verify } = trpc.auth.verify.useMutation({
    onSuccess: () => {
      utils.auth.invalidate();
    },
  });

  const { mutateAsync: logOut } = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.invalidate();
    },
  });

  const authenticationAdapter = useMemo(
    () =>
      createAuthenticationAdapter({
        getNonce: async () => {
          const { data: nonceData } = await fetchNonce();
          return nonceData?.nonce ?? "";
        },

        createMessage: ({ nonce, address, chainId }) => {
          return new SiweMessage({
            domain: window.location.host,
            address,
            statement: "Sign in with Ethereum to the app.",
            uri: window.location.origin,
            version: "1",
            chainId,
            nonce,
          });
        },

        getMessageBody: ({ message }) => {
          return message.prepareMessage();
        },

        verify: async ({ message, signature }) => {
          const verifyRes = await verify({
            message,
            signature,
          });
          return verifyRes.ok;
        },

        signOut: async () => {
          const res = await logOut();

          if (!res.ok) {
            throw new Error("Failed to logout");
          }
        },
      }),
    [fetchNonce, verify, logOut]
  );

  if (loading) sessionStatus = "loading";
  if (authenticated) sessionStatus = "authenticated";

  return (
    <WagmiConfig client={client}>
      <RainbowKitAuthenticationProvider
        adapter={authenticationAdapter}
        status={sessionStatus}
      >
        <RainbowKitProvider
          chains={chains}
          theme={darkTheme()}
          modalSize={"compact"}
        >
          <Component {...pageProps} />
        </RainbowKitProvider>
      </RainbowKitAuthenticationProvider>
    </WagmiConfig>
  );
};

export default trpc.withTRPC(MyApp);
