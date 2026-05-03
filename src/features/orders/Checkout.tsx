import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import { clearCart } from '../cart/cartSlice';
import api from '../../api/client';
import { useNavigate } from 'react-router-dom';
import { Container, Stepper, Step, StepLabel, Paper, TextField, Button, Typography, Box, Alert, Divider, Stack, Grid } from '@mui/material';
import CheckCircle from '@mui/icons-material/CheckCircle';

export default function Checkout() {
  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [address, setAddress] = useState({ street: '', city: '', zip: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleAddressNext = () => {
    if (!address.street || !address.city || !address.zip) {
      setError('Please fill in all shipping details.');
      return;
    }
    setError(null);
    setActiveStep(1);
  };

  const handlePaymentSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // Security Improvement: Only send productId and quantity
      await api.post('/orders', {
        items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
        shippingAddress: address,
      });
      dispatch(clearCart());
      setActiveStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while placing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Shipping', 'Payment', 'Success'];

  if (items.length === 0 && activeStep !== 2) {
    return (
      <Container sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h5">Your cart is empty. Please add items before checking out.</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/')}>Back to Shop</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 6, pb: 8 }}>
      <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 'bold' }}>Checkout</Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
        {steps.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
      </Stepper>

      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

      {activeStep === 0 && (
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>Shipping Address</Typography>
              <Stack spacing={3}>
                <TextField 
                  fullWidth 
                  label="Street Address" 
                  value={address.street} 
                  onChange={e => setAddress({...address, street: e.target.value})} 
                />
                <Stack direction="row" spacing={2}>
                  <TextField 
                    fullWidth 
                    label="City" 
                    value={address.city} 
                    onChange={e => setAddress({...address, city: e.target.value})} 
                  />
                  <TextField 
                    fullWidth 
                    label="ZIP Code" 
                    value={address.zip} 
                    onChange={e => setAddress({...address, zip: e.target.value})} 
                  />
                </Stack>
                <Button variant="contained" size="large" onClick={handleAddressNext} sx={{ mt: 2, height: 48 }}>
                  Continue to Payment
                </Button>
              </Stack>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#fbfbfb' }}>
              <Typography variant="h6" gutterBottom>Order Summary</Typography>
              <Divider sx={{ mb: 2 }} />
              {items.map(item => (
                <Box key={item.productId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{item.name} x {item.quantity}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>₹{(item.price * item.quantity).toFixed(2)}</Typography>
                </Box>
              ))}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary.main">₹{total.toFixed(2)}</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeStep === 1 && (
        <Paper sx={{ p: 4, mx: 'auto', borderRadius: 3, maxWidth: 500 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>Payment Information</Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            This is a demonstration. No real payment will be processed.
          </Alert>
          <Stack spacing={3}>
            <TextField fullWidth label="Card Number" placeholder="4242 4242 4242 4242" />
            <Stack direction="row" spacing={2}>
              <TextField fullWidth label="Expiry Date" placeholder="MM/YY" />
              <TextField fullWidth label="CVV" placeholder="123" />
            </Stack>
            <Box sx={{ mt: 2, p: 2, border: '1px dashed #ccc', borderRadius: 2 }}>
              <Typography variant="subtitle1" align="center">
                Amount to be charged: <strong>₹{total.toFixed(2)}</strong>
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <Button fullWidth variant="outlined" onClick={() => setActiveStep(0)} disabled={loading}>Back</Button>
              <Button 
                fullWidth 
                variant="contained" 
                color="success" 
                onClick={handlePaymentSubmit} 
                disabled={loading}
                sx={{ height: 48 }}
              >
                {loading ? 'Processing...' : 'Complete Order'}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}

      {activeStep === 2 && (
        <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 4 }}>
          <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>Thank You!</Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Your order has been placed successfully and is now being processed.
          </Typography>
          <Button variant="contained" size="large" onClick={() => navigate('/orders')} sx={{ height: 48, px: 4 }}>
            View Order History
          </Button>
        </Paper>
      )}
    </Container>
  );
}
