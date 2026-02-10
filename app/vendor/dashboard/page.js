'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Camera, Trash2, Plus, Upload, MapPin, Crosshair } from 'lucide-react';

const defaultPlants = [
    { name: 'Monstera Deliciosa', category: 'Indoor', price: 850, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=800' },
    { name: 'Snake Plant', category: 'Indoor', price: 450, image: 'https://images.unsplash.com/photo-1593482831542-f852876dbdd1?auto=format&fit=crop&q=80&w=800' },
    { name: 'Red Rose', category: 'Flowering', price: 250, image: 'https://images.unsplash.com/photo-1593696954577-68094891b29a?auto=format&fit=crop&q=80&w=800' },
    { name: 'Aloe Vera', category: 'Medicinal', price: 150, image: 'https://images.unsplash.com/photo-1627931383788-b4b0e5005d52?auto=format&fit=crop&q=80&w=800' },
    { name: 'Mango Sapling', category: 'Fruit', price: 350, image: 'https://images.unsplash.com/photo-1598018305018-d7311ce83569?auto=format&fit=crop&q=80&w=800' },
    { name: 'Tulsi', category: 'Sacred', price: 100, image: 'https://images.unsplash.com/photo-1634320958189-eeb52119e685?auto=format&fit=crop&q=80&w=800' }
];

const specialtyOptions = ['Indoor', 'Outdoor', 'Medicinal', 'Flowering', 'Succulents', 'Fruit', 'Tissue Culture', 'Forestry'];

export default function VendorDashboard() {
    const [activeTab, setActiveTab] = useState('products'); // products | profile
    const [products, setProducts] = useState([]);
    const [myNursery, setMyNursery] = useState(null);
    const [myNurseryId, setMyNurseryId] = useState(null);
    const [isLocating, setIsLocating] = useState(false);

    // Forms
    const [productForm, setProductForm] = useState({
        name: '', price: '', category: 'Indoor', image: '', images: [], description: ''
    });
    const [profileForm, setProfileForm] = useState({
        name: '',
        location: '',
        city: '',
        state: '',
        pincode: '',
        lat: '',
        lng: '',
        image: '',
        description: '',
        phone: '',
        address: '', // Street Address
        website: '',
        farmersCount: '',
        googleMapEmbedUrl: '',
        specialties: [],
        gallery: [],
        reviews: []
    });

    const router = useRouter();

    useEffect(() => {
        const nurseryId = localStorage.getItem('vendorNurseryId');
        if (nurseryId) {
            setMyNurseryId(nurseryId);
            fetchData(nurseryId);
        } else {
            // Logged in but no nursery? Go to Onboarding
            router.push('/vendor/onboarding');
        }
    }, [router]);

    const fetchData = async (id) => {
        // Fetch Nursery Details
        try {
            const nRes = await fetch('/api/nurseries');
            const nData = await nRes.json();
            const me = nData.find(n => n.id === id);
            if (me) {
                setMyNursery(me);
                setProfileForm({
                    ...me,
                    phone: me.contact?.phone || '',
                    address: me.contact?.address || '',
                    city: me.contact?.city || '',
                    state: me.contact?.state || '',
                    pincode: me.contact?.pincode || '',
                    lat: me.lat || '',
                    lng: me.lng || '',
                    gallery: me.gallery || [],
                    reviews: me.reviews || [],
                    specialties: me.specialties || []
                });
            }

            // Fetch Products
            const pRes = await fetch('/api/products');
            const pData = await pRes.json();
            const myProducts = pData.filter(p => p.nurseryId === id);
            setProducts(myProducts);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Helper: Convert File to Base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const handleImageUpload = async (e, field, isGallery = false) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        try {
            const base64Promises = files.map(file => fileToBase64(file));
            const base64Results = await Promise.all(base64Promises);

            if (isGallery) {
                setProfileForm(prev => ({ ...prev, gallery: [...prev.gallery, ...base64Results] }));
            } else if (field === 'productImages') {
                setProductForm(prev => {
                    // Limit to 5 images total logic if needed, but flex for now
                    const newImages = [...(prev.images || []), ...base64Results];
                    return {
                        ...prev,
                        images: newImages,
                        image: prev.image || newImages[0]
                    };
                });
            } else if (field === 'productImageMain') {
                setProductForm(prev => ({ ...prev, image: base64Results[0] }));
            } else {
                setProfileForm(prev => ({ ...prev, [field]: base64Results[0] }));
            }
        } catch (err) {
            console.error("Error reading file", err);
            alert("Error uploading image");
        }
    };

    // --- Location Detection (Device GPS) ---
    const detectLocationFromDevice = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            // 1. Set Coords
            const newForm = {
                ...profileForm,
                lat: latitude,
                lng: longitude
            };

            // 2. Auto-generate Google Maps Embed URL if empty
            if (!profileForm.googleMapEmbedUrl) {
                // Construct a simple embed iframe src
                // Note: Standard Google Maps Embed API requires key for "view" mode, 
                // but we can use the "iframe" src trick for free usage or the direction link.
                // However, for Embedding a map nicely, usually you need an API key or "Share -> Embed" html.
                // A reliable fallback without API key is using OpenStreetMap embed or just a link.
                // But for the user request, let's try to simulate the Google Maps Embed URL structure if they want to autosave it.
                // Actually, let's use a construction that often works: 
                // https://maps.google.com/maps?q=lat,lng&z=15&output=embed
                newForm.googleMapEmbedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&hl=en&z=14&output=embed`;
            }

            // 3. Reverse Geocode for City/State if missing
            if (!profileForm.city) {
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await res.json();
                    if (data) {
                        newForm.city = data.address.city || data.address.town || data.address.village || data.address.county || '';
                        newForm.state = data.address.state || '';
                        newForm.pincode = data.address.postcode || '';
                    }
                } catch (e) { console.error(e); }
            }

            setProfileForm(newForm);
            setIsLocating(false);
            alert("GPS Location Captured! Map updated.");

        }, (err) => {
            console.error(err);
            setIsLocating(false);
            alert("Unable to retrieve your location. Please allow location access.");
        });
    };

    // --- Profile Updates ---
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        const finalLocation = profileForm.location || (profileForm.city ? `${profileForm.city}, ${profileForm.state}` : profileForm.location);

        const res = await fetch('/api/nurseries', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...profileForm,
                location: finalLocation,
                id: myNurseryId,
                contact: {
                    phone: profileForm.phone,
                    address: profileForm.address,
                    city: profileForm.city,
                    state: profileForm.state,
                    pincode: profileForm.pincode,
                    email: myNursery.contact?.email
                }
            })
        });

        if (res.ok) {
            alert("Profile Updated Successfully!");
            fetchData(myNurseryId);
        } else {
            alert("Failed to update profile.");
        }
    };

    const handleSpecialtyChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setProfileForm(prev => ({ ...prev, specialties: [...prev.specialties, value] }));
        } else {
            setProfileForm(prev => ({ ...prev, specialties: prev.specialties.filter(s => s !== value) }));
        }
    };

    const addReview = () => {
        const user = prompt("Customer Name:");
        const comment = prompt("Review Comment:");
        const rating = prompt("Rating (1-5):");
        if (user && comment) {
            const newReview = { user, comment, rating: parseInt(rating) || 5 };
            setProfileForm(prev => ({ ...prev, reviews: [...prev.reviews, newReview] }));
        }
    };

    // --- Product Updates ---
    const handleProductSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...productForm,
                nurseryId: myNurseryId,
                vendor: myNursery?.name || 'My Nursery',
                nurseryPhone: myNursery?.contact?.phone
            }),
        });

        if (res.ok) {
            alert('Product added!');
            fetchData(myNurseryId);
            setProductForm({ name: '', price: '', category: 'Indoor', image: '', images: [], description: '' });
        }
    };

    return (
        <div className="container section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1>Vendor Dashboard</h1>
                    {myNurseryId && (
                        <Link href={`/nursery/${myNurseryId}`} target="_blank" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'underline' }}>
                            View My Public Nursery Page
                        </Link>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-outline" onClick={() => {
                        document.cookie = "plant_vendor_v1=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        localStorage.removeItem('vendorNurseryId');
                        router.push('/vendor/login');
                    }}>Logout</button>
                    <Link href="/" className="btn btn-secondary">Back to Site</Link>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #ddd', marginBottom: '2rem' }}>
                <button
                    onClick={() => setActiveTab('products')}
                    style={{ padding: '1rem', borderBottom: activeTab === 'products' ? '3px solid var(--primary)' : 'none', fontWeight: 600, color: activeTab === 'products' ? 'var(--primary)' : '#666', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    Manage Products
                </button>
                <button
                    onClick={() => setActiveTab('profile')}
                    style={{ padding: '1rem', borderBottom: activeTab === 'profile' ? '3px solid var(--primary)' : 'none', fontWeight: 600, color: activeTab === 'profile' ? 'var(--primary)' : '#666', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    Edit Profile & Gallery
                </button>
            </div>

            {/* PRODUCT TAB */}
            {activeTab === 'products' && (
                <div className="grid grid-cols-2" style={{ gap: '4rem' }}>
                    <div className="card" style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Add New Product</h2>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="label">Quick Select:</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {defaultPlants.map(p => (
                                    <button key={p.name} type="button" onClick={() => setProductForm({ ...productForm, ...p, description: `High quality ${p.name}` })} style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', border: '1px solid #ccc', background: 'white', cursor: 'pointer', fontSize: '0.85rem' }}>
                                        + {p.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input className="input" placeholder="Product Name" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} required />
                            <input className="input" type="number" placeholder="Price (₹)" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} required />
                            <select className="input" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })}>
                                <option>Indoor</option><option>Outdoor</option><option>Flowering</option><option>Medicinal</option><option>Fruit</option><option>Succulents</option><option>Sacred</option>
                            </select>

                            <div>
                                <label className="label">Main Product Image</label>
                                {productForm.image && <img src={productForm.image} style={{ height: 80, objectFit: 'cover', borderRadius: 8, marginBottom: '0.5rem', display: 'block' }} />}
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'productImageMain')} className="input" />
                            </div>

                            <div>
                                <label className="label">Additional Product Photos (Max 5)</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    {productForm.images?.map((img, i) => (
                                        <div key={i} style={{ position: 'relative', height: 60, width: 60 }}>
                                            <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }} />
                                            <button type="button" onClick={() => setProductForm(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))} style={{ position: 'absolute', top: 0, right: 0, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: 16, height: 16, fontSize: '10px', cursor: 'pointer' }}>×</button>
                                        </div>
                                    ))}
                                </div>
                                <input type="file" accept="image/*" multiple onChange={(e) => handleImageUpload(e, 'productImages')} className="input" />
                            </div>

                            <textarea className="input" placeholder="Description" rows="3" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })}></textarea>

                            <button type="submit" className="btn btn-primary">Add Product</button>
                        </form>
                    </div>

                    <div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Your Products</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '600px', overflowY: 'auto' }}>
                            {products.map(product => (
                                <div key={product.id} className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <img src={product.image || 'https://via.placeholder.com/50'} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ marginBottom: '0' }}>{product.name}</h4>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>₹{product.price}</span>
                                    </div>
                                </div>
                            ))}
                            {products.length === 0 && <p>No products yet.</p>}
                        </div>
                    </div>
                </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
                <div className="grid grid-cols-2" style={{ gap: '4rem' }}>
                    <form onSubmit={handleProfileUpdate} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3>Basic Info</h3>
                        <input className="input" placeholder="Nursery Name" value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} required />

                        <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', border: '1px solid #eee' }}>
                            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} /> Location & Address</h4>
                            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>
                                Stand at your nursery location and click "Auto-Tag Location" to automatically let customers find you on the map.
                            </p>

                            <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label className="label" style={{ fontSize: '0.85rem' }}>City</label>
                                    <input className="input" value={profileForm.city} onChange={e => setProfileForm({ ...profileForm, city: e.target.value })} placeholder="e.g. Pune" />
                                </div>
                                <div>
                                    <label className="label" style={{ fontSize: '0.85rem' }}>State</label>
                                    <input className="input" value={profileForm.state} onChange={e => setProfileForm({ ...profileForm, state: e.target.value })} placeholder="e.g. Maharashtra" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label className="label" style={{ fontSize: '0.85rem' }}>Pincode</label>
                                    <input className="input" value={profileForm.pincode} onChange={e => setProfileForm({ ...profileForm, pincode: e.target.value })} placeholder="e.g. 411001" />
                                </div>
                                <div>
                                    <label className="label" style={{ fontSize: '0.85rem' }}>Street Address</label>
                                    <input className="input" value={profileForm.address} onChange={e => setProfileForm({ ...profileForm, address: e.target.value })} placeholder="Shop 4, Main Road..." />
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <button type="button" onClick={detectLocationFromDevice} className="btn btn-secondary btn-sm" disabled={isLocating} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Crosshair size={16} />
                                    {isLocating ? 'Acquiring GPS...' : 'Auto-Tag My Location'}
                                </button>
                                {profileForm.lat ? <span style={{ color: 'green', fontSize: '0.8rem' }}>✅ {profileForm.lat.toFixed(4)}, {profileForm.lng.toFixed(4)}</span> : <span style={{ color: 'orange', fontSize: '0.8rem' }}>⚠ GPS Not Set</span>}
                            </div>
                        </div>

                        <div>
                            <label className="label">Main Cover Image</label>
                            {profileForm.image && <img src={profileForm.image} style={{ height: 100, objectFit: 'cover', borderRadius: 8, marginBottom: '0.5rem' }} />}
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'image')} className="input" />
                        </div>

                        <textarea className="input" placeholder="Description" rows="4" value={profileForm.description} onChange={e => setProfileForm({ ...profileForm, description: e.target.value })}></textarea>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                            {specialtyOptions.map(opt => (
                                <label key={opt} style={{ fontSize: '0.9rem' }}>
                                    <input type="checkbox" value={opt} checked={profileForm.specialties.includes(opt)} onChange={handleSpecialtyChange} /> {opt}
                                </label>
                            ))}
                        </div>

                        <h3>Contact & Extras</h3>
                        <label className="label">Google Maps Embed URL</label>
                        <input className="input" placeholder="https://maps.google.com/..." value={profileForm.googleMapEmbedUrl} onChange={e => setProfileForm({ ...profileForm, googleMapEmbedUrl: e.target.value })} />
                        <small style={{ fontSize: '0.75rem', color: '#666', display: 'block', marginBottom: '0.5rem' }}>
                            Will be auto-filled if you use "Auto-Tag My Location", or paste your own.
                        </small>

                        <input className="input" placeholder="Phone" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} />

                        <button type="submit" className="btn btn-primary">Save Changes</button>
                    </form>

                    <div>
                        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <h3>Gallery Images</h3>
                                <label className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                                    <Upload size={14} style={{ marginRight: 4 }} /> Upload
                                    <input type="file" accept="image/*" multiple onChange={(e) => handleImageUpload(e, null, true)} style={{ display: 'none' }} />
                                </label>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                                {profileForm.gallery.map((img, i) => (
                                    <div key={i} style={{ position: 'relative', height: 80 }}>
                                        <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }} />
                                        <button
                                            type="button"
                                            onClick={() => setProfileForm(prev => ({ ...prev, gallery: prev.gallery.filter((_, idx) => idx !== i) }))}
                                            style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <h3>Customer Reviews</h3>
                                <button type="button" onClick={addReview} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}><Plus size={14} /> Add Testimonial</button>
                            </div>
                            <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                                {profileForm.reviews.map((rev, i) => (
                                    <div key={i} style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                                        <div style={{ fontWeight: 600 }}>{rev.user} <span style={{ color: 'gold' }}>★ {rev.rating}</span></div>
                                        <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>{rev.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
