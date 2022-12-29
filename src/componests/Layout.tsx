import Header from "./Header";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#2e026d]">
      <Header />
      <main>{children}</main>
    </div>
  );
}
