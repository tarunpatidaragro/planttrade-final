import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'lib/data.json');

// Helper to read data
async function readData() {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(fileContents);
}

// Helper to write data
async function writeData(data) {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

export async function GET() {
    try {
        const data = await readData();
        return NextResponse.json(data.nurseries);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const data = await readData();

        // Basic Validation
        if (!body.name || !body.location || !body.contact?.phone) {
            return NextResponse.json({ error: 'Name, Location and Phone are required' }, { status: 400 });
        }

        const newNursery = {
            id: body.id || body.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            ...body
        };

        // Check for duplicate ID
        if (data.nurseries.some(n => n.id === newNursery.id)) {
            newNursery.id = newNursery.id + '-' + Date.now();
        }

        data.nurseries.push(newNursery);
        await writeData(data);

        return NextResponse.json(newNursery, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create nursery' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const body = await request.json();
        const data = await readData();
        const index = data.nurseries.findIndex(n => n.id === body.id);

        if (index === -1) return NextResponse.json({ error: 'Nursery not found' }, { status: 404 });

        data.nurseries[index] = { ...data.nurseries[index], ...body };
        await writeData(data);

        return NextResponse.json(data.nurseries[index]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const data = await readData();

        data.nurseries = data.nurseries.filter(n => n.id !== id);
        // Optional: Delete associated products
        data.products = data.products.filter(p => p.nurseryId !== id);

        await writeData(data);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
