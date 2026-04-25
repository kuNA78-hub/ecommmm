import { useEffect, useState } from 'react';
import api from '../../api/client';
import { Container, Paper, Typography, Box, MenuItem, Select, FormControl } from '@mui/material';

interface Order {
  _id: string;
  buyerId: { name: string; email: string };
  totalAmount: number;
  status: string;
  createdAt: string;
  items: any[];
}

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await api.get('/orders/seller');
    setOrders(res.data);
  };

  const updateStatus = async (id: string, status: string) => {
    await api.put(`/orders/${id}/status`, { status });
    fetchOrders();
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Orders</Typography>
      {orders.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>No orders yet.</Paper>
      ) : (
        orders.map(order => (
          <Paper key={order._id} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Order #{order._id.slice(-6)}</Typography>
              <FormControl size="small">
                <Select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  sx={{
                    fontSize: '0.875rem',
                    '& .MuiSelect-select': {
                      py: 0.5,
                      px: 1.5,
                      borderRadius: 1,
                      bgcolor: order.status === 'delivered' ? '#dcfce7' : order.status === 'shipped' ? '#dbeafe' : '#fef3c7',
                      color: order.status === 'delivered' ? '#166534' : order.status === 'shipped' ? '#1e40af' : '#92400e',
                    }
                  }}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="shipped">Shipped</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              Buyer: {order.buyerId?.name} ({order.buyerId?.email})
            </Typography>
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