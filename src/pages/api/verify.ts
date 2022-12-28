import { ironOptions } from "iron-session";
import { withIronSessionApiRoute } from "iron-session/next";
import type { NextApiRequest, NextApiResponse } from "next";
import { SiweMessage } from "siwe";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "POST":
      try {
        const { message, signature } = req.body;
        const siweMessage = new SiweMessage(message);
        // ? Puede fallar
        const fields = await siweMessage.verify({
          signature,
          nonce: req.session.nonce,
        });

        if (fields.success !== true)
          return res.status(422).json({ message: "Invalid nonce." });

        req.session.siwe = siweMessage;
        await req.session.save();
        res.json({ ok: true });
      } catch (_error) {
        res.json({ ok: false });
      }
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withIronSessionApiRoute(handler, ironOptions);
