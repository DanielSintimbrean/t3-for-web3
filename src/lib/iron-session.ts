import type { IronSessionOptions } from "iron-session";
import { env } from "../env/server.mjs";

export const sessionOptions: IronSessionOptions = {
  cookieName: "iron-session/siwe",
  password: env.SECRET_COOKIE_PASSWORD,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
