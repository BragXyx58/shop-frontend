import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiProducts, apiOrders } from '../../api';
import { useUserStore } from '../../store/userStore';

export const AdminPanel = () => {
  const navigate = useNavigate();
  const { role } = useUserStore();

  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  useEffect(() => {
    if (role !== 'Admin') navigate('/');
    else {
      fetchProducts();
      fetchOrders();
    }
  }, [role, navigate]);

  const fetchProducts = async () => {
    const res = await apiProducts.get('/products');
    setProducts(res.data);
  };

  const fetchOrders = async () => {
    const res = await apiOrders.get('/orders');
    setOrders(res.data);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiProducts.post('/products', {
  name,
  description: desc,
  price: Number(price),
  category,
  imageUrl 
});
    setName(''); setDesc(''); setPrice(''); setCategory(''); setImageUrl('');
    fetchProducts();
  };

  const handleDeleteProduct = async (id: number) => {
    await apiProducts.delete(`/products/${id}`);
    fetchProducts();
  };

  const handleChangeOrderStatus = async (id: number, newStatus: string) => {
    await apiOrders.put(`/orders/${id}/status`, { status: newStatus });
    fetchOrders(); 
  };

  return (
    <div className="container" style={{ maxWidth: '1000px' }}>
      <h1 style={{ color: '#f59e0b', marginBottom: '20px' }}>Адмін Панель</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <button className="btn" style={{ backgroundColor: activeTab === 'products' ? 'var(--primary)' : '#e5e7eb', color: activeTab === 'products' ? 'white' : 'black' }} onClick={() => setActiveTab('products')}>Управління товарами</button>
        <button className="btn" style={{ backgroundColor: activeTab === 'orders' ? 'var(--primary)' : '#e5e7eb', color: activeTab === 'orders' ? 'white' : 'black' }} onClick={() => setActiveTab('orders')}>Замовлення клієнтів</button>
      </div>

      {activeTab === 'products' ? (
        <>
          <div className="card" style={{ marginBottom: '40px' }}>
            <h3 style={{ marginBottom: '20px' }}>➕ Додати новий товар</h3>
            <form className="form-group" style={{ maxWidth: '100%' }} onSubmit={handleAddProduct}>
              <input type="text" placeholder="Назва товару" required value={name} onChange={(e) => setName(e.target.value)} />
              <input type="text" placeholder="Категорія" required value={category} onChange={(e) => setCategory(e.target.value)} />
              <input type="text" placeholder="URL картинки (http://...)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              <textarea placeholder="Опис" required value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} />
              <input type="number" placeholder="Ціна (грн)" required value={price} onChange={(e) => setPrice(e.target.value)} />
              <button type="submit" className="btn btn-primary">Створити товар</button>
            </form>
          </div>
          <div className="card" style={{ padding: '0' }}>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {products.map((p) => (
                <li key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid var(--border-color)' }}>
                  <span><strong>{p.name}</strong> ({p.price} ₴)</span>
                  <button className="btn btn-danger" onClick={() => handleDeleteProduct(p.id)}>Видалити</button>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {orders.length === 0 ? <p>Замовлень немає.</p> : orders.map(o => (
            <div key={o.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h3>Замовлення #{o.id}</h3>
                <h2 style={{ color: 'var(--primary)' }}>{o.totalAmount} ₴</h2>
              </div>
              <p><strong>Клієнт:</strong> {o.userEmail}</p>
              <p><strong>Телефон:</strong> {o.phoneNumber}</p>
              <p><strong>Адреса:</strong> {o.deliveryAddress}</p>
              
              <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <strong>Статус:</strong>
                <select 
                  value={o.status} 
                  onChange={(e) => handleChangeOrderStatus(o.id, e.target.value)}
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '16px', fontWeight: 'bold' }}
                >
                  <option value="Paid">Оплачено (Paid)</option>
                  <option value="Pending Shipment">Очікує відправки (Pending Shipment)</option>
                  <option value="Shipped">Відправлено (Shipped)</option>
                  <option value="Delivered">Доставлено (Delivered)</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};