import { z } from "zod"

export type Inputs = z.infer<typeof loginSchema>

export const loginSchema = z.object({
  email: z.string().trim().min(1, { message: "Email is required" }).email({ message: "Incorrect email address" }),
  password: z
    .string()
    .trim()
    .min(1, { message: "Password is required" })
    .min(3, { message: "Password must be at least 3 characters long" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter (a-z)" }),
  rememberMe: z.boolean(),
})
