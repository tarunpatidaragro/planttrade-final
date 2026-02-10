import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import { Package, Users, AlertCircle, DollarSign, Activity, Star } from 'lucide-react';

async function getData() {
    const filePath = path.join(process.cwd(), 'lib/data.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    return JSON.parse(jsonData);
}

export const metadata = {
    title: 'PlantTrade Master Admin',
};

export default async function AdminDashboard() {
    const data = await getData();
    const nurseries = data.nurseries || [];
    const products = data.products || [];

    // Calculate stats
    const totalNurseries = nurseries.length;
    const totalProducts = products.length;
    const rescuePlants = products.filter(p => p.isRescue).length;
    const totalRevenue = "₹12.5L"; // Mocked for premium feel

    return (
        <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
            {/* Header Area */}
            <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Master Admin Portal</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Welcome back, Admin. Here is your daily platform overview.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn" style={{ background: '#f1f1f1', color: 'var(--text-main)' }}>Settings</button>
                    <button className="btn btn-primary">Export Report</button>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <StatCard title="Total Nurseries" value={totalNurseries} icon={<Users size={24} color="#2980b9" />} color="rgba(41, 128, 185, 0.1)" />
                <StatCard title="Active Listings" value={totalProducts} icon={<Package size={24} color="#27ae60" />} color="rgba(39, 174, 96, 0.1)" />
                <StatCard title="Rescue Plants" value={rescuePlants} icon={<AlertCircle size={24} color="#e74c3c" />} color="rgba(231, 76, 60, 0.1)" />
                <StatCard title="Monthly Revenue" value={totalRevenue} icon={<DollarSign size={24} color="#f39c12" />} color="rgba(243, 156, 18, 0.1)" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                {/* Recent Nurseries Table */}
                <div className="card" style={{ padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', background: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Partner Nurseries</h2>
                        <Link href="/nurseries" style={{ color: 'var(--primary)', fontWeight: 600 }}>View All</Link>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                                    <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nursery</th>
                                    <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location</th>
                                    <th style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Rating</th>
                                    <th style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Items</th>
                                    <th style={{ textAlign: 'right', padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {nurseries.map(nursery => (
                                    <tr key={nursery.id} style={{ borderBottom: '1px solid #f9f9f9', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eee', overflow: 'hidden' }}>
                                                    <img src={nursery.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                                {nursery.name}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{nursery.location}</td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: '#fef9c3', color: '#854d0e', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontWeight: 700, fontSize: '0.875rem' }}>
                                                <Star size={14} fill="#854d0e" /> {nursery.rating}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: 'var(--text-main)' }}>
                                            {products.filter(p => p.nurseryId === nursery.id).length}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <Link href={`/nursery/${nursery.id}`} style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none', padding: '0.5rem 1rem', background: 'var(--background)', borderRadius: '0.5rem' }}>
                                                Manage
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sidebar / Quick Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card" style={{ padding: '1.5rem', borderRadius: '1rem', background: '#ecfdf5', border: '1px solid #d1fae5' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#065f46' }}>Viral Feature: Rescue 🚑</h3>
                        <p style={{ color: '#047857', marginBottom: '1rem', fontSize: '0.9rem' }}>
                            You have <strong>{rescuePlants} plants</strong> currently marked for rescue. Promoting these can increase engagement by 40%.
                        </p>
                        <button className="btn" style={{ width: '100%', background: '#059669', color: 'white' }}>Promote Rescue Plants</button>
                    </div>

                    <div className="card" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>System Health</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Server Status</span>
                                <span style={{ color: '#27ae60', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27ae60' }}></div> Operational</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Database</span>
                                <span style={{ color: '#27ae60', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27ae60' }}></div> Connected</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Last Sync</span>
                                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Just now</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }) {
    return (
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', transition: 'transform 0.2s' }}>
            <div style={{ background: color, padding: '1rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
            </div>
            <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{title}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{value}</div>
            </div>
        </div>
    )
}
