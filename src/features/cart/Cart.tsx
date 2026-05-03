import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../store/store';
import { updateQuantity, removeFromCart } from './cartSlice';
import { Link } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, IconButton, TextField, Button, Paper, Box, Divider, Avatar, Stack, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function Cart() {
  const { items } = useAppSelector((state) => state.cart);
  const dispatch = useDispatch();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (productId: string, val: string) => {
    const quantity = parseInt(val);
    if (isNaN(quantity) || quantity < 1) {
      return;
    }
    dispatch(updateQuantity({ productId, quantity }));
  };

  if (items.length === 0) {
    return (
      <Container sx={{ mt: 10, textAlign: 'center' }}>
        <ShoppingBagIcon sx={{ fontSize: 100, color: '#eee', mb: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>Your cart is empty</Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>Looks like you haven't added anything to your cart yet.</Typography>
        <Button component={Link} to="/" variant="contained" size="large">Start Shopping</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 6, pb: 8 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Your Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
      </Typography>
      
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ border: '1px solid #eee', borderRadius: 3, overflow: 'hidden' }}>
            <List disablePadding>
              {items.map((item, index) => (
                <Box key={item.productId}>
                  <ListItem sx={{ p: 3, alignItems: 'flex-start' }}>
                    <Avatar 
                      src={item.image} 
                      variant="rounded" 
                      sx={{ width: 100, height: 100, mr: 3, bgcolor: '#f5f5f5' }}
                    >
                      {item.name[0]}
                    </Avatar>
                    <ListItemText 
                      primary={
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{item.name}</Typography>
                      } 
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 'bold' }}>
                            ₹{item.price}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">Unit Price</Typography>
                        </Box>
                      } 
                    />
                    <Stack direction="column" alignItems="flex-end" spacing={1}>
                      <TextField
                        label="Qty"
                        type="number"
                        size="small"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                        sx={{ width: 70 }}
                        slotProps={{ htmlInput: { min: 1, style: { textAlign: 'center' } } }}
                      />
                      <IconButton 
                        onClick={() => dispatch(removeFromCart(item.productId))} 
                        color="error" 
                        size="small"
                        title="Remove item"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </ListItem>
                  {index < items.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #eee', borderRadius: 3, bgcolor: '#fafafa', position: 'sticky', top: 20 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Order Summary</Typography>
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography>₹{total.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Shipping</Typography>
                <Typography color="success.main">FREE</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  ₹{total.toFixed(2)}
                </Typography>
              </Box>
            </Stack>
            <Button 
              component={Link} 
              to="/checkout" 
              variant="contained" 
              fullWidth 
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{ height: 56, borderRadius: 2 }}
            >
              Checkout
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
              Shipping and taxes calculated at checkout
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
