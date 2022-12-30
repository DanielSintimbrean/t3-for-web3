import type { IronSession } from "iron-session";
import { trpc } from "../utils/trpc";

type Authenticated = {
  authenticated: true;
  user: NonNullable<IronSession["user"]>;
} & SessionType;

type Unauthenticated = {
  authenticated: false;
} & SessionType;

type SessionType = {
  session: IronSession;
  loading: boolean;
};

type Session = Authenticated | Unauthenticated;

export function useSession(): Session {
  const { data: session, isFetching: loading } = trpc.auth.getSession.useQuery(
    undefined,
    {}
  );

  const authenticated = !!session?.user;

  if (authenticated) {
    return {
      authenticated,
      session,
      loading,
      user: session.user,
    } as Session;
  }

  return { authenticated, session, loading } as Session;
}
