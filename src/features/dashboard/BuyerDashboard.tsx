import { useEffect, useState } from 'react';
import api from '../../api/client';
import { Container, Grid, Paper, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

interface Order {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function BuyerDashboard() {
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ totalSpent: 0, orderCount: 0 });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await api.get('/orders/me');
    const orders = res.data;
    setRecentOrders(orders.slice(0, 5));
    const totalSpent = orders.reduce((sum: number, o: Order) => sum + o.totalAmount, 0);
    setStats({ totalSpent, orderCount: orders.length });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>My Dashboard</Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Total Spent</Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>${stats.totalSpent}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Orders Placed</Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{stats.orderCount}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mb: 2 }}>Recent Orders</Typography>
      {recentOrders.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          No orders yet. <Button component={Link} to="/">Start Shopping</Button>
        </Paper>
      ) : (
        recentOrders.map(order => (
          <Paper key={order._id} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontWeight: 'medium' }}>Order #{order._id.slice(-6)}</Typography>
              <Typography sx={{ fontWeight: 'bold' }}>${order.totalAmount}</Typography>
              <Typography
                variant="caption"
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  bgcolor: order.status === 'delivered' ? '#dcfce7' : order.status === 'shipped' ? '#dbeafe' : '#fef3c7',
                  color: order.status === 'delivered' ? '#166534' : order.status === 'shipped' ? '#1e40af' : '#92400e',
                  textTransform: 'capitalize'
                }}
              >
                {order.status}
              </Typography>
            </Box>
          </Paper>
        ))
      )}
      <Button component={Link} to="/orders" variant="outlined" sx={{ mt: 2 }}>View All Orders</Button>
    </Container>
  );
}