import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './store/store';
import Navbar from './components/Navbar';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import ProductList from './features/products/ProductList';
import Cart from './features/cart/Cart';
import Checkout from './features/orders/Checkout';
import SellerDashboard from './features/dashboard/SellerDashboard';
import BuyerDashboard from './features/dashboard/BuyerDashboard';
import Inventory from './features/products/Inventory';
import OrdersList from './features/orders/OrdersList';
import OrderHistory from './features/orders/OrderHistory';
import Profile from './features/profile/Profile';
import ProductDetail from './features/products/ProductDetail';
import type { JSX } from 'react';

function ProtectedRoute({ children, roles }: { children: JSX.Element; roles?: string[] }) {
  const { user } = useAppSelector((state) => state.auth);
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
}

function App() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProductList />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute roles={['buyer']}><Cart /></ProtectedRoute>} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<ProtectedRoute roles={['buyer']}><Checkout /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute roles={['buyer']}><OrderHistory /></ProtectedRoute>} />
        <Route path="/seller/dashboard" element={
          <ProtectedRoute roles={['seller', 'employee']}>
            {user?.role === 'buyer' ? <Navigate to="/" /> : <SellerDashboard />}
          </ProtectedRoute>
        } />
        <Route path="/buyer/dashboard" element={
          <ProtectedRoute roles={['buyer']}>
            <BuyerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/seller/inventory" element={<ProtectedRoute roles={['seller', 'employee']}><Inventory /></ProtectedRoute>} />
        <Route path="/seller/orders" element={<ProtectedRoute roles={['seller', 'employee']}><OrdersList /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
