import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { useDispatch } from 'react-redux';
import { addToCart } from '../cart/cartSlice';
import { useAppSelector } from '../../store/store';
import { Container, Grid, Card, CardContent, Typography, CardActions, Button, TextField, MenuItem, Box, CardMedia, CircularProgress, Alert, Snackbar } from '@mui/material';
import { Link } from 'react-router-dom';

interface Product { _id: string; name: string; price: number; stock: number; category: string; images: string[]; }

const fetchProducts = async (category: string, search: string) => {
  const params: any = {};
  if (category) params.category = category;
  if (search) params.search = search;
  const res = await api.get('/products/public', { params });
  return res.data;
};

// Simple debouncing hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function ProductList() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const dispatch = useDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const { data: products = [], isLoading, isError } = useQuery<Product[]>({
    queryKey: ['products', selectedCategory, debouncedSearch],
    queryFn: () => fetchProducts(selectedCategory, debouncedSearch),
  });

  // Fetch all categories once (logic improvement)
  const { data: allProducts = [] } = useQuery<Product[]>({
    queryKey: ['all-products-for-categories'],
    queryFn: () => fetchProducts('', ''),
    staleTime: 1000 * 60 * 5, // 5 mins
  });
  
  const categories: string[] = Array.from(new Set(allProducts.map((p: Product) => p.category)));

  const handleAddToCart = (product: Product) => {
    if (!user || user.role !== 'buyer') {
      setSnackbar({ open: true, message: 'Please login as a buyer to add items to cart.', severity: 'error' });
      return;
    }
    dispatch(addToCart({ productId: product._id, name: product.name, price: product.price, quantity: 1, image: product.images?.[0] }));
    setSnackbar({ open: true, message: `${product.name} added to cart!`, severity: 'success' });
  };

  return (
    <Container sx={{ mt: 4, pb: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Browse Products</Typography>
      
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 8 }}>
          <TextField 
            fullWidth 
            label="Search products..." 
            variant="outlined"
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField 
            select 
            fullWidth 
            label="Category" 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((cat: string) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
          </TextField>
        </Grid>
      </Grid>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Alert severity="error">Failed to load products. Please try again later.</Alert>
      ) : products.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" color="text.secondary">No products found matching your criteria.</Typography>
          <Button sx={{ mt: 2 }} onClick={() => { setSearch(''); setSelectedCategory(''); }}>Clear Filters</Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {products.map((product: Product) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
                <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {product.images?.[0] ? (
                    <CardMedia component="img" height="200" image={product.images[0]} alt={product.name} sx={{ objectFit: 'cover' }} />
                  ) : (
                    <Box sx={{ height: 200, bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="body2" color="text.secondary">No image</Typography>
                    </Box>
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }} noWrap>{product.name}</Typography>
                    <Typography variant="h6" color="primary.main" sx={{ mb: 1 }}>₹{product.price}</Typography>
                    <Typography variant="caption" color={product.stock > 0 ? 'success.main' : 'error.main'}>
                      {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                    </Typography>
                  </CardContent>
                </Link>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    onClick={() => handleAddToCart(product)} 
                    disabled={product.stock === 0}
                    size="small"
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}