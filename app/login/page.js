'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
    const router = useRouter();

    const handleLogin = (e) => {
        e.preventDefault();
        router.push('/');
    };

    return (
        <div className="container section" style={{ maxWidth: '400px', margin: '4rem auto' }}>
            <div className="card" style={{ padding: '2rem' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Welcome Back</h1>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input type="email" placeholder="Email" className="input" required />
                    <input type="password" placeholder="Password" className="input" required />
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <Link href="/vendor/register" style={{ color: 'var(--primary)' }}>Are you a vendor?</Link>
                </div>
            </div>
        </div>
    );
}
