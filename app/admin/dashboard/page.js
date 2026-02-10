'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '../../components/ProductCard';

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('nurseries');
    const [nurseries, setNurseries] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Forms
    const [nurseryForm, setNurseryForm] = useState({
        name: '', location: '', image: '', description: '', phone: '', address: '',
        website: '', googleMapEmbedUrl: '', gallery: '', farmersCount: ''
    });

    const [productForm, setProductForm] = useState({
        name: '', price: '', category: 'Indoor', image: '', description: '', nurseryId: ''
    });

    useEffect(() => {
        const checkAuth = () => {
            const isAdmin = localStorage.getItem('isAdmin');
            if (!isAdmin) {
                router.push('/admin/login');
            }
        };
        checkAuth();
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const nRes = await fetch('/api/nurseries');
        const pRes = await fetch('/api/products');
        const nData = await nRes.json();
        const pData = await pRes.json();
        setNurseries(nData);
        setProducts(pData);
        setLoading(false);
    };

    const handleNurserySubmit = async (e) => {
        e.preventDefault();

        // Parse gallery URLs from comma-separated string
        const galleryArray = nurseryForm.gallery ? nurseryForm.gallery.split(',').map(url => url.trim()) : [];

        const res = await fetch('/api/nurseries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...nurseryForm,
                contact: { phone: nurseryForm.phone, address: nurseryForm.address, email: 'admin@planttrade.in' },
                specialties: ['General'],
                rating: 5.0,
                gallery: galleryArray,
                farmersCount: parseInt(nurseryForm.farmersCount) || 0
            })
        });
        if (res.ok) {
            alert('Nursery Added!');
            fetchData();
            setNurseryForm({
                name: '', location: '', image: '', description: '', phone: '', address: '',
                website: '', googleMapEmbedUrl: '', gallery: '', farmersCount: ''
            });
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        if (!productForm.nurseryId) {
            alert('Please select a nursery');
            return;
        }

        const selectedNursery = nurseries.find(n => n.id === productForm.nurseryId);

        const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...productForm,
                vendor: selectedNursery ? selectedNursery.name : 'Unknown',
                nurseryPhone: selectedNursery ? selectedNursery.contact.phone : ''
            })
        });
        if (res.ok) {
            alert('Product Added!');
            fetchData();
            setProductForm({ name: '', price: '', category: 'Indoor', image: '', description: '', nurseryId: '' });
        }
    };

    const handleDeleteNursery = async (id) => {
        if (!confirm('Delete this nursery and all its products?')) return;
        await fetch(`/api/nurseries?id=${id}`, { method: 'DELETE' });
        fetchData();
    };

    const handleDeleteProduct = async (id) => {
        if (!confirm('Delete this product?')) return;
        await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
        fetchData();
    };

    if (loading) return <div className="container section">Loading Admin Panel...</div>;

    return (
        <div className="container section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Admin Dashboard</h1>
                <button onClick={() => { localStorage.removeItem('isAdmin'); router.push('/admin/login'); }} className="btn btn-outline">
                    Logout
                </button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #ccc' }}>
                <button
                    className={`btn ${activeTab === 'nurseries' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setActiveTab('nurseries')}
                >
                    Manage Nurseries ({nurseries.length})
                </button>
                <button
                    className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setActiveTab('products')}
                >
                    Manage Products ({products.length})
                </button>
            </div>

            {activeTab === 'nurseries' && (
                <div className="grid grid-cols-2" style={{ gap: '4rem' }}>
                    {/* Add Nursery Form */}
                    <div className="card" style={{ padding: '2rem' }}>
                        <h3>Add New Nursery</h3>
                        <form onSubmit={handleNurserySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                                <input className="input" placeholder="Nursery Name" value={nurseryForm.name} onChange={e => setNurseryForm({ ...nurseryForm, name: e.target.value })} required />
                                <input className="input" placeholder="Farmers Count (e.g. 50)" value={nurseryForm.farmersCount} onChange={e => setNurseryForm({ ...nurseryForm, farmersCount: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                                <input className="input" placeholder="Location (City, State)" value={nurseryForm.location} onChange={e => setNurseryForm({ ...nurseryForm, location: e.target.value })} required />
                                <input className="input" placeholder="Phone Number" value={nurseryForm.phone} onChange={e => setNurseryForm({ ...nurseryForm, phone: e.target.value })} required />
                            </div>

                            <input className="input" placeholder="Main Image URL" value={nurseryForm.image} onChange={e => setNurseryForm({ ...nurseryForm, image: e.target.value })} required />
                            <textarea className="input" placeholder="Description" value={nurseryForm.description} onChange={e => setNurseryForm({ ...nurseryForm, description: e.target.value })} rows="3"></textarea>
                            <input className="input" placeholder="Full Address" value={nurseryForm.address} onChange={e => setNurseryForm({ ...nurseryForm, address: e.target.value })} />

                            <hr style={{ margin: '0.5rem 0', borderColor: '#eee' }} />

                            <input className="input" placeholder="Website URL (Optional)" value={nurseryForm.website} onChange={e => setNurseryForm({ ...nurseryForm, website: e.target.value })} />
                            <input className="input" placeholder="Google Maps Embed URL (Src only)" value={nurseryForm.googleMapEmbedUrl} onChange={e => setNurseryForm({ ...nurseryForm, googleMapEmbedUrl: e.target.value })} />
                            <textarea className="input" placeholder="Gallery Image URLs (Comma separated)" value={nurseryForm.gallery} onChange={e => setNurseryForm({ ...nurseryForm, gallery: e.target.value })} rows="2"></textarea>

                            <button type="submit" className="btn btn-primary">Add Nursery</button>
                        </form>
                    </div>

                    {/* Existing Nurseries List */}
                    <div style={{ maxHeight: '800px', overflowY: 'auto' }}>
                        <h3>Existing Nurseries</h3>
                        {nurseries.map(n => (
                            <div key={n.id} className="card" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <img src={n.image} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                                <div style={{ flex: 1 }}>
                                    <h4>{n.name}</h4>
                                    <p style={{ fontSize: '0.8rem' }}>{n.location}</p>
                                    {n.farmersCount > 0 && <span style={{ fontSize: '0.75rem', background: '#eee', padding: '2px 6px', borderRadius: 4 }}>{n.farmersCount} Farmers</span>}
                                </div>
                                <button onClick={() => handleDeleteNursery(n.id)} className="btn btn-outline" style={{ borderColor: 'red', color: 'red' }}>Delete</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'products' && (
                <div className="grid grid-cols-2" style={{ gap: '4rem' }}>
                    {/* Add Product Form */}
                    <div className="card" style={{ padding: '2rem' }}>
                        <h3>Add New Product</h3>
                        <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <select className="input" value={productForm.nurseryId} onChange={e => setProductForm({ ...productForm, nurseryId: e.target.value })} required>
                                <option value="">Select Nursery Owner</option>
                                {nurseries.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                            </select>
                            <input className="input" placeholder="Product Name" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} required />
                            <input className="input" type="number" placeholder="Price (INR)" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} required />
                            <select className="input" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })}>
                                <option>Indoor</option>
                                <option>Outdoor</option>
                                <option>Sacred</option>
                                <option>Flowering</option>
                                <option>Spice</option>
                            </select>
                            <input className="input" placeholder="Image URL" value={productForm.image} onChange={e => setProductForm({ ...productForm, image: e.target.value })} required />
                            <textarea className="input" placeholder="Description" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} rows="3"></textarea>
                            <button type="submit" className="btn btn-primary">Add Product</button>
                        </form>
                    </div>

                    {/* Existing Products List */}
                    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        <h3>Existing Products</h3>
                        {products.length === 0 && <p>No products found.</p>}
                        {products.map(p => (
                            <div key={p.id} style={{ marginBottom: '1rem' }}>
                                <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: 50, height: 50 }}>
                                        <img src={p.image} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <strong>{p.name}</strong>
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>
                                            ₹{p.price} | {p.vendor}
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeleteProduct(p.id)} style={{ background: 'red', color: 'white', border: 'none', padding: '0.5rem', borderRadius: 4, cursor: 'pointer' }}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
