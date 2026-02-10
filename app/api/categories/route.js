import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'lib/data.json');

const defaultCategories = [
    { name: 'Indoor', image: 'https://images.unsplash.com/photo-1599687351724-dfa3c4ff81b1?auto=format&fit=crop&w=150&q=80', description: 'Perfect for living rooms and low light.' },
    { name: 'Outdoor', image: 'https://images.unsplash.com/photo-1614594975525-e45852b82481?auto=format&fit=crop&w=150&q=80', description: 'For gardens, balconies and full sun.' },
    { name: 'Flowering', image: 'https://images.unsplash.com/photo-1598512752271-33f913a5af13?auto=format&fit=crop&w=150&q=80', description: 'Seasonal and perennial blooms.' },
    { name: 'Fruit', image: 'https://images.unsplash.com/photo-1622383563227-0430138f2976?auto=format&fit=crop&w=150&q=80', description: 'Grow your own organic fruit.' },
    { name: 'Medicinal', image: 'https://images.unsplash.com/photo-1526304640152-d4619684e484?auto=format&fit=crop&w=150&q=80', description: 'Herbs and healing plants.' },
    { name: 'Succulents', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=150&q=80', description: 'Low maintenance beauties.' },
    { name: 'Seeds', image: 'https://images.unsplash.com/photo-1445510440086-60aca5c156dc?auto=format&fit=crop&w=150&q=80', description: 'Start your garden from scratch.' },
    { name: 'Pots', image: 'https://images.unsplash.com/photo-1459156212016-c812468e2115?auto=format&fit=crop&w=150&q=80', description: 'Planters and containers.' },
    { name: 'Sacred', image: 'https://images.unsplash.com/photo-1634320958189-eeb52119e685?auto=format&fit=crop&w=150&q=80', description: 'Tulsi, Bel Patra and more.' }
];

async function readData() {
    try {
        const fileContents = await fs.readFile(dataFilePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (e) {
        return { categories: [] };
    }
}

export async function GET() {
    const data = await readData();
    let cats = data.categories || [];

    // Seed defaults if empty
    if (cats.length === 0) {
        cats = defaultCategories;
        data.categories = cats;
        // Try to save back if possible (might fail on readonly fs, but locally fine)
        try { await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2)); } catch (e) { }
    }

    return NextResponse.json(cats);
}

export async function POST(request) {
    try {
        const body = await request.json(); // { name, image, description }

        if (!body.name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

        const data = await readData();
        if (!data.categories) data.categories = defaultCategories;

        // Check duplicate
        if (!data.categories.find(c => c.name.toLowerCase() === body.name.toLowerCase())) {
            data.categories.push({
                name: body.name,
                image: body.image || 'https://via.placeholder.com/150',
                description: body.description || ''
            });
            await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
        }

        return NextResponse.json(data.categories);
    } catch (e) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const body = await request.json(); // { oldName, name, image, description }
        if (!body.oldName) return NextResponse.json({ error: 'Old Name required' }, { status: 400 });

        const data = await readData();
        const index = data.categories.findIndex(c => c.name === body.oldName);

        if (index === -1) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

        // Update
        data.categories[index] = {
            name: body.name || data.categories[index].name,
            image: body.image || data.categories[index].image,
            description: body.description || data.categories[index].description
        };

        await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
        return NextResponse.json(data.categories);
    } catch (e) {
        return NextResponse.json({ error: 'Update Failed' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const name = searchParams.get('name');

        const data = await readData();
        data.categories = data.categories.filter(c => c.name !== name);

        await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
        return NextResponse.json(data.categories);
    } catch (e) {
        return NextResponse.json({ error: 'Delete Failed' }, { status: 500 });
    }
}
