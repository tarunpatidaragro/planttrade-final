'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Search } from 'lucide-react';

export default function NurseryOnboarding() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        location: '', // Display string: "City, State"
        city: '',
        state: '',
        pincode: '',
        address: '', // Street address
        lat: '',
        lng: '',
        image: '',
        description: '',
        phone: '',
        website: '',
        farmersCount: '',
        googleMapEmbedUrl: '',
        specialties: []
    });

    const [isLocating, setIsLocating] = useState(false);

    useEffect(() => {
        const email = localStorage.getItem('vendorEmail');
        if (!email) {
            router.push('/vendor/register');
        }
    }, []);

    const handleSpecialtyChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setFormData(prev => ({ ...prev, specialties: [...prev.specialties, value] }));
        } else {
            setFormData(prev => ({ ...prev, specialties: prev.specialties.filter(s => s !== value) }));
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

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const base64 = await fileToBase64(file);
            setFormData(prev => ({ ...prev, image: base64 }));
        } catch (err) {
            console.error("Error reading file", err);
            alert("Error uploading image");
        }
    };

    const detectLocationFromAddress = async () => {
        if (!formData.city && !formData.pincode) {
            alert("Please enter at least a City or Pincode first.");
            return;
        }

        setIsLocating(true);
        const query = `${formData.address ? formData.address + ', ' : ''}${formData.city ? formData.city + ', ' : ''}${formData.state ? formData.state + ', ' : ''}${formData.pincode}`;

        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
            const data = await res.json();

            if (data && data.length > 0) {
                const result = data[0];
                setFormData(prev => ({
                    ...prev,
                    lat: parseFloat(result.lat),
                    lng: parseFloat(result.lon),
                    location: `${prev.city}, ${prev.state}` // Auto-format location string
                }));
                alert(`Location Found: Lat ${result.lat}, Lng ${result.lon}`);
            } else {
                alert("Could not find coordinates for this address. Please try adding more details.");
            }
        } catch (e) {
            console.error(e);
            alert("Error fetching coordinates.");
        } finally {
            setIsLocating(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure location string is set
        const finalLocation = formData.location || `${formData.city}, ${formData.state}`;

        try {
            const res = await fetch('/api/nurseries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: formData.name.toLowerCase().replace(/\s+/g, '-'), // Generate ID slug
                    name: formData.name,
                    location: finalLocation, // "City, State"
                    lat: formData.lat || null,
                    lng: formData.lng || null,
                    image: formData.image,
                    description: formData.description,
                    rating: 5.0, // Default start rating
                    farmersCount: parseInt(formData.farmersCount) || 1,
                    specialties: formData.specialties.length > 0 ? formData.specialties : ['General'],
                    website: formData.website,
                    googleMapEmbedUrl: formData.googleMapEmbedUrl,
                    contact: {
                        phone: formData.phone,
                        email: localStorage.getItem('vendorEmail'),
                        address: formData.address,
                        city: formData.city,
                        state: formData.state,
                        pincode: formData.pincode
                    }
                })
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('vendorNurseryId', data.id);
                alert('Nursery Listed Successfully! Redirecting to Dashboard...');
                router.push('/vendor/dashboard');
            } else {
                alert('Failed to list nursery. Please try again.');
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong.');
        }
    };

    const specialtyOptions = ['Indoor', 'Outdoor', 'Medicinal', 'Flowering', 'Succulents', 'Fruit', 'Tissue Culture', 'Forestry'];

    return (
        <div className="container section" style={{ maxWidth: '800px' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1>List Your Nursery</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Tell us about your business so customers can find you.</p>
            </div>

            <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label className="label">Nursery Name *</label>
                    <input className="input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required placeholder="e.g. Green Valley Nursery" />
                </div>

                {/* Enhanced Location Section */}
                <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', border: '1px solid #eee' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MapPin size={18} /> Location Details
                    </h3>
                    <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label className="label" style={{ fontSize: '0.9rem' }}>City *</label>
                            <input className="input" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} required placeholder="e.g. Indore" />
                        </div>
                        <div>
                            <label className="label" style={{ fontSize: '0.9rem' }}>State *</label>
                            <input className="input" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} required placeholder="e.g. Madhya Pradesh" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label className="label" style={{ fontSize: '0.9rem' }}>Pincode *</label>
                            <input className="input" value={formData.pincode} onChange={e => setFormData({ ...formData, pincode: e.target.value })} required placeholder="e.g. 452001" />
                        </div>
                        <div>
                            <label className="label" style={{ fontSize: '0.9rem' }}>Street Address</label>
                            <input className="input" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Shop No, Road Name..." />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={detectLocationFromAddress} className="btn btn-secondary" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }} disabled={isLocating}>
                            {isLocating ? 'Locating...' : 'Get GPS Coordinates'}
                        </button>
                        {(formData.lat && formData.lng) ? (
                            <span style={{ color: 'green', fontSize: '0.9rem', fontWeight: 600 }}>✅ GPS Locked: {formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}</span>
                        ) : (
                            <span style={{ color: '#eab308', fontSize: '0.85rem' }}>⚠ GPS needed for "Nearby" search</span>
                        )}
                    </div>
                </div>

                <div>
                    <label className="label">Main Image</label>
                    {formData.image && <img src={formData.image} style={{ height: 100, objectFit: 'cover', borderRadius: 8, marginBottom: '0.5rem', display: 'block' }} />}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="input" />
                    <input className="input" style={{ marginTop: '0.5rem' }} placeholder="Or paste Image URL" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                </div>

                <div>
                    <label className="label">Description *</label>
                    <textarea className="input" rows="4" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required placeholder="Describe your nursery..."></textarea>
                </div>

                <div>
                    <label className="label">Specialties (Select multiple)</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                        {specialtyOptions.map(opt => (
                            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                <input type="checkbox" value={opt} onChange={handleSpecialtyChange} checked={formData.specialties.includes(opt)} />
                                {opt}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
                    <div>
                        <label className="label">Contact Phone *</label>
                        <input className="input" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required placeholder="+91..." />
                    </div>
                    <div>
                        <label className="label">Farmers / Staff Count</label>
                        <input className="input" type="number" value={formData.farmersCount} onChange={e => setFormData({ ...formData, farmersCount: e.target.value })} placeholder="e.g. 10" />
                    </div>
                </div>

                <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
                    <div>
                        <label className="label">Website (Optional)</label>
                        <input className="input" value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} placeholder="https://..." />
                    </div>
                    <div>
                        <label className="label">Google Maps Embed URL (src)</label>
                        <input className="input" value={formData.googleMapEmbedUrl} onChange={e => setFormData({ ...formData, googleMapEmbedUrl: e.target.value })} placeholder="https://www.google.com/maps/embed?..." />
                        <small style={{ fontSize: '0.75rem', color: '#888' }}>Go to Google Maps -&gt; Share -&gt; Embed -&gt; Copy src URL.</small>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '1rem', fontSize: '1.1rem' }}>
                    Submit & Create Dashboard
                </button>
            </form>
        </div>
    );
}
