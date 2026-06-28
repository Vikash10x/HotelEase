import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#111827] text-stone-300 font-sans border-t border-stone-800">
            {/* Top Grid Area */}
            <div className="container mx-auto px-6 md:px-12 py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
                    
                    {/* Brand Section */}
                    <div className="space-y-6 text-left">
                        <Link to="/" className="flex items-center space-x-3.5 group">
                            <span className="text-2xl font-serif tracking-widest text-white uppercase">
                                Hotel<span className="font-light text-[#c59b72]">Ease</span>
                            </span>
                        </Link>
                        <p className="text-sm text-stone-400 font-light leading-relaxed max-w-xs">
                            A sanctuary of quiet luxury, combining modern architectural intelligence with the highest standards of personalized hospitality.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#facebook" className="text-stone-400 hover:text-[#c59b72] transition-colors duration-300">
                                <span className="sr-only">Facebook</span>
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
                            </a>
                            <a href="#instagram" className="text-stone-400 hover:text-[#c59b72] transition-colors duration-300">
                                <span className="sr-only">Instagram</span>
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.31 22h-.62c-5.02 0-9.69-4.67-9.69-9.69v-.62C2 6.67 6.67 2 11.69 2h.62c5.02 0 9.69 4.67 9.69 9.69v.62c0 5.02-4.67 9.69-9.69 9.69zM12 4.62c-4.07 0-7.38 3.3-7.38 7.38s3.3 7.38 7.38 7.38 7.38-3.3 7.38-7.38-3.3-7.38-7.38-7.38zM12 7.7a4.3 4.3 0 100 8.6 4.3 4.3 0 000-8.6z"/></svg>
                            </a>
                            <a href="#twitter" className="text-stone-400 hover:text-[#c59b72] transition-colors duration-300">
                                <span className="sr-only">Twitter</span>
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.95 4.57a10 10 0 01-2.82.77 4.96 4.96 0 002.16-2.72c-.95.55-2 .95-3.12 1.18a4.92 4.92 0 00-8.38 4.48A14 14 0 011.64 3.16a4.92 4.92 0 001.52 6.57 4.9 4.9 0 01-2.23-.61v.06a4.92 4.92 0 003.95 4.83 4.9 4.9 0 01-2.22.08 4.92 4.92 0 004.6 3.42A9.9 9.9 0 010 19.54a13.9 13.9 0 007.55 2.21c9.05 0 14-7.5 14-14v-.64a10 10 0 002.4-2.54z"/></svg>
                            </a>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="text-left">
                        <h4 className="text-xs uppercase tracking-widest text-[#c59b72] font-semibold mb-6">Discover</h4>
                        <ul className="space-y-4 text-sm font-light">
                            <li>
                                <Link to="/rooms" className="hover:text-white transition-colors duration-300">Rooms & Suites</Link>
                            </li>
                            <li>
                                <a href="#wellness" className="hover:text-white transition-colors duration-300">Wellness & Spa</a>
                            </li>
                            <li>
                                <a href="#dining" className="hover:text-white transition-colors duration-300">Signature Dining</a>
                            </li>
                            <li>
                                <a href="#experiences" className="hover:text-white transition-colors duration-300">Local Experiences</a>
                            </li>
                        </ul>
                    </div>

                    {/* Office / Location Contact */}
                    <div className="text-left">
                        <h4 className="text-xs uppercase tracking-widest text-[#c59b72] font-semibold mb-6">Contact</h4>
                        <ul className="space-y-4 text-sm font-light text-stone-400">
                            <li className="flex items-start space-x-3">
                                <svg className="w-5 h-5 text-stone-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                <span>100 Luxury Way, Aman Hills,<br/>California, CA 90210</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <svg className="w-5 h-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                <span>+1 (310) 555-0189</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <svg className="w-5 h-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                <span>concierge@hotelease.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter Sign up */}
                    <div className="text-left space-y-6">
                        <h4 className="text-xs uppercase tracking-widest text-[#c59b72] font-semibold">Newsletter</h4>
                        <p className="text-sm text-stone-400 font-light leading-relaxed">
                            Subscribe to receive curated guides, exclusive offers, and announcements from HotelEase.
                        </p>
                        <form onSubmit={(e) => e.preventDefault()} className="flex items-center border-b border-stone-700 py-2">
                            <input 
                                type="email" 
                                placeholder="YOUR EMAIL" 
                                className="appearance-none bg-transparent border-none w-full text-stone-200 mr-3 py-1 px-2 leading-tight focus:outline-none text-xs uppercase tracking-wider font-light" 
                                required
                            />
                            <button 
                                type="submit" 
                                className="flex-shrink-0 bg-transparent hover:text-white text-stone-400 text-xs tracking-widest uppercase font-semibold transition-colors duration-300"
                            >
                                JOIN
                            </button>
                        </form>
                    </div>

                </div>
            </div>

            {/* Bottom Copyright Area */}
            <div className="border-t border-stone-900 bg-[#0b0f19] py-8 text-center text-xs tracking-widest uppercase text-stone-500">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p>&copy; {new Date().getFullYear()} HotelEase. All Rights Reserved.</p>
                    <div className="flex space-x-6">
                        <a href="#privacy" className="hover:text-stone-400 transition-colors">Privacy Policy</a>
                        <a href="#terms" className="hover:text-stone-400 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
