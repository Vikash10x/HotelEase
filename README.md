# HotelEase - MERN Stack Hotel Management System

## Overview
HotelEase is a complete full-stack MERN (MongoDB, Express, React, Node.js) Hotel Management System. It features role-based access for Admin, Receptionist, Customer, Housekeeping Staff, and Manager.

## Features
- JWT Authentication & Role-based Access Control
- Room Management (CRUD, Availability)
- Booking Management & Checkout System
- Role-specific Dashboards
- Modern, Premium UI using Tailwind CSS
- Fully Responsive Design

## Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS, React Router, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt

## Installation Steps

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and configure it (a default is provided in the code).
4. Start the development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (if Vite initialization failed to complete `npm install` previously, run it again):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Deployment Guide
- **Frontend (Vercel)**: Push to GitHub, import the repository into Vercel, set root directory to `frontend`. Update the base API URL in `axios.js`.
- **Backend (Render)**: Push to GitHub, import into Render as Web Service, set root directory to `backend`, set env vars (`MONGO_URI`, `JWT_SECRET`).
- **Database (MongoDB Atlas)**: Create a cluster, get the connection URI, whitelist IP, and add to Render's Env vars.

## Architecture & Structure
Clean and maintainable code architecture dividing concerns cleanly between models, controllers, routes, middleware, and frontend components.

*Enjoy building and managing with HotelEase!*
# HotelEase
