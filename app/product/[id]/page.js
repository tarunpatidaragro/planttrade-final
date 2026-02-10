export default async function ProductPage({ params }) {
    const { id } = await params;
    const { product, nursery, related } = await getData(id);

    if (!product) {
        return <div className="container section">Product not found</div>;
    }

    const phone = product.nurseryPhone ? product.nurseryPhone.replace(/[^\d]/g, '') : "919754684978";
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
        <div className="container section" style={{ paddingTop: '2rem' }}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Breadcrumb */}
            <div style={{ marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <Link href="/">Home</Link> &gt; <Link href={`/nursery/${product.nurseryId}`}> {product.vendor}</Link> &gt; {product.name}
            </div>

            <div className="grid grid-cols-2" style={{ gap: '4rem', marginBottom: '4rem' }}>
                {/* Product Images */}
                <div>
                    <div style={{ borderRadius: '1.5rem', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', marginBottom: '1rem' }}>
                        <img src={allImages[0]} alt={product.name} style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>
                    {/* Thumbnails */}
                    {allImages.length > 1 && (
                        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto' }}>
                            {allImages.map((img, i) => (
                                <img key={i} src={img} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '0.5rem', cursor: 'pointer', border: '2px solid transparent' }} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div>
                    <span style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.9rem', fontWeight: 600 }}>
                        {product.category}
                    </span>
                    <h1 style={{ fontSize: '2.5rem', marginTop: '1rem', marginBottom: '0.5rem' }}>{product.name}</h1>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '1.5rem' }}>
                        ₹{product.price}
                    </p>

                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.8' }}>
                        {product.description}
                    </p>

                    {/* Benefits Section */}
                    <div style={{ background: '#F9F9F9', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Star size={20} fill="gold" stroke="gold" /> Key Benefits
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {product.benefits?.split(',').map((benefit, i) => (
                                <li key={i} style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <CheckCircle size={18} color="var(--primary)" />
                                    <span>{benefit.trim()}</span>
                                </li>
                            ))}
                            {!product.benefits && <li>Air purifying properties</li>}
                        </ul>
                    </div>

                    {/* Nursery Location / Map Info */}
                    {nursery?.location && (
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <MapPin size={20} color="var(--text-secondary)" />
                                <strong style={{ color: 'var(--text-secondary)' }}>Located at: {nursery.location}</strong>
                            </div>

                            {/* Embed Google Map if available, else a static placeholder */}
                            <div style={{ height: '200px', width: '100%', borderRadius: '1rem', overflow: 'hidden', border: '1px solid #ddd' }}>
                                {nursery.googleMapEmbedUrl ? (
                                    <iframe
                                        src={nursery.googleMapEmbedUrl}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                ) : (
                                    <div style={{ width: '100%', height: '100%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                                        Map View Provided on Enquiry
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* CTA */}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <a href={whatsappUrl} target="_blank" className="btn btn-primary" style={{ flex: 1, padding: '1rem', fontSize: '1.1rem', background: '#25D366' }}>
                            Enquire on WhatsApp
                        </a>
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                        <img src={nursery?.image} style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }} />
                        <div>
                            <div style={{ fontSize: '0.9rem', color: '#888' }}>Sold by</div>
                            <Link href={`/nursery/${product.nurseryId}`} style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>
                                {product.vendor}
                            </Link>
                        </div>
                    </div>
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

async function getData(productId) {
    const filePath = path.join(process.cwd(), 'lib/data.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(jsonData);

    const product = data.products.find(p => p.id == productId);
    if (!product) return { product: null, related: [] };

    const nursery = data.nurseries.find(n => n.id === product.nurseryId); // Get nursery info

    const related = data.products.filter(p =>
        p.id != productId && (p.nurseryId === product.nurseryId || p.category === product.category)
    ).slice(0, 4);

    return { product, nursery, related };
}
