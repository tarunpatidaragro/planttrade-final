'use client';

import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';

export default function ProductCard({ product, adminMode, onDelete }) {
    // If no specific phone is provided, fallback to a dummy one or handle it gracefully
    const phone = product.nurseryPhone ? product.nurseryPhone.replace(/[^\d]/g, '') : "919999999999";
    const whatsappUrl = `https://wa.me/${phone}?text=Hello, I am interested in your product: *${product.name}* priced at ₹${product.price} seen on PlantTrade.`;

    // Mocking pricing for display to match screenshot aesthetics (Display Price vs Original)
    // If we have proper data in future, use that.
    const price = parseInt(product.price || 0);
    const originalPrice = Math.round(price * 1.3); // 30% markup for "original"
    const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

    return (
        <div className="card" style={{
            border: 'none',
            borderRadius: '1rem',
            overflow: 'hidden',
            boxShadow: 'none', /* User might want flats or let global css handle shadows, but screenshot looks minimal shadow */
            display: 'flex',
            flexDirection: 'column',
            background: 'white'
        }}>
            {/* Image Section */}
            <div style={{ position: 'relative', height: '220px', width: '100%', borderRadius: '1rem', overflow: 'hidden' }}>
                <Link href={`/product/${product.id}`} style={{ display: 'block', height: '100%' }}>
                    <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </Link>

                {/* Rating Badge Removed */}

                {adminMode && (
                    <button
                        onClick={() => onDelete(product.id)}
                        style={{
                            position: 'absolute',
                            top: '0.5rem',
                            right: '0.5rem',
                            background: 'white',
                            color: 'red',
                            border: 'none',
                            padding: '0.4rem',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        }}
                    >
                        ✖
                    </button>
                )}
            </div>

            {/* Content Section */}
            <div style={{ padding: '0.75rem 0 0 0', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>

                {/* Title */}
                <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#333',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    margin: 0
                }}>
                    <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {product.name}
                    </Link>
                </h3>

                {/* Nursery Name */}
                <div style={{ fontSize: '0.85rem', color: '#666', fontWeight: 500 }}>
                    By {product.vendor}
                </div>

                {/* Price Section */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#16a34a' }}>
                        ₹ {price.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '0.9rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                        ₹ {originalPrice.toLocaleString()}
                    </span>
                </div>

                {/* Button */}
                <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                    {!adminMode && (
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'block',
                                width: '100%',
                                background: '#16a34a', // Green
                                color: 'white',
                                textAlign: 'center',
                                padding: '0.6rem 0',
                                borderRadius: '0.5rem',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}
                        >
                            Enquire
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
