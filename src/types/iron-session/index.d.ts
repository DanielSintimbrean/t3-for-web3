import "iron-session";
import type { SiweMessage } from "siwe";

declare module "iron-session" {
  interface IronSessionData {
    nonce?: string;
    siwe?: SiweMessage;
    user?: {
      address: string;
    };
  }

  const ironOptions: IronSessionOptions = {
    cookieName: "siwe",
    // ! FIXME: Use a secure secret
    password: "complex_password_at_least_32_characters_long",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  };
}
