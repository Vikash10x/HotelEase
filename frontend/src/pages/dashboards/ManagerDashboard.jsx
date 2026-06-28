import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const ManagerDashboard = () => {
    const [stats, setStats] = useState(null);
    const [bookingsReport, setBookingsReport] = useState([]);
    const [revenueReport, setRevenueReport] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [statsRes, bookingsRes, revenueRes] = await Promise.all([
                    api.get('/reports/dashboard'),
                    api.get('/reports/bookings'),
                    api.get('/reports/revenue')
                ]);
                setStats(statsRes.data);
                setBookingsReport(bookingsRes.data);
                setRevenueReport(revenueRes.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to load manager reports", error);
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    if (loading) return <div className="p-8">Loading Manager Overview...</div>;

    return (
        <div className="pt-28 pb-24 px-6 md:px-8 max-w-7xl mx-auto font-sans bg-[#fbfaf7]">
            {/* Header */}
            <div className="mb-12 border-b border-stone-200/60 pb-8">
                <h1 className="font-serif text-4xl md:text-5xl text-primary tracking-wide font-normal">Executive Insights</h1>
                <p className="text-xs uppercase tracking-widest text-stone-500 mt-2 font-medium">HotelEase Management Analytics</p>
            </div>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-white p-6 border border-stone-200/60 shadow-sm border-t-2 border-primary flex flex-col justify-between">
                    <div>
                        <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold">Inventory</span>
                        <h3 className="text-sm font-medium text-stone-500 mt-1 uppercase tracking-wider">Total Chambers</h3>
                    </div>
                    <p className="font-serif text-4xl text-primary mt-4 font-normal">{stats ? stats.totalRooms : '—'}</p>
                </div>
                <div className="bg-white p-6 border border-stone-200/60 shadow-sm border-t-2 border-stone-400 flex flex-col justify-between">
                    <div>
                        <span className="text-xs uppercase tracking-wider text-emerald-600 font-semibold">Live</span>
                        <h3 className="text-sm font-medium text-stone-500 mt-1 uppercase tracking-wider">Available Keys</h3>
                    </div>
                    <p className="font-serif text-4xl text-primary mt-4 font-normal">{stats ? stats.availableRooms : '—'}</p>
                </div>
                <div className="bg-white p-6 border border-stone-200/60 shadow-sm border-t-2 border-secondary flex flex-col justify-between">
                    <div>
                        <span className="text-xs uppercase tracking-wider text-amber-600 font-semibold">Activity</span>
                        <h3 className="text-sm font-medium text-stone-500 mt-1 uppercase tracking-wider">Total Bookings</h3>
                    </div>
                    <p className="font-serif text-4xl text-primary mt-4 font-normal">{stats ? stats.totalBookings : '—'}</p>
                </div>
                <div className="bg-white p-6 border border-stone-200/60 shadow-sm border-t-2 border-stone-800 flex flex-col justify-between">
                    <div>
                        <span className="text-xs uppercase tracking-wider text-[#4b6351] font-semibold">Ledger</span>
                        <h3 className="text-sm font-medium text-stone-500 mt-1 uppercase tracking-wider">Gross Revenue</h3>
                    </div>
                    <p className="font-serif text-4xl text-[#4b6351] mt-4 font-normal">${stats ? stats.revenue.toLocaleString() : '—'}</p>
                </div>
            </div>

            {/* Detailed Reports */}
            <div className="bg-white p-8 border border-stone-200/60 shadow-sm mb-12">
                <div className="border-b border-stone-200 pb-4 mb-8">
                    <h2 className="font-serif text-2xl text-primary tracking-wide font-normal uppercase">Comprehensive Reports Overview</h2>
                </div>
                
                <h3 className="font-serif text-xl text-primary tracking-wide mb-4 uppercase">All Recent Bookings</h3>
                <div className="overflow-x-auto mb-12 border border-stone-200/60">
                    <table className="w-full text-left border-collapse bg-white">
                        <thead>
                            <tr className="bg-stone-50 border-b border-stone-200">
                                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Customer</th>
                                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Room</th>
                                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Check-in</th>
                                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Check-out</th>
                                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Status</th>
                                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {bookingsReport.slice(0, 15).map((booking) => (
                                <tr key={booking._id} className="hover:bg-stone-50/50 transition-colors">
                                    <td className="p-4 font-serif text-base font-normal text-stone-900">{booking.customer?.name}</td>
                                    <td className="p-4 text-sm font-mono text-stone-600">{booking.room?.roomNumber || '—'}</td>
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
                                    <td className="p-4 text-right font-serif text-base font-semibold text-[#4b6351]">${booking.totalAmount}</td>
                                </tr>
                            ))}
                            {bookingsReport.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-sm tracking-wide text-stone-400 font-light uppercase">No bookings registered.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <h3 className="font-serif text-xl text-primary tracking-wide mb-4 uppercase">Confirmed Revenue Transactions</h3>
                <div className="overflow-x-auto border border-stone-200/60">
                    <table className="w-full text-left border-collapse bg-white">
                        <thead>
                            <tr className="bg-stone-50 border-b border-stone-200">
                                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Transaction ID</th>
                                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Date</th>
                                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Method</th>
                                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Settlement</th>
                                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {revenueReport.slice(0, 15).map((payment) => (
                                <tr key={payment._id} className="hover:bg-stone-50/50 transition-colors">
                                    <td className="p-4 font-mono text-sm text-stone-500">{payment.transactionId || payment._id.slice(-8).toUpperCase()}</td>
                                    <td className="p-4 text-sm text-stone-600">{new Date(payment.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 text-sm text-stone-600 font-medium tracking-wide">{payment.paymentMethod}</td>
                                    <td className="p-4 text-sm text-[#4b6351] font-semibold uppercase tracking-wider">{payment.status}</td>
                                    <td className="p-4 text-right font-serif text-base font-semibold text-[#4b6351]">${payment.amount.toLocaleString()}</td>
                                </tr>
                            ))}
                            {revenueReport.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-sm tracking-wide text-stone-400 font-light uppercase">No paid transactions.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;
