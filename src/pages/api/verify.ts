import type { NextApiRequest, NextApiResponse } from "next";
import { SiweMessage } from "siwe";
import { withSessionAPI } from "../../lib/iron-session";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "POST":
      try {
        const { message, signature } = req.body;
        const siweMessage = new SiweMessage(message);
        // ? Puede fallar
        const fields = await siweMessage.verify(signature);

        if (fields.success !== true)
          return res.status(422).json({ message: "Invalid nonce." });

        req.session.siwe = siweMessage;
        req.session.user = { address: siweMessage.address };
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

export default withSessionAPI(handler);
