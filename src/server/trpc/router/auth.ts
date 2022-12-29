import { generateNonce, SiweMessage } from "siwe";
import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { siweMessageSchema } from "../../../utils/validator/siwe";
import { TRPCError } from "@trpc/server";

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
      const siweMessage = new SiweMessage(req.input.message as SiweMessage);
      let fields;

      try {
        fields = await siweMessage.verify({
          signature: req.input.signature,
          nonce: req.ctx.session.nonce,
        });
      } catch {
        throw new TRPCError({
          message: "Invalid signature",
          code: "BAD_REQUEST",
        });
      }

      req.ctx.session.siwe = fields.data;
      req.ctx.session.user = { address: siweMessage.address };
      await req.ctx.session.save();
      return { ok: true };
    }),
  /**
   * Logout
   */
  logout: publicProcedure.mutation(async ({ ctx }) => {
    ctx.session.destroy();
    return { ok: true };
  }),
});
