'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NurseryCard from './NurseryCard';
import ProductCard from './ProductCard';
import SearchBar from './SearchBar';
import { Sprout, Flower, Trees, Leaf, Microscope, Sun, MapPin, X, Info, Map as MapIcon, Calendar, User, ChevronDown } from 'lucide-react';

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

export default function HomeFeed({ nurseries, products, posts, categories }) {
    const [location, setLocation] = useState('');
    const [filteredNurseries, setFilteredNurseries] = useState(nurseries);
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [isLocationModalOpen, setLocationModalOpen] = useState(false);
    const [nearbyMessage, setNearbyMessage] = useState('');
    const [discoveredCities, setDiscoveredCities] = useState([]);
    // Use passed categories if available, else derive (fallback logic removed for simplicity as we want admin controlled)
    const [dynamicCategories, setDynamicCategories] = useState(categories && categories.length > 0 ? categories : []);

    useEffect(() => {
        const savedLoc = localStorage.getItem('userLocation');
        if (savedLoc) {
            setLocation(savedLoc);
            applyFilter(savedLoc);
        }

        // Extract unique cities
        const cities = new Set();

        nurseries.forEach(n => {
            if (n.contact?.city) cities.add(n.contact.city);
            else if (n.location) {
                const parts = n.location.split(',');
                if (parts.length > 0) cities.add(parts[0].trim());
            }
        });

        setDiscoveredCities(Array.from(cities));

        // If categories prop was empty/undefined (initial load without data), maybe we can derive?
        // But we want Admin control. If categories is empty, we shout to Admin to add some!
        // Or we use a default constant here if really needed.
        if (!categories || categories.length === 0) {
            // Fallback or leave empty
        } else {
            setDynamicCategories(categories);
        }

    }, [nurseries, categories]); // Re-run if nurseries prop changes (though usually static on page load)

    // ... rest of code ... 

    // I will now skip to the replacement of the Categories Section in the second chunk if possible, or just rely on 'dynamicCategories' state in render.
    // I need to make sure I update the render to use 'dynamicCategories' instead of 'categories'.
    // Because I am replacing lines 10-21 (imports to export default), I am injecting the state hooks.
    // I need to be careful not to duplicate 'useEffect' logic or miss existing logic. 
    // My replacement block above includes the START of the function.
    // I need to make sure I include the existing 'useEffect' body or merge it?
    // The existing 'useEffect' (lines 29-49) handles location and cities.
    // I WILL REPLACE the 'categories' const AND the top part of 'HomeFeed' including 'useEffect'.

    // Wait, the ReplacementContent above ends at `}, [nurseries]);`. 
    // I need to check where `useEffect` ends in original file. Line 49.
    // My replacement covers lines 10 to 49 approx.

    // Original lines 10-19: `const categories = ...`
    // Original lines 21: `export default function...`
    // Original lines 22-28: `useState` hooks.
    // Original lines 29-49: `useEffect`.

    // My replacement includes all of this.
    // I will verify `applyFilter` definition follows immediately.
    // Line 51: `// Haversine formula...`
    // Line 66: `const applyFilter ...`

    // So I should end my replacement before line 51.

    // Code looks correct.

    // AND I need to update the Categories render loop (Lines 299-335).
    // I will use `dynamicCategories` there. 
    // I will use a separate `replace_file_content` for that, OR do it in one go if I use `multi_replace`.
    // I'll use `multi_replace`.


    // Haversine formula to calculate distance in km
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        if (!lat1 || !lon1 || !lat2 || !lon2) return null;
        const R = 6371; // Radius of Earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return Math.round(d);
    };

    const applyFilter = async (locText, userLat = null, userLng = null) => {
        if (!locText && !userLat) {
            setFilteredNurseries(nurseries);
            setFilteredProducts(products);
            setNearbyMessage('');
            return;
        }

        let searchLat = userLat;
        let searchLng = userLng;

        // If we only have text but no coords, grab coords effectively
        if (!searchLat && locText) {
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${locText}`);
                const data = await res.json();
                if (data && data.length > 0) {
                    searchLat = parseFloat(data[0].lat);
                    searchLng = parseFloat(data[0].lon);
                }
            } catch (e) {
                console.error("Geocoding failed", e);
            }
        }

        // 1. Try finding exact location matches first (String Match)
        const lowerLoc = locText ? locText.toLowerCase() : '';
        const exactMatches = nurseries.filter(n => n.location?.toLowerCase().includes(lowerLoc));

        let results = [];
        let message = '';

        if (exactMatches.length > 0) {
            // Found exact matches
            results = exactMatches;
            // Also append others but sorted by distance if coords exist
            if (searchLat) {
                const others = nurseries.filter(n => !n.location?.toLowerCase().includes(lowerLoc));
                const othersWithDist = others.map(n => ({
                    ...n,
                    distance: calculateDistance(searchLat, searchLng, n.lat, n.lng)
                })).sort((a, b) => (a.distance || 9999) - (b.distance || 9999));

                // We might not show others mixed in, but keeping it clean: Show exact matches first.
                // Actually user request: "if not available so show possible nearby"
                // So if exact matches exist, we just show them? Or show matches + nearby?
                // Let's show matches.
            }
        } else {
            // No exact matches found. Find nearby.
            if (searchLat) {
                message = `No nurseries found in "${locText}". Showing results nearby:`;
                results = nurseries.map(n => ({
                    ...n,
                    distance: calculateDistance(searchLat, searchLng, n.lat, n.lng)
                })).sort((a, b) => (a.distance || 9999) - (b.distance || 9999));
            } else {
                // Fallback if no coords found
                results = nurseries;
            }
        }

        setFilteredNurseries(results);
        setNearbyMessage(message);

        // Filter products based on the RESULTING nurseries
        // Create map of nursery IDs that are present in our results
        const nurseryIds = new Set(results.map(n => n.id));
        const relatedProducts = products.filter(p => nurseryIds.has(p.nurseryId)).slice(0, 8);
        setFilteredProducts(relatedProducts);
    };

    const handleLocationSet = (newLoc) => {
        setLocation(newLoc);
        localStorage.setItem('userLocation', newLoc);
        applyFilter(newLoc);
        setLocationModalOpen(false);
    };

    const detectLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await res.json();

                    const city = data.address.city || data.address.town || data.address.village || data.address.county;
                    if (city) {
                        alert(`Detected Location: ${city}`);
                        handleLocationSet(city);
                    } else {
                        alert("Could not detect precise city.");
                    }
                } catch (e) {
                    console.error(e);
                    alert("Error fetching location data.");
                }
            }, (err) => {
                alert("Location access denied or unavailable.");
            });
        }
    };

    const clearLocation = () => {
        setLocation('');
        localStorage.removeItem('userLocation');
        applyFilter('');
    };

    return (
        <>
            {/* Location Bar */}
            <div style={{ background: '#f0fdf4', padding: '0.75rem', borderBottom: '1px solid #dcfce7', position: 'sticky', top: 0, zIndex: 99 }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--primary-dark)' }}>
                        <MapPin size={18} />
                        {location ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {location}
                                <button onClick={clearLocation} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center' }}><X size={14} /></button>
                            </span>
                        ) : (
                            <span>Showing all Nurseries</span>
                        )}
                        {nearbyMessage && <span style={{ marginLeft: '1rem', color: '#eab308', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}><Info size={14} /> {nearbyMessage}</span>}
                    </div>
                    <button
                        onClick={() => setLocationModalOpen(true)}
                        className="btn btn-sm btn-outline"
                        style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem' }}
                    >
                        {location ? 'Change Location' : 'Set Location'}
                    </button>
                </div>
            </div>

            {/* Modal */}
            {isLocationModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="card" style={{ padding: '2rem', width: '90%', maxWidth: '400px', position: 'relative' }}>
                        <button onClick={() => setLocationModalOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                        <h3 style={{ marginBottom: '1.5rem' }}>Select your Location</h3>

                        <button onClick={detectLocation} className="btn btn-secondary" style={{ width: '100%', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <MapPin size={18} /> Detect Current Location
                        </button>

                        <div style={{ textAlign: 'center', margin: '1rem 0', color: '#888' }}>- OR -</div>

                        <form onSubmit={(e) => { e.preventDefault(); handleLocationSet(e.target.elements.city.value); }}>
                            <input
                                name="city"
                                className="input"
                                placeholder="Enter City/Town (e.g. Barwani)"
                                style={{ marginBottom: '1rem' }}
                                autoFocus
                            />
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Update Location</button>
                        </form>
                    </div>
                </div>
            )}

            <section className="section" style={{
                background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=2000)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '5rem 0',
                color: 'white',
                textAlign: 'center',
                borderRadius: '0 0 1.5rem 1.5rem',
                marginBottom: '2rem'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
                        Connect with India's Best Nurseries
                    </h1>
                    <p style={{ fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto 2.5rem', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
                        Explore a curated list of authentic plant nurseries from across the country.
                        Find rare species, sacred plants, and expert growers directly.
                    </p>

                    <SearchBar />
                </div>
            </section>

            {/* Discover Cities Section */}
            <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '0.75rem 0', marginBottom: '1.5rem', whiteSpace: 'nowrap' }}>
                <div className="container" style={{
                    display: 'flex',
                    gap: '2rem',
                    overflowX: 'auto',
                    scrollbarWidth: 'none',
                    alignItems: 'center',
                    paddingRight: '1rem' /* Handling padding manually for scroll */
                }}>
                    <span style={{ fontWeight: 600, color: '#333', display: 'flex', alignItems: 'center', gap: '0.25rem', borderRight: '1px solid #ddd', paddingRight: '1rem', marginRight: '-1rem' }}>
                        <MapIcon size={16} /> Cities
                    </span>

                    {/* Horizontal List */}
                    {discoveredCities.map((city, i) => (
                        <Link href={`/city/${city}`} key={i} style={{
                            textDecoration: 'none',
                            color: '#555',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            flexShrink: 0
                        }}>
                            {city} <ChevronDown size={14} color="#999" />
                        </Link>
                    ))}

                    <Link href="/nurseries" style={{
                        textDecoration: 'none',
                        color: 'var(--primary)',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        flexShrink: 0
                    }}>
                        All Cities
                    </Link>
                </div>
            </div>

            {/* Categories Section - Horizontal Scroll */}
            <div className="section" style={{ paddingTop: '1rem', paddingBottom: '1rem', background: 'white' }}>
                <div style={{
                    display: 'flex',
                    overflowX: 'auto',
                    gap: '1.5rem',
                    padding: '0 1rem',
                    scrollbarWidth: 'none',
                    paddingBottom: '0.5rem'
                }}>
                    {dynamicCategories.map((cat, i) => (
                        <Link href={`/nurseries?q=${encodeURIComponent(cat.name)}`} key={i} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem',
                            minWidth: '80px',
                            cursor: 'pointer',
                            textDecoration: 'none'
                        }}>
                            <div style={{
                                width: '75px',
                                height: '75px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                border: '2px solid #fff',
                                padding: '2px', // gap between border and image
                                background: 'white',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                            }}>
                                <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, textAlign: 'center', color: '#333', lineHeight: 1.2 }}>
                                {cat.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Featured Nurseries */}
            <section className="container section" style={{ marginBottom: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {location ? `Growers near ${location}` : 'Verified Growers'}
                    </span>
                    <h2 style={{ fontSize: '2rem', color: 'var(--text-main)', marginTop: '0.5rem' }}>Featured Nurseries</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Hand-picked for quality and variety.</p>
                </div>

                <div className="grid grid-cols-3" style={{ gap: '1.5rem' }}>
                    {filteredNurseries.map(nursery => (
                        <NurseryCard key={nursery.id} nursery={nursery} />
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <Link href="/nurseries" className="btn btn-secondary">
                        View All Nurseries
                    </Link>
                </div>
            </section>

            {/* All Plants Section */}
            <section className="section" style={{ background: '#f9f9f9', padding: '3rem 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Fresh Arrivals</span>
                        <h2 style={{ fontSize: '2rem', color: 'var(--text-main)', marginTop: '0.5rem' }}>Trending Plants</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Best-selling plants from nurseries near you.</p>
                    </div>

                    <div className="grid grid-cols-4" style={{ gap: '1.5rem' }}>
                        {filteredProducts.map(product => {
                            const nursery = nurseries.find(n => n.id === product.nurseryId); // Find nursery for phone
                            const productWithPhone = { ...product, nurseryPhone: nursery?.contact?.phone || nursery?.phone };
                            return <ProductCard key={product.id} product={productWithPhone} />
                        })}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <Link href="/plants" className="btn btn-outline">
                            View All Plants
                        </Link>
                    </div>
                </div>
            </section>

            {/* Blog Section */}
            <section className="container section" style={{ marginBottom: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Our Blog</span>
                    <h2 style={{ fontSize: '2rem', color: 'var(--text-main)', marginTop: '0.5rem' }}>Plant Care & Tips</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Expert advice for your green journey</p>
                </div>

                <div className="grid grid-cols-3" style={{ gap: '1.5rem' }}>
                    {posts && posts.map(post => (
                        <article key={post.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ height: '200px', overflow: 'hidden' }}>
                                <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
                            </div>
                            <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={14} /> {post.date}</span>
                                </div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                                    <Link href={`/blog/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        {post.title}
                                    </Link>
                                </h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', flex: 1 }}>
                                    {post.excerpt}
                                </p>
                                <Link href={`/blog/${post.id}`} style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                                    Read More →
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <Link href="/blog" className="btn btn-outline">
                        View All Articles
                    </Link>
                </div>
            </section>

            <section className="section" style={{ background: 'var(--surface)', marginTop: '2rem' }}>
                <div className="container">
                    <div className="grid grid-cols-2" style={{ alignItems: 'center', gap: '2rem' }}>
                        <div>
                            <h2 style={{ marginBottom: '1rem', fontSize: '1.75rem' }}>Are you a Nursery Owner?</h2>
                            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                                Join India's largest network of plant growers. Get a dedicated page, list your products, and reach thousands of plant lovers nationwide.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem' }}>
                                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    ✅ Dedicated Profile Page
                                </li>
                                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    ✅ Direct Customer Enquiries
                                </li>
                                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    ✅ Zero Commissions
                                </li>
                            </ul>
                            <Link href="/vendor/register" className="btn btn-primary">
                                Register Your Nursery
                            </Link>
                        </div>
                        <div>
                            <img
                                src="https://images.unsplash.com/photo-1592419044706-39796d40f98c?auto=format&fit=crop&q=80&w=1000"
                                alt="Nursery Owner"
                                style={{ borderRadius: '1rem', boxShadow: 'var(--shadow-lg)' }}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
