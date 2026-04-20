import { useEffect, useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { apiAuth, apiOrders } from '../../api';

export const Profile = () => {
  const { email, username } = useUserStore();
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (email) {
      apiAuth.get(`/profile/${email}`).then(res => {
        setPhone(res.data.phone || '');
        setAddress(res.data.address || '');
      });
      apiOrders.get(`/orders/my/${email}`).then(res => setOrders(res.data));
    }
  }, [email]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiAuth.put(`/profile/${email}`, { phone, address });
      setMsg('✅ Дані успішно збережено!');
    } catch {
      setMsg('❌ Помилка збереження.');
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Paid': return '#3b82f6'; 
      case 'Pending Shipment': return '#f59e0b'; 
      case 'Shipped': return '#8b5cf6'; 
      case 'Delivered': return '#10b981'; 
      default: return 'gray';
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <h1>Особистий кабінет: {username}</h1>
      
      <div className="card" style={{ marginTop: '20px' }}>
        <h3>Налаштування профілю</h3>
        {msg && <p style={{ color: msg.includes('✅') ? 'green' : 'red' }}>{msg}</p>}
        <form className="form-group" style={{ maxWidth: '100%', marginTop: '15px' }} onSubmit={handleUpdate}>
          <input type="text" placeholder="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input type="text" placeholder="Адреса за замовчуванням" value={address} onChange={(e) => setAddress(e.target.value)} />
          <button className="btn btn-primary" type="submit">Зберегти зміни</button>
        </form>
      </div>

      <h3 style={{ margin: '30px 0 15px' }}>📦 Мої замовлення</h3>
      {orders.length === 0 ? <p>Ви ще нічого не замовляли.</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {orders.map(o => (
            <div key={o.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
              <div>
                <strong>Замовлення #{o.id}</strong>
                <p style={{ fontSize: '14px', color: 'gray' }}>{new Date(o.createdAt).toLocaleString()}</p>
                <p style={{ fontSize: '14px', marginTop: '5px' }}>📍 {o.deliveryAddress} | 📞 {o.phoneNumber}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h2>{o.totalAmount} ₴</h2>
                <span style={{ backgroundColor: getStatusColor(o.status), color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                  {o.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};