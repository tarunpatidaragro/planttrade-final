import dbConnect from '@/lib/mongoose';
import Nursery from '@/models/Nursery';
import Product from '@/models/Product';
import { promises as fs } from 'fs';
import path from 'path';

async function getData() {
  try {
    await dbConnect();
    const nurseries = await Nursery.find({}).sort({ createdAt: -1 }).limit(6).lean();
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(8).lean();

    // Normalize IDs
    const safeNurseries = nurseries.map(n => ({ ...n, _id: n._id.toString() }));
    const safeProducts = products.map(p => ({ ...p, _id: p._id.toString() }));

    return {
      nurseries: safeNurseries,
      products: safeProducts,
      categories: [] // Categories can be static or fetched if we have a model
    };

  } catch (e) {
    console.warn("MongoDB Fetch Error (Home):", e);
    if (process.env.NODE_ENV !== 'production') {
      const filePath = path.join(process.cwd(), 'lib/data.json');
      try {
        const jsonData = await fs.readFile(filePath, 'utf8');
        return JSON.parse(jsonData);
      } catch (err) { return { nurseries: [], products: [] }; }
    }
    return { nurseries: [], products: [] };
  }
}

import HomeFeed from './components/HomeFeed';
import { blogPosts } from '../lib/blogData';

export default async function Home() {
  const data = await getData();
  const nurseries = data.nurseries || [];
  const products = (data.products || []).slice(0, 8);
  const categories = data.categories || [];
  const posts = blogPosts.slice(0, 3);
  return <HomeFeed nurseries={nurseries} products={products} posts={posts} categories={categories} />;
}
