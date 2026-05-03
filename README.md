# Enterprise E-Commerce Platform

A robust, full-stack e-commerce solution designed with a focus on security, performance, and scalable architecture. This platform supports multi-role interactions, allowing sellers, employees, and buyers to engage in a seamless commercial ecosystem.

## Project Workflow

### 1. Authentication and Security
The platform implements a secure authentication system using HTTP-only cookies to mitigate XSS attacks.
- **JWT Implementation**: Short-lived access tokens combined with refresh token rotation.
- **Role-Based Access Control (RBAC)**: Distinct permissions for Sellers, Employees, and Buyers.
- **Silent Refresh**: Axios interceptors handle token expiration automatically without interrupting the user experience.

### 2. Product Management
- **Catalog Browsing**: Optimized product listing with debounced search functionality to reduce server load.
- **Inventory Control**: Sellers and authorized employees can manage stock levels, pricing, and product metadata.
- **Atomic Updates**: Inventory changes are handled atomically to prevent overselling during high-traffic periods.

### 3. Transactional Flow
- **Cart Logic**: Client-side state management for immediate responsiveness.
- **Secure Checkout**: All price calculations and stock verifications are performed on the server side to prevent price manipulation and ensure data integrity.
- **Order Tracking**: Real-time status updates from 'pending' to 'delivered'.

### 4. Analytical Dashboards
- **Seller Insights**: High-level metrics including total revenue, order counts, and product performance.
- **Buyer History**: Detailed overview of past transactions and shipment statuses.

## Project Structure

```text
├── server/                 # Backend Node.js/Express application
│   ├── controllers/        # Business logic and request handling
│   ├── middleware/         # Authentication, authorization, and error handling
│   ├── models/             # Mongoose schemas and database models
│   ├── routes/             # API endpoint definitions
│   ├── utils/              # Zod validation schemas and utility functions
│   └── server.ts           # Server initialization and entry point
├── src/                    # Frontend React application
│   ├── api/                # Axios configuration and API interceptors
│   ├── components/         # Reusable UI components
│   ├── features/           # Modularized feature logic (Auth, Cart, Orders, Products)
│   ├── store/              # Redux Toolkit state management
│   ├── App.tsx             # Root component and routing
│   └── main.tsx            # React application entry point
├── package.json            # Project dependencies and scripts
└── vite.config.ts          # Frontend build and proxy configuration
```

## Configuration

### Backend Environment Variables
Create a `.env` file in the root directory for backend configuration:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secure_access_token_secret
REFRESH_TOKEN_SECRET=your_secure_refresh_token_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend Environment Variables
Create a `.env` file in the root directory for frontend configuration:

```env
VITE_API_URL=http://localhost:5000/api
```

## Technology Stack

- **Frontend**: React, TypeScript, Vite, Redux Toolkit, Material-UI, Axios.
- **Backend**: Node.js, Express, TypeScript, MongoDB (Mongoose), Zod.
- **Security**: JWT (HttpOnly Cookies), Refresh Token Rotation, Server-side price verification.

## Proof of Work
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/50eb2ba7-0fc7-4f73-a75b-9d3466d1b50f" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/152cdd55-707d-453b-9369-53894205ff97" />
<img width="1917" height="1032" alt="image" src="https://github.com/user-attachments/assets/50e51ceb-1458-4b35-8b72-f7038c61e68c" />
