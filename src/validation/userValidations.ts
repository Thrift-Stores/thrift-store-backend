import { z } from "zod";

export const signupSchema = z.object({
    email: z.string()
      .trim()
      .email({ message: "Invalid email address. Please enter a valid email." })
      .nonempty({ message: "Email is required" }),
  
    username: z.string()
      .trim()
      .min(4, { message: "Name must be at least 4 characters long." })
      .nonempty({ message: "Username is required" }),
  
    password: z.string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
      .regex(/[0-9]/, { message: "Password must contain at least one number." })
      .regex(/[\W_]/, { message: "Password must contain at least one special character." })
      .nonempty({ message: "Password is required" }),

      college : z.string()
      .trim().nonempty({ message: "College is required" })
  });


export const loginSchema = z.object({
    email: z.string()
    .trim()
    .email({ message: "Invalid email address. Please enter a valid email." })
    .nonempty({ message: "Email is required" }),  

    password : z.string()
    .nonempty({ message: "Password is required" }),
})