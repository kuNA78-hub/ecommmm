import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { useDispatch } from 'react-redux';
import { addToCart } from '../cart/cartSlice';
import { useAppSelector } from '../../store/store';
import { Container, Grid, Card, CardContent, Typography, CardActions, Button, TextField, MenuItem, Box, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';

interface Product { _id: string; name: string; price: number; stock: number; category: string; images: string[]; }

const fetchProducts = async (category: string, search: string) => {
  const params: any = {};
  if (category) params.category = category;
  if (search) params.search = search;
  const res = await api.get('/products/public', { params });
  return res.data;
};

export default function ProductList() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['products', selectedCategory, search],
    queryFn: () => fetchProducts(selectedCategory, search),
  });
  const categories: string[] = [...new Set(products.map((p: Product) => p.category))];

  const handleAddToCart = (product: Product) => {
    if (!user || user.role !== 'buyer') { alert('Please login as buyer'); return; }
    dispatch(addToCart({ productId: product._id, name: product.name, price: product.price, quantity: 1, image: product.images?.[0] }));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 8 }}><TextField fullWidth label="Search" value={search} onChange={(e) => setSearch(e.target.value)} /></Grid>
        <Grid size={{ xs: 4 }}>
          <TextField select fullWidth label="Category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            {categories.map((cat: string) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
          </TextField>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        {products.map((product: Product) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {product.images?.[0] ? (<CardMedia component="img" height="200" image={product.images[0]} alt={product.name} />) : (
                <Box sx={{ height: 200, bgcolor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body2" color="text.secondary">No image</Typography>
                </Box>
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">${product.price}</Typography>
                <Typography variant="caption">Stock: {product.stock}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} to={`/product/${product._id}`}>View Details</Button>
                <Button size="small" onClick={() => handleAddToCart(product)} disabled={product.stock === 0}>Add to Cart</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}