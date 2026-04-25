import { useEffect, useState } from 'react';
import api from '../../api/client';
import { Container, Paper, Typography, Box } from '@mui/material';

interface Order {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: any[];
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await api.get('/orders/me');
    setOrders(res.data);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>My Orders</Typography>
      {orders.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>No orders yet.</Paper>
      ) : (
        orders.map(order => (
          <Paper key={order._id} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Order #{order._id.slice(-6)}</Typography>
              <Typography
                variant="caption"
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  bgcolor: order.status === 'delivered' ? '#dcfce7' : order.status === 'shipped' ? '#dbeafe' : '#fef3c7',
                  color: order.status === 'delivered' ? '#166534' : order.status === 'shipped' ? '#1e40af' : '#92400e',
                  fontWeight: 'medium'
                }}
              >
                {order.status}
              </Typography>
            </Box>
            <Box sx={{ mb: 1 }}>
              {order.items.map((item, idx) => (
                <Typography key={idx} variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item.name} x {item.quantity}</span>
                  <span>${item.price}</span>
                </Typography>
              ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, pt: 1, borderTop: '1px solid #e5e7eb' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>{new Date(order.createdAt).toLocaleDateString()}</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Total: ${order.totalAmount}</Typography>
            </Box>
          </Paper>
        ))
      )}
    </Container>
  );
}