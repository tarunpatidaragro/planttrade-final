'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Store, Mail, Lock, CheckCircle, ArrowRight } from 'lucide-react';

export default function VendorLogin() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSendOtp = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            if (email) {
                setStep(2);
                alert(`OTP sent to ${email}. Use 1234 to login.`); // Demo only
            } else {
                setError("Please enter a valid email");
            }
        }, 1000);
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        setError('');
        if (otp === '1234') {
            // Success - Set Vendor Cookie
            document.cookie = "plant_vendor_v1=true; path=/; SameSite=Lax";
            localStorage.setItem('vendorEmail', email);

            router.push('/vendor/dashboard');
        } else {
            setError('Invalid OTP. Please try again.');
        }
    };

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
            <div className="card" style={{ background: 'white', padding: '2.5rem', borderRadius: '1rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '420px' }}>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '56px', height: '56px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                        <Store size={28} color="#16a34a" />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>Vendor Portal</h1>
                    <p style={{ color: '#64748b' }}>Manage your nursery and orders</p>
                </div>

                {step === 1 && (
                    <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label className="label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#475569' }}>Registered Email</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={20} style={{ position: 'absolute', top: '12px', left: '12px', color: '#94a3b8' }} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="nursery@example.com"
                                    className="input"
                                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none' }}
                                    required
                                />
                            </div>
                        </div>

                        <button disabled={isLoading} type="submit" style={{ background: '#16a34a', color: 'white', padding: '0.875rem', borderRadius: '0.5rem', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            {isLoading ? 'Sending...' : <>Get Login Code <ArrowRight size={18} /></>}
                        </button>

                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                            <Link href="/vendor/register" style={{ color: '#16a34a', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
                                New Nursery? Register Here
                            </Link>
                        </div>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label className="label" style={{ fontWeight: 500, color: '#475569' }}>Enter OTP</label>
                                <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#16a34a', fontSize: '0.85rem', cursor: 'pointer' }}>Change Email</button>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Lock size={20} style={{ position: 'absolute', top: '12px', left: '12px', color: '#94a3b8' }} />
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter 4-digit code"
                                    className="input"
                                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', letterSpacing: '4px', fontSize: '1.1rem' }}
                                    maxLength={4}
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        {error && <div style={{ color: '#ef4444', fontSize: '0.875rem', textAlign: 'center' }}>{error}</div>}

                        <button type="submit" style={{ background: '#16a34a', color: 'white', padding: '0.875rem', borderRadius: '0.5rem', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
                            Verify & Login
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
