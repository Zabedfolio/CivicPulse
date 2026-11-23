import { z } from "zod";

export const ISSUE_CATEGORIES = [
  "Road Damage",
  "Streetlight",
  "Drainage",
  "Footpath",
  "Waste Management",
  "Public Infrastructure",
];

export const ISSUE_PRIORITIES = ["low", "medium", "high", "critical"];

export const issueReportSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must not exceed 100 characters"),
  description: z
    .string()
    .trim()
    .min(15, "Please provide at least 15 characters describing the issue location and severity"),
  category: z.enum(ISSUE_CATEGORIES, {
    errorMap: () => ({ message: "Please select an infrastructure category" }),
  }),
  priority: z.enum(ISSUE_PRIORITIES).default("medium"),
  address: z
    .string()
    .trim()
    .min(5, "Please specify an accurate street address, ward, or landmark"),
  latitude: z.coerce
    .number()
    .min(-90, "Valid latitude is required (-90 to 90)")
    .max(90, "Valid latitude is required (-90 to 90)"),
  longitude: z.coerce
    .number()
    .min(-180, "Valid longitude is required (-180 to 180)")
    .max(180, "Valid longitude is required (-180 to 180)"),
  image: z.any().optional(),
});
