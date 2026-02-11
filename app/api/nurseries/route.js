import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Nursery from '@/models/Nursery';

// Fallback to file system if no DB (for local dev without mongo)
import { promises as fs } from 'fs';
import path from 'path';
const dataFilePath = path.join(process.cwd(), 'lib/data.json');

async function readFileData() {
    try {
        const fileContents = await fs.readFile(dataFilePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (e) { return { nurseries: [] }; }
}

async function writeFileData(data) {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

export async function GET() {
    try {
        const conn = await dbConnect();
        if (conn) {
            const nurseries = await Nursery.find({}).sort({ createdAt: -1 });
            return NextResponse.json(nurseries);
        }
    } catch (e) {
        console.warn("MongoDB Error, falling back to file:", e);
    }

    // Fallback
    const data = await readFileData();
    return NextResponse.json(data.nurseries || []);
}

export async function POST(request) {
    try {
        const body = await request.json();

        // Validation
        const cleanId = body.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') || `n-${Date.now()}`;

        // Basic Fields Validation
        if (!body.name) return NextResponse.json({ error: "Nursery Name is required" }, { status: 400 });
        if (!body.location && (!body.contact?.city || !body.contact?.state)) return NextResponse.json({ error: "Location (City/State) is required" }, { status: 400 });
        if (!body.contact?.phone) return NextResponse.json({ error: "Phone Number is required" }, { status: 400 });

        const newNurseryData = {
            id: cleanId,
            ...body
        };

        const conn = await dbConnect();
        if (conn) {
            try {
                const nursery = await Nursery.create(newNurseryData);
                return NextResponse.json(nursery, { status: 201 });
            } catch (mongoErr) {
                // Duplicate key error
                if (mongoErr.code === 11000) {
                    newNurseryData.id = `${cleanId}-${Date.now()}`;
                    const nursery = await Nursery.create(newNurseryData);
                    return NextResponse.json(nursery, { status: 201 });
                }
                throw mongoErr;
            }
        }

        // File System Fallback
        if (process.env.NODE_ENV === 'production') {
            return NextResponse.json({
                error: 'Configuration Required: Database connection missing. Vercel is read-only. Please add MONGODB_URI to your Vercel Environment Variables.'
            }, { status: 500 });
        }

        console.warn("Using File System Fallback (Not persistent on Vercel)");
        const data = await readFileData();
        if (!data.nurseries) data.nurseries = [];

        // Check Duplicate
        if (data.nurseries.some(n => n.id === newNurseryData.id)) {
            newNurseryData.id = `${newNurseryData.id}-${Date.now()}`;
        }

        data.nurseries.push(newNurseryData);
        await writeFileData(data);

        return NextResponse.json(newNurseryData, { status: 201 });

    } catch (error) {
        console.error("API POST Error:", error);
        return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
    }
}

// Implement DELETE/PUT similarly if needed, but for now focus on Adding/Viewing
export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    try {
        const conn = await dbConnect();
        if (conn) {
            await Nursery.findOneAndDelete({ id });
            return NextResponse.json({ success: true });
        }
    } catch (e) { }
    return NextResponse.json({ success: true });
}
