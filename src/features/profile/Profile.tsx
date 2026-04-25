import { Container, Paper, Typography, Box } from '@mui/material';
import { useAppSelector } from '../../store/store';

export default function Profile() {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return <Container>Please log in.</Container>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Profile</Typography>
        <Box sx={{ mt: 2 }}>
          <Typography><strong>Name:</strong> {user.name}</Typography>
          <Typography><strong>Email:</strong> {user.email}</Typography>
          <Typography><strong>Role:</strong> {user.role}</Typography>
        </Box>
      </Paper>
    </Container>
  );
}
