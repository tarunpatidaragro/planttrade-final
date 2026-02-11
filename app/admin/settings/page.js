'use client';
import { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, Upload } from 'lucide-react';

export default function SiteSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [heroData, setHeroData] = useState({
        title: '',
        subtitle: '',
        image: ''
    });

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                setHeroData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setHeroData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(heroData)
            });
            if (res.ok) {
                alert('Settings Updated Successfully!');
            } else {
                alert('Failed to update settings');
            }
        } catch (error) {
            console.error(error);
            alert('Error saving settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem' }}>Site Settings</h1>

            <div className="card" style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>Homepage Hero Banner</h2>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>

                    {/* Image Preview */}
                    <div>
                        <label className="label" style={{ marginBottom: '0.5rem', display: 'block' }}>Banner Image</label>
                        <div style={{
                            height: '200px',
                            background: '#f1f5f9',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            marginBottom: '1rem',
                            border: '2px dashed #cbd5e1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative'
                        }}>
                            {heroData.image ? (
                                <img src={heroData.image} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ textAlign: 'center', color: '#64748b' }}>
                                    <ImageIcon size={32} style={{ margin: '0 auto 0.5rem' }} />
                                    <span>No Image Set</span>
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    opacity: 0,
                                    cursor: 'pointer'
                                }}
                            />
                        </div>
                        <button type="button" className="btn btn-outline" style={{ pointerEvents: 'none' }}>
                            <Upload size={16} style={{ marginRight: '8px' }} /> Click above to upload new image
                        </button>
                    </div>

                    <div>
                        <label className="label">Hero Title</label>
                        <input
                            className="input"
                            style={{ width: '100%' }}
                            value={heroData.title}
                            onChange={e => setHeroData({ ...heroData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="label">Subtitle</label>
                        <textarea
                            className="input"
                            rows={3}
                            style={{ width: '100%' }}
                            value={heroData.subtitle}
                            onChange={e => setHeroData({ ...heroData, subtitle: e.target.value })}
                        />
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={saving}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
