import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Settings from '@/models/Settings';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'lib/data.json');

async function readFileData() {
    try {
        const fileContents = await fs.readFile(dataFilePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (e) { return {}; }
}

async function writeFileData(data) {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

export async function GET() {
    try {
        const conn = await dbConnect();
        if (conn) {
            const setting = await Settings.findOne({ key: 'hero' });
            if (setting) return NextResponse.json(setting.value);
        }
    } catch (e) { }

    const data = await readFileData();
    const hero = data.hero || {
        title: "Bring Nature Home",
        subtitle: "Discover thousands of rare and common plants from trusted independent nurseries.",
        image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=2000"
    };
    return NextResponse.json(hero);
}

export async function POST(request) {
    try {
        const body = await request.json();

        const conn = await dbConnect();
        if (conn) {
            // Upsert (Update if exists, Insert if not)
            const updated = await Settings.findOneAndUpdate(
                { key: 'hero' },
                { key: 'hero', value: body },
                { new: true, upsert: true }
            );
            return NextResponse.json(updated.value);
        }

        if (process.env.NODE_ENV === 'production') {
            return NextResponse.json({
                error: 'Configuration Required: Database connection missing. Vercel is read-only. Please add MONGODB_URI to your Vercel Environment Variables.'
            }, { status: 500 });
        }

        const data = await readFileData();
        data.hero = { ...data.hero, ...body };
        await writeFileData(data);
        return NextResponse.json(data.hero);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: `Failed to update settings: ${error.message}` }, { status: 500 });
    }
}
