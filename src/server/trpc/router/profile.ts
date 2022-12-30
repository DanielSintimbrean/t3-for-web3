import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const profileRouter = router({
  changeName: protectedProcedure
    .input(z.object({ newName: z.string().min(3) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        where: { address: ctx.user.address },
        data: { name: input.newName },
      });

      ctx.session.user = { name: input.newName, address: ctx.user.address };

      await ctx.session.save();

      return { ok: true };
    }),
});
