'use client';
import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Store,
    Image as ImageIcon,
    ShoppingBag,
    MessageSquare,
    BarChart,
    Settings,
    LogOut,
    Menu,
    X,
    FileText,
    List,
    Plus
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    useEffect(() => {
        let idleTimer;

        // Logout function
        const performLogout = () => {
            sessionStorage.removeItem('plant_auth_active');
            sessionStorage.removeItem('auth_timestamp');
            document.cookie = "plant_secret_v5=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            router.push('/admin/login');
        };

        const resetTimer = () => {
            clearTimeout(idleTimer);
            // Auto-lock after 60 seconds of inactivity
            idleTimer = setTimeout(performLogout, 60000);
        };

        // Listen for activity
        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keydown', resetTimer);
        window.addEventListener('scroll', resetTimer);
        window.addEventListener('click', resetTimer);

        // Initial set
        resetTimer();

        // Check authentication status (Strict Cookie Check)
        const checkAuth = () => {
            // Cleanup old persistent storage if it exists
            if (localStorage.getItem('isAdmin')) {
                localStorage.removeItem('isAdmin');
            }

            // Clean old cookies
            document.cookie = "plant_auth_secure=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            // 1. Check Tab Session (Strict 'Lock on Close' behavior)
            const isTabActive = sessionStorage.getItem('plant_auth_active');

            if (!isTabActive) {
                // Tab was closed, so we kill the session even if cookie exists
                document.cookie = "plant_secret_v5=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                setIsAuthenticated(false);
                if (pathname !== '/admin/login') {
                    router.push('/admin/login');
                }
                setIsLoading(false);
                return;
            }

            // 2. Check Valid Cookie (Server/Middleware sync)
            const cookieAdmin = document.cookie.split('; ').find(row => row.trim().startsWith('plant_secret_v5='));
            const hasCookie = cookieAdmin && cookieAdmin.split('=')[1] === 'true';

            if (hasCookie && isTabActive) {
                setIsAuthenticated(true);
                if (pathname === '/admin/login') {
                    router.push('/admin/dashboard');
                }
            } else {
                setIsAuthenticated(false);
                if (pathname !== '/admin/login') {
                    router.push('/admin/login');
                }
            }
            setIsLoading(false);
        };

        checkAuth();

        return () => {
            // Cleanup listeners
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keydown', resetTimer);
            window.removeEventListener('scroll', resetTimer);
            window.removeEventListener('click', resetTimer);
            clearTimeout(idleTimer);
        };
    }, [pathname, router]);

    // Show loading state while checking auth to prevent flash of content
    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#059669', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <style jsx>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    // If on login page, render only children (no sidebar/layout)
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    // If not authenticated (and not on login page - though the useEffect should handle redirect), don't render content
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            {/* Sidebar */}
            <aside style={{
                width: sidebarOpen ? '260px' : '80px',
                background: '#1e293b',
                color: 'white',
                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 50
            }}>
                <div style={{
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: sidebarOpen ? 'space-between' : 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                    {sidebarOpen && <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#4ade80' }}>PlantTrade</h1>}
                    <button onClick={toggleSidebar} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav style={{ flex: 1, padding: '1rem 0', overflowY: 'auto' }}>
                    <ul style={{ listStyle: 'none' }}>
                        <MenuItem icon={<LayoutDashboard size={20} />} label="Dashboard" href="/admin/dashboard" sidebarOpen={sidebarOpen} active={pathname === '/admin/dashboard'} />
                        <div style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, display: sidebarOpen ? 'block' : 'none' }}>Management</div>
                        <MenuItem icon={<Store size={20} />} label="Nurseries" href="/admin/nurseries" sidebarOpen={sidebarOpen} active={pathname.startsWith('/admin/nurseries')} />
                        <MenuItem icon={<ShoppingBag size={20} />} label="Products" href="/admin/products" sidebarOpen={sidebarOpen} active={pathname.startsWith('/admin/products')} />
                        <MenuItem icon={<List size={20} />} label="Categories" href="/admin/categories" sidebarOpen={sidebarOpen} active={pathname.startsWith('/admin/categories')} />
                        <MenuItem icon={<ImageIcon size={20} />} label="Banners" href="/admin/banners" sidebarOpen={sidebarOpen} active={pathname.startsWith('/admin/banners')} />
                        <MenuItem icon={<FileText size={20} />} label="Blogs" href="/admin/blogs" sidebarOpen={sidebarOpen} active={pathname.startsWith('/admin/blogs')} />
                        <div style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, display: sidebarOpen ? 'block' : 'none' }}>Insights</div>
                        <MenuItem icon={<BarChart size={20} />} label="Analytics" href="/admin/analytics" sidebarOpen={sidebarOpen} active={pathname.startsWith('/admin/analytics')} />
                        <MenuItem icon={<MessageSquare size={20} />} label="Enquiries" href="/admin/enquiries" sidebarOpen={sidebarOpen} active={pathname.startsWith('/admin/enquiries')} />
                    </ul>
                </nav>

                <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button
                        onClick={() => {
                            // Clear Sessions
                            sessionStorage.removeItem('plant_auth_active');
                            document.cookie = "plant_secret_v5=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                            router.push('/admin/login');
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            border: 'none',
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            justifyContent: sidebarOpen ? 'flex-start' : 'center',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                    >
                        <LogOut size={20} />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{
                flex: 1,
                marginLeft: sidebarOpen ? '260px' : '80px',
                transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                padding: '2rem'
            }}>
                {children}
            </main>
        </div>
    );
}

function MenuItem({ icon, label, href, sidebarOpen, active }) {
    return (
        <li>
            <Link href={href} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1.5rem',
                color: active ? '#4ade80' : '#cbd5e1',
                background: active ? 'rgba(74, 222, 128, 0.1)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.2s',
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                borderRight: active ? '3px solid #4ade80' : '3px solid transparent'
            }}
                className="hover:bg-slate-800 hover:text-white"
            >
                <div style={{ opacity: active ? 1 : 0.7 }}>{icon}</div>
                {sidebarOpen && <span style={{ fontSize: '0.95rem', fontWeight: active ? 600 : 400 }}>{label}</span>}
            </Link>
        </li>
    );
}

