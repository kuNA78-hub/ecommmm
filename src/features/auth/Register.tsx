import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { register } from './authSlice';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Container, TextField, Button, Typography, Paper, Box, MenuItem } from '@mui/material';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['seller', 'buyer']),
  inviteToken: z.string().optional(),
});

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  // Force role to be 'buyer' if token exists, otherwise default to 'buyer' (avoid undefined)
  const defaultRole = token ? 'buyer' : 'buyer';

  const { register: formRegister, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: defaultRole,
      inviteToken: token || undefined,
    },
  });

  const onSubmit = async (data: any) => {
    // If there's an invite token, the role must be 'employee' for the backend.
    // But the schema only allows 'seller' or 'buyer'. We'll override the role when submitting.
    const submitData = { ...data };
    if (token) {
      submitData.role = 'employee';
      submitData.inviteToken = token;
    }
    await dispatch(register(submitData) as any);
    navigate('/');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" align="center">Register</Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...formRegister('name')}
              label="Name"
              fullWidth
              margin="normal"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              {...formRegister('email')}
              label="Email"
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              {...formRegister('password')}
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <TextField
              select
              {...formRegister('role')}
              label="Role"
              fullWidth
              margin="normal"
              disabled={!!token}
            >
              <MenuItem value="buyer">Buyer</MenuItem>
              <MenuItem value="seller">Seller</MenuItem>
            </TextField>
            {token && (
              <Typography variant="caption" color="green">
                You are registering as an employee (invitation accepted).
              </Typography>
            )}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
              Register
            </Button>
          </form>
          <Typography align="center" sx={{ mt: 2 }}>
            Already have an account? <Link to="/login">Login</Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
