import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const { data } = await api.get('/rooms');
                setRooms(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to load rooms", error);
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    if (loading) return <div className="p-8 text-center text-xl">Loading rooms...</div>;

    return (
        <div className="pt-32 pb-24 px-6 sm:px-12 max-w-7xl mx-auto min-h-screen bg-[#fbfaf7]">
            <div className="text-center mb-20 max-w-2xl mx-auto">
                <span className="text-[10px] tracking-[0.35em] uppercase font-bold text-secondary mb-3.5 block">Accommodations</span>
                <h1 className="text-3xl md:text-5xl font-serif font-light text-slate-900 mb-4 tracking-wide">Chambers & Pavilions</h1>
                <p className="text-stone-500 text-sm md:text-base font-light leading-relaxed tracking-wide">A selection of private sanctuaries, minimalist open-air suites, and ocean-facing pavilions designed to restore harmony and balance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {rooms.map(room => (
                    <div key={room._id} className="bg-white rounded-sm overflow-hidden border border-stone-200/40 shadow-sm hover:shadow-lg transition duration-500 group flex flex-col">
                        <div className="relative overflow-hidden aspect-[4/3] bg-stone-50">
                            <img src={room.images[0] || 'https://via.placeholder.com/800x400'} alt={`Room ${room.roomNumber}`} className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-700 ease-out" />
                            <div className="absolute top-4 right-4">
                                <span className="bg-[#fbfaf7]/90 backdrop-blur-md text-primary px-4 py-2 rounded-sm text-xs font-bold shadow-sm border border-stone-200/30 tracking-wider">
                                    ${room.price} <span className="text-[10px] font-normal text-stone-500">/ night</span>
                                </span>
                            </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                            <div>
                                <h2 className="text-xl font-serif font-light text-slate-800 mb-1.5">
                                    {room.type.toLowerCase().includes('room') || room.type.toLowerCase().includes('suite') ? room.type : `${room.type} Suite`}
                                </h2>
                                <p className="text-stone-500 text-xs font-semibold uppercase tracking-wider flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                    Max Capacity: {room.capacity} Guest{room.capacity > 1 ? 's' : ''}
                                </p>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-stone-100/60">
                                <span className={`px-3 py-1 rounded-sm text-[10px] font-bold shadow-xs uppercase tracking-widest border flex items-center ${
                                    room.status === 'Available' ? 'bg-emerald-50/60 text-emerald-700 border-emerald-100/60' : 'bg-rose-50/60 text-rose-700 border-rose-100/60'
                                }`}>
                                    <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${room.status === 'Available' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                    {room.status}
                                </span>
                                <Link to={`/rooms/${room._id}`} className="text-secondary font-bold text-xs uppercase tracking-widest hover:text-primary transition flex items-center group border-b border-transparent hover:border-primary pb-0.5">
                                    View Details
                                    <svg className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Rooms;
