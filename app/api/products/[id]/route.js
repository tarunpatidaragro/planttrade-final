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
        // find product by id (string or number safe check)
        const product = data.products.find(p => p.id == id);

        if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        return NextResponse.json(product);
    } catch (e) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const { id } = await params;
    try {
        const body = await request.json();
        const data = await readData();
        const index = data.products.findIndex(p => p.id == id);

        if (index === -1) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

        // Update fields
        data.products[index] = { ...data.products[index], ...body };
        await writeData(data);

        return NextResponse.json(data.products[index]);
    } catch (e) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const { id } = await params;
    try {
        const data = await readData();
        data.products = data.products.filter(p => p.id != id);
        await writeData(data);
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
