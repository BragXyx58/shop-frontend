import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiProducts, apiOrders } from '../../api';
import { useUserStore } from '../../store/userStore';
import type { IProduct } from '../../types/product';

export const AdminPanel = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { role } = useUserStore();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [statusMsg, setStatusMsg] = useState('');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (role !== 'Admin') {
      navigate('/');
    } else {
      fetchProducts();
      fetchOrders();
    }
  }, [role, navigate]);

  const fetchProducts = async () => {
    try {
      const res = await apiProducts.get<IProduct[]>('/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Помилка завантаження товарів', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await apiOrders.get('/orders');
      setOrders(res.data);
    } catch (error) {
      console.error('Помилка завантаження замовлень', error);
    }
  };

  const handleAddOrUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = { 
      name, 
      description: desc, 
      price: Number(price), 
      category, 
      imageUrl 
    };

    try {
      if (editingId) {
        await apiProducts.put(`/products/${editingId}`, productData);
        setStatusMsg('✅ Товар оновлено! ');
        setEditingId(null);
      } else {
        await apiProducts.post('/products', productData);
        setStatusMsg('✅ Товар успішно додано! ');
      }
      
      setName(''); setDesc(''); setPrice(''); setCategory(''); setImageUrl('');
      fetchProducts();
    } catch (error) {
      setStatusMsg('❌ Помилка при збереженні товару.');
    }
  };

  const handleEditClick = (p: IProduct) => {
    setEditingId(p.id);
    setName(p.name);
    setDesc(p.description);
    setPrice(p.price.toString());
    setCategory(p.category);
    setImageUrl(p.imageUrl || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цей товар?')) return;
    try {
      await apiProducts.delete(`/products/${id}`);
      setStatusMsg('🗑️ Товар видалено.');
      fetchProducts();
    } catch (error) {
      setStatusMsg('❌ Помилка при видаленні.');
    }
  };

  const handleChangeOrderStatus = async (id: number, newStatus: string) => {
    try {
      await apiOrders.put(`/orders/${id}/status`, { status: newStatus });
      fetchOrders(); 
      setStatusMsg(`✅ Статус замовлення #${id} змінено на ${newStatus}`);
    } catch (error) {
      setStatusMsg('❌ Помилка при зміні статусу.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '1000px' }}>
      <h1 style={{ color: '#f59e0b', marginBottom: '20px' }}> {t('admin_panel')}</h1>

      {statusMsg && (
        <h3 style={{ 
          color: statusMsg.includes('❌') ? 'var(--danger)' : 'var(--success)', 
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: statusMsg.includes('❌') ? '#fee2e2' : '#d1fae5',
          borderRadius: '8px'
        }}>
          {statusMsg}
        </h3>
      )}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <button 
          className="btn" 
          style={{ backgroundColor: activeTab === 'products' ? 'var(--primary)' : '#e5e7eb', color: activeTab === 'products' ? 'white' : 'black' }} 
          onClick={() => setActiveTab('products')}
        >
          📦 Управління товарами
        </button>
        <button 
          className="btn" 
          style={{ backgroundColor: activeTab === 'orders' ? 'var(--primary)' : '#e5e7eb', color: activeTab === 'orders' ? 'white' : 'black' }} 
          onClick={() => setActiveTab('orders')}
        >
          🧾 Замовлення клієнтів
        </button>
      </div>

      {activeTab === 'products' ? (
        <>
          <div className="card" style={{ marginBottom: '40px' }}>
            <h3 style={{ marginBottom: '20px' }}>
              {editingId ? '✏️ Редагувати товар' : `➕ ${t('admin_add_title')}`}
            </h3>
            <form className="form-group" style={{ maxWidth: '100%' }} onSubmit={handleAddOrUpdateProduct}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input type="text" placeholder={t('product_name')} required value={name} onChange={(e) => setName(e.target.value)} />
                <input type="text" placeholder={t('category')} required value={category} onChange={(e) => setCategory(e.target.value)} />
                <input type="number" placeholder={t('price')} required value={price} onChange={(e) => setPrice(e.target.value)} />
                <input type="text" placeholder="URL картинки (http://...)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              </div>
              <textarea placeholder={t('description')} required value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} style={{ marginTop: '15px' }} />
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button type="submit" className="btn btn-primary">
                  {editingId ? '💾 Зберегти зміни' : t('create_product')}
                </button>
                {editingId && (
                  <button type="button" className="btn btn-danger" onClick={() => { setEditingId(null); setName(''); setDesc(''); setPrice(''); setCategory(''); setImageUrl(''); }}>
                    Скасувати
                  </button>
                )}
              </div>
            </form>
          </div>

          <h3 style={{ marginBottom: '15px' }}>📦 {t('admin_manage_title')}</h3>
          <div className="card" style={{ padding: '0' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {products.length === 0 ? <li style={{ padding: '20px' }}>Товарів немає</li> : products.map((p, index) => (
                <li key={p.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '15px 20px', 
                  borderBottom: index !== products.length - 1 ? '1px solid var(--border-color)' : 'none', 
                  alignItems: 'center' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt="img" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', backgroundColor: '#e5e7eb', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📷</div>
                    )}
                    <span><strong>{p.name}</strong> ({p.price} ₴)</span>
                  </div>
                  <div>
                    <button className="btn" style={{ backgroundColor: '#3b82f6', color: 'white', marginRight: '10px' }} onClick={() => handleEditClick(p)}>Редагувати</button>
                    <button className="btn btn-danger" onClick={() => handleDeleteProduct(p.id)}>{t('delete')}</button>
                  </div>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', color: 'var(--text-muted)', marginBottom: '15px' }}>
                <p><strong>Клієнт:</strong> {o.userEmail}</p>
                <p><strong>Телефон:</strong> {o.phoneNumber}</p>
                <p><strong>Адреса:</strong> {o.deliveryAddress}</p>
                <p><strong>Створено:</strong> {new Date(o.createdAt).toLocaleString()}</p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <strong style={{ color: 'var(--text-main)' }}>Статус:</strong>
                <select 
                  value={o.status} 
                  onChange={(e) => handleChangeOrderStatus(o.id, e.target.value)}
                  style={{ 
                    padding: '8px 12px', 
                    borderRadius: '6px', 
                    border: '1px solid var(--border-color)', 
                    fontSize: '15px', 
                    fontWeight: 'bold',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Pending">Очікує (Pending)</option>
                  <option value="Paid">Оплачено (Paid)</option>
                  <option value="Shipped">Відправлено (Shipped)</option>
                  <option value="Cancelled">Скасовано (Cancelled)</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};