'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Image as ImageIcon, CheckCircle, X } from 'lucide-react';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form States
    const [newName, setNewName] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Edit Mode
    const [editMode, setEditMode] = useState(false);
    const [oldName, setOldName] = useState('');

    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => {
                setCategories(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEdit = (cat) => {
        setEditMode(true);
        setOldName(cat.name);
        setNewName(cat.name);
        setNewDesc(cat.description || '');
        setImagePreview(cat.image);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setEditMode(false);
        setOldName('');
        setNewName('');
        setNewDesc('');
        setImagePreview(null);
    };

    const handleDelete = async (name) => {
        if (confirm(`Delete category "${name}"?`)) {
            try {
                const res = await fetch(`/api/categories?name=${encodeURIComponent(name)}`, { method: 'DELETE' });
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data);
                }
            } catch (e) {
                alert('Delete failed');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newName) return;

        setSubmitting(true);
        try {
            const method = editMode ? 'PUT' : 'POST';
            const body = {
                name: newName,
                description: newDesc,
                image: imagePreview || 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=150&q=80'
            };

            if (editMode) body.oldName = oldName;

            const res = await fetch('/api/categories', {
                method: resMethod,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            // Wait, fetch method needs to be passed correctly. 
            // I used 'resMethod' variable which is not defined. I should use 'method'.

        } catch (error) {
            // ...
        }
    };

    // Re-writing handleSubmit cleanly for the file write
    const handleSubmitClean = async (e) => {
        e.preventDefault();
        if (!newName) return;

        setSubmitting(true);
        try {
            const method = editMode ? 'PUT' : 'POST';
            const body = {
                name: newName,
                description: newDesc,
                image: imagePreview
            };

            if (editMode) body.oldName = oldName;

            const res = await fetch('/api/categories', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                const updatedList = await res.json();
                setCategories(updatedList);
                handleCancel(); // Reset form
                alert(editMode ? 'Updated Successfully' : 'Added Successfully');
            } else {
                alert('Operation failed');
            }
        } catch (error) {
            console.error(error);
            alert('Error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)' }}>Manage Specialties</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Add or remove plant categories/specialties.</p>
                </div>
            </div>

            {/* Add/Edit Form */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', background: '#f8fafc', border: '1px solid #e2e8f0', position: 'sticky', top: '1rem', zIndex: 10 }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 600 }}>{editMode ? 'Edit Specialty' : 'Add New Specialty'}</h3>
                <form onSubmit={handleSubmitClean} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr auto', gap: '1rem', alignItems: 'end' }}>

                    {/* Image Upload */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 500 }}>Icon/Image</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '50px', height: '50px', background: '#eee', borderRadius: '50%', overflow: 'hidden',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #ddd'
                            }}>
                                {imagePreview ? (
                                    <img src={imagePreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <ImageIcon size={20} color="#999" />
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ fontSize: '0.8rem', width: '100%' }}
                            />
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 500 }}>Name</label>
                        <input
                            className="input"
                            placeholder="e.g. Indoor, Succulents..."
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Desc */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 500 }}>Short Description</label>
                        <input
                            className="input"
                            placeholder="Optional benefit..."
                            value={newDesc}
                            onChange={e => setNewDesc(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {editMode && (
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="btn btn-outline"
                                style={{ height: '42px' }}
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                            style={{ height: '42px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            {submitting ? 'Saving...' : (editMode ? 'Update' : <><Plus size={18} /> Add</>)}
                        </button>
                    </div>
                </form>
            </div>

            {/* List */}
            {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Loading categories...</div>
            ) : (
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {categories.map((cat, i) => (
                        <div key={i} className="card" style={{ padding: '1rem', textAlign: 'center', position: 'relative' }}>
                            <div style={{
                                width: '80px', height: '80px', margin: '0 auto 1rem',
                                borderRadius: '50%', overflow: 'hidden', border: '4px solid #f0fdf4'
                            }}>
                                <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{cat.name}</h4>
                            {cat.description && <p style={{ fontSize: '0.85rem', color: '#666' }}>{cat.description}</p>}

                            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                <button onClick={() => handleEdit(cat)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                                    <Edit size={16} />
                                </button>
                                <button onClick={() => handleDelete(cat.name)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
