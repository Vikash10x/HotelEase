import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../pages/dashboards/AdminDashboard';
import CustomerDashboard from '../pages/dashboards/CustomerDashboard';
import ReceptionDashboard from '../pages/dashboards/ReceptionDashboard';
import HousekeepingDashboard from '../pages/dashboards/HousekeepingDashboard';
import ManagerDashboard from '../pages/dashboards/ManagerDashboard';
import ProtectedRoute from '../components/ProtectedRoute';

const DashboardRouter = () => {
    const role = localStorage.getItem('role');

    return (
        <ProtectedRoute>
            <Routes>
                {role === 'Admin' && <Route path="/*" element={<AdminDashboard />} />}
                {role === 'Customer' && <Route path="/*" element={<CustomerDashboard />} />}
                {role === 'Receptionist' && <Route path="/*" element={<ReceptionDashboard />} />}
                {role === 'Housekeeping Staff' && <Route path="/*" element={<HousekeepingDashboard />} />}
                {role === 'Manager' && <Route path="/*" element={<ManagerDashboard />} />}
                {/* Default fallback */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </ProtectedRoute>
    );
};

export default DashboardRouter;
