import { useEffect, useState } from 'react';
import api from '../../api/client';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { Container, Grid, Paper, Typography, Button, Box, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Alert } from '@mui/material';

export default function SellerDashboard() {
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, revenue: 0 });
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    api.get('/dashboard/stats').then(res => setStats(res.data));
  }, []);

  const handleInvite = async () => {
    try {
      const res = await api.post('/invitations', { email: inviteEmail });
      setInviteLink(res.data.inviteLink);
    } catch (err) {
      alert('Failed to send invite');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Seller Dashboard</Typography>
        <Box>
          <Button component={Link} to="/seller/inventory" variant="contained" sx={{ mr: 2 }}>Manage Products</Button>
          <Button component={Link} to="/seller/orders" variant="outlined" sx={{ mr: 2 }}>View Orders</Button>
          {user?.role === 'seller' && (
            <Button variant="contained" color="secondary" onClick={() => setInviteOpen(true)}>Invite Employee</Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>Total Products</Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{stats.totalProducts}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>Total Orders</Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{stats.totalOrders}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>Revenue</Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>${stats.revenue}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={inviteOpen} onClose={() => setInviteOpen(false)}>
        <DialogTitle>Invite Employee</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Employee Email"
            margin="normal"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          {inviteLink && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Invite link: <a href={inviteLink} target="_blank" rel="noopener noreferrer">{inviteLink}</a>
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteOpen(false)}>Cancel</Button>
          <Button onClick={handleInvite} variant="contained">Send Invite</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}