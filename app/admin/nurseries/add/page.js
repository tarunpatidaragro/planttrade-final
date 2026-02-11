'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, MapPin, Upload, X, Image as ImageIcon, Globe, Phone, Mail, Search, CheckCircle, FileText, User, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function AddNurseryPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isLocating, setIsLocating] = useState(false);

    // Comprehensive Data Structure matching Vendor/Frontend
    const [formData, setFormData] = useState({
        name: '',
        description: '', // "About Nursery"
        image: '', // "Master Image" (Base64)
        gallery: [], // "Images Gallery Multiple Image Upload"
        specialties: [], // "Add Speciality (Category)"
        website: '', // "Website Link"
        rating: 5.0,
        farmersCount: 1,

        // Location System Integrated with Frontend & Google Map
        address: '',
        city: '',
        state: '',
        pincode: '',
        lat: '',
        lng: '',
        googleMapEmbedUrl: '', // "Map Embadded"

        // Contact Info
        contactPerson: '', // "Owner Name"
        phone: '', // "Owner Number" -> for "Chat on WhatsApp Button"
        email: '', // "Mail Id"

        // Social Media Link Option
        instagram: '',
        facebook: '',
        whatsapp: '',
        youtube: '',

        // "Nursury Documents PDF to upload"
        documents: []
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

    const handleFileUpload = async (e, type) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Size check (simulated 2MB limit for base64 safety on Vercel)
        const isTooLarge = files.some(file => file.size > 2 * 1024 * 1024);
        if (isTooLarge) {
            alert("File matches size limit (Keep under 2MB for Best Performance).");
            return;
        }

        try {
            const base64Promises = files.map(file => fileToBase64(file));
            const base64Results = await Promise.all(base64Promises);

            if (type === 'gallery') {
                setFormData(prev => ({ ...prev, gallery: [...prev.gallery, ...base64Results] }));
            } else if (type === 'image') {
                setFormData(prev => ({ ...prev, image: base64Results[0] }));
            } else if (type === 'documents') {
                // For PDFs, we might want just links if upload fails, but here we try base64
                setFormData(prev => ({ ...prev, documents: [...prev.documents, ...base64Results] }));
            }
        } catch (err) {
            console.error("Error processing files", err);
            alert("Error processing files");
        }
    };

    const removeArrayItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
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
        if (!formData.phone.trim()) newErrors.phone = 'Owner Number is required';
        if (!formData.image) newErrors.image = 'Master Image is required';

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

        const payload = {
            id: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
            name: formData.name,
            description: formData.description,
            openingHours: formData.openingHours || '9:00 AM - 7:00 PM',
            image: formData.image,
            gallery: formData.gallery,
            documents: formData.documents,
            lat: formData.lat || null,
            lng: formData.lng || null,
            location: `${formData.city}, ${formData.state}`,
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
                // Extract names or use fallback
                const list = Array.isArray(data) && data.length > 0 ? data.map(c => c.name || c) : ['Indoor', 'Outdoor', 'Fruit', 'Medicinal', 'Succulents', 'Cacti', 'Bonsai', 'Seeds', 'Forestry', 'Flowering'];
                setSpecialtyOptions(list);
            })
            .catch(err => {
                console.error("Failed to load categories", err);
                setSpecialtyOptions(['Indoor', 'Outdoor', 'Fruit', 'Medicinal', 'Succulents', 'Cacti', 'Bonsai', 'Seeds', 'Forestry', 'Flowering']);
            });
    }, []);

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin/nurseries" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ArrowLeft size={18} /> Back
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Add New Nursery</h1>
                        <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>Fill in all details to onboard a nursery partner.</p>
                    </div>
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

                {/* LEFT COLUMN: Main Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Section: Basic Information */}
                    <div className="card" style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileText size={20} /> About Nursery
                        </h3>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <label className="label">Nursery Name *</label>
                                <input className="input" style={{ width: '100%', borderColor: errors.name ? 'red' : '' }} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Green Paradise Nursery" />
                                {errors.name && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.name}</div>}
                            </div>

                            <div>
                                <label className="label">Description / About</label>
                                <textarea className="input" style={{ width: '100%' }} rows={5} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Write a detailed description about the nursery..." />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label className="label">Website Link</label>
                                    <input className="input" style={{ width: '100%' }} value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} placeholder="https://..." />
                                </div>
                                <div>
                                    <label className="label">Opening Hours</label>
                                    <input className="input" style={{ width: '100%' }} value={formData.openingHours || ''} onChange={e => setFormData({ ...formData, openingHours: e.target.value })} placeholder="e.g. 9 AM - 7 PM" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section: Contact Details (Owner) */}
                    <div className="card" style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <User size={20} /> Owner & Contact Details
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label className="label">Owner Name</label>
                                <input className="input" style={{ width: '100%' }} value={formData.contactPerson} onChange={e => setFormData({ ...formData, contactPerson: e.target.value })} placeholder="e.g. Amit Kumar" />
                            </div>
                            <div>
                                <label className="label">Owner Number *</label>
                                <div style={{ position: 'relative' }}>
                                    <Phone size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#666' }} />
                                    <input className="input" style={{ width: '100%', paddingLeft: '35px', borderColor: errors.phone ? 'red' : '' }} value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+91..." />
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#16a34a', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <MessageCircle size={12} /> This number will be used for "Chat on WhatsApp".
                                </div>
                                {errors.phone && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.phone}</div>}
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label className="label">Mail Id</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#666' }} />
                                    <input className="input" type="email" style={{ width: '100%', paddingLeft: '35px' }} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="nursery@example.com" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section: Location System */}
                    <div className="card" style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MapPin size={20} color="#0ea5e9" /> Location System (Google Map Integrated)
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <label className="label">City *</label>
                                <input className="input" style={{ width: '100%', borderColor: errors.city ? 'red' : '' }} value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} placeholder="Ex: Pune" />
                                {errors.city && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.city}</div>}
                            </div>
                            <div>
                                <label className="label">State *</label>
                                <input className="input" style={{ width: '100%', borderColor: errors.state ? 'red' : '' }} value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} placeholder="Ex: Maharashtra" />
                                {errors.state && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.state}</div>}
                            </div>
                            <div>
                                <label className="label">Pincode</label>
                                <input className="input" style={{ width: '100%' }} value={formData.pincode} onChange={e => setFormData({ ...formData, pincode: e.target.value })} placeholder="Ex: 411001" />
                            </div>
                            <div>
                                <label className="label">Full Address</label>
                                <input className="input" style={{ width: '100%' }} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Shop No, Street, Landmark..." />
                            </div>
                        </div>

                        {/* GIS Action */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', padding: '1rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '1rem' }}>
                            <button
                                type="button"
                                onClick={detectLocationFromAddress}
                                disabled={isLocating}
                                className="btn"
                                style={{ background: '#0ea5e9', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <Search size={16} /> {isLocating ? 'Locating...' : 'Search Location on Map'}
                            </button>
                            <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                {formData.lat ?
                                    <span style={{ color: 'green', fontWeight: 600 }}>✅ Location Found: {formData.lat}, {formData.lng}</span>
                                    : '⚠️ Precise location required for search features'
                                }
                            </div>
                        </div>

                        {/* Embed Map */}
                        <div>
                            <label className="label">Map Embedded URL</label>
                            <input className="input" style={{ width: '100%' }} value={formData.googleMapEmbedUrl} onChange={e => setFormData({ ...formData, googleMapEmbedUrl: e.target.value })} placeholder="https://maps.google.com/..." />
                            <small style={{ color: '#64748b' }}>If you leave this blank, we'll try to generate one from the coordinates.</small>
                        </div>
                    </div>

                    {/* Section: Social Media */}
                    <div className="card" style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Globe size={20} /> Social Media Link Option
                        </h3>
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
                                <label className="label">WhatsApp Group Link</label>
                                <input className="input" style={{ width: '100%' }} value={formData.whatsapp} onChange={e => setFormData({ ...formData, whatsapp: e.target.value })} placeholder="https://chat.whatsapp.com/..." />
                            </div>
                            <div>
                                <label className="label">YouTube Channel</label>
                                <input className="input" style={{ width: '100%' }} value={formData.youtube} onChange={e => setFormData({ ...formData, youtube: e.target.value })} placeholder="https://youtube.com/..." />
                            </div>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN: Media & Meta */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Master Image */}
                    <div className="card" style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 600 }}>Nursery Master Image *</h3>
                        <div style={{ border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '1rem', textAlign: 'center', marginBottom: '1rem' }}>
                            {formData.image ? (
                                <img src={formData.image} alt="Master" style={{ width: '100%', borderRadius: '6px', maxHeight: '200px', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ padding: '2rem 0', color: '#94a3b8' }}>
                                    <ImageIcon size={48} style={{ margin: '0 auto', display: 'block', marginBottom: '0.5rem' }} />
                                    No Image Selected
                                </div>
                            )}
                        </div>
                        {errors.image && <div style={{ color: 'red', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{errors.image}</div>}
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} style={{ width: '100%' }} />
                    </div>

                    {/* Gallery */}
                    <div className="card" style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 600 }}>Images Gallery (Multiple)</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                            {formData.gallery.map((img, idx) => (
                                <div key={idx} style={{ position: 'relative', aspectRatio: '1' }}>
                                    <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('gallery', idx)}
                                        style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <label className="btn btn-outline" style={{ display: 'block', textAlign: 'center', cursor: 'pointer', padding: '0.5rem' }}>
                            <Upload size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Upload Photos
                            <input type="file" multiple accept="image/*" onChange={(e) => handleFileUpload(e, 'gallery')} style={{ display: 'none' }} />
                        </label>
                    </div>

                    {/* Documents Upload */}
                    <div className="card" style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 600 }}>Nursery Documents PDF</h3>
                        <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem' }}>Upload registration, licenses etc.</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                            {formData.documents.map((doc, idx) => (
                                <div key={idx} style={{ padding: '0.5rem', background: '#f0f9ff', borderRadius: '4px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#0369a1' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                                        <FileText size={16} /> <span>Document {idx + 1}</span>
                                    </div>
                                    <button type="button" onClick={() => removeArrayItem('documents', idx)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X size={14} /></button>
                                </div>
                            ))}
                        </div>

                        <label className="btn btn-outline" style={{ display: 'block', textAlign: 'center', cursor: 'pointer', padding: '0.5rem' }}>
                            <Upload size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Upload PDF
                            <input type="file" accept="application/pdf" onChange={(e) => handleFileUpload(e, 'documents')} style={{ display: 'none' }} />
                        </label>
                        <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.5rem', textAlign: 'center' }}>Max file size: 2MB (Base64 storage)</p>
                    </div>

                    {/* Specialties / Category */}
                    <div className="card" style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 600 }}>Add Speciality (Category)</h3>
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

                    {/* Add Products Feature Note */}
                    <div className="card" style={{ padding: '1.5rem', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', fontWeight: 600, color: '#92400e' }}>Add Products Feature</h3>
                        <p style={{ fontSize: '0.85rem', color: '#92400e' }}>
                            After saving this nursery, you can add products to it from the <strong>Manage Products</strong> page.
                        </p>
                    </div>

                    {/* Customer Review Note */}
                    <div className="card" style={{ padding: '1.5rem', background: '#fdf2f8', borderRadius: '8px', border: '1px solid #fbcfe8' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', fontWeight: 600, color: '#be185d' }}>Customer Reviews</h3>
                        <p style={{ fontSize: '0.85rem', color: '#be185d' }}>
                            Customer reviews will automatically appear on the nursery profile page when submitted by users.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
