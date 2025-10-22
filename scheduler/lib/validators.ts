import { DateTime } from "luxon";
import { z } from "zod";

const isoDateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(\.\d+)?Z/;

export const AvailabilityQuerySchema = z.object({
  from: z
    .string()
    .regex(isoDateRegex, "from must be an ISO-8601 UTC string"),
  to: z
    .string()
    .regex(isoDateRegex, "to must be an ISO-8601 UTC string")
}).refine(({ from, to }) => DateTime.fromISO(to) > DateTime.fromISO(from), {
  message: "to must be after from"
});

export const BookingRequestSchema = z
  .object({
    startTs: z.string().regex(isoDateRegex, "startTs must be an ISO-8601 UTC string"),
    endTs: z.string().regex(isoDateRegex, "endTs must be an ISO-8601 UTC string"),
    guestName: z.string().min(2).max(120),
    guestPhone: z
      .string()
      .regex(/^\+[1-9][0-9]{6,14}$/, "guestPhone must be a valid E.164 number")
  })
  .refine((value) => DateTime.fromISO(value.endTs) > DateTime.fromISO(value.startTs), {
    message: "endTs must be later than startTs",
    path: ["endTs"]
  });

export const SettingsUpdateSchema = z.object({
  title: z.string().min(1).max(120),
  timezone: z
    .string()
    .refine((tz) => DateTime.now().setZone(tz).isValid, "Invalid IANA timezone")
});

const slotValues = [15, 20, 30, 45, 60] as const;

export const AvailabilityWindowInputSchema = z
  .object({
    id: z.string().uuid().optional(),
    weekday: z.number().int().min(1).max(7),
    startMinute: z.number().int().min(0).max(1439),
    endMinute: z.number().int().min(1).max(1440),
    slotMinutes: z.number().int().refine((value) => slotValues.includes(value as any), "Invalid slot length")
  })
  .refine((value) => value.endMinute > value.startMinute, {
    message: "endMinute must be greater than startMinute",
    path: ["endMinute"]
  });

export const WindowsMutationSchema = z.object({
  upserts: z.array(AvailabilityWindowInputSchema).default([]),
  deletes: z.array(z.string().uuid()).default([])
});

export type AvailabilityQueryInput = z.infer<typeof AvailabilityQuerySchema>;
export type BookingRequestInput = z.infer<typeof BookingRequestSchema>;
export type SettingsUpdateInput = z.infer<typeof SettingsUpdateSchema>;
export type AvailabilityWindowInput = z.infer<typeof AvailabilityWindowInputSchema>;
export type WindowsMutationInput = z.infer<typeof WindowsMutationSchema>;
