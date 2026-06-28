import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const ReceptionDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState('');

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/bookings');
            // Show only relevant bookings for reception
            const activeBookings = data.filter(b => ['Pending', 'Confirmed', 'Checked-in'].includes(b.status));
            setBookings(activeBookings);
            setLoading(false);
        } catch (error) {
            console.error("Failed to load bookings", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            await api.patch(`/bookings/${id}/status`, { status: newStatus });
            setMsg(`Booking successfully updated to ${newStatus}`);
            fetchBookings();
        } catch (error) {
            setMsg(error.response?.data?.message || 'Update failed');
        }
    };

    if (loading) return <div className="p-8">Loading Reception Dashboard...</div>;

    return (
        <div className="pt-28 pb-24 px-6 md:px-8 max-w-6xl mx-auto font-sans bg-[#fbfaf7] min-h-screen">
            {/* Header */}
            <div className="mb-12 border-b border-stone-200/60 pb-8 text-left">
                <h1 className="font-serif text-4xl md:text-5xl text-primary tracking-wide font-normal">Concierge desk</h1>
                <p className="text-xs uppercase tracking-widest text-stone-500 mt-2 font-medium">HotelEase Reception Operations</p>
            </div>
            
            {msg && (
                <div className="mb-8 bg-stone-100 text-stone-800 border-l-2 border-secondary py-3.5 px-4 text-sm uppercase tracking-wider font-medium flex justify-between items-center">
                    <span>{msg}</span>
                    <button onClick={() => setMsg('')} className="text-stone-400 hover:text-stone-900 font-bold text-xs uppercase tracking-wider">Dismiss</button>
                </div>
            )}

            <div className="bg-white p-8 border border-stone-200/60 shadow-sm text-left">
                <h2 className="font-serif text-xl text-primary tracking-wide mb-6 uppercase border-b border-stone-100 pb-3">Active & Incoming Guests</h2>
                
                {bookings.length === 0 ? (
                    <p className="text-stone-500 font-light text-sm">No active bookings found.</p>
                ) : (
                    <div className="overflow-x-auto border border-stone-200/60">
                        <table className="w-full text-left border-collapse bg-white">
                            <thead>
                                <tr className="bg-stone-50 border-b border-stone-200">
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Guest Name</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Room</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Check-in</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Check-out</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Status</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {bookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-stone-50/50 transition-colors">
                                        <td className="p-4 font-serif text-base font-normal text-stone-900">{booking.customer?.name}</td>
                                        <td className="p-4 text-sm text-stone-600">{booking.room?.roomNumber} ({booking.room?.type})</td>
                                        <td className="p-4 text-sm text-stone-600">{new Date(booking.checkInDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</td>
                                        <td className="p-4 text-sm text-stone-600">{new Date(booking.checkOutDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-sm text-xs uppercase font-semibold tracking-wider whitespace-nowrap border ${
                                                booking.status === 'Confirmed' ? 'bg-[#e6eeea] text-[#2e4a36] border-[#d2e2d8]' :
                                                booking.status === 'Checked-in' ? 'bg-[#eef2f6] text-[#2c5282] border-[#d2e0f0]' :
                                                booking.status === 'Checked-out' ? 'bg-[#f3f0f7] text-[#553c9a] border-[#e2d9f3]' :
                                                booking.status === 'Pending' ? 'bg-[#faf2e6] text-[#8c6b23] border-[#f3e3cc]' :
                                                'bg-[#fdf0f0] text-[#a93232] border-[#fbd5d5]'
                                            }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="p-4 space-x-2 whitespace-nowrap">
                                            {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                                                <button onClick={() => updateStatus(booking._id, 'Checked-in')} className="bg-primary hover:bg-stone-800 text-white px-4 py-2 font-sans text-xs tracking-wider uppercase font-semibold transition-all duration-200 cursor-pointer shadow-sm">
                                                    Check-in
                                                </button>
                                            )}
                                            {booking.status === 'Checked-in' && (
                                                <button onClick={() => updateStatus(booking._id, 'Checked-out')} className="bg-secondary hover:bg-[#b58b62] text-white px-4 py-2 font-sans text-xs tracking-wider uppercase font-semibold transition-all duration-200 cursor-pointer shadow-sm">
                                                    Check-out
                                                </button>
                                            )}
                                            {booking.status === 'Pending' && (
                                                 <button onClick={() => updateStatus(booking._id, 'Confirmed')} className="bg-[#4b6351] hover:bg-[#3d5142] text-white px-4 py-2 font-sans text-xs tracking-wider uppercase font-semibold transition-all duration-200 cursor-pointer shadow-sm">
                                                    Confirm
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReceptionDashboard;
