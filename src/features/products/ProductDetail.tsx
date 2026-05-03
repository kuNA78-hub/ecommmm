import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { useDispatch } from 'react-redux';
import { addToCart } from '../cart/cartSlice';
import { useAppSelector } from '../../store/store';
import { Container, Grid, Typography, Button, Box, Chip, CircularProgress, Stack, Paper, Divider, Snackbar, Alert } from '@mui/material';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import FlashOn from '@mui/icons-material/FlashOn';
import ArrowBack from '@mui/icons-material/ArrowBack';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  images: string[];
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Fetch all products (public endpoint) then find the one with matching ID
        const res = await api.get('/products/public');
        const found = res.data.find((p: Product) => p._id === id);
        if (found) {
          setProduct(found);
        } else {
          setError('Product not found');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    if (!user || user.role !== 'buyer') {
      setSnackbar({ open: true, message: 'Please login as a buyer to shop.' });
      return;
    }

    dispatch(addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0]
    }));

    setSnackbar({ open: true, message: 'Added to cart!' });
  };

  const handleBuyNow = () => {
    if (!product) return;

    if (!user || user.role !== 'buyer') {
      setSnackbar({ open: true, message: 'Please login as a buyer to shop.' });
      return;
    }

    dispatch(addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0]
    }));

    navigate('/checkout');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Container sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error">{error || 'Product not found'}</Typography>
        <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate('/')}>Back to Products</Button>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, pb: 8 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 4, color: 'text.secondary' }}>
        Back
      </Button>

      <Grid container spacing={6}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ position: 'sticky', top: 20 }}>
            <Paper elevation={0} sx={{ overflow: 'hidden', borderRadius: 4, bgcolor: '#f9f9f9', border: '1px solid #eee' }}>
              {product.images?.[selectedImage] ? (
                <img src={product.images[selectedImage]} alt={product.name} style={{ width: '100%', height: 'auto', display: 'block' }} />
              ) : (
                <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">No image available</Typography>
                </Box>
              )}
            </Paper>

            {product.images && product.images.length > 1 && (
              <Stack direction="row" spacing={2} sx={{ mt: 2, overflowX: 'auto', pb: 1 }}>
                {product.images.map((img, idx) => (
                  <Box
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    sx={{
                      width: 80,
                      height: 80,
                      cursor: 'pointer',
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: selectedImage === idx ? '2px solid #1976d2' : '2px solid transparent',
                      opacity: selectedImage === idx ? 1 : 0.7,
                      '&:hover': { opacity: 1 }
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Box>
            <Chip label={product.category} color="primary" variant="outlined" sx={{ mb: 2, borderRadius: 1 }} />
            <Typography variant="h3" sx={{ mb: 1, fontWeight: 'bold' }}>{product.name}</Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                ₹{product.price}
              </Typography>
              <Divider orientation="vertical" flexItem sx={{ height: 24, alignSelf: 'center' }} />
              <Typography variant="body1" color={product.stock > 0 ? 'success.main' : 'error.main'} sx={{ fontWeight: '500' }}>
                {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Currently Out of Stock'}
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.7 }}>
              {product.description || 'Experience excellence with our latest selection. This product is designed to meet your highest expectations for quality and performance.'}
            </Typography>

            <Divider sx={{ mb: 4 }} />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                sx={{ flex: 1, height: 56, borderRadius: 2 }}
              >
                Add to Cart
              </Button>
              <Button
                variant="contained"
                size="large"
                startIcon={<FlashOn />}
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                sx={{
                  flex: 1,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: '#ff9800',
                  '&:hover': { bgcolor: '#f57c00' }
                }}
              >
                Buy Now
              </Button>
            </Stack>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity="info" variant="filled" sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}
