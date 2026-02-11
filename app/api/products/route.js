import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Product from '@/models/Product';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'lib/data.json');

async function readFileData() {
    try {
        const fileContents = await fs.readFile(dataFilePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (e) { return { products: [] }; }
}

async function writeFileData(data) {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const nurseryId = searchParams.get('nurseryId');

        const conn = await dbConnect();
        if (conn) {
            const query = nurseryId ? { nurseryId } : {};
            const products = await Product.find(query).sort({ createdAt: -1 });
            return NextResponse.json(products);
        }
    } catch (e) { console.warn("MongoDB Error:", e); }

    // Fallback
    const data = await readFileData();
    if (nurseryId) {
        return NextResponse.json(data.products?.filter(p => p.nurseryId === nurseryId) || []);
    }
    return NextResponse.json(data.products || []);
}

export async function POST(request) {
    try {
        const body = await request.json();

        // Basic Validation
        if (!body.name || !body.price || !body.nurseryId) {
            return NextResponse.json({ error: 'Name, Price and Nursery ID are required' }, { status: 400 });
        }

        const newProductData = {
            id: body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
            ...body
        };

        const conn = await dbConnect();
        if (conn) {
            try {
                // Check if ID exists (handled by unique index too, but good for custom logic)
                const existing = await Product.findOne({ id: newProductData.id });
                if (existing) {
                    newProductData.id = `${newProductData.id}-${Date.now()}`;
                }
                const product = await Product.create(newProductData);
                return NextResponse.json(product, { status: 201 });
            } catch (mongoErr) {
                // If it's a dupe key error despite our check (race condition), retry with timestamp
                if (mongoErr.code === 11000) {
                    newProductData.id = `${newProductData.id}-${Date.now()}`;
                    const product = await Product.create(newProductData);
                    return NextResponse.json(product, { status: 201 });
                }
                throw mongoErr;
            }
        }

        // --- FILE SYSTEM FALLBACK ---

        // STOP here if on Vercel (Production) to avoid EROFS crash
        if (process.env.NODE_ENV === 'production') {
            return NextResponse.json({
                error: 'Configuration Required: Database connection missing. Vercel is read-only. Please add MONGODB_URI to your Vercel Environment Variables.'
            }, { status: 500 });
        }

        const data = await readFileData();
        if (!data.products) data.products = [];

        // Ensure unique ID for file system too
        if (data.products.some(p => p.id === newProductData.id)) {
            newProductData.id = `${newProductData.id}-${Date.now()}`;
        }

        data.products.push(newProductData);
        await writeFileData(data);

        return NextResponse.json(newProductData, { status: 201 });
    } catch (error) {
        console.error("API POST Error:", error);
        return NextResponse.json({ error: `Failed to save product: ${error.message}` }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id'); // String ID

        const conn = await dbConnect();
        if (conn) {
            await Product.findOneAndDelete({ id });
            return NextResponse.json({ success: true });
        }

        // Fallback
        if (process.env.NODE_ENV === 'production') {
            return NextResponse.json({ error: 'Database missing' }, { status: 500 });
        }

        const data = await readFileData();
        data.products = data.products.filter(p => p.id !== id && p.id != id); // Handle string vs int issues
        await writeFileData(data);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
