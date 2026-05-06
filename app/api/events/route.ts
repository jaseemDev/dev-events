import {NextRequest, NextResponse} from "next/server";
import {connectToDatabase} from "@/lib/mongodb";
import Event from '@/database/event.model';
import {v2 as cloudinary} from 'cloudinary';
import {UploadApiResponse} from 'cloudinary';

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        const formData = await req.formData();

        const file = formData.get('image') as File;

        // ✅ Validate it's actually a File object, not a string
        if (!file || !(file instanceof File) || file.size === 0) {
            return NextResponse.json({message: "File is required"}, {status: 400});
        }

        let tags = JSON.parse(formData.get('tags') as string);
        let agenda = JSON.parse(formData.get('agenda') as string);
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // ✅ Resolve with `result`, not `buffer`
        const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {resource_type: "image", folder: "events"},
                (error, result) => {
                    if (error) return reject(error);
                    if (!result) return reject(new Error("No result from Cloudinary"));
                    resolve(result); // ✅ Fix here
                }
            ).end(buffer);
        });

        // Build event object from remaining form fields
        const event = Object.fromEntries(formData.entries());
        event.image = uploadResult.secure_url; // ✅ Now this works

        const createdEvent = await Event.create({
            ...event,
            tags: tags,
            agenda: agenda,
        });
        return NextResponse.json(
            {message: "Event created successfully.", event: createdEvent},
            {status: 201}
        );

    } catch (e) {
        console.error(e);
        return NextResponse.json({
            message: 'Error posting route',
            error: e instanceof Error ? e.message : "Unknown error"
        }, {status: 500});
    }
}


export async function GET(req: NextRequest, res: NextResponse) {
    try {
        await connectToDatabase()
        const events = await Event.find().sort({createdAt: -1});
        return NextResponse.json({message: "Event fetched successfully.", data: events}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: 'Event fetching failed', error: error}, {status: 500})
    }
}