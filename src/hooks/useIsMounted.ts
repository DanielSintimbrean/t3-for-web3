import { useEffect, useState } from "react";

/**
 * This hook is used to check if the component is mounted or not.
 * Wagmi does not have a first class solution for SSR yet. See the link 👇 for workarounds.
 * @see https://github.com/wagmi-dev/wagmi/issues/542#issuecomment-1144178142
 */
export const useIsMounted = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return mounted;
};
