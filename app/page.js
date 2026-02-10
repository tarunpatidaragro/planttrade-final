import { promises as fs } from 'fs';
import path from 'path';
import HomeFeed from './components/HomeFeed';
import { blogPosts } from '../lib/blogData';

async function getData() {
  const filePath = path.join(process.cwd(), 'lib/data.json');
  const jsonData = await fs.readFile(filePath, 'utf8');
  const data = JSON.parse(jsonData);
  return data;
}

export default async function Home() {
  const data = await getData();
  const nurseries = data.nurseries;
  const products = data.products.slice(0, 8);

  const posts = blogPosts.slice(0, 3);
  return <HomeFeed nurseries={nurseries} products={products} posts={posts} />;
}
