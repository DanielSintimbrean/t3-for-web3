import { generateNonce, SiweMessage } from "siwe";
import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { siweMessageSchema } from "../../../utils/validator/siwe";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
  /**
   * Nonce
   */
  nonce: publicProcedure.query(async ({ ctx }) => {
    // Get current date to setup session expiration
    const currentDate = new Date();

    // Setup Session
    ctx.session.nonce = generateNonce();
    ctx.session.issuedAt = currentDate.toISOString();
    ctx.session.expirationTime = new Date(
      currentDate.getTime() + 10 * 60 * 1000 // 10 minutes from the current time
    ).toISOString();

    // Save Session
    await ctx.session.save();

    // Return
    return {
      nonce: ctx.session.nonce,
      issuedAt: ctx.session.issuedAt,
      expirationTime: ctx.session.expirationTime,
    };
  }),
  /**
   * Verify
   */
  verify: publicProcedure
    .input(
      //z.object({ message: z.object<SiweMessage>({}), signature: z.string() })
      z.object({
        message: siweMessageSchema,
        signature: z.string(),
      })
    )
    .mutation(async (req) => {
      try {
        const siweMessage = new SiweMessage(req.input.message as SiweMessage);
        const fields = await siweMessage.validate(req.input.signature);

        // To access the express request to need to refer to ctx from the full request
        // As req.ctx.req
        if (fields.nonce !== req.ctx.session.nonce) {
          throw new Error("Invalid nonce.");
        }

        req.ctx.session.siwe = fields;
        req.ctx.session.user = { address: siweMessage.address };
        await req.ctx.session.save();
        return { ok: true };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        return {
          ok: false,
          error: error?.message ?? "Unknown error",
        };
      }
    }),
  /**
   * Logout
   */
  logout: publicProcedure.mutation(async ({ ctx }) => {
    ctx.session.destroy();
    return { ok: true };
  }),
});
