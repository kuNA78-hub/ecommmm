import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { useDispatch } from 'react-redux';
import { addToCart } from '../cart/cartSlice';
import { useAppSelector } from '../../store/store';
import { Container, Grid, Typography, Button, Box, Chip, CircularProgress, Stack } from '@mui/material';

interface Product { _id: string; name: string; price: number; stock: number; category: string; description: string; images: string[]; }

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/public`);
                const found = res.data.find((p: Product) => p._id === id);
                setProduct(found);
            } catch (error) { console.error(error); } finally { setLoading(false); }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        if (!user || user.role !== 'buyer') { alert('Please login as buyer'); navigate('/login'); return; }
        dispatch(addToCart({ productId: product._id, name: product.name, price: product.price, quantity: 1, image: product.images?.[0] }));
        alert('Added to cart!');
    };

    const handleBuyNow = () => {
        if (!product) return;
        if (!user || user.role !== 'buyer') { alert('Please login as buyer'); navigate('/login'); return; }
        dispatch(addToCart({ productId: product._id, name: product.name, price: product.price, quantity: 1, image: product.images?.[0] }));
        navigate('/checkout');
    };

    if (loading) return <Container sx={{ mt: 4, textAlign: 'center' }}><CircularProgress /></Container>;
    if (!product) return <Container sx={{ mt: 4, textAlign: 'center' }}><Typography variant="h5">Product not found</Typography></Container>;

    return (
        <Container sx={{ mt: 4 }}>
            <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>← Back</Button>
            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 6 }}>
                    {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} style={{ width: '100%', borderRadius: 8 }} />
                    ) : (
                        <Box sx={{ height: 400, bgcolor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>No image available</Typography>
                        </Box>
                    )}
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h4" sx={{ mb: 1 }}>{product.name}</Typography>
                    <Chip label={product.category} sx={{ mb: 2 }} />
                    <Typography variant="h5" sx={{ color: 'primary.main', mb: 1 }}>${product.price}</Typography>
                    <Typography variant="body2" sx={{ color: product.stock > 0 ? 'green' : 'red', mb: 2 }}>
                        {product.stock > 0 ? `In stock (${product.stock} available)` : 'Out of stock'}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>{product.description || 'No description available.'}</Typography>
                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" size="large" onClick={handleAddToCart} disabled={product.stock === 0}>
                            Add to Cart
                        </Button>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleBuyNow}
                            disabled={product.stock === 0}
                            sx={{
                                bgcolor: '#f5b042',
                                color: 'white',
                                '&:hover': { bgcolor: '#e6a03a' }
                            }}
                        >
                            Buy Now
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    );
}