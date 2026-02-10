'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const email = e.target.email.value;
        const password = e.target.password.value;

        // Simulate network delay for better UX
        await new Promise(resolve => setTimeout(resolve, 800));

        if (email === 'tarunpatidar.agro@gmail.com' && password === 'Tarun@1998') {
            // 1. Set Session Cookie (Server check)
            document.cookie = "plant_secret_v5=true; path=/; SameSite=Lax";

            // 2. Set Tab Session (Client check)
            sessionStorage.setItem('plant_auth_active', 'true');
            sessionStorage.setItem('auth_timestamp', Date.now().toString());

            router.push('/admin/dashboard');
        } else {
            setError('Invalid administration credentials');
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Decor */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                left: '-10%',
                width: '40%',
                height: '40%',
                background: 'rgba(34, 197, 94, 0.15)',
                filter: 'blur(100px)',
                borderRadius: '50%'
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: '-10%',
                right: '-10%',
                width: '40%',
                height: '40%',
                background: 'rgba(59, 130, 246, 0.15)',
                filter: 'blur(100px)',
                borderRadius: '50%'
            }}></div>

            <div className="login-card" style={{
                width: '100%',
                maxWidth: '420px',
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(16px)',
                padding: '2.5rem',
                borderRadius: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                margin: '1.5rem',
                position: 'relative',
                zIndex: 10
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem auto',
                        boxShadow: '0 10px 15px -3px rgba(34, 197, 94, 0.3)'
                    }}>
                        <ShieldCheck size={32} color="white" />
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>PlantTrade Admin</h1>
                    <p style={{ color: '#94a3b8' }}>Secure access for platform management</p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#fca5a5',
                        padding: '0.75rem',
                        borderRadius: '0.75rem',
                        marginBottom: '1.5rem',
                        fontSize: '0.875rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} color="#64748b" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                name="email"
                                type="email"
                                defaultValue="tarunpatidar.agro@gmail.com"
                                placeholder="admin@example.com"
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem 0.875rem 3rem',
                                    background: 'rgba(15, 23, 42, 0.6)',
                                    border: '1px solid #334155',
                                    borderRadius: '0.75rem',
                                    color: 'white',
                                    outline: 'none',
                                    fontSize: '0.95rem',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                                onBlur={(e) => e.target.style.borderColor = '#334155'}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <label style={{ color: '#cbd5e1', fontSize: '0.875rem', fontWeight: 500 }}>Password</label>
                            {/* <a href="#" style={{ color: '#22c55e', fontSize: '0.875rem', textDecoration: 'none' }}>Forgot password?</a> */}
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem 0.875rem 3rem',
                                    background: 'rgba(15, 23, 42, 0.6)',
                                    border: '1px solid #334155',
                                    borderRadius: '0.75rem',
                                    color: 'white',
                                    outline: 'none',
                                    fontSize: '0.95rem',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                                onBlur={(e) => e.target.style.borderColor = '#334155'}
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            background: isLoading ? '#166534' : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '1rem',
                            borderRadius: '0.75rem',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            marginTop: '0.5rem',
                            transition: 'transform 0.1s, box-shadow 0.2s',
                            boxShadow: '0 4px 6px -1px rgba(34, 197, 94, 0.2)'
                        }}
                        onMouseEnter={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(-1px)')}
                        onMouseLeave={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                        {isLoading ? 'Authenticating...' : (
                            <>
                                Sign In <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                    {/* Demo Hint */}
                    <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.75rem', color: '#64748b' }}>
                        Protected Area. Authorized Personnel Only.
                    </div>
                </form>
            </div>
        </div>
    );
}

