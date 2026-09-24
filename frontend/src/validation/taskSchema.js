import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .regex(
      /^[a-zA-Z ]+$/,
      "Title must contain only letters and spaces"
    ),

  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .regex(
      /^[a-z ]+$/,
      "Description must contain only lowercase letters and spaces"
    ),

  priority: z
    .string()
    .refine(
      (value) =>
        ["LOW", "MEDIUM", "HIGH"].includes(value),
      "Priority must be LOW, MEDIUM, or HIGH"
    ),

  assignedTo: z
    .string()
    .min(1, "Please select an employee"),
});