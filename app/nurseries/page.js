import dbConnect from '@/lib/mongoose';
import Nursery from '@/models/Nursery';
import { promises as fs } from 'fs';
import path from 'path';

async function getNurseries(search) {
    try {
        await dbConnect();
        let query = {};
        if (search) {
            const regex = new RegExp(search, 'i');
            query = {
                $or: [
                    { name: regex },
                    { location: regex },
                    { specialties: regex }
                ]
            };
        }
        const nurseries = await Nursery.find(query).sort({ createdAt: -1 }).lean();
        // Convert _id to string or remove it to avoid serialization issues
        return nurseries.map(n => ({ ...n, _id: n._id.toString() }));
    } catch (e) {
        console.warn("MongoDB Fetch Error (Nurseries Page):", e);
        // ONLY valid for local fallback
        if (process.env.NODE_ENV !== 'production') {
            const filePath = path.join(process.cwd(), 'lib/data.json');
            try {
                const jsonData = await fs.readFile(filePath, 'utf8');
                let data = JSON.parse(jsonData).nurseries || [];
                if (search) {
                    const q = search.toLowerCase();
                    data = data.filter(n =>
                        n.name.toLowerCase().includes(q) ||
                        n.location.toLowerCase().includes(q) ||
                        n.specialties.some(s => s.toLowerCase().includes(q))
                    );
                }
                return data;
            } catch (err) { return []; }
        }
        return [];
    }
}

export default async function NurseriesList({ searchParams }) {
    const { q } = await searchParams; // search query
    const nurseries = await getNurseries(q);

    return (
        <div className="container section">
            <h1 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '3rem' }}>
                {q ? `Nurseries for "${q}"` : 'All Verified Nurseries'}
            </h1>

            <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
                {nurseries.map(nursery => (
                    <div key={nursery.id} className="card">
                        <div style={{ height: '250px', background: '#eee' }}>
                            <img src={nursery.image} alt={nursery.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{nursery.name}</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{nursery.location}</p>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                                {nursery.specialties.map(s => (
                                    <span key={s} style={{ fontSize: '0.75rem', background: '#e0f2f1', color: 'var(--primary-dark)', padding: '2px 6px', borderRadius: '4px' }}>
                                        {s}
                                    </span>
                                ))}
                            </div>

                            <Link href={`/nursery/${nursery.id}`} className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                                View Profile
                            </Link>
                        </div>
                    </div>
                ))}
                {nurseries.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem' }}>
                        <h3>No nurseries found matching "{q}".</h3>
                        <p>Try searching for "Indoor", "Roses", or "Bangalore".</p>
                        <Link href="/nurseries" className="btn btn-outline" style={{ marginTop: '1rem' }}>View All</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
