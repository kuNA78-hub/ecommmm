import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { register as registerAction, clearError } from './authSlice';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Container, TextField, Button, Typography, Paper, Box, MenuItem, Alert, CircularProgress } from '@mui/material';
import { useEffect } from 'react';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
  role: z.enum(['seller', 'buyer']),
  inviteToken: z.string().optional(),
});

type RegisterForm = z.infer<typeof schema>;

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { error, loading } = useSelector((state: any) => state.auth);

  const { register: formRegister, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'buyer',
      inviteToken: token || undefined,
    },
  });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data: RegisterForm) => {
    const submitData = { ...data };
    
    if (token) {
      (submitData as any).role = 'employee';
      submitData.inviteToken = token;
    }
    
    const resultAction = await dispatch(registerAction(submitData) as any);
    if (registerAction.fulfilled.match(resultAction)) {
      navigate('/');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
            Join Our Platform
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
            Create an account to start {token ? 'working as an employee' : 'shopping or selling'}.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...formRegister('name')}
              label="Full Name"
              fullWidth
              margin="normal"
              error={!!errors.name}
              helperText={errors.name?.message}
              disabled={loading}
            />
            <TextField
              {...formRegister('email')}
              label="Email Address"
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={loading}
              autoComplete="email"
            />
            <TextField
              {...formRegister('password')}
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={loading}
              autoComplete="new-password"
            />
            
            {!token && (
              <TextField
                select
                {...formRegister('role')}
                label="Account Type"
                fullWidth
                margin="normal"
                disabled={loading}
              >
                <MenuItem value="buyer">Buyer - I want to shop</MenuItem>
                <MenuItem value="seller">Seller - I want to sell products</MenuItem>
              </TextField>
            )}

            {token && (
              <Box sx={{ p: 2, bgcolor: '#f0f7ff', borderRadius: 1, mt: 2, mb: 1 }}>
                <Typography variant="caption" color="primary" sx={{ display: 'block' }}>
                  <strong>Note:</strong> You are registering as an employee via invitation.
                </Typography>
              </Box>
            )}

            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2, height: '48px' }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </Button>
          </form>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: '500' }}>
                Login here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
