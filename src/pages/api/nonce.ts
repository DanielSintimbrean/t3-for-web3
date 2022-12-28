import type { NextApiRequest, NextApiResponse } from "next";
import { generateNonce } from "siwe";
import { withSessionAPI } from "../../lib/iron-session";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = req.session;
  const { method } = req;
  switch (method) {
    case "GET":
      session.nonce = generateNonce();
      await session.save();
      res.setHeader("Content-Type", "text/plain");
      res.send(session.nonce);
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withSessionAPI(handler);
