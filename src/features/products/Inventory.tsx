import { useEffect, useState } from 'react';
import api from '../../api/client';
import { Container, TextField, Button, Paper, IconButton, Table, TableHead, TableRow, TableCell, TableBody, Typography, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Inventory() {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', price: 0, stock: 0, category: '', description: '', images: [] as string[] });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => { fetchProducts(); }, []);
  const fetchProducts = async () => { const res = await api.get('/products'); setProducts(res.data); };
  const handleDelete = async (id: string) => { if (confirm('Delete?')) await api.delete(`/products/${id}`); fetchProducts(); };
  const addImage = () => {
    if (imageUrl && !form.images.includes(imageUrl)) {
      setForm({ ...form, images: [...form.images, imageUrl] }); setImageUrl('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = { ...form };
    if (imageUrl && !form.images.includes(imageUrl)) submitData.images = [...form.images, imageUrl];
    if (editingId) await api.put(`/products/${editingId}`, submitData);
    else await api.post('/products', submitData);
    fetchProducts();
    setForm({ name: '', price: 0, stock: 0, category: '', description: '', images: [] });
    setImageUrl('');
    setEditingId(null);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>Manage Inventory</Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
            <TextField label="Name" value={form.name} onChange={e =>
              setForm({ ...form, name: e.target.value })} required fullWidth />
            <TextField label="Price" type="number" value={form.price} onChange={e =>
              setForm({ ...form, price: parseFloat(e.target.value) })} required fullWidth />
            <TextField label="Stock" type="number" value={form.stock} onChange={e =>
              setForm({ ...form, stock: parseInt(e.target.value) })} required fullWidth />
            <TextField label="Category" value={form.category} onChange={e =>
              setForm({ ...form, category: e.target.value })} required fullWidth />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
            <TextField label="Description" value={form.description} onChange={e =>
              setForm({ ...form, description: e.target.value })} fullWidth />
            <TextField label="Image URL" value={imageUrl} onChange={e =>
              setImageUrl(e.target.value)} fullWidth />
            <Button variant="outlined" onClick={addImage} sx={{ minWidth: 120 }}>Add Image</Button>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button type="submit" variant="contained">{editingId ? 'Update' : 'Add'} Product</Button>
            {editingId && <Button onClick={() => {
              setEditingId(null); setForm({ name: '', price: 0, stock: 0, category: '', description: '', images: [] });
              setImageUrl('');
            }}>Cancel</Button>}
          </Stack>
        </form>
      </Paper>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: '#f5f5f5' }}>
            <TableCell>Image</TableCell><TableCell>Name</TableCell><TableCell>Price</TableCell><TableCell>Stock</TableCell>
            <TableCell>Category</TableCell><TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map(p => (
            <TableRow key={p._id}>
              <TableCell>{p.images?.[0] ? <img src={p.images[0]} alt={p.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} /> : 'No img'}</TableCell>
              <TableCell>{p.name}</TableCell><TableCell>${p.price}</TableCell><TableCell>{p.stock}</TableCell><TableCell>{p.category}</TableCell>
              <TableCell>
                <IconButton onClick={() => { setEditingId(p._id); setForm(p); }}><EditIcon /></IconButton>
                <IconButton onClick={() => handleDelete(p._id)}><DeleteIcon /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
