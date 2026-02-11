'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProductFormPage() {
    const router = useRouter();
    const [nurseries, setNurseries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Categories hardcoded or fetched? Let's use static for now as api/categories might not exist
    const categories = ['Indoor', 'Outdoor', 'Flowering', 'Fruit', 'Medicinal', 'Succulents', 'Seeds', 'Pots', 'Fertilizers'];

    const [formData, setFormData] = useState({
        name: '',
        nurseryId: '',
        price: '',
        category: '',
        description: '',
        benefits: '', // "key nenifits"
        image: '',
        rating: 4.5
    });

    useEffect(() => {
        // Fetch nurseries for dropdown
        fetch('/api/nurseries').then(res => res.json()).then(data => setNurseries(data));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('Product Added Successfully!');
                router.push('/admin/products');
            } else {
                const err = await res.json();
                alert(`Error: ${err.error || 'Failed to add product'}`);
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Link href="/admin/products" className="btn btn-outline" style={{ border: 'none' }}>
                    <ArrowLeft size={20} />
                </Link>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Add New Plant</h1>
            </div>

            <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Section 1: Basic Info */}
                <div>
                    <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Plant Details</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label className="label">Plant Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="input" placeholder="e.g. Fiddle Leaf Fig" required />
                        </div>
                        <div>
                            <label className="label">Price (₹)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} className="input" placeholder="e.g. 499" required />
                        </div>
                    </div>
                    <div style={{ marginTop: '1.5rem' }}>
                        <label className="label">Category</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="input" required>
                            <option value="">Select Category</option>
                            {categories.map((cat, i) => (
                                <option key={i} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Section 2: Nursery Assignment */}
                <div>
                    <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Assign to Nursery</h3>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Select Nursery</label>
                        <select name="nurseryId" value={formData.nurseryId} onChange={handleChange} className="input" required>
                            <option value="">-- Choose Nursery --</option>
                            {nurseries.map(n => (
                                <option key={n._id || n.id} value={n._id || n.id}>{n.name} ({n.location})</option>
                            ))}
                        </select>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
                            This product will be listed under the selected nursery's profile.
                        </p>
                    </div>
                </div>

                {/* Section 3: Description & Benefits */}
                <div>
                    <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Content</h3>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className="input" style={{ minHeight: '120px' }} placeholder="Detailed description of the plant..." required />
                    </div>
                    <div>
                        <label className="label">Key Benefits (comma separated)</label>
                        <textarea name="benefits" value={formData.benefits} onChange={handleChange} className="input" style={{ minHeight: '80px' }} placeholder="e.g. Air purifying, Low light tolerant..." />
                    </div>
                </div>

                {/* Section 4: Images */}
                <div>
                    <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Images</h3>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Image URL</label>
                        <input type="url" name="image" value={formData.image} onChange={handleChange} className="input" placeholder="https://..." required />
                        <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>Paste a direct link to an image (e.g., from Unsplash or Imgur).</p>
                        {formData.image && <img src={formData.image} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '0.5rem', borderRadius: '0.5rem', border: '1px solid #eee' }} />}
                    </div>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button type="button" onClick={() => router.back()} className="btn btn-outline" disabled={isLoading}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Product'}
                    </button>
                </div>

            </form>
        </div>
    );
}
