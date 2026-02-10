import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'lib/data.json');

const defaultPosts = [
    {
        id: "1",
        title: "10 Best Air-Purifying Plants for Indian Homes",
        excerpt: "Discover plants that not only look good but also clean the air you breathe. Perfect for city living.",
        content: `
      <p>In the bustling cities of India, air quality can be a major concern. Fortunately, nature has provided us with a simple solution: air-purifying plants. These green companions not only beautify our homes but also work tirelessly to remove toxins from the air.</p>
      <h2>1. Snake Plant (Sansevieria)</h2>
      <p>Also known as "Mother-in-Law's Tongue," this plant is a powerhouse. It releases oxygen at night, making it perfect for bedrooms. It's incredibly hardy and requires very little water.</p>
      <h2>2. Spider Plant (Chlorophytum comosum)</h2>
      <p>Great for beginners, the Spider Plant fights formaldehyde and xylene. It produces "pups" that you can re-pot and gift to friends!</p>
    `,
        image: "https://images.unsplash.com/photo-1512428559087-560fa0db44b5?auto=format&fit=crop&q=80&w=800",
        date: "Feb 8, 2026",
        author: "Dr. Lakshmi Rao"
    },
    {
        id: "2",
        title: "How to Care for Succulents in Monsoon",
        excerpt: "Monsoon can be tricky for succulents. Learn simple tips to keep your cacti and succulents healthy.",
        content: "Monsoon brings relief from the heat, but for succulent lovers, it brings anxiety.",
        image: "https://images.unsplash.com/photo-1459156212016-c812468e2115?auto=format&fit=crop&q=80&w=800",
        date: "Jan 15, 2026",
        author: "Rahul Verma"
    }
];


async function readData() {
    try {
        const fileContents = await fs.readFile(dataFilePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (e) {
        return { posts: [] };
    }
}

export async function GET() {
    const data = await readData();
    let posts = data.posts || [];

    // Seed defaults if empty
    if (posts.length === 0) {
        posts = defaultPosts;
        data.posts = posts;
        // Try to save
        try { await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2)); } catch (e) { }
    }

    return NextResponse.json(posts);
}

export async function POST(request) {
    try {
        const body = await request.json();
        const data = await readData();

        if (!data.posts) data.posts = defaultPosts;

        const newPost = {
            id: Date.now().toString(), // Simple ID
            title: body.title,
            excerpt: body.excerpt,
            content: body.content,
            image: body.image,
            author: body.author || 'PlantTrade Admin',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };

        // Add to TOP of list
        data.posts.unshift(newPost);
        await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));

        return NextResponse.json(newPost);
    } catch (e) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        const data = await readData();
        if (data.posts) {
            data.posts = data.posts.filter(p => p.id !== id);
            await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Delete Failed' }, { status: 500 });
    }
}
