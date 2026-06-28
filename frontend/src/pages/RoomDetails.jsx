import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const RoomDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Form States
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [guests, setGuests] = useState(1);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [idType, setIdType] = useState('Aadhaar');
    const [idNumber, setIdNumber] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('UPI');

    const [bookingMsg, setBookingMsg] = useState('');
    const [isBooking, setIsBooking] = useState(false);
    const [confirmedBooking, setConfirmedBooking] = useState(null);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const { data } = await api.get(`/rooms/${id}`);
                setRoom(data);
                
                // Pre-fill profile info from token/localStorage if available
                const userObjStr = localStorage.getItem('user');
                if (userObjStr) {
                    try {
                        const user = JSON.parse(userObjStr);
                        setFullName(user.name || '');
                        setEmail(user.email || '');
                    } catch (e) {
                        console.error(e);
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch room", error);
                setLoading(false);
            }
        };
        fetchRoom();
    }, [id]);

    const calculateTotalAmount = () => {
        if (!checkInDate || !checkOutDate) return room ? room.price : 0;
        const diffTime = Math.abs(new Date(checkOutDate) - new Date(checkInDate));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays * room.price : room.price;
    };

    const handleBook = async (e) => {
        e.preventDefault();
        if (isBooking) return;

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        setIsBooking(true);
        setBookingMsg('Processing your booking, please wait...');

        try {
            const amount = calculateTotalAmount();
            const paymentStatus = paymentMethod === 'Cash' ? 'pending' : 'paid';

            const { data: bookingData } = await api.post('/bookings', {
                room: id,
                checkInDate,
                checkOutDate,
                totalAmount: amount,
                fullName,
                email,
                phone,
                idType,
                idNumber,
                guests: Number(guests),
                paymentStatus
            });

            // Create corresponding payment record
            await api.post('/payments', {
                booking: bookingData._id,
                amount: amount,
                paymentMethod: paymentMethod,
                status: paymentMethod === 'Cash' ? 'Pending' : 'Success',
                transactionId: `${paymentMethod.toLowerCase()}_${Date.now()}`
            });

            setRoom(prev => ({ ...prev, status: 'Booked' }));
            setConfirmedBooking(bookingData);
            setBookingMsg('Booking confirmed successfully!');
        } catch (error) {
            setBookingMsg(error.response?.data?.message || 'Failed to create booking');
        } finally {
            setIsBooking(false);
        }
    };

    if (loading) return <div className="p-16 text-center text-xl font-bold text-slate-600">Loading room details...</div>;
    if (!room) return <div className="p-16 text-center text-xl text-red-600 font-bold">Room not found</div>;

    // Show Confirmation Details Screen on Success
    if (confirmedBooking) {
        return (
            <div className="pt-36 pb-24 px-6 max-w-3xl mx-auto bg-[#fbfaf7]">
                <div className="bg-white rounded-sm shadow-xl overflow-hidden border border-stone-200/40">
                    {/* Header */}
                    <div className="bg-[#4b6351] text-white p-10 text-center border-b border-[#3e5243]">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-full mb-4 border border-white/20">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-serif font-light tracking-wide text-white">Reservation Confirmed</h1>
                        <p className="mt-2 text-[#d1dbd4] text-xs uppercase tracking-widest font-semibold">Thank you for choosing HotelEase</p>
                        
                        <div className="mt-6 inline-flex items-center bg-white/5 px-4 py-2 rounded-sm text-xs font-mono border border-white/10 select-all cursor-pointer hover:bg-white/10 transition duration-200 text-white tracking-widest">
                            <span className="text-[#d1dbd4] mr-2 font-sans text-[10px] uppercase font-bold">Booking ID:</span>
                            <span className="font-bold">{confirmedBooking.bookingId || 'N/A'}</span>
                        </div>
                    </div>

                    {/* Details Body */}
                    <div className="p-8 space-y-8 text-left font-sans">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-[#fbfaf7] p-5 rounded-sm border border-stone-200/40">
                                <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Selected Accommodation</h3>
                                <p className="text-base font-bold text-slate-800">
                                    {room.type.toLowerCase().includes('room') || room.type.toLowerCase().includes('suite') ? room.type : `${room.type} Suite`} - No. {room.roomNumber}
                                </p>
                                <p className="text-xs text-stone-500 mt-1">${room.price} / night</p>
                            </div>
                            <div className="bg-[#fbfaf7] p-5 rounded-sm border border-stone-200/40">
                                <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Total Amount Paid</h3>
                                <p className="text-xl font-bold text-secondary">${confirmedBooking.totalAmount}</p>
                                <p className="text-xs text-stone-500 mt-1 uppercase font-bold tracking-wider">
                                    Status: <span className={confirmedBooking.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-500'}>
                                        {confirmedBooking.paymentStatus}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Guest & ID Information */}
                        <div className="border-t border-stone-100/60 pt-6">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 flex items-center">
                                <svg className="w-4 h-4 mr-2 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Guest & Identification Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-xs">
                                <div className="flex justify-between border-b pb-2 border-stone-100/40">
                                    <span className="text-stone-400 font-medium">Guest Name</span>
                                    <span className="font-bold text-slate-800">{confirmedBooking.fullName}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2 border-stone-100/40">
                                    <span className="text-stone-400 font-medium">Email Address</span>
                                    <span className="font-bold text-slate-800">{confirmedBooking.email}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2 border-stone-100/40">
                                    <span className="text-stone-400 font-medium">Phone Number</span>
                                    <span className="font-bold text-slate-800">{confirmedBooking.phone}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2 border-stone-100/40">
                                    <span className="text-stone-400 font-medium">Total Guests</span>
                                    <span className="font-bold text-slate-800">{confirmedBooking.guests} Person(s)</span>
                                </div>
                                <div className="flex justify-between border-b pb-2 border-stone-100/40">
                                    <span className="text-stone-400 font-medium">ID Verification</span>
                                    <span className="font-bold text-slate-800">{confirmedBooking.idType}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2 border-stone-100/40">
                                    <span className="text-stone-400 font-medium">ID Document No.</span>
                                    <span className="font-bold text-slate-800 font-mono tracking-wider">{confirmedBooking.idNumber}</span>
                                </div>
                            </div>
                        </div>

                        {/* Stay Information */}
                        <div className="border-t border-stone-100/60 pt-6">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 flex items-center">
                                <svg className="w-4 h-4 mr-2 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Reservation Schedule
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-xs">
                                <div className="flex justify-between border-b pb-2 border-stone-100/40">
                                    <span className="text-stone-400 font-medium">Check-in Date</span>
                                    <span className="font-bold text-slate-800">{new Date(confirmedBooking.checkInDate).toLocaleDateString([], { dateStyle: 'long' })}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2 border-stone-100/40">
                                    <span className="text-stone-400 font-medium">Check-out Date</span>
                                    <span className="font-bold text-slate-800">{new Date(confirmedBooking.checkOutDate).toLocaleDateString([], { dateStyle: 'long' })}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2 border-stone-100/40">
                                    <span className="text-stone-400 font-medium">Settlement Type</span>
                                    <span className="font-bold text-slate-800">{paymentMethod}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2 border-stone-100/40">
                                    <span className="text-stone-400 font-medium">Booking Status</span>
                                    <span className="bg-[#4b6351]/10 text-[#4b6351] border border-[#4b6351]/20 px-3 py-0.5 rounded-sm font-bold text-[10px] tracking-widest uppercase">
                                        {confirmedBooking.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-[#fbfaf7] p-6 flex flex-col sm:flex-row gap-4 justify-between border-t border-stone-100/60 text-xs tracking-widest font-semibold uppercase">
                        <button onClick={() => window.print()} className="bg-stone-200/60 text-stone-700 px-6 py-3.5 rounded-sm hover:bg-stone-200 transition cursor-pointer">
                            Print Invoice
                        </button>
                        <Link to="/rooms" className="bg-primary text-white px-8 py-3.5 rounded-sm hover:bg-secondary transition shadow-sm text-center cursor-pointer">
                            Back to Chambers
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-36 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen bg-[#fbfaf7]">
            <div className="flex flex-col lg:flex-row gap-12 text-left">
                {/* Left Side: Room Details */}
                <div className="lg:w-1/2 space-y-8">
                    <div className="relative overflow-hidden rounded-sm shadow-lg h-72 md:h-[480px] bg-stone-100">
                        <img src={room.images[0]} alt="Room" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent"></div>
                        <div className="absolute bottom-6 left-6 text-white">
                            <span className="bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-sm text-[10px] font-bold border border-white/10 uppercase tracking-widest">
                                Chamber No. {room.roomNumber}
                            </span>
                            <h1 className="text-3xl md:text-5xl font-serif font-light mt-3 tracking-wide">
                                {room.type.toLowerCase().includes('room') || room.type.toLowerCase().includes('suite') ? room.type : `${room.type} Suite`}
                            </h1>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-sm border border-stone-200/40 shadow-xs space-y-8">
                        <div>
                            <h2 className="text-2xl font-serif font-light text-slate-800 mb-4">Chamber Overview</h2>
                            <p className="text-stone-500 leading-relaxed text-sm font-light tracking-wide">{room.description}</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 border-t border-b border-stone-100/60 py-6">
                            <div className="text-center">
                                <span className="block text-[10px] text-stone-400 font-bold uppercase tracking-widest">Capacity</span>
                                <span className="text-base font-semibold text-slate-800 mt-1 block">{room.capacity} Guest(s)</span>
                            </div>
                            <div className="text-center border-l border-r border-stone-100/60">
                                <span className="block text-[10px] text-stone-400 font-bold uppercase tracking-widest">Price</span>
                                <span className="text-base font-semibold text-slate-800 mt-1 block">${room.price} / night</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-[10px] text-stone-400 font-bold uppercase tracking-widest">Status</span>
                                <span className={`inline-block mt-1 font-bold text-xs uppercase tracking-widest ${room.status === 'Available' ? 'text-emerald-600' : 'text-rose-600 animate-pulse'}`}>
                                    {room.status}
                                </span>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4">Sanctuary Amenities</h3>
                            <div className="flex flex-wrap gap-2">
                                {room.amenities && room.amenities.length > 0 ? (
                                    room.amenities.map((amenity, idx) => (
                                        <span key={idx} className="bg-[#fbfaf7] text-stone-600 px-4 py-2.5 rounded-sm text-xs font-semibold border border-stone-200/40">
                                            {amenity}
                                        </span>
                                    ))
                                ) : (
                                    ['High-Speed Wi-Fi', 'Smart TV', 'Air Conditioning', 'Mini Bar', '24/7 Room Service'].map((amenity, idx) => (
                                        <span key={idx} className="bg-[#fbfaf7] text-stone-600 px-4 py-2.5 rounded-sm text-xs font-semibold border border-stone-200/40">
                                            {amenity}
                                        </span>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Step-by-Step Booking Form */}
                <div className="lg:w-1/2">
                    <div className="bg-white p-8 rounded-sm shadow-xl border border-stone-200/40 lg:sticky lg:top-28">
                        <h2 className="text-xl font-serif font-light text-slate-800 mb-6 pb-3 border-b border-stone-100/60">Reserve Chamber</h2>
                        
                        {bookingMsg && (
                            <div className={`p-4 rounded-sm mb-6 text-xs font-semibold ${
                                bookingMsg.includes('confirmed') 
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-100/60' 
                                    : 'bg-rose-50 text-rose-800 border border-rose-100/60'
                            }`}>
                                {bookingMsg}
                            </div>
                        )}

                        <form onSubmit={handleBook} className="space-y-6">
                            {/* Step 1: Stay Details */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Step 1: Stay Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1.5 tracking-wider">Check-in Date</label>
                                        <input 
                                            type="date" 
                                            value={checkInDate} 
                                            onChange={(e) => setCheckInDate(e.target.value)} 
                                            required 
                                            className="w-full border border-stone-200/60 p-3 rounded-sm focus:ring-1 focus:ring-secondary/45 focus:border-secondary outline-none text-stone-700 bg-transparent text-xs font-semibold" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1.5 tracking-wider">Check-out Date</label>
                                        <input 
                                            type="date" 
                                            value={checkOutDate} 
                                            onChange={(e) => setCheckOutDate(e.target.value)} 
                                            required 
                                            className="w-full border border-stone-200/60 p-3 rounded-sm focus:ring-1 focus:ring-secondary/45 focus:border-secondary outline-none text-stone-700 bg-transparent text-xs font-semibold" 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1.5 tracking-wider">Number of Guests</label>
                                    <select 
                                        value={guests} 
                                        onChange={(e) => setGuests(Number(e.target.value))} 
                                        className="w-full border border-stone-200/60 p-3 rounded-sm focus:ring-1 focus:ring-secondary/45 focus:border-secondary outline-none text-stone-700 bg-transparent text-xs font-semibold cursor-pointer"
                                    >
                                        {Array.from({ length: room.capacity }, (_, i) => i + 1).map(num => (
                                            <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Step 2: Guest Details */}
                            <div className="space-y-4 pt-4 border-t border-stone-100/60">
                                <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Step 2: Guest Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1.5 tracking-wider">Full Name</label>
                                        <input 
                                            type="text" 
                                            placeholder="Vikash Kumawat"
                                            value={fullName} 
                                            onChange={(e) => setFullName(e.target.value)} 
                                            required 
                                            className="w-full border border-stone-200/60 p-3 rounded-sm focus:ring-1 focus:ring-secondary/45 focus:border-secondary outline-none text-stone-700 bg-transparent text-xs font-semibold" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1.5 tracking-wider">Email Address</label>
                                        <input 
                                            type="email" 
                                            placeholder="vikash@gmail.com"
                                            value={email} 
                                            onChange={(e) => setEmail(e.target.value)} 
                                            required 
                                            className="w-full border border-stone-200/60 p-3 rounded-sm focus:ring-1 focus:ring-secondary/45 focus:border-secondary outline-none text-stone-700 bg-transparent text-xs font-semibold" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1.5 tracking-wider">Phone Number</label>
                                        <input 
                                            type="tel" 
                                            placeholder="9876543210"
                                            value={phone} 
                                            onChange={(e) => setPhone(e.target.value)} 
                                            required 
                                            className="w-full border border-stone-200/60 p-3 rounded-sm focus:ring-1 focus:ring-secondary/45 focus:border-secondary outline-none text-stone-700 bg-transparent text-xs font-semibold" 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Step 3: ID Verification */}
                            <div className="space-y-4 pt-4 border-t border-stone-100/60">
                                <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Step 3: Identification Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1.5 tracking-wider">ID Type</label>
                                        <select 
                                            value={idType} 
                                            onChange={(e) => setIdType(e.target.value)} 
                                            className="w-full border border-stone-200/60 p-3 rounded-sm focus:ring-1 focus:ring-secondary/45 focus:border-secondary outline-none text-stone-700 bg-transparent text-xs font-semibold cursor-pointer"
                                        >
                                            <option value="Aadhaar">Aadhaar</option>
                                            <option value="Passport">Passport</option>
                                            <option value="Driving License">Driving License</option>
                                            <option value="Voter ID">Voter ID</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1.5 tracking-wider">ID Number</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. XXXX-XXXX-1234"
                                            value={idNumber} 
                                            onChange={(e) => setIdNumber(e.target.value)} 
                                            required 
                                            className="w-full border border-stone-200/60 p-3 rounded-sm focus:ring-1 focus:ring-secondary/45 focus:border-secondary outline-none text-stone-700 bg-transparent text-xs font-semibold" 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Step 4: Payment */}
                            <div className="space-y-4 pt-4 border-t border-stone-100/60">
                                <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Step 4: Payment Method</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {['UPI', 'Card', 'Cash'].map(method => (
                                        <label 
                                            key={method} 
                                            className={`border rounded-sm p-4 flex flex-col items-center justify-center text-center cursor-pointer transition select-none ${
                                                paymentMethod === method 
                                                    ? 'border-secondary bg-[#fbfaf7] text-secondary font-bold shadow-xs' 
                                                    : 'border-stone-200 text-stone-500 font-semibold hover:bg-[#fbfaf7]'
                                            }`}
                                        >
                                            <input 
                                                type="radio" 
                                                name="paymentMethod" 
                                                value={method} 
                                                checked={paymentMethod === method}
                                                onChange={() => setPaymentMethod(method)}
                                                className="sr-only"
                                            />
                                            <span className="text-xs uppercase tracking-widest font-semibold block">
                                                {method === 'Cash' ? 'Cash' : method}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Total Amount Display & Submit */}
                            <div className="pt-6 border-t border-stone-100/60 space-y-4">
                                <div className="flex justify-between items-center bg-[#fbfaf7] p-4 rounded-sm border border-stone-200/40">
                                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Estimated Total</span>
                                    <span className="text-2xl font-bold text-slate-800">${calculateTotalAmount()}</span>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={room.status !== 'Available' || isBooking} 
                                    className={`w-full py-4 rounded-sm font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-sm hover:shadow-md ${
                                        (room.status === 'Available' && !isBooking) 
                                            ? 'bg-primary text-white hover:bg-secondary cursor-pointer' 
                                            : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                                    }`}
                                >
                                    {isBooking ? 'Processing...' : (room.status === 'Available' ? 'Confirm Reservation' : 'Chamber Reserved')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetails;
