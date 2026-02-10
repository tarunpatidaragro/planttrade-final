import Link from 'next/link';
import { MapPin, Star, Phone, Navigation } from 'lucide-react';

export default function NurseryCard({ nursery }) {
    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
            {/* Distance Badge */}
            {nursery.distance !== undefined && nursery.distance !== null && (
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: '#fff',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backdropFilter: 'blur(4px)'
                }}>
                    <Navigation size={12} />
                    {nursery.distance} km
                </div>
            )}

            <div style={{ position: 'relative', height: '200px' }}>
                <img
                    src={nursery.image}
                    alt={nursery.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    padding: '1rem',
                    color: 'white'
                }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'white' }}>{nursery.name}</h3>
                </div>
            </div>

            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                    <MapPin size={16} />
                    <span style={{ fontSize: '0.9rem' }}>{nursery.location}</span>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', flex: 1 }}>
                    {nursery.description.substring(0, 100)}...
                </p>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {nursery.specialties.map((tag, index) => (
                        <span key={index} style={{
                            fontSize: '0.75rem',
                            background: 'var(--background)',
                            color: 'var(--primary-dark)',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontWeight: 600
                        }}>
                            {tag}
                        </span>
                    ))}
                </div>

                <Link href={`/nursery/${nursery.id}`} className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }}>
                    Visit Nursery
                </Link>
            </div>
        </div>
    );
}
