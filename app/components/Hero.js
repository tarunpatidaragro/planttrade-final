import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Hero() {
    // In a real Server Component, we would fetch directly. 
    // Since this might be used as a client component or simplified, we'll assume it receives data or defaults.
    // For now, let's keep it simple and client-side fetch or just hardcode defaults with a TODO.
    // Actually, let's make it smarter. We'll use a client-side fetch for the dynamic update without full page reload requirement.

    const [hero, setHero] = useState({
        title: "Bring Nature Home",
        subtitle: "Discover thousands of rare and common plants from trusted independent nurseries.",
        image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=2000"
    });

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.title) setHero(data);
            })
            .catch(err => console.log('Using default hero'));
    }, []);

    return (
        <section className="section hero-section" style={{
            background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${hero.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            textAlign: 'center',
            transition: 'background 0.5s ease'
        }}>
            <div className="container">
                <h1 className="hero-title">
                    {hero.title}
                </h1>
                <p style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2rem', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                    {hero.subtitle}
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/shop" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}>
                        Shop Plants
                    </Link>
                    <Link href="/vendor/register" className="btn" style={{ backgroundColor: 'white', color: 'var(--primary)', fontSize: '1.2rem', padding: '1rem 2rem' }}>
                        Sell Plants
                    </Link>
                </div>
            </div>
        </section>
    );
}
