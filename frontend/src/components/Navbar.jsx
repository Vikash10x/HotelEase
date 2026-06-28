import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled || mobileMenuOpen ? 'bg-[#fbfaf7]/90 backdrop-blur-xl border-b border-stone-200/40 py-4 shadow-sm' : 'bg-white/30 backdrop-blur-sm py-6 border-b border-transparent'}`}>
            <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-3.5 group">
                    <div className="perspective-1000 w-8 h-8 flex items-center justify-center transform group-hover:scale-105 transition-all duration-300">
                        <div className="logo-cube">
                            <div className="logo-face face-front">H</div>
                            <div className="logo-face face-back">H</div>
                            <div className="logo-face face-right">E</div>
                            <div className="logo-face face-left">E</div>
                            <div className="logo-face face-top"></div>
                            <div className="logo-face face-bottom"></div>
                        </div>
                    </div>
                    <span className="text-2xl font-serif tracking-widest text-primary uppercase">Hotel<span className="font-light text-secondary">Ease</span></span>
                </Link>

                <div className="hidden md:flex space-x-10 items-center font-sans text-xs font-semibold uppercase tracking-widest">
                    <Link to="/rooms" className={`relative group transition-colors text-stone-600 hover:text-secondary ${isActive('/rooms') ? 'text-secondary' : ''}`}>
                        Rooms
                        <span className={`absolute -bottom-2 left-0 h-[1.5px] transition-all duration-300 group-hover:w-full bg-secondary ${isActive('/rooms') ? 'w-full' : 'w-0'}`}></span>
                    </Link>

                    {token ? (
                        <>
                            <Link to="/dashboard" className={`relative group transition-colors text-stone-600 hover:text-secondary ${isActive('/dashboard') ? 'text-secondary' : ''}`}>
                                Dashboard
                                <span className={`absolute -bottom-2 left-0 h-[1.5px] transition-all duration-300 group-hover:w-full bg-secondary ${isActive('/dashboard') ? 'w-full' : 'w-0'}`}></span>
                            </Link>
                            <button onClick={handleLogout} className="border border-stone-300 hover:border-rose-300 hover:bg-rose-50 text-stone-700 hover:text-rose-700 px-6 py-2.5 rounded-sm transition-all duration-300 flex items-center font-medium cursor-pointer text-xs tracking-widest">
                                <svg className="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                LOGOUT
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-stone-600 hover:text-secondary transition-colors">Login</Link>
                            <Link to="/register" className="bg-primary hover:bg-secondary text-white px-7 py-3 rounded-sm transition-all duration-300 shadow-sm transform hover:-translate-y-[1px] font-medium text-xs tracking-widest">REGISTER</Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                    className="md:hidden text-stone-600 hover:text-stone-900 focus:outline-none cursor-pointer"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {mobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu Panel */}
            <div className={`md:hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-screen opacity-100 py-6 border-t border-stone-200/40 bg-[#fbfaf7]' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="flex flex-col space-y-4 px-6 font-sans text-xs font-semibold uppercase tracking-widest text-left">
                    <Link 
                        to="/rooms" 
                        onClick={() => setMobileMenuOpen(false)}
                        className={`py-2 transition-colors text-stone-600 hover:text-secondary ${isActive('/rooms') ? 'text-secondary' : ''}`}
                    >
                        Rooms
                    </Link>

                    {token ? (
                        <>
                            <Link 
                                to="/dashboard" 
                                onClick={() => setMobileMenuOpen(false)}
                                className={`py-2 transition-colors text-stone-600 hover:text-secondary ${isActive('/dashboard') ? 'text-secondary' : ''}`}
                            >
                                Dashboard
                            </Link>
                            <button 
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    handleLogout();
                                }} 
                                className="w-full text-left py-2 border-t border-stone-200/40 text-stone-700 hover:text-rose-700 font-medium transition-colors"
                            >
                                LOGOUT
                            </button>
                        </>
                    ) : (
                        <>
                            <Link 
                                to="/login" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="py-2 text-stone-600 hover:text-secondary transition-colors"
                            >
                                Login
                            </Link>
                            <Link 
                                to="/register" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="bg-primary hover:bg-secondary text-white text-center py-3 rounded-sm transition-all duration-300 shadow-sm font-medium"
                            >
                                REGISTER
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
