'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BlogsList() {
    const router = useRouter();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/blogs')
            .then(res => res.json())
            .then(data => {
                setBlogs(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    const handleDelete = async (id) => {
        if (confirm('Delete this article?')) {
            try {
                const res = await fetch(`/api/blogs?id=${id}`, { method: 'DELETE' });
                if (res.ok) {
                    setBlogs(blogs.filter(b => b.id !== id));
                }
            } catch (e) {
                alert('Delete failed');
            }
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Manage Blogs</h1>
                <Link href="/admin/blogs/add" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> New Article
                </Link>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {blogs.map(blog => (
                        <div key={blog.id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ height: '180px', background: '#eee' }}>
                                <img src={blog.image} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', lineHeight: '1.3' }}>{blog.title}</h3>
                                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem', flex: 1 }}>{blog.excerpt?.substring(0, 100)}...</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{blog.date}</span>
                                    <button
                                        onClick={() => handleDelete(blog.id)}
                                        style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
