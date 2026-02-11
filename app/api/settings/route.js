import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'lib/data.json');

async function readData() {
    try {
        const fileContents = await fs.readFile(dataFilePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (e) {
        return {};
    }
}

async function writeData(data) {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

export async function GET() {
    const data = await readData();
    // Return existing hero settings or default
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
        const data = await readData();

        data.hero = {
            ...data.hero,
            ...body
        };

        await writeData(data);
        return NextResponse.json(data.hero);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
