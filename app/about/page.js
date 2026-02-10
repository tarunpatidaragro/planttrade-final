'use client';

import { Recycle, Heart, Users, Globe, Award, TrendingUp } from 'lucide-react';

export default function AboutPage() {
    return (
        <div>
            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, #166534 0%, #14532d 100%)',
                color: 'white',
                padding: '6rem 0',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: 800 }}>
                        Cultivating a Greener Future
                    </h1>
                    <p style={{ fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto', opacity: 0.9 }}>
                        We are on a mission to reconnect people with nature by making authentic plants accessible to everyone, everywhere.
                    </p>
                </div>

                {/* Decorative Elements */}
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', opacity: 0.1 }}>
                    <Globe size={400} />
                </div>
            </div>

            {/* Our Story Section */}
            <section className="section container">
                <div className="grid grid-cols-2" style={{ gap: '4rem', alignItems: 'center' }}>
                    <div>
                        <img
                            src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=1000"
                            alt="Our Story"
                            style={{ borderRadius: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                        />
                    </div>
                    <div>
                        <span style={{ color: 'var(--primary)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Our Story</span>
                        <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>From a Small Garden to a Nationwide Movement</h2>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                            PlantTrade started with a simple observation: while India has thousands of incredible nurseries, finding them and buying quality plants online was a struggle.
                        </p>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                            We built a bridge. A platform that empowers local growers to showcase their expertise and allows plant parents to discover unique, healthy varieties that you won't find in a typical store.
                        </p>
                        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
                            <div>
                                <h3 style={{ fontSize: '2rem', color: 'var(--primary-dark)' }}>10k+</h3>
                                <p style={{ fontSize: '0.9rem', color: '#666' }}>Happy Gardeners</p>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '2rem', color: 'var(--primary-dark)' }}>500+</h3>
                                <p style={{ fontSize: '0.9rem', color: '#666' }}>Verified Nurseries</p>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '2rem', color: 'var(--primary-dark)' }}>100%</h3>
                                <p style={{ fontSize: '0.9rem', color: '#666' }}>Eco-Friendly</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="section" style={{ background: '#f8fafc' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Why We Do It</h2>
                        <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)' }}>
                            Our core values guide every decision we make, ensuring we create value for both our customers and our planet.
                        </p>
                    </div>

                    <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
                        {[
                            { icon: <Heart size={32} />, title: "Passion for Plants", desc: "We are plant nerds at heart. Every listing is curated with love and expertise." },
                            { icon: <Users size={32} />, title: "Community First", desc: "We support local nurseries, helping small businesses thrive in the digital age." },
                            { icon: <Recycle size={32} />, title: "Sustainability", desc: "Promoting eco-friendly practices and sustainable gardening solutions." },
                            { icon: <Award size={32} />, title: "Quality Guarantee", desc: "We only partner with verified growers to ensure you get healthy, thriving plants." },
                            { icon: <Globe size={32} />, title: "Pan-India Reach", desc: "Delivering green happiness to every pin code across the country." },
                            { icon: <TrendingUp size={32} />, title: "Growing Together", desc: "We grow as you grow. Our success is measured by your blooming gardens." }
                        ].map((item, i) => (
                            <div key={i} className="card" style={{ padding: '2rem', textAlign: 'center', transition: 'transform 0.3s' }}>
                                <div style={{
                                    width: '64px', height: '64px',
                                    background: 'var(--surface)',
                                    borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 1.5rem',
                                    color: 'var(--primary)'
                                }}>
                                    {item.icon}
                                </div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{item.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team/Join Section */}
            <section className="section container" style={{ textAlign: 'center', padding: '6rem 0' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Ready to Grow?</h2>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                    Join thousands of plant lovers and start your journey today. Whether you're a beginner or an expert, there's a plant waiting for you.
                </p>
                <a href="/nurseries" className="btn btn-primary btn-lg" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
                    Start Exploring Nurseries
                </a>
            </section>
        </div>
    );
}
