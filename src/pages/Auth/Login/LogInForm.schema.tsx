import { z } from "zod";

export const formSchema = z.object({
  email: z.string().email({
    message: "Invalid Email Address",
  }),
});
