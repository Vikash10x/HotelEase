import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const HousekeepingDashboard = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState('');

    const fetchRoomsToClean = async () => {
        try {
            const { data } = await api.get('/rooms');
            // Filter rooms that need cleaning
            const dirtyRooms = data.filter(r => r.status === 'Cleaning');
            setRooms(dirtyRooms);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch rooms", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoomsToClean();
    }, []);

    const markAsCleaned = async (roomId) => {
        try {
            await api.patch(`/rooms/${roomId}/status`, { status: 'Available' });
            setMsg(`Room updated to Available successfully!`);
            fetchRoomsToClean();
        } catch (error) {
            setMsg(error.response?.data?.message || 'Failed to update room status');
        }
    };

    if (loading) return <div className="p-8">Loading tasks...</div>;

    return (
        <div className="pt-28 pb-24 px-6 md:px-8 max-w-5xl mx-auto font-sans bg-[#fbfaf7] min-h-screen">
            {/* Header */}
            <div className="mb-12 border-b border-stone-200/60 pb-8 text-left">
                <h1 className="font-serif text-4xl md:text-5xl text-primary tracking-wide font-normal">Chamber Maintenance</h1>
                <p className="text-xs uppercase tracking-widest text-stone-500 mt-2 font-medium">HotelEase Housekeeping Portal</p>
            </div>
            
            {msg && (
                <div className="mb-8 bg-stone-100 text-stone-800 border-l-2 border-secondary py-3.5 px-4 text-sm uppercase tracking-wider font-medium flex justify-between items-center">
                    <span>{msg}</span>
                    <button onClick={() => setMsg('')} className="text-stone-400 hover:text-stone-900 font-bold text-xs uppercase tracking-wider">Dismiss</button>
                </div>
            )}

            <div className="bg-white p-8 border border-stone-200/60 shadow-sm text-left">
                <h2 className="font-serif text-xl text-primary tracking-wide mb-6 uppercase border-b border-stone-100 pb-3">Rooms Requiring Cleaning</h2>
                
                {rooms.length === 0 ? (
                    <p className="text-stone-500 font-light text-sm">Great job! There are no rooms that require cleaning currently.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        {rooms.map(room => (
                            <div key={room._id} className="border border-stone-200/50 p-5 flex flex-col sm:flex-row md:flex-col lg:flex-row justify-between items-start sm:items-center md:items-start lg:items-center gap-4 bg-[#faf9f6] hover:bg-stone-50 transition duration-200">
                                <div className="space-y-1.5">
                                    <h3 className="font-serif text-xl text-primary font-medium">Room {room.roomNumber}</h3>
                                    <p className="text-sm text-stone-500">
                                        {room.type.toLowerCase().includes('room') || room.type.toLowerCase().includes('suite') ? room.type : `${room.type} Suite`}
                                    </p>
                                    <span className="inline-block bg-[#faf2e6] text-[#8c6b23] border border-[#f3e3cc] px-2.5 py-0.5 rounded-sm text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Needs Cleaning</span>
                                </div>
                                <div className="w-full sm:w-auto md:w-full lg:w-auto flex-shrink-0">
                                    <button 
                                        onClick={() => markAsCleaned(room._id)} 
                                        className="w-full sm:w-auto md:w-full lg:w-auto bg-primary hover:bg-stone-800 text-white px-5 py-3 font-sans text-xs tracking-wider uppercase font-semibold transition-colors duration-200 cursor-pointer shadow-sm whitespace-nowrap text-center">
                                        Mark as Cleaned
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HousekeepingDashboard;
