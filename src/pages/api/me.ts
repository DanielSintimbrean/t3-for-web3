import type { NextApiRequest, NextApiResponse } from "next";
import { withSessionAPI } from "../../lib/iron-session";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "GET":
      res.send({ address: req.session.siwe?.address });
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withSessionAPI(handler);
