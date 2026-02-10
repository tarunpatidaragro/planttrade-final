import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import ProductCard from '../components/ProductCard';

async function getProducts() {
    const filePath = path.join(process.cwd(), 'lib/data.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    return JSON.parse(jsonData).products;
}

export default async function PlantsPage() {
    const products = await getProducts();

    return (
        <div className="container section">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3rem' }}>All Plants</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Explore our complete collection of greenery from nurseries across India.</p>
            </div>

            <div className="grid grid-cols-4" style={{ gap: '2rem' }}>
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
                {products.length === 0 && <p>No plants listed yet.</p>}
            </div>
        </div>
    );
}
