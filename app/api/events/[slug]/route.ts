import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Event, {IEvent} from "@/database/event.model";
import mongoose from "mongoose";

/** Shape of the dynamic route context provided by Next.js */
interface RouteContext {
    params: { slug: string };
}

export async function GET(
    req: NextRequest,
    { params }: RouteContext
): Promise<NextResponse> {
    try {
        const { slug } = await params;
        console.log("here")


        // ── 1. Validate slug presence ────────────────────────────────────────────
        if (!slug || slug.trim() === "") {
            return NextResponse.json(
                { message: "Slug parameter is missing or invalid." },
                { status: 400 }
            );
        }

        // Slugs should only contain lowercase letters, digits, and hyphens
        const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
        if (!SLUG_REGEX.test(slug)) {
            return NextResponse.json(
                {
                    message:
                        "Invalid slug format. Slugs must contain only lowercase letters, digits, and hyphens.",
                },
                { status: 400 }
            );
        }

        // ── 2. Connect to the database ───────────────────────────────────────────
        await connectToDatabase();

        // ── 3. Query the Event collection ────────────────────────────────────────
        // Use .lean() for a plain JS object — faster and avoids unnecessary Mongoose overhead
        const event = await Event.findOne({ slug })
            .lean<IEvent>()
            .exec();

        // ── 4. Handle not-found case ─────────────────────────────────────────────
        if (!event) {
            return NextResponse.json(
                { message: `No event found with slug: "${slug}".` },
                { status: 404 }
            );
        }

        // ── 5. Return the event ──────────────────────────────────────────────────
        return NextResponse.json(
            { message: "Event fetched successfully.", data:event },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error("[GET /api/events/[slug]] Unexpected error:", error);

        // Surface a clear message without leaking internal details
        const message =
            error instanceof Error ? error.message : "An unexpected error occurred.";

        return NextResponse.json(
            { message: "Internal server error.", error: message },
            { status: 500 }
        );
    }
}