import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "../componests/Layout";
import { useSession } from "../hooks/useSession";
import { trpc } from "../utils/trpc";

const ProfilePage: NextPage = () => {
  const trpcUtils = trpc.useContext();
  const router = useRouter();

  const session = useSession();
  const [newName, setNewName] = useState("");

  const { data: mrcImages } = trpc.mrCrypto.getMrcNftImages.useQuery(
    undefined,
    {}
  );
  const { mutateAsync: changeNameAsync } = trpc.profile.changeName.useMutation({
    onSuccess: () => {
      trpcUtils.auth.getSession.invalidate();
    },
  });

  if (!session.authenticated && !session.loading) {
    router.push("/");
  }

  if (!session.authenticated) {
    return <Layout>Loading...</Layout>;
  }

  return (
    <Layout>
      <div className="flex flex-col items-center gap-12">
        <div className="container flex w-screen flex-col items-center justify-center gap-12 px-4 py-16 text-white">
          <h1 className="flex text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Profile
          </h1>
          <h2 className="text-3xl">
            Hello 👋 <b className="uppercase">{session.user.name}</b>!
          </h2>
        </div>
        <div>
          <form
            className="flex flex-col items-center"
            onSubmit={(e) => {
              e.preventDefault();
              changeNameAsync({ newName });
            }}
          >
            <input
              className="input m-2"
              type="text"
              name="name"
              id="name"
              placeholder="New Name"
              onChange={(e) => setNewName(e.target.value)}
            />
            <button type="submit" className="text-white">
              {" "}
              Change Name
            </button>
          </form>
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
      </div>
    </Layout>
  );
};

export default ProfilePage;
