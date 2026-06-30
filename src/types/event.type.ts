import { z } from "zod";

export const EventSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    date: z.string().min(1, "Date is required"),
    time: z.string().min(1, "Time is required"),
    location: z.string().min(1, "Location is required"),
    price: z.number().min(0, "Price cannot be negative"),
    category: z.enum(["music", "sports", "theater", "art", "comedy"], {
        errorMap: () => ({ message: "Invalid category. Choose from: music, sports, theater, art, comedy" }),
    }),
    image: z.string().nullable().optional(),
    createdBy: z.string().min(1, "Creator ID is required"),
});

export type EventType = z.infer<typeof EventSchema>;
