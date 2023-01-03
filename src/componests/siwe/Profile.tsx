import * as React from "react";
import { useAccount, useNetwork, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import { useIsMounted } from "../../hooks/useIsMounted";
import { trpc } from "../../utils/trpc";
import { useSession } from "../../hooks/useSession";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function SignInButton() {
  const trpcUtils = trpc.useContext();
  const [state, setState] = React.useState<{
    loading?: boolean;
  }>({});

  const { mutateAsync: verifyMutate } = trpc.auth.verify.useMutation({
    onSuccess: () => {
      // Refresh session
      trpcUtils.auth.invalidate();
    },
  });

  const nonceQuery = trpc.auth.nonce.useQuery(undefined, {
    enabled: false,
  });
  const { authenticated } = useSession();

  const { address } = useAccount();
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();

  const signIn = async () => {
    try {
      const chainId = chain?.id;
      if (!address || !chainId) return;

      const { data: nonceData } = await nonceQuery.refetch();

      setState((x) => ({ ...x, loading: true }));

      // Create SIWE message with pre-fetched nonce and sign with wallet
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce: nonceData?.nonce,
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      // Verify signature
      const verifyRes = await verifyMutate({ message, signature });

      if (!verifyRes.ok) throw new Error("Error verifying message");
    } catch (error) {
    } finally {
      setState((x) => ({ ...x, loading: false }));
    }
  };

  return (
    <button
      className="text-white"
      disabled={state.loading || authenticated}
      onClick={signIn}
    >
      Sign-In with Ethereum
    </button>
  );
}

export function Profile() {
  // const trpcUtils = trpc.useContext();
  // const { mutateAsync: logOut } = trpc.auth.logout.useMutation({
  //   onSuccess: () => {
  //     // Refresh session
  //     trpcUtils.auth.getSession.invalidate();
  //   },
  // });
  // const { isConnected } = useAccount();
  // const isMounted = useIsMounted();

  // // Fetch user when:
  // const { session } = useSession();

  // if (isConnected && isMounted) {
  //   return (
  //     <div>
  //       {/* Account content goes here */}

  //       {session?.user?.address ? (
  //         <div>
  //           <div className="font-bold">
  //             Signed in as{" "}
  //             {session.user.address.slice(0, 6) +
  //               "..." +
  //               session.user.address.slice(-5, -1)}
  //           </div>
  //           <button
  //             onClick={async () => {
  //               await logOut();
  //             }}
  //           >
  //             Sign Out
  //           </button>
  //         </div>
  //       ) : (
  //         <div className="flex flex-row gap-4">
  //           <SignInButton />
  //           <ConnectButton showBalance={false} accountStatus={"address"} />
  //         </div>
  //       )}
  //     </div>
  //   );
  // }

  return (
    <div>
      <ConnectButton></ConnectButton>
    </div>
  );
}
