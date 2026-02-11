import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Nursery from '@/models/Nursery';
import { promises as fs } from 'fs';
import path from 'path';

// Helper for local file fallback
const dataFilePath = path.join(process.cwd(), 'lib/data.json');

async function readFileData() {
    try {
        const fileContents = await fs.readFile(dataFilePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (e) { return { nurseries: [] }; }
}

export async function GET(request, { params }) {
    const { id } = await params;

    try {
        await dbConnect();

        // Try finding by custom 'id' string first
        let nursery = await Nursery.findOne({ id: id });

        // If not found, try by MongoDB _id
        if (!nursery && id.match(/^[0-9a-fA-F]{24}$/)) {
            nursery = await Nursery.findById(id);
        }

        if (nursery) {
            return NextResponse.json(nursery);
        }
    } catch (e) {
        console.warn("MongoDB Fetch Error (Single Nursery):", e);
    }

    // Fallback to File System
    const data = await readFileData();
    const localNursery = data.nurseries?.find(n => n.id === id || n._id === id);

    if (!localNursery) {
        return NextResponse.json({ error: 'Nursery not found' }, { status: 404 });
    }

    return NextResponse.json(localNursery);
}

export async function PUT(request, { params }) {
    const { id } = await params;

    try {
        const body = await request.json();
        await dbConnect();

        // Try updating by custom 'id'
        let updatedNursery = await Nursery.findOneAndUpdate(
            { id: id },
            { $set: body },
            { new: true }
        );

        // If not found, try by MongoDB _id
        if (!updatedNursery && id.match(/^[0-9a-fA-F]{24}$/)) {
            updatedNursery = await Nursery.findByIdAndUpdate(
                id,
                { $set: body },
                { new: true }
            );
        }

        if (updatedNursery) {
            return NextResponse.json(updatedNursery);
        }

    } catch (e) {
        console.warn("MongoDB Update Error (Single Nursery):", e);
        // If MongoDB fails, we might still want to try returning error or fallback
        // But for editing, reliability is key. If DB is connected, we expect it to work.
    }

    // Fallback Update (only if not found or DB error)
    if (process.env.NODE_ENV !== 'production') {
        const data = await readFileData();
        const index = data.nurseries?.findIndex(n => n.id === id);

        if (index !== -1) {
            data.nurseries[index] = { ...data.nurseries[index], ...body };
            await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
            return NextResponse.json(data.nurseries[index]);
        }
    }

    return NextResponse.json({ error: 'Nursery not found or Update Failed' }, { status: 404 });
}
