import mongoose, { Document, Model, Schema, Types } from "mongoose";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** RFC-5322–inspired regex for validating email addresses. */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const BookingSchema = new Schema<IBooking>(
  {
    // Indexed for efficient lookups of all bookings belonging to an event.
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "eventId is required"],
      index: true,
    },

    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => EMAIL_REGEX.test(v),
        message: (props: { value: string }) =>
          `"${props.value}" is not a valid email address`,
      },
    },
  },
  {
    timestamps: true, // auto-manages createdAt / updatedAt
  }
);

// ---------------------------------------------------------------------------
// Pre-save hook
// ---------------------------------------------------------------------------

/**
 * Before persisting a booking, confirm the referenced event actually exists.
 * Failing early here prevents orphaned bookings in the database and surfaces
 * the problem at write time rather than at query time.
 */
BookingSchema.pre<IBooking>("save", async function (next) {
  try {
    // Only run the DB round-trip when eventId is new or has changed.
    if (this.isModified("eventId")) {
      // Lazy-require to avoid a circular-import issue if models share a file.
      const Event = mongoose.model("Event");

      const eventExists = await Event.exists({ _id: this.eventId });

      if (!eventExists) {
        throw new Error(
          `Event with id "${this.eventId}" does not exist`
        );
      }
    }

    // @ts-ignore
    next();
  } catch (err) {
    // @ts-ignore
    next(err instanceof Error ? err : new Error(String(err)));
  }
});

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------

// Guard against model re-registration during Next.js hot-module replacement.
const Booking: Model<IBooking> =
  mongoose.models.Booking ??
  mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
