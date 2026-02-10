'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/nurseries?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <form onSubmit={handleSearch} style={{
            background: 'white',
            maxWidth: '600px',
            margin: '0 auto',
            padding: '1rem',
            borderRadius: '50px',
            display: 'flex',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)'
        }}>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for plants or nurseries..."
                style={{
                    border: 'none',
                    flex: 1,
                    padding: '0 1.5rem',
                    fontSize: '1.1rem',
                    outline: 'none',
                    color: 'var(--text-main)'
                }}
            />
            <button type="submit" className="btn btn-primary" style={{ borderRadius: '50px', padding: '0.75rem 2rem' }}>
                Search
            </button>
        </form>
    );
}
