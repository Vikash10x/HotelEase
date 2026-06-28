import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/register', { name, email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('userId', data._id);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen pt-36 pb-24 bg-[#fbfaf7] flex items-start justify-center px-4 sm:px-6">
            <div className="bg-white rounded-sm shadow-xl flex max-w-4xl w-full overflow-hidden border border-stone-200/40">
                {/* Left Side - Image & Branding */}
                <div className="hidden md:flex w-5/12 bg-gradient-to-br from-[#111827] to-[#1f2937] p-8 flex-col justify-between relative overflow-hidden text-white text-left">
                    <img src="https://images.unsplash.com/photo-1542314831-c53cd3816002?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-[#0b0f19]/35"></div>
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/10 p-2 rounded-sm backdrop-blur-md shadow-sm border border-white/20">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1v1H9V7zm5 0h1v1h-1V7zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1z"></path></svg>
                            </div>
                            <span className="text-xl font-serif tracking-widest text-white uppercase">Hotel<span className="font-light text-secondary">Ease</span></span>
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-3xl font-serif font-light leading-tight">Guest Register</h2>
                            <p className="text-stone-300 text-sm font-light leading-relaxed tracking-wide">Create a guest profile to unlock exclusive member privileges and immediate reservation status.</p>
                        </div>
                    </div>
                    <div className="relative z-10 mt-8">
                        <div className="flex items-center space-x-3 bg-white/5 w-max pr-4 p-1.5 rounded-sm backdrop-blur-md border border-white/10 shadow-sm">
                            <div className="flex -space-x-2 pl-1">
                                <img className="w-7 h-7 rounded-full border border-white/20 shadow-sm" src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" />
                                <img className="w-7 h-7 rounded-full border border-white/20 shadow-sm" src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" />
                                <img className="w-7 h-7 rounded-full border border-white/20 shadow-sm" src="https://randomuser.me/api/portraits/women/68.jpg" alt="User" />
                            </div>
                            <span className="text-xs font-bold tracking-widest uppercase text-stone-200">10k+ Mindful Guests</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-7/12 p-8 md:p-12 bg-white relative text-left">
                    <div className="max-w-sm mx-auto space-y-6">
                        <div>
                            <h2 className="text-2xl font-serif font-light text-slate-800 tracking-wide">Create Account</h2>
                            <p className="text-stone-500 font-light text-sm mt-1.5">Please fill in your details to get started.</p>
                        </div>

                        {error && <div className="bg-rose-50 border border-rose-100 text-rose-700 p-3 rounded-sm text-xs font-semibold shadow-xs">{error}</div>}

                        <form onSubmit={handleRegister} className="space-y-5">
                            <div>
                                <label className="block text-stone-500 mb-1.5 font-bold text-xs tracking-widest uppercase">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-secondary">
                                        <svg className="h-4 w-4 text-stone-400 group-focus-within:text-secondary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                    </div>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full pl-10 pr-3 py-2.5 border border-stone-200/60 bg-transparent rounded-sm focus:bg-white focus:ring-1 focus:ring-secondary/45 focus:border-secondary transition-all outline-none font-medium text-slate-700 placeholder-stone-400 text-sm" placeholder="John Doe" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-stone-500 mb-1.5 font-bold text-xs tracking-widest uppercase">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-secondary">
                                        <svg className="h-4 w-4 text-stone-400 group-focus-within:text-secondary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                    </div>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-10 pr-3 py-2.5 border border-stone-200/60 bg-transparent rounded-sm focus:bg-white focus:ring-1 focus:ring-secondary/45 focus:border-secondary transition-all outline-none font-medium text-slate-700 placeholder-stone-400 text-sm" placeholder="you@example.com" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-stone-500 mb-1.5 font-bold text-xs tracking-widest uppercase">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-secondary">
                                        <svg className="h-4 w-4 text-stone-400 group-focus-within:text-secondary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                    </div>
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-10 pr-3 py-2.5 border border-stone-200/60 bg-transparent rounded-sm focus:bg-white focus:ring-1 focus:ring-secondary/45 focus:border-secondary transition-all outline-none font-medium text-slate-700 placeholder-stone-400 text-sm" placeholder="••••••••" />
                                </div>
                            </div>

                            <button type="submit" className="w-full cursor-pointer bg-primary hover:bg-secondary text-white py-3.5 rounded-sm transition-all font-bold tracking-widest uppercase shadow-sm hover:shadow-md transform hover:-translate-y-[0.5px] mt-6 text-sm">
                                CREATE ACCOUNT
                            </button>
                        </form>

                        <div className="pt-4 border-t border-stone-100/60 text-center">
                            <p className="text-stone-500 font-medium text-sm">
                                Already have an account? <Link to="/login" className="text-secondary font-bold hover:text-primary transition-colors ml-1 border-b border-transparent hover:border-primary pb-0.5">Sign in</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
