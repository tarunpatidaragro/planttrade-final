'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';


export default function EditProductPage({ params }) {
    const { id } = use(params);
    const router = useRouter();
    const [nurseries, setNurseries] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        nurseryId: '',
        price: '',
        category: '',
        description: '',
        benefits: '',
        image: '',
        gallery: [],
        rating: 4.5
    });

    useEffect(() => {
        // Fetch nurseries and categories
        Promise.all([
            fetch('/api/nurseries').then(res => res.json()),
            fetch('/api/categories').then(res => res.json()),
            fetch(`/api/products/${id}`).then(res => res.json())
        ]).then(([nurseriesData, categoriesData, productData]) => {
            setNurseries(nurseriesData);
            setCategories(categoriesData);

            // Populate Form
            if (productData && !productData.error) {
                setFormData({
                    name: productData.name || '',
                    nurseryId: productData.nurseryId || '',
                    price: productData.price || '',
                    category: productData.category || '',
                    description: productData.description || '',
                    benefits: productData.benefits || '',
                    image: productData.image || '',
                    gallery: productData.gallery || [],
                    rating: productData.rating || 4.5
                });
            } else {
                alert('Product not found');
                router.push('/admin/products');
            }
            setLoading(false);
        }).catch(err => {
            console.error(err);
            alert('Failed to load data');
        });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('Product Updated!');
                router.push('/admin/products');
            } else {
                alert('Failed to update product');
            }
        } catch (e) {
            console.error(e);
            alert('Error updating product');
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Link href="/admin/products" className="btn btn-outline" style={{ border: 'none' }}>
                    <ArrowLeft size={20} />
                </Link>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Edit Plant</h1>
            </div>

            <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Section 1: Basic Info */}
                <div>
                    <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Plant Details</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label className="label">Plant Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="input" required />
                        </div>
                        <div>
                            <label className="label">Price (₹)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} className="input" required />
                        </div>
                    </div>
                    <div style={{ marginTop: '1.5rem' }}>
                        <label className="label">Category</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="input" required>
                            <option value="">Select Category</option>
                            {categories.map((cat, i) => (
                                <option key={i} value={cat.name}>{cat.name}</option>
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
                                <option key={n.id} value={n.id}>{n.name} ({n.location})</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Section 3: Description & Benefits */}
                <div>
                    <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Content</h3>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className="input" style={{ minHeight: '120px' }} required />
                    </div>
                    <div>
                        <label className="label">Key Benefits</label>
                        <textarea name="benefits" value={formData.benefits} onChange={handleChange} className="input" style={{ minHeight: '80px' }} placeholder="e.g. Air purifying..." />
                    </div>
                </div>

                {/* Section 4: Images */}
                <div>
                    <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Images</h3>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Main Image</label>
                        {formData.image && <img src={formData.image} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', display: 'block', marginBottom: '0.5rem', borderRadius: '4px' }} />}
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="input" />
                    </div>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button type="button" onClick={() => router.back()} className="btn btn-outline">Cancel</button>
                    <button type="submit" className="btn btn-primary">Update Product</button>
                </div>

            </form>
        </div>
    );
}
