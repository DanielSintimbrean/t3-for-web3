import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import Layout from "../componests/Layout";
import { useSession } from "../hooks/useSession";
import { trpc } from "../utils/trpc";

const ProfilePage: NextPage = () => {
  const router = useRouter();
  const { authenticated, loading } = useSession();
  const { data: mrcImages } = trpc.mrCrypto.getMrcNftImages.useQuery();

  if (!loading && !authenticated) {
    router.push("/");
  }

  return (
    <Layout>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 text-white">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Profile{" "}
        </h1>
      </div>
      <div className="flex flex-row justify-center gap-4 p-48">
        {mrcImages &&
          mrcImages.data.map((mrcImage, i) => (
            <Image
              key={i}
              src={mrcImage}
              width={250}
              height={250}
              alt={"MRC"}
            />
          ))}
      </div>
    </Layout>
  );
};

export default ProfilePage;
