'use server'
import {connectToDatabase} from "@/lib/mongodb";
import Event from '@/database/event.model';

export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        await connectToDatabase();

        const event = await Event.findOne({slug}).lean();

        // Return early if the source event doesn't exist
        if (!event) return [];

        return await Event.find({
            _id: {$ne: event._id},        // ✅ exclude current event
            tags: {$in: event.tags ?? []} // ✅ match by shared tags
        }).lean().exec();

    } catch (e) {
        console.error('[getSimilarEventsBySlug]', e);
        return [];
    }
};