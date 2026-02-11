'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, MapPin, Upload, X, Image as ImageIcon, Globe, Phone, Mail, Search, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function AddNurseryPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isLocating, setIsLocating] = useState(false);

    // Comprehensive Data Structure matching Vendor/Frontend
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '', // Cover Image (Base64)
        gallery: [], // Array of Base64 strings
        specialties: [],
        website: '',
        farmersCount: 5,
        rating: 5.0,

        // Detailed Location
        address: '',
        city: '',
        state: '',
        pincode: '',

        // GIS
        lat: '',
        lng: '',
        googleMapEmbedUrl: '',

        // Contact
        contactPerson: '',
        phone: '',
        email: '',

        // Social
        instagram: '',
        facebook: '',
        whatsapp: '',
        youtube: ''
    });

    // Helper: File to Base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const handleImageUpload = async (e, isGallery = false) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        try {
            const base64Promises = files.map(file => fileToBase64(file));
            const base64Results = await Promise.all(base64Promises);

            if (isGallery) {
                setFormData(prev => ({ ...prev, gallery: [...prev.gallery, ...base64Results] }));
            } else {
                setFormData(prev => ({ ...prev, image: base64Results[0] }));
            }
        } catch (err) {
            console.error("Error processing images", err);
            alert("Error processing images");
        }
    };

    const removeGalleryImage = (index) => {
        setFormData(prev => ({
            ...prev,
            gallery: prev.gallery.filter((_, i) => i !== index)
        }));
    };

    // Location Intelligence: Address -> GPS
    const detectLocationFromAddress = async () => {
        if (!formData.city && !formData.pincode) {
            alert("Please enter at least a City or Pincode to search.");
            return;
        }

        setIsLocating(true);
        // Build query string
        const query = `${formData.address ? formData.address + ', ' : ''}${formData.city ? formData.city + ', ' : ''}${formData.state ? formData.state + ', ' : ''}${formData.pincode}`;

        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
            const data = await res.json();

            if (data && data.length > 0) {
                const result = data[0];
                const lat = parseFloat(result.lat);
                const lng = parseFloat(result.lon);

                setFormData(prev => ({
                    ...prev,
                    lat: lat,
                    lng: lng,
                    // Auto-generate Google Embed URL if empty
                    googleMapEmbedUrl: prev.googleMapEmbedUrl || `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=14&output=embed`
                }));
                alert(`Location Found: ${lat}, ${lng}`);
            } else {
                alert("Could not find coordinates. Please refine the address.");
            }
        } catch (e) {
            console.error(e);
            alert("Error fetching location data.");
        } finally {
            setIsLocating(false);
        }
    };

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Nursery Name is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!validate()) {
            alert("Please fix the errors in the form before saving.");
            return;
        }

        setIsLoading(true);

        // Construct final payload
        // Note: We map flat form fields to the nested structure expected by the API/Frontend
        const payload = {
            id: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
            name: formData.name,
            description: formData.description,
            openingHours: formData.openingHours || '9:00 AM - 7:00 PM',
            image: formData.image,
            gallery: formData.gallery,
            lat: formData.lat || null,
            lng: formData.lng || null,
            location: `${formData.city}, ${formData.state}`, // Display string
            googleMapEmbedUrl: formData.googleMapEmbedUrl,
            rating: parseFloat(formData.rating) || 5.0,
            farmersCount: parseInt(formData.farmersCount) || 1,
            specialties: formData.specialties.length > 0 ? formData.specialties : ['General'],
            website: formData.website,
            contact: {
                person: formData.contactPerson,
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode
            },
            social: {
                instagram: formData.instagram,
                facebook: formData.facebook,
                whatsapp: formData.whatsapp,
                youtube: formData.youtube
            }
        };

        try {
            const res = await fetch('/api/nurseries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert('Nursery Added Successfully!');
                router.push('/admin/nurseries');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to add nursery.');
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleSpecialty = (tag) => {
        if (formData.specialties.includes(tag)) {
            setFormData(prev => ({ ...prev, specialties: prev.specialties.filter(t => t !== tag) }));
        } else {
            setFormData(prev => ({ ...prev, specialties: [...prev.specialties, tag] }));
        }
    };

    // const specialtyOptions = ['Indoor', 'Outdoor', 'Fruit', 'Medicinal', 'Succulents', 'Cacti', 'Bonsai', 'Seeds', 'Forestry', 'Flowering'];
    const [specialtyOptions, setSpecialtyOptions] = useState([]);

    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => {
                // Extract names
                setSpecialtyOptions(data.map(c => c.name));
            })
            .catch(err => console.error("Failed to load categories", err));
    }, []);

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin/nurseries" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ArrowLeft size={18} /> Back
                    </Link>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Onboard New Nursery</h1>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', fontSize: '1rem' }}
                >
                    <Save size={18} /> {isLoading ? 'Saving...' : 'Save Nursery'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                {/* LEFT COLUMN */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Basic Info */}
                    <div className="card" style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>Basic Information</h3>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <label className="label">Nursery Name *</label>
                                <input className="input" style={{ width: '100%', borderColor: errors.name ? 'red' : '' }} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Green Paradise Nursery" />
                                {errors.name && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.name}</div>}
                            </div>
                            <div>
                                <label className="label">Opening Hours</label>
                                <input className="input" style={{ width: '100%' }} value={formData.openingHours || ''} onChange={e => setFormData({ ...formData, openingHours: e.target.value })} placeholder="e.g. Mon-Sat: 9 AM - 7 PM" />
                            </div>
                            <div>
                                <label className="label">Description</label>
                                <textarea className="input" style={{ width: '100%' }} rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="About the nursery..." />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label className="label">Website (Optional)</label>
                                    <input className="input" style={{ width: '100%' }} value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} placeholder="https://" />
                                </div>
                                <div>
                                    <label className="label">Farmers/Staff Count</label>
                                    <input type="number" className="input" style={{ width: '100%' }} value={formData.farmersCount} onChange={e => setFormData({ ...formData, farmersCount: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location Intelligence */}
                    <div className="card" style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MapPin size={20} color="#0ea5e9" /> Location & Maps
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <label className="label">City *</label>
                                <input className="input" style={{ width: '100%', borderColor: errors.city ? 'red' : '' }} value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} placeholder="Pune" />
                                {errors.city && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.city}</div>}
                            </div>
                            <div>
                                <label className="label">State *</label>
                                <input className="input" style={{ width: '100%', borderColor: errors.state ? 'red' : '' }} value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} placeholder="Maharashtra" />
                                {errors.state && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.state}</div>}
                            </div>
                            <div>
                                <label className="label">Pincode *</label>
                                <input className="input" style={{ width: '100%' }} value={formData.pincode} onChange={e => setFormData({ ...formData, pincode: e.target.value })} placeholder="411001" />
                            </div>
                            <div>
                                <label className="label">Address Line</label>
                                <input className="input" style={{ width: '100%' }} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Shop No, Street..." />
                            </div>
                        </div>

                        {/* GPS Action */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', padding: '1rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '1rem' }}>
                            <button
                                type="button"
                                onClick={detectLocationFromAddress}
                                disabled={isLocating}
                                className="btn"
                                style={{ background: '#0ea5e9', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <Search size={16} /> {isLocating ? 'Locating...' : 'Get GPS from Address'}
                            </button>
                            <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                {formData.lat ?
                                    <span style={{ color: 'green', fontWeight: 600 }}>✅ GPS Set: {formData.lat}, {formData.lng}</span>
                                    : '⚠️ GPS required for map features'
                                }
                            </div>
                        </div>

                        {/* Embed URL */}
                        <div>
                            <label className="label">Google Maps Embed URL</label>
                            <input className="input" style={{ width: '100%' }} value={formData.googleMapEmbedUrl} onChange={e => setFormData({ ...formData, googleMapEmbedUrl: e.target.value })} placeholder="https://maps.google.com/..." />
                            <small style={{ color: '#64748b' }}>Auto-generated when you click "Get GPS", or paste your own.</small>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="card" style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>Contact Details</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label className="label">Contact Person</label>
                                <input className="input" style={{ width: '100%' }} value={formData.contactPerson} onChange={e => setFormData({ ...formData, contactPerson: e.target.value })} />
                            </div>
                            <div>
                                <label className="label">Phone / Mobile * (Required)</label>
                                <input className="input" style={{ width: '100%', borderColor: errors.phone ? 'red' : '' }} value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+91..." />
                                {errors.phone && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.phone}</div>}
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label className="label">Email Address</label>
                                <input className="input" type="email" style={{ width: '100%' }} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="card" style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>Social Media Links</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label className="label">Instagram</label>
                                <input className="input" style={{ width: '100%' }} value={formData.instagram} onChange={e => setFormData({ ...formData, instagram: e.target.value })} placeholder="https://instagram.com/..." />
                            </div>
                            <div>
                                <label className="label">Facebook</label>
                                <input className="input" style={{ width: '100%' }} value={formData.facebook} onChange={e => setFormData({ ...formData, facebook: e.target.value })} placeholder="https://facebook.com/..." />
                            </div>
                            <div>
                                <label className="label">WhatsApp (Link)</label>
                                <input className="input" style={{ width: '100%' }} value={formData.whatsapp} onChange={e => setFormData({ ...formData, whatsapp: e.target.value })} placeholder="https://wa.me/..." />
                            </div>
                            <div>
                                <label className="label">YouTube</label>
                                <input className="input" style={{ width: '100%' }} value={formData.youtube} onChange={e => setFormData({ ...formData, youtube: e.target.value })} placeholder="https://youtube.com/..." />
                            </div>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Cover Image */}
                    <div className="card" style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 600 }}>Cover Image</h3>
                        <div style={{ border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '1rem', textAlign: 'center', marginBottom: '1rem' }}>
                            {formData.image ? (
                                <img src={formData.image} alt="Cover" style={{ width: '100%', borderRadius: '6px', maxHeight: '200px', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ padding: '2rem 0', color: '#94a3b8' }}>
                                    <ImageIcon size={48} style={{ margin: '0 auto', display: 'block', marginBottom: '0.5rem' }} />
                                    No Image Selected
                                </div>
                            )}
                        </div>
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, false)} style={{ width: '100%' }} />
                    </div>

                    {/* Gallery */}
                    <div className="card" style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 600 }}>Gallery (Multiple)</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                            {formData.gallery.map((img, idx) => (
                                <div key={idx} style={{ position: 'relative', aspectRatio: '1' }}>
                                    <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                                    <button
                                        type="button"
                                        onClick={() => removeGalleryImage(idx)}
                                        style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <label className="btn btn-outline" style={{ display: 'block', textAlign: 'center', cursor: 'pointer' }}>
                            <Upload size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Upload Photos
                            <input type="file" multiple accept="image/*" onChange={(e) => handleImageUpload(e, true)} style={{ display: 'none' }} />
                        </label>
                    </div>

                    {/* Specialties */}
                    <div className="card" style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 600 }}>Specialties</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {specialtyOptions.map(tag => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => toggleSpecialty(tag)}
                                    style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        border: formData.specialties.includes(tag) ? '1px solid #16a34a' : '1px solid #cbd5e1',
                                        background: formData.specialties.includes(tag) ? '#dcfce7' : 'white',
                                        color: formData.specialties.includes(tag) ? '#166534' : '#64748b',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
