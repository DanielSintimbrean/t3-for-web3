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
}
