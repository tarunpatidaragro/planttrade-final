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

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const nurseryId = searchParams.get('nurseryId');
        const data = await readData();

        if (nurseryId) {
            return NextResponse.json(data.products.filter(p => p.nurseryId === nurseryId));
        }
        return NextResponse.json(data.products);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const data = await readData();

        const newProduct = {
            id: Date.now(),
            ...body
        };

        if (!newProduct.name || !newProduct.price || !newProduct.nurseryId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        data.products.push(newProduct);
        await writeData(data);

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save product' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = parseInt(searchParams.get('id'));
        const data = await readData();

        data.products = data.products.filter(p => p.id !== id);
        await writeData(data);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
