import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);

    const [showAddRoom, setShowAddRoom] = useState(false);
    const [roomList, setRoomList] = useState([]);
    const [roomData, setRoomData] = useState({ roomNumber: '', type: 'Single', price: '', capacity: '', description: '', imageUrl: '' });
    const [editingRoomId, setEditingRoomId] = useState(null);
    const [msg, setMsg] = useState('');

    const [showManageStaff, setShowManageStaff] = useState(false);
    const [staffList, setStaffList] = useState([]);
    const [staffData, setStaffData] = useState({ name: '', email: '', password: '', role: 'Receptionist', department: '', salary: '', shift: 'Morning' });
    const [editingStaffId, setEditingStaffId] = useState(null);

    const [showReports, setShowReports] = useState(false);
    const [bookingsReport, setBookingsReport] = useState([]);
    const [revenueReport, setRevenueReport] = useState([]);

    const fetchStaff = async () => {
        try {
            const { data } = await api.get('/staff');
            setStaffList(data);
        } catch (error) {
            console.error("Failed to load staff", error);
        }
    };

    const fetchRooms = async () => {
        try {
            const { data } = await api.get('/rooms');
            setRoomList(data);
        } catch (error) {
            console.error("Failed to load rooms", error);
        }
    };

    const fetchReportsData = async () => {
        try {
            const [bookingsRes, revenueRes] = await Promise.all([
                api.get('/reports/bookings'),
                api.get('/reports/revenue')
            ]);
            setBookingsReport(bookingsRes.data);
            setRevenueReport(revenueRes.data);
        } catch (error) {
            console.error("Failed to load reports", error);
        }
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/reports/dashboard');
                setStats(data);
            } catch (error) {
                console.error("Failed to load stats", error);
            }
        };
        fetchStats();
        fetchStaff();
        fetchRooms();
    }, []);

    const handleAddRoom = async (e) => {
        e.preventDefault();
        try {
            let selectedImage = roomData.imageUrl.trim();
            if (!selectedImage) {
                const typeLower = roomData.type.toLowerCase();
                if (typeLower.includes('single')) {
                    selectedImage = '/rooms/single.png';
                } else if (typeLower.includes('double')) {
                    selectedImage = '/rooms/double.png';
                } else if (typeLower.includes('deluxe')) {
                    selectedImage = '/rooms/deluxe.png';
                } else if (typeLower.includes('family')) {
                    selectedImage = '/rooms/family.png';
                } else if (typeLower.includes('suite')) {
                    selectedImage = '/rooms/suite.png';
                } else {
                    selectedImage = '/rooms/single.png';
                }
            }

            if (editingRoomId) {
                await api.put(`/rooms/${editingRoomId}`, {
                    ...roomData,
                    price: Number(roomData.price),
                    capacity: Number(roomData.capacity),
                    images: [selectedImage]
                });
                setMsg('Room updated successfully!');
            } else {
                await api.post('/rooms', {
                    ...roomData,
                    price: Number(roomData.price),
                    capacity: Number(roomData.capacity),
                    images: [selectedImage]
                });
                setMsg('Room added successfully!');
            }
            setRoomData({ roomNumber: '', type: 'Single', price: '', capacity: '', description: '', imageUrl: '' });
            setEditingRoomId(null);
            fetchRooms();
            const { data } = await api.get('/reports/dashboard');
            setStats(data);
        } catch (error) {
            setMsg(error.response?.data?.message || 'Failed to save room');
        }
    };

    const handleEditRoom = (room) => {
        setRoomData({
            roomNumber: room.roomNumber,
            type: room.type,
            price: room.price,
            capacity: room.capacity,
            description: room.description,
            imageUrl: room.images && room.images.length > 0 ? room.images[0] : ''
        });
        setEditingRoomId(room._id);
        setShowAddRoom(true);
        window.scrollTo({ top: 400, behavior: 'smooth' });
    };

    const handleDeleteRoom = async (id) => {
        if (!window.confirm("Are you sure you want to delete this room?")) return;
        try {
            await api.delete(`/rooms/${id}`);
            setMsg('Room deleted successfully!');
            fetchRooms();
            const { data } = await api.get('/reports/dashboard');
            setStats(data);
        } catch (error) {
            setMsg(error.response?.data?.message || 'Failed to delete room');
        }
    };

    const handleAddStaff = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = { ...staffData, salary: Number(staffData.salary) };
            if (editingStaffId && !dataToSend.password) {
                delete dataToSend.password; // Don't send empty password
            }

            if (editingStaffId) {
                await api.put(`/staff/${editingStaffId}`, dataToSend);
                setMsg('Staff member updated successfully!');
            } else {
                await api.post('/staff', dataToSend);
                setMsg('Staff member added successfully!');
            }
            setStaffData({ name: '', email: '', password: '', role: 'Receptionist', department: '', salary: '', shift: 'Morning' });
            setEditingStaffId(null);
            fetchStaff();
        } catch (error) {
            setMsg(error.response?.data?.message || 'Failed to save staff');
        }
    };

    const handleEditStaff = (staff) => {
        setStaffData({
            name: staff.user?.name || '',
            email: staff.user?.email || '',
            password: '',
            role: staff.user?.role || 'Receptionist',
            department: staff.department || '',
            salary: staff.salary || '',
            shift: staff.shift || 'Morning'
        });
        setEditingStaffId(staff._id);
        setShowManageStaff(true);
        window.scrollTo({ top: 400, behavior: 'smooth' });
    };

    const handleDeleteStaff = async (id) => {
        if (!window.confirm("Are you sure you want to delete this staff member?")) return;
        try {
            await api.delete(`/staff/${id}`);
            setMsg('Staff member deleted successfully!');
            fetchStaff();
        } catch (error) {
            setMsg(error.response?.data?.message || 'Failed to delete staff');
        }
    };

    return (
        <div className="pt-28 pb-24 px-6 md:px-8 max-w-7xl mx-auto font-sans bg-[#fbfaf7]">
            {/* Header */}
            <div className="mb-12 border-b border-stone-200/60 pb-8">
                <h1 className="font-serif text-4xl md:text-5xl text-primary tracking-wide font-normal">Property Operations</h1>
                <p className="text-xs uppercase tracking-widest text-stone-500 mt-2 font-medium">HotelEase Admin Control Portal</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

            {/* Notification messages */}
            {msg && (
                <div className="mt-8 bg-stone-100 text-stone-800 border-l-2 border-secondary py-3.5 px-4 text-sm uppercase tracking-wider font-medium flex justify-between items-center transition-all duration-300">
                    <span>{msg}</span>
                    <button onClick={() => setMsg('')} className="text-stone-400 hover:text-stone-900 ml-4 font-bold text-xs uppercase tracking-wider">Dismiss</button>
                </div>
            )}

            {/* Quick Actions Panel */}
            <div className="mt-12 bg-white p-8 border border-stone-200/60 shadow-sm">
                <h2 className="font-serif text-xl text-primary font-medium tracking-wide mb-6 uppercase">Console Actions</h2>
                <div className="flex flex-wrap gap-4">
                    <button 
                        onClick={() => { setShowAddRoom(!showAddRoom); setShowManageStaff(false); setShowReports(false); }} 
                        className={`px-6 py-3.5 rounded-none font-sans tracking-widest uppercase text-xs font-semibold transition-all duration-300 cursor-pointer ${
                            showAddRoom 
                                ? 'bg-secondary text-white shadow-sm' 
                                : 'border border-stone-300 text-stone-700 hover:border-stone-800 hover:bg-stone-50'
                        }`}
                    >
                        {showAddRoom ? 'Close Inventory' : 'Chamber Inventory'}
                    </button>
                    <button 
                        onClick={() => { setShowManageStaff(!showManageStaff); setShowAddRoom(false); setShowReports(false); }} 
                        className={`px-6 py-3.5 rounded-none font-sans tracking-widest uppercase text-xs font-semibold transition-all duration-300 cursor-pointer ${
                            showManageStaff 
                                ? 'bg-secondary text-white shadow-sm' 
                                : 'border border-stone-300 text-stone-700 hover:border-stone-800 hover:bg-stone-50'
                        }`}
                    >
                        {showManageStaff ? 'Close Staffing' : 'Staffing Roster'}
                    </button>
                    <button 
                        onClick={() => {
                            if (!showReports) fetchReportsData();
                            setShowReports(!showReports);
                            setShowAddRoom(false);
                            setShowManageStaff(false);
                        }} 
                        className={`px-6 py-3.5 rounded-none font-sans tracking-widest uppercase text-xs font-semibold transition-all duration-300 cursor-pointer ${
                            showReports 
                                ? 'bg-secondary text-white shadow-sm' 
                                : 'border border-stone-300 text-stone-700 hover:border-stone-800 hover:bg-stone-50'
                        }`}
                    >
                        {showReports ? 'Close Reports' : 'Financial Reports'}
                    </button>
                </div>
            </div>

            {/* Manage Rooms Panel */}
            {showAddRoom && (
                <div className="mt-8 bg-white p-8 border border-stone-200/60 shadow-sm transition-all duration-300">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-stone-100">
                        <h2 className="font-serif text-2xl text-primary tracking-wide font-normal">
                            {editingRoomId ? 'Modify Selection' : 'Register New Chamber'}
                        </h2>
                        {editingRoomId && (
                            <button 
                                onClick={() => { 
                                    setEditingRoomId(null); 
                                    setRoomData({ roomNumber: '', type: 'Single', price: '', capacity: '', description: '', imageUrl: '' }); 
                                }} 
                                className="text-xs uppercase tracking-wider text-stone-500 hover:text-stone-900 border-b border-stone-300 hover:border-stone-950 pb-0.5 font-semibold transition-colors duration-200"
                            >
                                Cancel Modification
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleAddRoom} className="mb-12 bg-[#faf9f6] p-6 border border-stone-200/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">Chamber Identity / Number</label>
                                <input 
                                    type="text" 
                                    value={roomData.roomNumber} 
                                    onChange={(e) => setRoomData({ ...roomData, roomNumber: e.target.value })} 
                                    required 
                                    className="w-full bg-white border border-stone-200 px-4 py-3 text-sm font-sans focus:outline-none focus:border-stone-800 transition-colors duration-200" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">Chamber Classification</label>
                                <select 
                                    value={roomData.type} 
                                    onChange={(e) => setRoomData({ ...roomData, type: e.target.value })} 
                                    className="w-full bg-white border border-stone-200 px-4 py-3 text-sm font-sans focus:outline-none focus:border-stone-800 transition-colors duration-200"
                                >
                                    <option value="Single">Single Room</option>
                                    <option value="Double">Double Room</option>
                                    <option value="Deluxe">Deluxe Suite</option>
                                    <option value="Family">Family Villa</option>
                                    <option value="Presidential Suite">Presidential Suite</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">Tariff Rate ($ / night)</label>
                                <input 
                                    type="number" 
                                    value={roomData.price} 
                                    onChange={(e) => setRoomData({ ...roomData, price: e.target.value })} 
                                    required 
                                    className="w-full bg-white border border-stone-200 px-4 py-3 text-sm font-sans focus:outline-none focus:border-stone-800 transition-colors duration-200" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">Maximum Occupancy</label>
                                <input 
                                    type="number" 
                                    value={roomData.capacity} 
                                    onChange={(e) => setRoomData({ ...roomData, capacity: e.target.value })} 
                                    required 
                                    className="w-full bg-white border border-stone-200 px-4 py-3 text-sm font-sans focus:outline-none focus:border-stone-800 transition-colors duration-200" 
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">Image Resource URL (Optional)</label>
                                <input 
                                    type="text" 
                                    placeholder="Leave empty for premium system presets" 
                                    value={roomData.imageUrl} 
                                    onChange={(e) => setRoomData({ ...roomData, imageUrl: e.target.value })} 
                                    className="w-full bg-white border border-stone-200 px-4 py-3 text-sm font-sans focus:outline-none focus:border-stone-800 transition-colors duration-200 placeholder:text-stone-300" 
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">Chamber Description</label>
                                <textarea 
                                    value={roomData.description} 
                                    onChange={(e) => setRoomData({ ...roomData, description: e.target.value })} 
                                    required 
                                    rows="3"
                                    className="w-full bg-white border border-stone-200 px-4 py-3 text-sm font-sans focus:outline-none focus:border-stone-800 transition-colors duration-200"
                                ></textarea>
                            </div>
                        </div>
                        <div className="mt-6">
                            <button 
                                type="submit" 
                                className="bg-primary hover:bg-stone-800 text-white px-8 py-3.5 font-sans tracking-widest uppercase text-xs font-semibold transition-colors duration-200 cursor-pointer"
                            >
                                {editingRoomId ? 'Commit Update' : 'Publish Chamber'}
                            </button>
                        </div>
                    </form>

                    {/* Rooms List Table */}
                    <div>
                        <h3 className="font-serif text-xl text-primary tracking-wide mb-4 uppercase">Chambers Catalog</h3>
                        <div className="overflow-x-auto border border-stone-200/60">
                            <table className="w-full text-left border-collapse bg-white">
                                <thead>
                                    <tr className="bg-stone-50 border-b border-stone-200">
                                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Room No.</th>
                                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Classification</th>
                                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Tariff Rate</th>
                                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Limit</th>
                                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {roomList.map((room) => (
                                        <tr key={room._id} className="hover:bg-stone-50/50 transition-colors">
                                            <td className="p-4 font-serif text-base font-normal text-stone-900">{room.roomNumber}</td>
                                            <td className="p-4 text-sm tracking-wide text-stone-600 font-medium">{room.type}</td>
                                            <td className="p-4 font-serif text-base text-[#4b6351] font-semibold">${room.price}</td>
                                            <td className="p-4 text-sm text-stone-600 font-light">{room.capacity} Guest(s)</td>
                                            <td className="p-4 text-right space-x-2 whitespace-nowrap">
                                                <button 
                                                    onClick={() => handleEditRoom(room)} 
                                                    className="bg-white border border-stone-200 hover:border-stone-800 text-stone-700 hover:text-stone-900 px-4 py-2 font-sans text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteRoom(room._id)} 
                                                    className="bg-white border border-stone-200 hover:border-red-600 text-stone-500 hover:text-red-600 px-4 py-2 font-sans text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {roomList.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-sm tracking-wide text-stone-400 font-light uppercase">No properties available.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Manage Staff Panel */}
            {showManageStaff && (
                <div className="mt-8 bg-white p-8 border border-stone-200/60 shadow-sm transition-all duration-300">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-stone-100">
                        <h2 className="font-serif text-2xl text-primary tracking-wide font-normal">
                            {editingStaffId ? 'Edit Team Member' : 'Team Roster Management'}
                        </h2>
                        {editingStaffId && (
                            <button 
                                onClick={() => { 
                                    setEditingStaffId(null); 
                                    setStaffData({ name: '', email: '', password: '', role: 'Receptionist', department: '', salary: '', shift: 'Morning' }); 
                                }} 
                                className="text-xs uppercase tracking-wider text-stone-500 hover:text-stone-900 border-b border-stone-300 hover:border-stone-950 pb-0.5 font-semibold transition-colors duration-200"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>

                    {/* Add/Edit Staff Form */}
                    <form onSubmit={handleAddStaff} className="mb-12 bg-[#faf9f6] p-6 border border-stone-200/50">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">Full Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter employee name" 
                                    value={staffData.name} 
                                    onChange={e => setStaffData({ ...staffData, name: e.target.value })} 
                                    required 
                                    className="w-full bg-white border border-stone-200 px-4 py-3 text-sm font-sans focus:outline-none focus:border-stone-800 transition-colors duration-200 placeholder:text-stone-300" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">Email Identity</label>
                                <input 
                                    type="email" 
                                    placeholder="employee@hotelease.com" 
                                    value={staffData.email} 
                                    onChange={e => setStaffData({ ...staffData, email: e.target.value })} 
                                    required 
                                    className="w-full bg-white border border-stone-200 px-4 py-3 text-sm font-sans focus:outline-none focus:border-stone-800 transition-colors duration-200 placeholder:text-stone-300" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">Access Credentials</label>
                                <input 
                                    type="password" 
                                    placeholder={editingStaffId ? "Retain current credential" : "Create password"} 
                                    value={staffData.password} 
                                    onChange={e => setStaffData({ ...staffData, password: e.target.value })} 
                                    required={!editingStaffId} 
                                    className="w-full bg-white border border-stone-200 px-4 py-3 text-sm font-sans focus:outline-none focus:border-stone-800 transition-colors duration-200 placeholder:text-stone-300" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">Assigned Roster Role</label>
                                <select 
                                    value={staffData.role} 
                                    onChange={e => setStaffData({ ...staffData, role: e.target.value })} 
                                    className="w-full bg-white border border-stone-200 px-4 py-3 text-sm font-sans focus:outline-none focus:border-stone-800 transition-colors duration-200"
                                >
                                    <option value="Receptionist">Reception Desk Officer</option>
                                    <option value="Housekeeping Staff">Housekeeping Supervisor</option>
                                    <option value="Manager">Estate General Manager</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">Department Division</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Concierge, Operations" 
                                    value={staffData.department} 
                                    onChange={e => setStaffData({ ...staffData, department: e.target.value })} 
                                    required 
                                    className="w-full bg-white border border-stone-200 px-4 py-3 text-sm font-sans focus:outline-none focus:border-stone-800 transition-colors duration-200 placeholder:text-stone-300" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">Compensation Salary ($)</label>
                                <input 
                                    type="number" 
                                    placeholder="Annual or monthly rate" 
                                    value={staffData.salary} 
                                    onChange={e => setStaffData({ ...staffData, salary: e.target.value })} 
                                    required 
                                    className="w-full bg-white border border-stone-200 px-4 py-3 text-sm font-sans focus:outline-none focus:border-stone-800 transition-colors duration-200 placeholder:text-stone-300" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">Duty Shift</label>
                                <select 
                                    value={staffData.shift} 
                                    onChange={e => setStaffData({ ...staffData, shift: e.target.value })} 
                                    className="w-full bg-white border border-stone-200 px-4 py-3 text-sm font-sans focus:outline-none focus:border-stone-800 transition-colors duration-200"
                                >
                                    <option value="Morning">Morning Shift (06:00 - 14:00)</option>
                                    <option value="Evening">Evening Shift (14:00 - 22:00)</option>
                                    <option value="Night">Night Shift (22:00 - 06:00)</option>
                                </select>
                            </div>
                            <div className="md:col-span-2 flex items-end">
                                <button 
                                    type="submit" 
                                    className="w-full bg-primary hover:bg-stone-800 text-white px-6 py-3.5 font-sans tracking-widest uppercase text-xs font-semibold transition-colors duration-200 cursor-pointer"
                                >
                                    {editingStaffId ? 'Confirm Updates' : 'Induct Staff Member'}
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Staff List Table */}
                    <div>
                        <h3 className="font-serif text-xl text-primary tracking-wide mb-4 uppercase">Staff Directory</h3>
                        <div className="overflow-x-auto border border-stone-200/60">
                            <table className="w-full text-left border-collapse bg-white">
                                <thead>
                                    <tr className="bg-stone-50 border-b border-stone-200">
                                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Name</th>
                                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Roster Role</th>
                                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Department</th>
                                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Duty Shift</th>
                                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Salary</th>
                                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {staffList.map((staff) => (
                                        <tr key={staff._id} className="hover:bg-stone-50/50 transition-colors">
                                            <td className="p-4 font-serif text-base font-normal text-stone-900">{staff.user?.name}</td>
                                            <td className="p-4 text-sm tracking-wide text-stone-600 font-light">{staff.user?.role}</td>
                                            <td className="p-4 text-sm text-stone-600">{staff.department}</td>
                                            <td className="p-4 text-sm text-stone-600 font-medium">{staff.shift}</td>
                                            <td className="p-4 font-serif text-base text-[#4b6351] font-semibold">${staff.salary.toLocaleString()}</td>
                                            <td className="p-4 text-right space-x-2 whitespace-nowrap">
                                                <button 
                                                    onClick={() => handleEditStaff(staff)} 
                                                    className="bg-white border border-stone-200 hover:border-stone-800 text-stone-700 hover:text-stone-900 px-4 py-2 font-sans text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteStaff(staff._id)} 
                                                    className="bg-white border border-stone-200 hover:border-red-600 text-stone-500 hover:text-red-600 px-4 py-2 font-sans text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {staffList.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="p-8 text-center text-sm tracking-wide text-stone-400 font-light uppercase">No staff members enrolled.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Reports Panel */}
            {showReports && (
                <div className="mt-8 bg-white p-8 border border-stone-200/60 shadow-sm transition-all duration-300">
                    <div className="border-b border-stone-200 pb-4 mb-8">
                        <h2 className="font-serif text-3xl text-primary tracking-wide font-normal uppercase">Hotel Performance Reports</h2>
                    </div>

                    <h3 className="font-serif text-xl text-primary tracking-wide mb-4 uppercase">Recent Reservations</h3>
                    <div className="overflow-x-auto border border-stone-200/60 mb-12">
                        <table className="w-full text-left border-collapse bg-white">
                            <thead>
                                <tr className="bg-stone-50 border-b border-stone-200">
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Guest</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Chamber</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Arrive</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Depart</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Status</th>
                                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-stone-500 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {bookingsReport.slice(0, 8).map((booking) => (
                                    <tr key={booking._id} className="hover:bg-stone-50/50 transition-colors">
                                        <td className="p-4 font-serif text-base font-normal text-stone-900">{booking.customer?.name}</td>
                                        <td className="p-4 text-sm font-mono text-stone-600">{booking.room?.roomNumber}</td>
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

                    <h3 className="font-serif text-xl text-primary tracking-wide mb-4 uppercase">Revenue Transactions</h3>
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
                                {revenueReport.slice(0, 8).map((payment) => (
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
                                        <td colSpan="5" className="p-8 text-center text-sm tracking-wide text-stone-400 font-light uppercase">No records found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;


