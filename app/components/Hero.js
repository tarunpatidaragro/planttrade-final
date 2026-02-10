import Link from 'next/link';

export default function Hero() {
    return (
        <section className="section hero-section" style={{
            background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=2000)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            textAlign: 'center'
        }}>
            <div className="container">
                <h1 className="hero-title">
                    Bring Nature Home
                </h1>
                <p style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2rem', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                    Discover thousands of rare and common plants from trusted independent nurseries.
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
