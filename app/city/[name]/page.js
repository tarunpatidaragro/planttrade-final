import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import { MapPin, ArrowLeft } from 'lucide-react';
import NurseryCard from '../../components/NurseryCard';

async function getData(cityName) {
    const filePath = path.join(process.cwd(), 'lib/data.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(jsonData);

    // Filter nurseries by city name (case-insensitive partial match)
    const cityLower = decodeURIComponent(cityName).toLowerCase();
    const cityNurseries = data.nurseries.filter(n => {
        const loc = n.location || '';
        const c = n.contact?.city || '';
        return loc.toLowerCase().includes(cityLower) || c.toLowerCase().includes(cityLower);
    });

    return cityNurseries;
}

export default async function CityPage({ params }) {
    const { name } = await params;
    const cityDisplayName = decodeURIComponent(name).charAt(0).toUpperCase() + decodeURIComponent(name).slice(1);
    const nurseries = await getData(name);

    return (
        <>
            <div style={{ background: 'var(--surface)', padding: '2rem 0', borderBottom: '1px solid #ddd' }}>
                <div className="container">
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                        <ArrowLeft size={18} /> Back to Home
                    </Link>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <MapPin size={32} color="var(--primary)" />
                        Nurseries in {cityDisplayName}
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                        Found {nurseries.length} verified growers in your area.
                    </p>
                </div>
            </div>

            <div className="container section">
                {nurseries.length > 0 ? (
                    <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
                        {nurseries.map(nursery => (
                            <NurseryCard key={nursery.id} nursery={nursery} />
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                        <h3 style={{ color: '#888' }}>No nurseries found listed in {cityDisplayName} yet.</h3>
                        <p>Know a good nursery here?</p>
                        <Link href="/vendor/register" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                            List a Nursery
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
