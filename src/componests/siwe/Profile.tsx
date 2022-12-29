import * as React from "react";
import { useAccount, useNetwork, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import { useIsMounted } from "../../hooks/useIsMounted";
import { trpc } from "../../utils/trpc";
import { useSession } from "../../hooks/useSession";

function SignInButton() {
  const [state, setState] = React.useState<{
    loading?: boolean;
  }>({});

  const { mutateAsync: verifyMutate } = trpc.auth.verify.useMutation();
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
  const { mutateAsync: logOut } = trpc.auth.logout.useMutation();
  const { isConnected } = useAccount();
  const isMounted = useIsMounted();

  // Fetch user when:
  const { session } = useSession();

  if (isConnected && isMounted) {
    return (
      <div>
        {/* Account content goes here */}

        {session?.user?.address ? (
          <div>
            <div>Signed in as {session.user.address}</div>
            <button
              onClick={async () => {
                await logOut();
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <SignInButton />
        )}
      </div>
    );
  }

  return <div>{/* Connect wallet content goes here */}</div>;
}
