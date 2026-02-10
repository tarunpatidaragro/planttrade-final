import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
    return (
        <footer style={{ background: 'var(--primary-dark)', color: 'rgba(255,255,255,0.8)', padding: '4rem 0', marginTop: 'auto' }}>
            <div className="container">
                <div className="grid grid-cols-4 footer-grid" style={{ gap: '2rem' }}>
                    <div>
                        <h3 style={{ color: 'white', marginBottom: '1rem' }}>PlantTrade</h3>
                        <p style={{ marginBottom: '1rem' }}>India's first dedicated marketplace connecting plant lovers directly with nurseries.</p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <a href="#" style={{ color: 'white', opacity: 0.8 }}><Instagram size={20} /></a>
                            <a href="#" style={{ color: 'white', opacity: 0.8 }}><Facebook size={20} /></a>
                            <a href="#" style={{ color: 'white', opacity: 0.8 }}><Twitter size={20} /></a>
                            <a href="#" style={{ color: 'white', opacity: 0.8 }}><Youtube size={20} /></a>
                        </div>
                    </div>
                    <div>
                        <h4 style={{ color: 'white' }}>Discover</h4>
                        <ul style={{ listStyle: 'none' }}>
                            <li><a href="/nurseries">All Nurseries</a></li>
                            <li><a href="/nurseries?q=Bangalore">Bangalore Nurseries</a></li>
                            <li><a href="/nurseries?q=Pune">Pune Nurseries</a></li>
                            <li><a href="/nurseries?q=Kerala">Kerala Nurseries</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ color: 'white' }}>For Growers</h4>
                        <ul style={{ listStyle: 'none' }}>
                            <li><a href="/vendor/register">List Your Nursery</a></li>
                            <li><a href="/login">Grower Login</a></li>
                            <li><a href="/vendor/dashboard">Dashboard</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ color: 'white' }}>Support</h4>
                        <ul style={{ listStyle: 'none' }}>
                            <li><a href="/contact">Contact Us</a></li>
                            <li><a href="/about">About Us</a></li>
                        </ul>
                    </div>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '2rem', paddingTop: '2rem', textAlign: 'center' }}>
                    &copy; {new Date().getFullYear()} PlantTrade. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
