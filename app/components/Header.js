"use client";
import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, LogIn, Store, Phone, Info, Leaf, Menu, X } from 'lucide-react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="header">
            <div className="container nav">
                <Link href="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'var(--primary)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                    }}>
                        <Leaf size={24} />
                    </div>
                    <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-dark)', letterSpacing: '-0.5px' }}>PlantTrade</span>
                </Link>

                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    <Link href="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link href="/plants" className="nav-link" onClick={() => setIsMenuOpen(false)}>Plants</Link>
                    <Link href="/nurseries" className="nav-link" onClick={() => setIsMenuOpen(false)}>Find Nurseries</Link>
                    <Link href="/blog" className="nav-link" onClick={() => setIsMenuOpen(false)}>Blog</Link>
                    <Link href="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>Contact</Link>

                    <Link href="/vendor/register" className="nav-link btn btn-outline" onClick={() => setIsMenuOpen(false)} style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Store size={18} /> List Your Nursery
                    </Link>
                    <Link href="/login" className="nav-link btn btn-primary" onClick={() => setIsMenuOpen(false)} style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <LogIn size={18} /> Login
                    </Link>
                </div>
            </div>
        </header>
    );
}
