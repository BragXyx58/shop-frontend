import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../../store/cartStore';
import { useUserStore } from '../../store/userStore';
import { apiOrders } from '../../api';

export const Cart = () => {
  const { t } = useTranslation();
  const { items, removeFromCart, clearCart, getTotalAmount } = useCartStore();
  const { email } = useUserStore(); 
  
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [orderStatus, setOrderStatus] = useState('');

  const handleCheckout = async () => {
    if (!email) {
      setOrderStatus('❌ Спочатку увійдіть в акаунт!');
      return;
    }
    if (!address || !phone) {
      setOrderStatus('❌ Будь ласка, заповніть адресу та телефон доставки.');
      return;
    }

    try {
      const orderData = {
        userEmail: email,
        totalAmount: getTotalAmount(),
        deliveryAddress: address,
        phoneNumber: phone
      };

      await apiOrders.post('/orders', orderData);
      setOrderStatus('✅ Замовлення успішно створено та оплачено!');
      clearCart();
    } catch (error) {
      setOrderStatus('❌ Помилка при створенні замовлення.');
    }
  };

  return (
    <div className="container">
      <h1 style={{ marginBottom: '20px' }}>{t('cart')}</h1>

      {orderStatus && <h3 style={{ color: orderStatus.includes('✅') ? 'var(--success)' : 'var(--danger)', marginBottom: '20px' }}>{orderStatus}</h3>}

      {items.length === 0 ? (
        <p>{t('empty_cart')}</p>
      ) : (
        <div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {items.map((item) => (
              <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', padding: '15px 0', alignItems: 'center' }}>
                <div>
                  <strong>{item.name}</strong> (x{item.quantity})<br/>
                  <span style={{ color: 'var(--text-muted)' }}>{item.price} ₴ / шт</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <strong style={{ color: 'var(--primary)' }}>{item.price * item.quantity} ₴</strong>
                  <button className="btn btn-danger" onClick={() => removeFromCart(item.id)}>{t('delete')}</button>
                </div>
              </li>
            ))}
          </ul>

          <div className="card" style={{ marginTop: '30px', maxWidth: '500px', marginLeft: 'auto' }}>
            <h3 style={{ marginBottom: '15px' }}>Дані для доставки:</h3>
            <div className="form-group">
              <input type="text" placeholder="Місто, Вулиця, Будинок" value={address} onChange={(e) => setAddress(e.target.value)} required />
              <input type="text" placeholder="+380 (XX) XXX-XX-XX" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            
            <h2 style={{ margin: '20px 0', textAlign: 'right' }}>Разом: {getTotalAmount()} ₴</h2>
            <button className="btn btn-success" style={{ width: '100%' }} onClick={handleCheckout}>Оформити замовлення</button>
          </div>
        </div>
      )}
    </div>
  );
};