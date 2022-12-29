import type { NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "../componests/Layout";
import { useSession } from "../hooks/useSession";

const ProfilePage: NextPage = () => {
  const router = useRouter();
  const { authenticated, loading } = useSession();

  if (!loading && !authenticated) {
    router.push("/");
  }

  return (
    <Layout>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Profile{" "}
        </h1>
      </div>
    </Layout>
  );
};

export default ProfilePage;
