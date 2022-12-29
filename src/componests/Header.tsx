import Link from "next/link";
import { useSession } from "../hooks/useSession";
import { Profile } from "./siwe/Profile";

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
  const { authenticated } = useSession();
  return (
    <header className="mx-5  flex flex-row items-center justify-between rounded-b-xl bg-gradient-to-br from-purple-600 to-purple-700 text-red-50">
      <div className="m-5">
        <Profile></Profile>
      </div>
      <nav className="">
        <ul className="m-5 flex flex-row gap-5">
          <li className="">
            <Link href="/">Home</Link>
          </li>
          <li className="">
            <Link href={authenticated ? "/profile" : "/"}>Profile</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
