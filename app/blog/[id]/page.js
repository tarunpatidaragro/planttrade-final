import Link from 'next/link';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { blogPosts } from '../../../lib/blogData';

export default async function BlogPost({ params }) {
    const { id } = await params;
    const post = blogPosts.find(p => p.id === parseInt(id));

    if (!post) {
        return (
            <div className="container section" style={{ textAlign: 'center', padding: '5rem' }}>
                <h1>Article Not Found</h1>
                <Link href="/blog" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Blog</Link>
            </div>
        );
    }

    return (
        <article>
            {/* Header Image */}
            <div style={{
                height: '400px',
                background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${post.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'flex-end',
                paddingBottom: '3rem'
            }}>
                <div className="container">
                    <span style={{ color: 'white', background: 'var(--primary)', padding: '0.25rem 1rem', borderRadius: '2rem', fontSize: '0.9rem', fontWeight: 600 }}>
                        Plant Care
                    </span>
                    <h1 style={{ color: 'white', fontSize: '3rem', margin: '1rem 0', maxWidth: '900px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        {post.title}
                    </h1>
                    <div style={{ display: 'flex', gap: '2rem', color: 'white' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={18} /> {post.date}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={18} /> {post.author}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container section" style={{ maxWidth: '800px' }}>
                <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '2rem', fontWeight: 500 }}>
                    <ArrowLeft size={18} /> Back to all articles
                </Link>

                <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />

                <hr style={{ margin: '4rem 0', border: 'none', borderTop: '1px solid #eee' }} />

                <div style={{ background: '#f9f9f9', padding: '2rem', borderRadius: '1rem', textAlign: 'center' }}>
                    <h3>Enjoyed this article?</h3>
                    <p>Check out our collection of plants to get started with your own garden.</p>
                    <Link href="/plants" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        Browse Plants
                    </Link>
                </div>
            </div>

            <style>{`
            .blog-content { font-size: 1.15rem; line-height: 1.8; color: var(--text-main); }
            .blog-content h2 { font-size: 1.8rem; margin-top: 2.5rem; margin-bottom: 1rem; color: var(--primary-dark); }
            .blog-content h3 { font-size: 1.4rem; margin-top: 2rem; margin-bottom: 0.75rem; }
            .blog-content p { margin-bottom: 1.5rem; }
            .blog-content ul { padding-left: 1.5rem; margin-bottom: 1.5rem; }
            .blog-content li { margin-bottom: 0.5rem; }
        `}</style>
        </article>
    );
}
