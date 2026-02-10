'use client';

import Link from 'next/link';

export default function ProductCard({ product, adminMode, onDelete }) {
    // If no specific phone is provided, fallback to a dummy one or handle it gracefully
    const phone = product.nurseryPhone ? product.nurseryPhone.replace(/[^\d]/g, '') : "919999999999";
    const whatsappUrl = `https://wa.me/${phone}?text=Hello, I am interested in your product: *${product.name}* priced at ₹${product.price} seen on PlantTrade.`;

    return (
        <div className="card">
            <div style={{ position: 'relative', height: '300px' }}>
                <Link href={`/product/${product.id}`} style={{ display: 'block', height: '100%' }}>
                    <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </Link>
                <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <span style={{
                        background: 'rgba(255,255,255,0.95)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '2rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: 'var(--text-main)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        {product.category}
                    </span>
                    {product.isRescue && (
                        <span style={{
                            background: '#ff4757',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '2rem',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                        }}>
                            🚑 RESCUE
                        </span>
                    )}
                </div>

                {adminMode && (
                    <button
                        onClick={() => onDelete(product.id)}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'red',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem',
                            borderRadius: '50%',
                            cursor: 'pointer'
                        }}
                    >
                        ✖
                    </button>
                )}
            </div>
            <div style={{ padding: '1.5rem' }}>
                {product.vendor && !adminMode && (
                    <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        By {product.vendor}
                    </div>
                )}

                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                    <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {product.name}
                    </Link>
                </h3>

                {product.isRescue && product.rescueReason && (
                    <p style={{ fontSize: '0.85rem', color: '#e84118', marginBottom: '1rem', fontStyle: 'italic', background: '#ffeaa7', padding: '0.5rem', borderRadius: '0.5rem' }}>
                        "{product.rescueReason}"
                    </p>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {product.isRescue && (
                            <span style={{ textDecoration: 'line-through', color: '#a4b0be', fontSize: '0.9rem' }}>
                                ₹{product.price}
                            </span>
                        )}
                        <span style={{ fontSize: '1.5rem', fontWeight: 700, color: product.isRescue ? '#ff4757' : 'var(--primary-dark)' }}>
                            ₹{product.isRescue ? product.rescuePrice : product.price}
                        </span>
                    </div>
                    {!adminMode && (
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                            style={{ padding: '0.5rem 1rem', background: '#25D366', color: 'white', border: 'none' }}
                        >
                            Enquire
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
