import { trpc } from "../utils/trpc";

export const useSession = () => {
  const { data: session, isFetching: loading } =
    trpc.auth.getSession.useQuery();
  const authenticated = !!session?.user?.address;
  return { session, loading, authenticated };
};
