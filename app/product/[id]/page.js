export default async function ProductPage({ params }) {
    const { id } = await params;
    const { product, nursery, related } = await getData(id);

    if (!product) {
        return <div className="container section">Product not found</div>;
    }

    const phone = (nursery?.contact?.phone || nursery?.phone || product.nurseryPhone || "919754684978").replace(/[^\d]/g, '');
    const whatsappUrl = `https://wa.me/${phone}?text=Hello, I am interested in your product: *${product.name}* priced at ₹${product.price} seen on PlantTrade.`;

    // Aggregated images
    const allImages = [product.image, ...(product.images || [])].filter(Boolean);

    // SEO: JSON-LD Structured Data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: allImages,
        description: product.description,
        brand: {
            '@type': 'Brand',
            name: nursery?.name || 'Vana'
        },
        offers: {
            '@type': 'Offer',
            url: `https://planttrade.in/product/${product.id}`,
            priceCurrency: 'INR',
            price: product.price,
            availability: 'https://schema.org/InStock',
            seller: {
                '@type': 'Organization',
                name: nursery?.name
            }
        }
    };

    return (
        <div className="container section" style={{ paddingTop: '1rem', paddingBottom: '6rem' }}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Breadcrumb */}
            <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <Link href="/">Home</Link> &gt; <Link href={`/nursery/${product.nurseryId}`}> {product.vendor}</Link> &gt; <span style={{ color: 'var(--text-main)' }}>{product.name}</span>
            </div>

            <div className="product-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* Product Images */}
                <div>
                    <div style={{ borderRadius: '1rem', overflow: 'hidden', marginBottom: '1rem', border: '1px solid #eee' }}>
                        <img src={allImages[0]} alt={product.name} style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '500px', objectFit: 'contain', background: '#f9f9f9' }} />
                    </div>
                    {/* Thumbnails */}
                    {allImages.length > 1 && (
                        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                            {allImages.map((img, i) => (
                                <img key={i} src={img} style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: '0.5rem', cursor: 'pointer', border: '1px solid #ddd' }} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <span style={{
                                background: '#dcfce7', color: '#166534', padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600,
                                display: 'inline-block', marginBottom: '0.5rem'
                            }}>
                                {product.category}
                            </span>
                            <h1 style={{ fontSize: '1.75rem', lineHeight: '1.2', marginBottom: '0.5rem', color: '#1a1a1a' }}>{product.name}</h1>
                            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                                By <Link href={`/nursery/${product.nurseryId}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>{product.vendor}</Link>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #eee' }}>
                        <span style={{ fontSize: '2rem', fontWeight: 700, color: '#16a34a' }}>
                            ₹{product.price}
                        </span>
                        {/* Fake original price if not present */}
                        <span style={{ fontSize: '1.1rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                            ₹{Math.round(product.price * 1.3)}
                        </span>
                        <span style={{ color: '#dc2626', fontWeight: 600, fontSize: '0.9rem' }}>(30% OFF)</span>
                    </div>

                    <p style={{ fontSize: '1rem', color: '#4b5563', marginBottom: '2rem', lineHeight: '1.6' }}>
                        {product.description}
                    </p>

                    {/* Benefits Section */}
                    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}>
                            <CheckCircle size={18} color="var(--primary)" /> Key Benefits
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
                            {product.benefits?.split(',').map((benefit, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', color: '#475569' }}>
                                    <span style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%' }}></span>
                                    <span>{benefit.trim()}</span>
                                </li>
                            ))}
                            {!product.benefits && <li>Excellent for home decor</li>}
                            {!product.benefits && <li>Low maintenance plant</li>}
                        </ul>
                    </div>

                    {/* Desktop Enquiry Button */}
                    <div className="desktop-enquire" style={{ marginBottom: '2rem' }}>
                        <a href={whatsappUrl} target="_blank" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', background: '#16a34a', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                            Enquire on WhatsApp
                        </a>
                    </div>

                    {/* Mobile Fixed Enquiry Bar */}
                    <div className="mobile-enquire-bar" style={{
                        position: 'fixed', bottom: 0, left: 0, right: 0,
                        background: 'white', padding: '1rem',
                        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
                        zIndex: 100, display: 'flex', gap: '1rem',
                        alignItems: 'center'
                    }}>
                        <div style={{ flex: 1 }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#16a34a', display: 'block' }}>
                                ₹{product.price}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#166534' }}>Inclusive of all taxes</span>
                        </div>
                        <a href={whatsappUrl} target="_blank" className="btn btn-primary" style={{ flex: 1, padding: '0.75rem', fontSize: '1rem', background: '#16a34a', borderRadius: '0.5rem', textAlign: 'center', textDecoration: 'none', color: 'white', fontWeight: 600 }}>
                            Enquire Now
                        </a>
                    </div>

                    {/* Nursery Info */}
                    {nursery?.location && (
                        <div style={{ marginTop: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                                <MapPin size={16} />
                                <strong>Location: {nursery.location}</strong>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Nearby / Similar Plants */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '4rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>
                    Similar Plants {nursery ? `at ${nursery.location}` : 'Near You'}
                </h2>
                <div className="grid grid-cols-4" style={{ gap: '2rem' }}>
                    {related.map(p => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                    {related.length === 0 && <p>No similar plants found nearby.</p>}
                </div>
            </div>
        </div>
    );
}

// Necessary helper imports that were excluded in previous overwrite
import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import { Star, CheckCircle, MapPin } from 'lucide-react';
import ProductCard from '../../components/ProductCard';

import dbConnect from '@/lib/mongoose';
import Product from '@/models/Product';
import Nursery from '@/models/Nursery';
import { promises as fs } from 'fs';
import path from 'path';

async function getData(productId) {
    try {
        await dbConnect();

        let product;
        if (productId.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product.findById(productId).lean();
        }
        if (!product) {
            product = await Product.findOne({ id: productId }).lean();
        }

        if (!product) return { product: null, nursery: null, related: [] };

        product._id = product._id.toString();

        // Fetch Nursery
        let nursery = null;
        if (product.nursery) {
            nursery = await Nursery.findById(product.nursery).lean();
        } else if (product.nurseryId) {
            nursery = await Nursery.findOne({ id: product.nurseryId }).lean();
            if (!nursery && product.nurseryId.match(/^[0-9a-fA-F]{24}$/)) {
                nursery = await Nursery.findById(product.nurseryId).lean();
            }
        }
        if (nursery) nursery._id = nursery._id.toString();

        // Fetch Related
        const related = await Product.find({
            _id: { $ne: product._id },
            category: product.category
        }).limit(4).lean();

        return {
            product,
            nursery,
            related: related.map(p => ({ ...p, _id: p._id.toString() }))
        };

    } catch (e) {
        console.warn("MongoDB Fetch Error (Product Detail):", e);
        if (process.env.NODE_ENV !== 'production') {
            const filePath = path.join(process.cwd(), 'lib/data.json');
            try {
                const jsonData = await fs.readFile(filePath, 'utf8');
                const data = JSON.parse(jsonData);
                const product = data.products.find(p => p.id == productId);
                if (!product) return { product: null, nursery: null, related: [] };
                const nursery = data.nurseries.find(n => n.id === product.nurseryId);
                const related = data.products.filter(p =>
                    p.id != productId && (p.nurseryId === product.nurseryId || p.category === product.category)
                ).slice(0, 4);
                return { product, nursery, related };
            } catch (err) { return { product: null, related: [] }; }
        }
        return { product: null, related: [] };
    }
}
