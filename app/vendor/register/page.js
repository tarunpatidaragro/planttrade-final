'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';

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
            localStorage.setItem('vendorEmail', email); // simple session mock
            router.push('/vendor/onboarding'); // Redirect to listing form
        } else {
            alert('Invalid OTP. Please try again.');
        }
    };

    return (
        <div className="container section" style={{ maxWidth: '480px', margin: '4rem auto' }}>
            <div className="card" style={{ padding: '2.5rem' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                    {step === 1 ? 'Partner with PlantTrade' : 'Verify Email'}
                </h1>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    {step === 1
                        ? 'Join 10,000+ nurseries growing their business online.'
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
    );
}
