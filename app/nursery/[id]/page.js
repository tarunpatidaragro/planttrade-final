import dbConnect from '@/lib/mongoose';
import Nursery from '@/models/Nursery';
import Product from '@/models/Product';
import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import { MapPin, Phone, Mail, Globe, Users, Star, MessageCircle, Instagram, Facebook, Twitter, Youtube, Clock } from 'lucide-react';
import ProductCard from '../../components/ProductCard';

// Shared Specialty Images
const SPECIALTY_IMAGES = {
    'Indoor': 'https://images.unsplash.com/photo-1599687351724-dfa3c4ff81b1?auto=format&fit=crop&w=150&q=80',
    'Outdoor': 'https://images.unsplash.com/photo-1614594975525-e45852b82481?auto=format&fit=crop&w=150&q=80',
    'Flowering': 'https://images.unsplash.com/photo-1598512752271-33f913a5af13?auto=format&fit=crop&w=150&q=80',
    'Fruit': 'https://images.unsplash.com/photo-1622383563227-0430138f2976?auto=format&fit=crop&w=150&q=80',
    'Medicinal': 'https://images.unsplash.com/photo-1526304640152-d4619684e484?auto=format&fit=crop&w=150&q=80',
    'Succulents': 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=150&q=80',
    'Seeds': 'https://images.unsplash.com/photo-1445510440086-60aca5c156dc?auto=format&fit=crop&w=150&q=80',
    'Pots': 'https://images.unsplash.com/photo-1459156212016-c812468e2115?auto=format&fit=crop&w=150&q=80',
    'Fertilizers': 'https://images.unsplash.com/photo-1622383563227-0430138f2976?auto=format&fit=crop&w=150&q=80'
};
const DEFAULT_CATEGORY_IMAGE = 'https://images.unsplash.com/photo-1526304640152-d4619684e484?auto=format&fit=crop&w=150&q=80';

async function getData(nurseryId) {
    try {
        await dbConnect();

        // Try precise match on 'id' string first (slug), then fallback to _id if it looks like an ObjectId
        let nursery = await Nursery.findOne({ id: nurseryId }).lean();

        if (!nursery && nurseryId.match(/^[0-9a-fA-F]{24}$/)) {
            nursery = await Nursery.findById(nurseryId).lean();
        }

        if (!nursery) return { nursery: null, products: [] };

        // Convert _id to string
        nursery._id = nursery._id.toString();

        // Fetch products for this nursery
        // Support both old 'nurseryId' (string) and new 'nursery' (ObjectId) references
        const products = await Product.find({
            $or: [
                { nurseryId: nursery.id },
                { nursery: nursery._id }
            ]
        }).lean();

        return {
            nursery,
            products: products.map(p => ({ ...p, _id: p._id.toString() }))
        };

    } catch (e) {
        console.warn("MongoDB Fetch Error (Nursery Detail):", e);
        // Local Fallback
        if (process.env.NODE_ENV !== 'production') {
            const filePath = path.join(process.cwd(), 'lib/data.json');
            try {
                const jsonData = await fs.readFile(filePath, 'utf8');
                const data = JSON.parse(jsonData);
                const nursery = data.nurseries.find(n => n.id === nurseryId);
                const products = data.products.filter(p => p.nurseryId === nurseryId);
                return { nursery, products };
            } catch (err) { return { nursery: null, products: [] }; }
        }
        return { nursery: null, products: [] };
    }
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
                        <h1 style={{ color: 'white', fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '0.5rem' }}>{nursery.name}</h1>
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
                <div className="nursery-layout">

                    {/* Main Content */}
                    <div>
                        {/* About */}
                        <div style={{ marginBottom: '3rem' }}>
                            <h2 style={{ borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>About {nursery.name}</h2>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>{nursery.description}</p>

                            <div style={{ marginTop: '1.5rem' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Specialties:</h3>
                                <div style={{
                                    display: 'flex',
                                    gap: '0.75rem',
                                    overflowX: 'auto',
                                    paddingBottom: '0.5rem',
                                    scrollbarWidth: 'none'
                                }}>
                                    {nursery.specialties?.map((tag, i) => (
                                        <div key={i} style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            minWidth: '80px',
                                            cursor: 'pointer',
                                            flexShrink: 0
                                        }}>
                                            <div style={{
                                                width: '75px',
                                                height: '75px',
                                                borderRadius: '50%',
                                                overflow: 'hidden',
                                                border: '2px solid #fff',
                                                padding: '2px',
                                                background: 'white',
                                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                            }}>
                                                <img
                                                    src={SPECIALTY_IMAGES[tag] || DEFAULT_CATEGORY_IMAGE}
                                                    alt={tag}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                                                />
                                            </div>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 600, textAlign: 'center', color: '#333', lineHeight: 1.2 }}>
                                                {tag}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Gallery */}
                        <div style={{ marginBottom: '3rem' }}>
                            <h2 style={{ borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Gallery</h2>
                            {nursery.gallery && nursery.gallery.length > 0 ? (
                                <div style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    overflowX: 'auto',
                                    paddingBottom: '1rem',
                                    scrollbarWidth: 'none'
                                }}>
                                    {nursery.gallery.map((img, index) => (
                                        <div key={index} style={{
                                            minWidth: '200px',
                                            height: '200px',
                                            borderRadius: '1rem',
                                            overflow: 'hidden',
                                            flexShrink: 0,
                                            aspectRatio: '1/1'
                                        }}>
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
                                <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
                                    {products.map(product => (
                                        <ProductCard
                                            key={product.id}
                                            product={{
                                                ...product,
                                                vendor: nursery.name,
                                                nurseryPhone: nursery.contact?.phone // Passing phone for Enquire button
                                            }}
                                        />
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
                            </div>

                            {/* Opening Hours */}
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ background: 'var(--background)', padding: '0.5rem', borderRadius: '50%', height: '40px' }}><Clock size={20} color="var(--primary)" /></div>
                                <div>
                                    <div className="label">Opening Hours</div>
                                    <p style={{ fontSize: '0.9rem' }}>{nursery.openingHours || 'Mon-Sun: 9:00 AM - 7:00 PM'}</p>
                                </div>
                            </div>

                            {/* Social Media */}
                            {(nursery.socials || nursery.social) && (
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                    {(nursery.socials?.instagram || nursery.social?.instagram) && (
                                        <a href={nursery.socials?.instagram || nursery.social?.instagram} target="_blank" style={{ color: '#E1306C' }}>
                                            <Instagram size={24} />
                                        </a>
                                    )}
                                    {(nursery.socials?.facebook || nursery.social?.facebook) && (
                                        <a href={nursery.socials?.facebook || nursery.social?.facebook} target="_blank" style={{ color: '#1877F2' }}>
                                            <Facebook size={24} />
                                        </a>
                                    )}
                                    {(nursery.socials?.twitter || nursery.social?.twitter) && (
                                        <a href={nursery.socials?.twitter || nursery.social?.twitter} target="_blank" style={{ color: '#1DA1F2' }}>
                                            <Twitter size={24} />
                                        </a>
                                    )}
                                    {(nursery.socials?.youtube || nursery.social?.youtube) && (
                                        <a href={nursery.socials?.youtube || nursery.social?.youtube} target="_blank" style={{ color: '#FF0000' }}>
                                            <Youtube size={24} />
                                        </a>
                                    )}
                                    {(nursery.socials?.whatsapp || nursery.social?.whatsapp) && (
                                        <a href={nursery.socials?.whatsapp || nursery.social?.whatsapp} target="_blank" style={{ color: '#25D366' }}>
                                            <MessageCircle size={24} />
                                        </a>
                                    )}
                                </div>
                            )}

                            <a
                                href={`https://wa.me/${nursery.contact?.phone?.replace(/\D/g, '')}?text=Hi ${nursery.name}, I found your profile on PlantTrade and would like to enquire.`}
                                target="_blank"
                                className="btn btn-primary"
                                style={{ width: '100%', marginTop: '2rem', textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                <MessageCircle size={18} /> Chat on WhatsApp
                            </a>
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
