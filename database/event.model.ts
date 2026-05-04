import mongoose, { Document, Model, Schema } from "mongoose";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: "online" | "offline" | "hybrid";
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Converts a title into a URL-friendly slug.
 * e.g. "Hello World! 2025" → "hello-world-2025"
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // strip non-alphanumeric chars
    .replace(/\s+/g, "-")         // collapse whitespace to hyphens
    .replace(/-+/g, "-");         // collapse consecutive hyphens
}

/**
 * Normalises a date string to ISO 8601 (YYYY-MM-DD).
 * Throws if the value cannot be parsed into a valid date.
 */
function normalizeDate(raw: string): string {
  const parsed = new Date(raw);
  if (isNaN(parsed.getTime())) {
    throw new Error(`Invalid date value: "${raw}"`);
  }
  return parsed.toISOString().split("T")[0]; // "YYYY-MM-DD"
}

/**
 * Normalises a time string to HH:MM (24-hour).
 * Accepts "9:5", "09:05", "9:05 AM", "21:30", etc.
 * Throws if the value cannot be parsed.
 */
function normalizeTime(raw: string): string {
  // Match optional leading zero, minutes, and optional AM/PM
  const match = raw
    .trim()
    .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);

  if (!match) {
    throw new Error(`Invalid time value: "${raw}". Expected HH:MM or HH:MM AM/PM`);
  }

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3]?.toUpperCase();

  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  if (hours > 23 || minutes > 59) {
    throw new Error(`Time out of range: "${raw}"`);
  }

  // Zero-pad to "HH:MM"
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },

    // Populated automatically in the pre-save hook; unique index below.
    slug: {
      type: String,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      required: [true, "description is required"],
      trim: true,
    },

    overview: {
      type: String,
      required: [true, "overview is required"],
      trim: true,
    },

    image: {
      type: String,
      required: [true, "image is required"],
      trim: true,
    },

    venue: {
      type: String,
      required: [true, "venue is required"],
      trim: true,
    },

    location: {
      type: String,
      required: [true, "location is required"],
      trim: true,
    },

    // Stored in normalised ISO format (YYYY-MM-DD) after pre-save hook.
    date: {
      type: String,
      required: [true, "date is required"],
    },

    // Stored in normalised 24-hour format (HH:MM) after pre-save hook.
    time: {
      type: String,
      required: [true, "time is required"],
    },

    mode: {
      type: String,
      enum: {
        values: ["online", "offline", "hybrid"],
        message: 'mode must be "online", "offline", or "hybrid"',
      },
      required: [true, "mode is required"],
    },

    audience: {
      type: String,
      required: [true, "audience is required"],
      trim: true,
    },

    agenda: {
      type: [String],
      required: [true, "agenda is required"],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "agenda must contain at least one item",
      },
    },

    organizer: {
      type: String,
      required: [true, "organizer is required"],
      trim: true,
    },

    tags: {
      type: [String],
      required: [true, "tags is required"],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "tags must contain at least one item",
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

EventSchema.pre<IEvent>("save", function (next) {
  try {
    // --- Slug: only regenerate when title changes to avoid breaking URLs ---
    if (this.isModified("title")) {
      this.slug = generateSlug(this.title);
    }

    // --- Date: normalise to ISO "YYYY-MM-DD" on every change ---
    if (this.isModified("date")) {
      this.date = normalizeDate(this.date);
    }

    // --- Time: normalise to 24-hour "HH:MM" on every change ---
    if (this.isModified("time")) {
      this.time = normalizeTime(this.time);
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
const Event: Model<IEvent> =
  mongoose.models.Event ?? mongoose.model<IEvent>("Event", EventSchema);

export default Event;
