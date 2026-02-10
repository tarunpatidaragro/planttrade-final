'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function AdminLogin() {
    const router = useRouter();
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        if (email === 'admin@planttrade.in' && password === 'admin123') {
            // Simple client-side auth for demo purposes
            localStorage.setItem('isAdmin', 'true');
            document.cookie = "isAdmin=true; path=/";
            router.push('/admin/dashboard');
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="container section" style={{ maxWidth: '400px', margin: '4rem auto' }}>
            <div className="card" style={{ padding: '2rem' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Admin Login</h1>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label className="label">Username</label>
                        <input name="email" type="email" defaultValue="admin@planttrade.in" className="input" required />
                    </div>
                    <div>
                        <label className="label">Password</label>
                        <input name="password" type="password" className="input" required />
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <Link href="/" style={{ color: 'var(--text-secondary)' }}>Back to Home</Link>
                </div>
            </div>
        </div>
    );
}
