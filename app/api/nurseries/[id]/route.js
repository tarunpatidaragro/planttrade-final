import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'lib/data.json');

async function readData() {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(fileContents);
}

async function writeData(data) {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

export async function GET(request, { params }) {
    const { id } = await params;
    try {
        const data = await readData();
        const nursery = data.nurseries.find(n => n.id === id);
        if (!nursery) return NextResponse.json({ error: 'Nursery not found' }, { status: 404 });
        return NextResponse.json(nursery);
    } catch (e) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const { id } = await params;
    try {
        const body = await request.json();
        const data = await readData();
        const index = data.nurseries.findIndex(n => n.id === id);

        if (index === -1) return NextResponse.json({ error: 'Nursery not found' }, { status: 404 });

        // Update fields
        data.nurseries[index] = { ...data.nurseries[index], ...body };
        await writeData(data);

        return NextResponse.json(data.nurseries[index]);
    } catch (e) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
