import { z } from "zod";

export const productSchema = z.object({
  title: z.string()
    .trim()
    .min(3, { message: "Title must be at least 3 characters long." })
    .max(100, { message: "Title must not exceed 100 characters." }),

  description: z.string()
    .trim()
    .min(10, { message: "Description must be at least 10 characters long." })
    .max(1000, { message: "Description must not exceed 1000 characters." }),

  category: z.enum(["books", 
    "electronics", 
    "cycles", 
    "hostel essentials", 
    "projects", 
    "other"], { message: "Invalid category selected." }),

  condition: z.enum(["like new", "good", "fair", "poor"], {
    message: "Condition must be 'like new', 'good', 'fair', or 'poor'.",
  }),

  saletype: z.enum(["fixed price", "auction", "open to offers"], {
    message: "Sale type must be 'fixed price', 'auction', or 'open to offers'.",
  }),

  price: z.number()
    .min(1, { message: "Price must be greater than 0." })
    .optional(),

  images: z.array(z.string().url({ message: "Each image must be a valid URL." }))
    .max(5, { message: "You can upload up to 5 images only." }),

  contactMethod: z.enum(["phone", "email", "both"], {
    message: "Contact method must be 'phone', 'email', or 'both'.",
  }),

  phone: z.string()
    .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits." })
    .optional(),

  email: z.string()
    .email({ message: "Invalid email format." })
    .optional(),

  meetingLocation: z.string()
    .trim()
    .min(3, { message: "Meeting location must be at least 3 characters long." }),

}).refine((data) => {
  if (data.contactMethod === "phone" || data.contactMethod === "both") {
    return data.phone !== undefined;
  }
  return true;
}, { message: "Phone number is required when contact method is 'phone' or 'both'." })
.refine((data) => {
  if (data.contactMethod === "email" || data.contactMethod === "both") {
    return data.email !== undefined;
  }
  return true;
}, { message: "Email is required when contact method is 'email' or 'both'." });
