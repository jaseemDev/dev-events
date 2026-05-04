/**
 * Single entry-point for all database models.
 * Import from here instead of referencing individual model files directly.
 *
 * Usage:
 *   import { Event, Booking } from "@/database";
 */

export { default as Event } from "./event.model";
export { default as Booking } from "./booking.model";

// Re-export interfaces so consumers can type their variables without
// importing from the individual model files.
export type { IEvent } from "./event.model";
export type { IBooking } from "./booking.model";
