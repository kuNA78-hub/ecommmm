import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../store/store';
import { updateQuantity, removeFromCart } from './cartSlice';
import { Link } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, IconButton, TextField, Button, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Cart() {
  const { items } = useAppSelector((state) => state.cart);
  const dispatch = useDispatch();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5">Your cart is empty</Typography>
        <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>Continue Shopping</Button>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Shopping Cart</Typography>
      <List>
        {items.map(item => (
          <ListItem key={item.productId} divider>
            <ListItemText primary={item.name} secondary={`$${item.price}`} />
            <TextField
              type="number"
              size="small"
              value={item.quantity}
              onChange={(e) => dispatch(updateQuantity({ productId: item.productId, quantity: parseInt(e.target.value) }))}
              sx={{ width: 80, mx: 2 }}
              slotProps={{ htmlInput: { min: 1 } }}
            />
            <IconButton onClick={() => dispatch(removeFromCart(item.productId))} color="error">
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
        <Button component={Link} to="/checkout" variant="contained" color="primary" sx={{ mt: 2 }}>
          Proceed to Checkout
        </Button>
      </Paper>
    </Container>
  );
}
