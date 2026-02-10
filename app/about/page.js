export default function About() {
    return (
        <div>
            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(rgba(46, 125, 50, 0.9), rgba(46, 125, 50, 0.9)), url(https://images.unsplash.com/photo-1542601906990-b4d3fb7d5b43?auto=format&fit=crop&q=80&w=2000)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '8rem 0',
                textAlign: 'center',
                color: 'white',
                borderRadius: '0 0 2rem 2rem',
                marginBottom: '6rem'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', color: 'white' }}>Growing Together</h1>
                    <p style={{ fontSize: '1.5rem', maxWidth: '800px', margin: '0 auto', opacity: 0.9 }}>
                        PlantTrade is India's largest community of plant lovers, connecting urban homes with the country's best nurseries.
                    </p>
                </div>
            </div>

            <div className="container section">

                {/* Mission & Vision */}
                <div className="grid grid-cols-2" style={{ gap: '6rem', alignItems: 'center', marginBottom: '8rem' }}>
                    <div>
                        <span style={{ color: 'var(--primary)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Our Story</span>
                        <h2 style={{ fontSize: '3rem', margin: '1rem 0 2rem', lineHeight: 1.2 }}>Bringing Nature Back to Concrete Jungles</h2>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            Born from a simple idea in 2026, PlantTrade started with a mission to make buying plants as easy as buying groceries. We realized that while India has thousands of amazing local nurseries, they were disconnected from the digital world.
                        </p>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                            Today, we bridge that gap. We empower small nursery owners by giving them a platform to showcase their beautiful flora to plant parents across the nation.
                        </p>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <img
                            src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=1000"
                            style={{ borderRadius: '2rem', boxShadow: 'var(--shadow-lg)' }}
                            alt="Our Vision"
                        />
                        <div style={{
                            position: 'absolute',
                            bottom: '-2rem',
                            left: '-2rem',
                            background: 'white',
                            padding: '2rem',
                            borderRadius: '1rem',
                            boxShadow: 'var(--shadow-lg)',
                            maxWidth: '250px'
                        }}>
                            <h3 style={{ fontSize: '3rem', color: 'var(--primary-dark)', marginBottom: '0' }}>10k+</h3>
                            <p style={{ margin: 0, fontWeight: 600 }}>Plants Delivered</p>
                        </div>
                    </div>
                </div>

                {/* Why Choose Us */}
                <div style={{ background: 'var(--background)', borderRadius: '2rem', padding: '6rem 4rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '4rem' }}>The PlantTrade Promise</h2>
                    <div className="grid grid-cols-3" style={{ gap: '4rem' }}>
                        <div>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌱</div>
                            <h3 style={{ marginBottom: '1rem' }}>Authentic Greenery</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Every plant comes directly from verified nurseries. No middlemen, just fresh, healthy plants.
                            </p>
                        </div>
                        <div>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🤝</div>
                            <h3 style={{ marginBottom: '1rem' }}>Empowering Growers</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                We take zero commission from our partner nurseries, ensuring they get the full value of their hard work.
                            </p>
                        </div>
                        <div>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💚</div>
                            <h3 style={{ marginBottom: '1rem' }}>Expert Support</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Our team of horticulturists is always just a message away to help you with care tips.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
