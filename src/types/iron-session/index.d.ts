import "iron-session";
import type { SiweMessage } from "siwe";

declare module "iron-session" {
  interface IronSessionData {
    nonce?: string;
    siwe?: SiweMessage;
    issuedAt?: string;
    expirationTime?: string;
    user?: {
      address: string;
      name: string;
    };
  }
}
