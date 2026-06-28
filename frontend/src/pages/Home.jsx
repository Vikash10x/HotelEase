import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState('1');

    const handleSearch = (e) => {
        e.preventDefault();
        // Redirect to rooms page, preserving dates if desired
        navigate('/rooms');
    };

    return (
        <div className="bg-[#fbfaf7] min-h-screen text-primary overflow-x-hidden">
            {/* Hero Section */}
            <div className="relative h-screen w-full flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}>
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
                
                {/* Hero Content */}
                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto text-white mt-12">
                    <span className="text-xs tracking-[0.3em] uppercase font-bold text-secondary mb-4 block animate-fade-in">Private Sanctuary</span>
                    <h1 className="text-5xl md:text-7xl font-serif font-light mb-6 tracking-wide leading-tight animate-fade-in-up">
                        The Art of <br className="hidden sm:inline" /> Quiet Luxury
                    </h1>
                    <p className="text-base md:text-lg mb-10 text-stone-200 font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
                        A serene retreat crafted for the mindful traveler. Discover minimalist design, pure wilderness, and customized hospitality.
                    </p>
                    <Link to="/rooms" className="inline-block bg-secondary hover:bg-white text-white hover:text-primary border border-secondary hover:border-white px-9 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-500 shadow-lg shadow-black/10">
                        Explore Chambers
                    </Link>
                </div>

                {/* Floating Quick Search booking widget */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-5xl px-6 z-20 hidden md:block">
                    <form onSubmit={handleSearch} className="bg-white/95 backdrop-blur-xl border border-stone-200/30 p-4 shadow-2xl flex items-center justify-between gap-4 rounded-sm">
                        <div className="flex-1 grid grid-cols-3 gap-6 text-left">
                            <div className="px-4 border-r border-stone-100">
                                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Check In</label>
                                <input 
                                    type="date" 
                                    value={checkIn}
                                    onChange={(e) => setCheckIn(e.target.value)}
                                    className="w-full text-xs font-semibold text-primary outline-none cursor-pointer" 
                                />
                            </div>
                            <div className="px-4 border-r border-stone-100">
                                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Check Out</label>
                                <input 
                                    type="date" 
                                    value={checkOut}
                                    onChange={(e) => setCheckOut(e.target.value)}
                                    className="w-full text-xs font-semibold text-primary outline-none cursor-pointer" 
                                />
                            </div>
                            <div className="px-4">
                                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Guests</label>
                                <select 
                                    value={guests}
                                    onChange={(e) => setGuests(e.target.value)}
                                    className="w-full text-xs font-semibold text-primary outline-none bg-transparent cursor-pointer"
                                >
                                    <option value="1">1 Guest</option>
                                    <option value="2">2 Guests</option>
                                    <option value="3">3 Guests</option>
                                    <option value="4">4 Guests</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="bg-primary hover:bg-secondary text-white px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors duration-300 rounded-sm cursor-pointer whitespace-nowrap">
                            Check Availability
                        </button>
                    </form>
                </div>
            </div>

            {/* Introduction Section */}
            <div className="py-24 px-6 max-w-5xl mx-auto text-center">
                <span className="text-[10px] tracking-[0.35em] uppercase font-bold text-secondary mb-4 block">The Sanctuary</span>
                <h2 className="text-3xl md:text-5xl font-serif font-light text-slate-900 tracking-wide mb-8">
                    Discover Absolute Harmony
                </h2>
                <div className="w-16 h-[1px] bg-secondary/60 mx-auto mb-8"></div>
                <p className="text-base md:text-lg text-slate-500 font-light leading-relaxed max-w-3xl mx-auto tracking-wide">
                    Nestled between the quiet whispers of pristine coastline and the shadows of ancient mountains, HotelEase is conceptualized as a peaceful sanctuary for the spirit. Here, time ceases to rush, allowing every detail of your visit to dissolve into tranquility, extreme comfort, and custom service.
                </p>
            </div>

            {/* Signature Collections Grid */}
            <div className="pb-28 px-6 max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <span className="text-[10px] tracking-[0.35em] uppercase font-bold text-secondary mb-2 block">Accommodations</span>
                        <h2 className="text-3xl md:text-4xl font-serif font-light text-slate-900 tracking-wide">Signature Chambers</h2>
                    </div>
                    <Link to="/rooms" className="text-xs font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors border-b border-secondary hover:border-primary pb-1 hidden sm:block">
                        View All Rooms →
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Collection Item 1 */}
                    <div className="group space-y-4">
                        <div className="relative overflow-hidden aspect-[4/5] bg-stone-100 rounded-sm">
                            <img src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Ocean Pavilion" className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-700 ease-out" />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition duration-500"></div>
                        </div>
                        <div className="text-left">
                            <h3 className="text-lg font-serif font-light text-slate-900">Ocean Pavilions</h3>
                            <p className="text-xs text-stone-500 mt-1 font-light tracking-wide">Panoramic ocean vistas & private pool terrace</p>
                        </div>
                    </div>

                    {/* Collection Item 2 */}
                    <div className="group space-y-4">
                        <div className="relative overflow-hidden aspect-[4/5] bg-stone-100 rounded-sm">
                            <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Mountain Villa" className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-700 ease-out" />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition duration-500"></div>
                        </div>
                        <div className="text-left">
                            <h3 className="text-lg font-serif font-light text-slate-900">Forest Villas</h3>
                            <p className="text-xs text-stone-500 mt-1 font-light tracking-wide">Secluded stone suites hidden amongst ancient pines</p>
                        </div>
                    </div>

                    {/* Collection Item 3 */}
                    <div className="group space-y-4">
                        <div className="relative overflow-hidden aspect-[4/5] bg-stone-100 rounded-sm">
                            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Garden Suite" className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-700 ease-out" />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition duration-500"></div>
                        </div>
                        <div className="text-left">
                            <h3 className="text-lg font-serif font-light text-slate-900">Garden Courtyard Suites</h3>
                            <p className="text-xs text-stone-500 mt-1 font-light tracking-wide">Traditional open-air structures with private hot springs</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Wellness & Spa Promo */}
            <div className="relative py-32 bg-cover bg-center flex items-center justify-center text-white" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')" }}>
                <div className="absolute inset-0 bg-[#0b0f19]/70 backdrop-blur-[1px]"></div>
                
                <div className="relative z-10 px-6 max-w-3xl text-center space-y-6">
                    <span className="text-[10px] tracking-[0.35em] uppercase font-bold text-secondary block">Restoration</span>
                    <h2 className="text-3xl md:text-5xl font-serif font-light tracking-wide">The Art of Mindful Wellness</h2>
                    <p className="text-stone-300 font-light text-sm md:text-base leading-relaxed tracking-wide">
                        Discover restorative healing rituals at the HotelEase Spa, featuring private yoga pavilions, natural mineral thermal pools, and personalized wellness plans crafted by master therapists.
                    </p>
                    <Link to="/rooms" className="inline-block border border-white hover:border-secondary hover:bg-secondary text-white hover:text-white px-8 py-3 text-xs font-semibold uppercase tracking-widest transition-all duration-300">
                        Explore Wellness
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
