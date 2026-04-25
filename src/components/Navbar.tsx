import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Badge } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/store';
import { useState } from 'react';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleClose();
  };
  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

  if (!user) {
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>E‑Commerce</Typography>
          <Button color="inherit" component={Link} to="/login">Login</Button>
          <Button color="inherit" component={Link} to="/register">Register</Button>
        </Toolbar>
      </AppBar>
    );
  }

  const isSeller = user.role === 'seller' || user.role === 'employee';
  const isBuyer = user.role === 'buyer';

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>E‑Commerce</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isSeller && (
            <Button color="inherit" component={Link} to="/seller/dashboard">Dashboard</Button>
          )}
          {isBuyer && (
            <>
              <Button color="inherit" component={Link} to="/">Shop</Button>
              <Button color="inherit" component={Link} to="/buyer/dashboard">My Dashboard</Button>
              <Button color="inherit" component={Link} to="/orders">My Orders</Button>
              <IconButton color="inherit" component={Link} to="/cart">
                <Badge badgeContent={cartCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </>
          )}
          <IconButton color="inherit" onClick={handleMenu}>
            <AccountCircle />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={handleProfile}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
