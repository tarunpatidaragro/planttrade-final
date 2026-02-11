'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NurseriesList() {
    const router = useRouter();
    const [nurseries, setNurseries] = useState([]);

    useEffect(() => {
        // Fetch nurseries from API
        fetch('/api/nurseries').then(res => res.json()).then(data => setNurseries(data));
    }, []);

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this nursery?')) {
            // Call API to delete
            alert('Deleted (Simulation)');
            setNurseries(nurseries.filter(n => n.id !== id));
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Manage Nurseries</h1>
                <Link href="/admin/nurseries/add" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> Add New Nursery
                </Link>
            </div>

            <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Name</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Location</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Owner Contact</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Specialties</th>
                            <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {nurseries.map((nursery) => (
                            <tr key={nursery.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <img
                                        src={nursery.image}
                                        alt={nursery.name}
                                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', background: '#eee' }}
                                    />
                                    <span style={{ fontWeight: 500 }}>{nursery.name}</span>
                                </td>
                                <td style={{ padding: '1rem', color: '#64748b' }}>{nursery.location}</td>
                                <td style={{ padding: '1rem' }}>
                                    <div>{nursery.contact?.person}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{nursery.contact?.phone}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                        {(nursery.specialties || []).slice(0, 3).map((tag, i) => (
                                            <span key={i} style={{ background: '#ecfdf5', color: '#047857', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                                                {tag}
                                            </span>
                                        ))}
                                        {(nursery.specialties || []).length > 3 && <span style={{ fontSize: '0.75rem', color: '#64748b' }}>+{(nursery.specialties || []).length - 3}</span>}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => router.push(`/admin/nurseries/edit/${nursery.id}`)}
                                            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer' }}
                                        >
                                            <Edit size={16} color="#475569" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(nursery.id)}
                                            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #fee2e2', background: '#fef2f2', cursor: 'pointer' }}
                                        >
                                            <Trash2 size={16} color="#ef4444" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
