import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import { MapPin, Phone, Mail, Globe, Users, Star, MessageCircle, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import ProductCard from '../../components/ProductCard';

async function getData(nurseryId) {
    const filePath = path.join(process.cwd(), 'lib/data.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(jsonData);

    const nursery = data.nurseries.find(n => n.id === nurseryId);
    const products = data.products.filter(p => p.nurseryId === nurseryId);

    return { nursery, products };
}

export default async function NurseryPage({ params }) {
    const { id } = await params;
    const { nursery, products } = await getData(id);

    if (!nursery) {
        return <div className="container section">Nursery not found</div>;
    }

    // SEO: JSON-LD Structured Data for LocalBusiness
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: nursery.name,
        image: nursery.image,
        telephone: nursery.contact?.phone,
        email: nursery.contact?.email,
        address: {
            '@type': 'PostalAddress',
            streetAddress: nursery.contact?.address,
            addressLocality: nursery.location,
            addressCountry: 'IN'
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: nursery.lat,
            longitude: nursery.lng
        },
        url: `https://planttrade.in/nursery/${nursery.id}`,
        aggregateRating: nursery.reviews && nursery.reviews.length > 0 ? {
            '@type': 'AggregateRating',
            ratingValue: (nursery.reviews.reduce((acc, r) => acc + r.rating, 0) / nursery.reviews.length).toFixed(1),
            reviewCount: nursery.reviews.length
        } : undefined
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Nursery Header */}
            <div style={{ position: 'relative', height: '400px' }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${nursery.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}></div>
                <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '3rem' }}>
                    <div style={{ maxWidth: '800px' }}>
                        <h1 style={{ color: 'white', fontSize: '3.5rem', marginBottom: '0.5rem' }}>{nursery.name}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MapPin size={24} />
                                <span>{nursery.location}</span>
                            </div>
                            {nursery.farmersCount && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Users size={24} />
                                    <span>{nursery.farmersCount} Farmers Connected</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container section">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '3rem' }}>

                    {/* Main Content */}
                    <div>
                        {/* About */}
                        <div style={{ marginBottom: '3rem' }}>
                            <h2 style={{ borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>About {nursery.name}</h2>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>{nursery.description}</p>

                            <div style={{ marginTop: '1.5rem' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Specialties:</h3>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {nursery.specialties?.map((tag, i) => (
                                        <span key={i} className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.9rem', cursor: 'default' }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Gallery */}
                        <div style={{ marginBottom: '3rem' }}>
                            <h2 style={{ borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Gallery</h2>
                            {nursery.gallery && nursery.gallery.length > 0 ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                    {nursery.gallery.map((img, index) => (
                                        <div key={index} style={{ height: '200px', borderRadius: '1rem', overflow: 'hidden' }}>
                                            <img src={img} alt={`Gallery ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ padding: '2rem', textAlign: 'center', background: '#f9f9f9', borderRadius: 'var(--radius)', border: '2px dashed var(--border)' }}>
                                    <p style={{ color: 'var(--text-secondary)' }}>No photos available for this nursery yet.</p>
                                </div>
                            )}
                        </div>

                        {/* Products */}
                        <div style={{ marginBottom: '3rem' }}>
                            <h2 style={{ borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Available Plants</h2>
                            {products.length > 0 ? (
                                <div className="grid grid-cols-2">
                                    {products.map(product => (
                                        <ProductCard key={product.id} product={{ ...product, vendor: nursery.name }} />
                                    ))}
                                </div>
                            ) : (
                                <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>No products listed yet.</p>
                            )}
                        </div>

                        {/* Reviews */}
                        {nursery.reviews && nursery.reviews.length > 0 && (
                            <div>
                                <h2 style={{ borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Customer Reviews</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {nursery.reviews.map((review, i) => (
                                        <div key={i} className="card" style={{ padding: '1.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <span style={{ fontWeight: 700 }}>{review.user}</span>
                                                <div style={{ display: 'flex', color: 'gold' }}>
                                                    {[...Array(5)].map((_, star) => (
                                                        <Star key={star} size={16} fill={star < review.rating ? 'gold' : 'none'} color={star < review.rating ? 'gold' : '#ccc'} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>"{review.comment}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Sidebar */}
                    <div style={{ position: 'sticky', top: '100px', alignSelf: 'start' }}>
                        {/* Contact Card */}
                        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>Contact Info</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {/* Phone */}
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ background: 'var(--background)', padding: '0.5rem', borderRadius: '50%', height: '40px' }}><Phone size={20} color="var(--primary)" /></div>
                                    <div>
                                        <div className="label">Call Us</div>
                                        <a href={`tel:${nursery.contact.phone}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>{nursery.contact.phone}</a>
                                    </div>
                                </div>

                                {/* Email */}
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ background: 'var(--background)', padding: '0.5rem', borderRadius: '50%', height: '40px' }}><Mail size={20} color="var(--primary)" /></div>
                                    <div>
                                        <div className="label">Email Us</div>
                                        <a href={`mailto:${nursery.contact.email}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>{nursery.contact.email}</a>
                                    </div>
                                </div>

                                {/* Website */}
                                {nursery.website && (
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ background: 'var(--background)', padding: '0.5rem', borderRadius: '50%', height: '40px' }}><Globe size={20} color="var(--primary)" /></div>
                                        <div>
                                            <div className="label">Website</div>
                                            <a href={nursery.website} target="_blank" style={{ color: 'var(--primary)', fontWeight: 600 }}>Visit Site</a>
                                        </div>
                                    </div>
                                )}

                                {/* Address */}
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ background: 'var(--background)', padding: '0.5rem', borderRadius: '50%', height: '40px' }}><MapPin size={20} color="var(--primary)" /></div>
                                    <div>
                                        <div className="label">Visit Us</div>
                                        <p style={{ fontSize: '0.9rem' }}>{nursery.contact.address}</p>
                                    </div>
                                </div>

                                {/* Social Media */}
                                {nursery.socials && (
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                        {nursery.socials.instagram && (
                                            <a href={nursery.socials.instagram} target="_blank" style={{ color: '#E1306C' }}>
                                                <Instagram size={24} />
                                            </a>
                                        )}
                                        {nursery.socials.facebook && (
                                            <a href={nursery.socials.facebook} target="_blank" style={{ color: '#1877F2' }}>
                                                <Facebook size={24} />
                                            </a>
                                        )}
                                        {nursery.socials.twitter && (
                                            <a href={nursery.socials.twitter} target="_blank" style={{ color: '#1DA1F2' }}>
                                                <Twitter size={24} />
                                            </a>
                                        )}
                                        {nursery.socials.youtube && (
                                            <a href={nursery.socials.youtube} target="_blank" style={{ color: '#FF0000' }}>
                                                <Youtube size={24} />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>

                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }}>
                                Send Enquiry
                            </button>
                        </div>

                        {/* Map Embed */}
                        {nursery.googleMapEmbedUrl && (
                            <div className="card" style={{ padding: '0.5rem', height: '300px', overflow: 'hidden' }}>
                                <iframe
                                    src={nursery.googleMapEmbedUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, borderRadius: '8px' }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}
