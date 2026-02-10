import Link from 'next/link';
import { Calendar, User } from 'lucide-react';
import { blogPosts } from '../../lib/blogData';

export default function BlogList() {
    return (
        <div className="container section">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Our Blog</span>
                <h1 style={{ fontSize: '3rem', marginTop: '0.5rem' }}>Plant Care & Tips</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Expert advice for your green journey</p>
            </div>

            <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
                {blogPosts.map(post => (
                    <article key={post.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ height: '240px', overflow: 'hidden' }}>
                            <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
                        </div>
                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#888', marginBottom: '0.75rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={14} /> {post.date}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><User size={14} /> {post.author}</span>
                            </div>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>
                                <Link href={`/blog/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    {post.title}
                                </Link>
                            </h2>
                            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', flex: 1 }}>
                                {post.excerpt}
                            </p>
                            <Link href={`/blog/${post.id}`} style={{ color: 'var(--primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>
                                Read More →
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
