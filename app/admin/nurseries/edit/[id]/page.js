'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, MapPin, Upload, X, Image as ImageIcon, Globe, Phone, Mail, Search, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function EditNurseryPage({ params }) {
    const { id } = use(params);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [specialtyOptions, setSpecialtyOptions] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
        gallery: [],
        specialties: [],
        website: '',
        farmersCount: 5,
        rating: 5.0,
        address: '',
        city: '',
        state: '',
        pincode: '',
        lat: '',
        lng: '',
        googleMapEmbedUrl: '',
        contactPerson: '',
        phone: '',
        email: '',
        instagram: '',
        facebook: '',
        whatsapp: '',
        youtube: ''
    });

    useEffect(() => {
        // Fetch Categories
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => setSpecialtyOptions(data.map(c => c.name)))
            .catch(err => console.error(err));

        // Fetch Nursery Data
        fetch(`/api/nurseries/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch');
                return res.json();
            })
            .then(data => {
                setFormData({
                    name: data.name || '',
                    description: data.description || '',
                    image: data.image || '',
                    documents: data.documents || [],
                    gallery: data.gallery || [],
                    specialties: data.specialties || [],
                    website: data.website || '',
                    farmersCount: data.farmersCount || 5,
                    rating: data.rating || 5.0,

                    // Location
                    address: data.contact?.address || '',
                    city: data.contact?.city || '',
                    state: data.contact?.state || '',
                    pincode: data.contact?.pincode || '',
                    lat: data.lat || '',
                    lng: data.lng || '',
                    googleMapEmbedUrl: data.googleMapEmbedUrl || '',

                    // Contact
                    contactPerson: data.contact?.person || '',
                    phone: data.contact?.phone || '',
                    email: data.contact?.email || '',

                    // Social
                    instagram: data.social?.instagram || '',
                    facebook: data.social?.facebook || '',
                    whatsapp: data.social?.whatsapp || '',
                    youtube: data.social?.youtube || ''
                });
            })
            .catch(err => {
                console.error(err);
                alert('Error loading nursery data');
                router.push('/admin/nurseries');
            });
    }, [id]);

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
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
            alert("Error processing images");
        }
    };

    const removeGalleryImage = (index) => {
        setFormData(prev => ({
            ...prev,
            gallery: prev.gallery.filter((_, i) => i !== index)
        }));
    };

    const detectLocationFromAddress = async () => {
        if (!formData.city && !formData.pincode) {
            alert("Please enter at least a City or Pincode to search.");
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
                    googleMapEmbedUrl: prev.googleMapEmbedUrl || `https://maps.google.com/maps?q=${result.lat},${result.lon}&hl=en&z=14&output=embed`
                }));
                alert(`Location Found: ${result.lat}, ${result.lon}`);
            } else {
                alert("Could not find coordinates.");
            }
        } catch (e) {
            alert("Error fetching location data.");
        } finally {
            setIsLocating(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            name: formData.name,
            description: formData.description,
            image: formData.image,
            documents: formData.documents,
            gallery: formData.gallery,
            lat: formData.lat || null,
            lng: formData.lng || null,
            location: `${formData.city}, ${formData.state}`,
            googleMapEmbedUrl: formData.googleMapEmbedUrl,
            rating: parseFloat(formData.rating) || 5.0,
            farmersCount: parseInt(formData.farmersCount) || 1,
            specialties: formData.specialties,
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
            const res = await fetch(`/api/nurseries/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert('Nursery Updated Successfully!');
                router.push('/admin/nurseries');
            } else {
                alert('Failed to update nursery.');
            }
        } catch (err) {
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

    if (!formData.name && isLoading) return <div>Loading...</div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin/nurseries" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ArrowLeft size={18} /> Back
                    </Link>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Edit Nursery</h1>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', fontSize: '1rem' }}
                >
                    <Save size={18} /> {isLoading ? 'Saving...' : 'Update Nursery'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Basic Info */}
                    <div className="card" style={{ padding: '1.5rem', background: 'white' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee' }}>Basic Information</h3>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <label className="label">Nursery Name *</label>
                                <input className="input" style={{ width: '100%' }} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div>
                                <label className="label">Description</label>
                                <textarea className="input" style={{ width: '100%' }} rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>

                            {/* Documents Section */}
                            <div>
                                <label className="label">Documents</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    {(formData.documents || []).map((doc, idx) => (
                                        <div key={idx} style={{ padding: '0.5rem', background: '#f0f9ff', borderRadius: '4px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#0369a1' }}>
                                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Document {idx + 1}</span>
                                            <button type="button" onClick={() => setFormData(prev => ({ ...prev, documents: prev.documents.filter((_, i) => i !== idx) }))} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X size={14} /></button>
                                        </div>
                                    ))}
                                </div>
                                <label className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                                    <Upload size={14} style={{ marginRight: '5px' }} /> Upload PDF
                                    <input type="file" accept="application/pdf" onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;
                                        try {
                                            const base64 = await fileToBase64(file);
                                            setFormData(prev => ({ ...prev, documents: [...(prev.documents || []), base64] }));
                                        } catch (e) { alert('Error reading file'); }
                                    }} style={{ display: 'none' }} />
                                </label>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label className="label">Website</label>
                                    <input className="input" style={{ width: '100%' }} value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} />
                                </div>
                                <div>
                                    <label className="label">Staff Count</label>
                                    <input type="number" className="input" style={{ width: '100%' }} value={formData.farmersCount} onChange={e => setFormData({ ...formData, farmersCount: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="card" style={{ padding: '1.5rem', background: '#f8fafc' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}><MapPin size={20} /> Location & Maps</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <input className="input" placeholder="City" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                            <input className="input" placeholder="State" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} />
                            <input className="input" placeholder="Pincode" value={formData.pincode} onChange={e => setFormData({ ...formData, pincode: e.target.value })} />
                            <input className="input" placeholder="Address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', padding: '1rem', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '1rem' }}>
                            <button type="button" onClick={detectLocationFromAddress} disabled={isLocating} className="btn" style={{ background: '#0ea5e9', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Search size={16} /> Get GPS
                            </button>
                            <span>{formData.lat ? `✅ ${formData.lat}, ${formData.lng}` : 'No GPS Set'}</span>
                        </div>
                        <input className="input" style={{ width: '100%' }} value={formData.googleMapEmbedUrl} onChange={e => setFormData({ ...formData, googleMapEmbedUrl: e.target.value })} placeholder="Embed URL" />
                    </div>

                    {/* Contact */}
                    <div className="card" style={{ padding: '1.5rem', background: 'white' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee' }}>Contact</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <input className="input" placeholder="Contact Person" value={formData.contactPerson} onChange={e => setFormData({ ...formData, contactPerson: e.target.value })} />
                            <input className="input" placeholder="Phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
                            <input className="input" placeholder="Email" style={{ gridColumn: 'span 2' }} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="card" style={{ padding: '1.5rem', background: 'white' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee' }}>Social Media</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <input className="input" placeholder="Instagram URL" value={formData.instagram} onChange={e => setFormData({ ...formData, instagram: e.target.value })} />
                            <input className="input" placeholder="Facebook URL" value={formData.facebook} onChange={e => setFormData({ ...formData, facebook: e.target.value })} />
                            <input className="input" placeholder="WhatsApp URL" value={formData.whatsapp} onChange={e => setFormData({ ...formData, whatsapp: e.target.value })} />
                            <input className="input" placeholder="YouTube URL" value={formData.youtube} onChange={e => setFormData({ ...formData, youtube: e.target.value })} />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Cover Image */}
                    <div className="card" style={{ padding: '1.5rem', background: 'white' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 600 }}>Cover Image</h3>
                        {formData.image && <img src={formData.image} style={{ width: '100%', marginBottom: '1rem', borderRadius: '4px' }} />}
                        <input type="file" onChange={(e) => handleImageUpload(e, false)} />
                    </div>

                    {/* Gallery */}
                    <div className="card" style={{ padding: '1.5rem', background: 'white' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 600 }}>Gallery</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                            {formData.gallery.map((img, i) => (
                                <div key={i} style={{ position: 'relative' }}>
                                    <img src={img} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
                                    <button type="button" onClick={() => removeGalleryImage(i)} style={{ position: 'absolute', top: 0, right: 0, background: 'red', color: 'white', border: 'none' }}><X size={12} /></button>
                                </div>
                            ))}
                        </div>
                        <input type="file" multiple onChange={(e) => handleImageUpload(e, true)} />
                    </div>

                    {/* Specialties */}
                    <div className="card" style={{ padding: '1.5rem', background: 'white' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 600 }}>Specialties</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {specialtyOptions.map(tag => (
                                <button type="button" key={tag} onClick={() => toggleSpecialty(tag)} style={{
                                    padding: '0.25rem 0.5rem', borderRadius: '4px',
                                    background: formData.specialties.includes(tag) ? '#dcfce7' : '#f1f5f9',
                                    color: formData.specialties.includes(tag) ? '#166534' : '#64748b',
                                    border: 'none', cursor: 'pointer'
                                }}>
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
