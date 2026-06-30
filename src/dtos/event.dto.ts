import { z } from "zod";
import { EventSchema } from "../types/event.type";

// DTO for creating an event (createdBy is set programmatically from Auth token)
export const CreateEventDTO = EventSchema.omit({ createdBy: true });
export type CreateEventDTO = z.infer<typeof CreateEventDTO>;

// DTO for updating an event (all fields optional)
export const UpdateEventDTO = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long").optional(),
    description: z.string().min(10, "Description must be at least 10 characters long").optional(),
    date: z.string().min(1, "Date is required").optional(),
    time: z.string().min(1, "Time is required").optional(),
    location: z.string().min(1, "Location is required").optional(),
    price: z.number().min(0, "Price cannot be negative").optional(),
    category: z.enum(["music", "sports", "theater", "art", "comedy"]).optional(),
    image: z.string().nullable().optional(),
});
export type UpdateEventDTO = z.infer<typeof UpdateEventDTO>;

// DTO for querying events list (?page=&limit=&search=&category=&createdBy=)
export const GetEventsQueryDTO = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().optional(),
    category: z.enum(["music", "sports", "theater", "art", "comedy"]).optional(),
    createdBy: z.string().optional(),
});
export type GetEventsQueryDTO = z.infer<typeof GetEventsQueryDTO>;
