import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import { clearCart } from '../cart/cartSlice';
import api from '../../api/client';
import { useNavigate } from 'react-router-dom';
import { Container, Stepper, Step, StepLabel, Paper, TextField, Button, Typography, Box, Alert } from '@mui/material';

export default function Checkout() {
  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [address, setAddress] = useState({ street: '', city: '', zip: '' });
  const [loading, setLoading] = useState(false);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleAddressNext = () => setActiveStep(1);
  const handlePaymentSubmit = async () => {
    setLoading(true);
    try {
      await api.post('/orders', {
        items: items.map(i => ({ productId: i.productId, name: i.name, price: i.price, quantity: i.quantity })),
        totalAmount: total,
        shippingAddress: address,
      });
      dispatch(clearCart());
      setActiveStep(2);
    } catch {
      alert('Order failed');
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Shipping Address', 'Payment', 'Confirmation'];

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
      </Stepper>

      {activeStep === 0 && (
        <Paper sx={{ p: 3 }}>
          <TextField fullWidth label="Street" margin="normal" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
          <TextField fullWidth label="City" margin="normal" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
          <TextField fullWidth label="ZIP" margin="normal" value={address.zip} onChange={e => setAddress({...address, zip: e.target.value})} />
          <Button variant="contained" onClick={handleAddressNext} sx={{ mt: 2 }}>Continue</Button>
        </Paper>
      )}

      {activeStep === 1 && (
        <Paper sx={{ p: 3 }}>
          <Alert severity="info" sx={{ mb: 2 }}>Demo mode – no real payment</Alert>
          <TextField fullWidth label="Card Number" margin="normal" placeholder="4242 4242 4242 4242" />
          <TextField fullWidth label="Expiry" margin="normal" placeholder="MM/YY" />
          <TextField fullWidth label="CVV" margin="normal" />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
            <Button variant="contained" color="success" onClick={handlePaymentSubmit} disabled={loading}>
              {loading ? 'Processing...' : 'Place Order'}
            </Button>
          </Box>
        </Paper>
      )}

      {activeStep === 2 && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" color="green">Order placed successfully!</Typography>
          <Button variant="contained" onClick={() => navigate('/orders')} sx={{ mt: 2 }}>View Orders</Button>
        </Paper>
      )}
    </Container>
  );
}
