import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await api.get('/bookings/my-bookings');
                setBookings(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to load bookings", error);
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const handleCancelBooking = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;
        try {
            await api.patch(`/bookings/${id}/cancel`);
            // Refresh list
            const { data } = await api.get('/bookings/my-bookings');
            setBookings(data);
        } catch (error) {
            console.error("Failed to cancel booking", error);
            alert(error.response?.data?.message || 'Failed to cancel booking');
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="pt-36 pb-24 px-6 md:px-12 bg-[#fbfaf7] min-h-screen">
            <div className="max-w-5xl mx-auto space-y-8 text-left">
                <div>
                    <span className="text-secondary font-bold uppercase tracking-[0.35em] text-xs block mb-1">Guest Portal</span>
                    <h1 className="text-3xl md:text-4xl font-serif font-light text-slate-900 tracking-wide">My Dashboard</h1>
                </div>
                
                <div className="bg-white rounded-sm shadow-xl p-8 border border-stone-200/40 space-y-6">
                    <div>
                        <h2 className="text-xl font-serif font-light text-slate-800">My Reservations</h2>
                        <div className="w-10 h-[1px] bg-secondary mt-2"></div>
                    </div>
                    
                    {bookings.length === 0 ? (
                        <p className="text-stone-500 font-light text-sm">You have no active reservations yet. <Link to="/rooms" className="text-secondary font-bold hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-0.5 ml-1">Browse Chambers</Link></p>
                    ) : (
                        <div className="overflow-x-auto rounded-sm border border-stone-200/40">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#fbfaf7] text-stone-500 font-bold text-xs uppercase tracking-wider border-b border-stone-200/40">
                                        <th className="p-4">Chamber</th>
                                        <th className="p-4">Check-in</th>
                                        <th className="p-4">Check-out</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Total Amount</th>
                                        <th className="p-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((booking) => (
                                        <tr key={booking._id} className="border-b border-stone-100/60 hover:bg-[#fbfaf7]/60 transition text-sm text-slate-700">
                                            <td className="p-4 font-bold text-slate-800">{booking.room?.roomNumber ? `${booking.room.type} Suite (${booking.room.roomNumber})` : 'N/A'}</td>
                                            <td className="p-4 font-normal text-stone-500">{new Date(booking.checkInDate).toLocaleDateString([], { dateStyle: 'medium' })}</td>
                                            <td className="p-4 font-normal text-stone-500">{new Date(booking.checkOutDate).toLocaleDateString([], { dateStyle: 'medium' })}</td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 rounded-sm text-xs uppercase font-semibold tracking-wider whitespace-nowrap border ${
                                                    booking.status === 'Confirmed' ? 'bg-[#e6eeea] text-[#2e4a36] border-[#d2e2d8]' :
                                                    booking.status === 'Checked-in' ? 'bg-[#eef2f6] text-[#2c5282] border-[#d2e0f0]' :
                                                    booking.status === 'Checked-out' ? 'bg-[#f3f0f7] text-[#553c9a] border-[#e2d9f3]' :
                                                    booking.status === 'Pending' ? 'bg-[#faf2e6] text-[#8c6b23] border-[#f3e3cc] animate-pulse' :
                                                    'bg-[#fdf0f0] text-[#a93232] border-[#fbd5d5]'
                                                }`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="p-4 font-bold text-slate-800">${booking.totalAmount}</td>
                                            <td className="p-4 text-center">
                                                {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                                                    <button onClick={() => handleCancelBooking(booking._id)} className="bg-stone-50 text-stone-600 hover:bg-rose-50 hover:text-rose-700 border border-stone-200/60 px-4 py-2 rounded-sm font-bold text-xs tracking-wider uppercase transition cursor-pointer">
                                                        Cancel
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
        </div>
    );
};

export default CustomerDashboard;
