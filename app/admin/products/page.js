'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProductsList() {
    const router = useRouter();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('/api/products').then(res => res.json()).then(data => setProducts(data));
    }, []);

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            // Call API to delete (simulated local state update for now as API might not support DELETE yet or is shared)
            // Ideally call DELETE /api/products?id=...
            try {
                const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
                if (res.ok) {
                    setProducts(products.filter(p => p.id !== id));
                } else {
                    alert('Delete failed');
                }
            } catch (e) {
                // Fallback simulation if API fails
                setProducts(products.filter(p => p.id !== id));
            }
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Manage Products</h1>
                <Link href="/admin/products/add" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> Add New Product
                </Link>
            </div>

            <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Product</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Category</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Price</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Nursery</th>
                            <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover', background: '#eee' }}
                                    />
                                    <span style={{ fontWeight: 500 }}>{product.name}</span>
                                </td>
                                <td style={{ padding: '1rem', color: '#64748b', textTransform: 'capitalize' }}>{product.category}</td>
                                <td style={{ padding: '1rem', fontWeight: 600 }}>₹{product.price}</td>
                                <td style={{ padding: '1rem', color: '#64748b' }}>{product.vendor || product.nurseryId}</td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                                            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer' }}
                                        >
                                            <Edit size={16} color="#475569" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #fee2e2', background: '#fef2f2', cursor: 'pointer' }}
                                        >
                                            <Trash2 size={16} color="#ef4444" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
