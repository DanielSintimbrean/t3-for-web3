import type { IronSessionOptions } from "iron-session";
import { withIronSessionApiRoute } from "iron-session/next";
import type { NextApiRequest, NextApiResponse } from "next/types";
import { env } from "../env/server.mjs";

export const sessionOptions: IronSessionOptions = {
  cookieName: "iron-session/siwe",
  password: env.SECRET_COOKIE_PASSWORD,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

type NextApiRequestHandl = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void>;

export function withSessionAPI(handler: NextApiRequestHandl) {
  return withIronSessionApiRoute(handler, sessionOptions);
}
