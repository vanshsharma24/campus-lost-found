import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const linkClass = (path) =>
        `text-sm font-medium transition-colors ${
            isActive(path)
                ? 'text-brand-600'
                : 'text-slate-600 hover:text-slate-900'
        }`;

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center text-white font-bold shadow-sm group-hover:shadow-md transition-shadow">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="font-display text-lg font-bold text-slate-900 hidden sm:block">
                            Campus <span className="text-brand-600">Lost & Found</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/" className={linkClass('/')}>Home</Link>
                        <Link to="/items" className={linkClass('/items')}>Browse</Link>
                        {user && (
                            <>
                                <Link to="/report" className={linkClass('/report')}>Report Item</Link>
                                <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
                            </>
                        )}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <>
                                <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                                    <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 hidden lg:block">{user.name}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm font-medium text-slate-600 hover:text-red-600 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-brand-600 px-3 py-1.5 transition-colors">
                                    Sign in
                                </Link>
                                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-slate-100"
                    >
                        <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {mobileOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {mobileOpen && (
                    <div className="md:hidden border-t border-slate-100 py-3 space-y-1">
                        <Link to="/" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700">Home</Link>
                        <Link to="/items" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700">Browse</Link>
                        {user ? (
                            <>
                                <Link to="/report" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700">Report Item</Link>
                                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700">Dashboard</Link>
                                <Link to="/profile" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700">Profile</Link>
                                <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-red-600">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700">Sign in</Link>
                                <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg bg-brand-600 text-white text-center">Get Started</Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
