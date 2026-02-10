'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, CheckCircle, Zap, Globe, Layout } from 'lucide-react';

export default function VendorRegister() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setStep(2);
            alert(`OTP sent to ${email}. Use 1234 to verify.`); // Demo only
        }, 1500);
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        if (otp === '1234') {
            // Success
            document.cookie = "plant_vendor_v1=true; path=/; SameSite=Lax";
            localStorage.setItem('vendorEmail', email); // simple session mock
            router.push('/vendor/onboarding'); // Redirect to listing form
        } else {
            alert('Invalid OTP. Please try again.');
        }
    };

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '4rem 0' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Grow Your Business with PlantTrade</h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Join India's largest network of plant nurseries.</p>
                </div>

                <div className="grid grid-cols-2" style={{ gap: '4rem', alignItems: 'flex-start' }}>
                    {/* Left Side: Plans & Benefits */}
                    <div>
                        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Choose Your Plan</h2>

                        {/* Standard Plan */}
                        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid #cbd5e1' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Standard Listing
                                </h3>
                                <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>₹1,199 <span style={{ fontSize: '0.85rem', fontWeight: 400, color: '#666' }}>+ GST</span></span>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Perfect for local nurseries starting out.</p>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                                    <CheckCircle size={18} color="green" /> Basic Profile Page
                                </li>
                                <li style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                                    <CheckCircle size={18} color="green" /> List up to 50 Products
                                </li>
                                <li style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                                    <CheckCircle size={18} color="green" /> Local Enquiries
                                </li>
                            </ul>
                        </div>

                        {/* Ultra Plan */}
                        <div className="card" style={{ padding: '1.5rem', border: '2px solid var(--primary)', background: '#f0fdf4', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '-10px', right: '20px', background: 'var(--primary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 700 }}>
                                POPULAR
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-dark)' }}>
                                    <Zap size={20} fill="gold" stroke="none" /> Ultra Listing
                                </h3>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-dark)' }}>₹2,500</span>
                                    {/* No +GST mentioned for Ultra as per request "add 2500", usually implied, but I'll leave it clean or add if needed. User just said 2500. */}
                                </div>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>For serious growers expanding nationwide.</p>

                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 500 }}>
                                    <Globe size={20} color="var(--primary)" /> <strong>India-Wide Enquiries</strong>
                                </li>
                                <li style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 500 }}>
                                    <Layout size={20} color="var(--primary)" /> <strong>Full Dedicated Website Page</strong>
                                </li>
                                <li style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                                    <CheckCircle size={18} color="var(--primary)" /> Unlimited Product Listings
                                </li>
                                <li style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                                    <CheckCircle size={18} color="var(--primary)" /> Priority Support
                                </li>
                                <li style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                                    <CheckCircle size={18} color="var(--primary)" /> Verfied Badge
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Side: Registration Form */}
                    <div>
                        <div className="card" style={{ padding: '2.5rem', position: 'sticky', top: '2rem' }}>
                            <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                                {step === 1 ? 'Start Your Application' : 'Verify Email'}
                            </h2>
                            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                                {step === 1
                                    ? 'Enter your email to verify and proceed directly to listing details.'
                                    : `We sent a code to ${email}`}
                            </p>

                            {step === 1 && (
                                <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div>
                                        <label className="label">Work Email / Gmail</label>
                                        <div style={{ position: 'relative' }}>
                                            <Mail size={20} style={{ position: 'absolute', top: '12px', left: '12px', color: '#999' }} />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="nursery@gmail.com"
                                                className="input"
                                                style={{ paddingLeft: '2.5rem' }}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button disabled={isLoading} type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                                        {isLoading ? 'Sending OTP...' : 'Continue with Email'}
                                    </button>

                                    <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#666' }}>
                                        By continuing, you verify that you are an authorized representative of a nursery.
                                    </div>
                                </form>
                            )}

                            {step === 2 && (
                                <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div>
                                        <label className="label">Enter OTP</label>
                                        <div style={{ position: 'relative' }}>
                                            <Lock size={20} style={{ position: 'absolute', top: '12px', left: '12px', color: '#999' }} />
                                            <input
                                                type="text"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                placeholder="Enter 4-digit code"
                                                className="input"
                                                style={{ paddingLeft: '2.5rem', letterSpacing: '4px', fontSize: '1.2rem' }}
                                                maxLength={4}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                                        Verify & Continue
                                    </button>

                                    <button type="button" onClick={() => setStep(1)} className="btn btn-outline" style={{ width: '100%', border: 'none' }}>
                                        Change Email
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
