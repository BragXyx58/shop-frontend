import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiProducts } from '../../api';
import type { IProduct } from '../../types/product';
import { useCartStore } from '../../store/cartStore';

export const ProductDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiProducts.get<IProduct>(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="container"><p>Завантаження...</p></div>;
  if (!product) return <div className="container"><p>Товар не знайдено</p></div>;

  return (
    <div className="container" style={{ maxWidth: '900px', padding: '40px 20px' }}>
      <button className="btn" style={{ marginBottom: '20px', backgroundColor: '#e5e7eb' }} onClick={() => navigate(-1)}>
        ⬅ Назад до каталогу
      </button>
      
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        {/* Картинка */}
        <div style={{ flex: '1 1 400px' }}>
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} style={{ width: '100%', borderRadius: '12px', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '400px', backgroundColor: '#e5e7eb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              📷 Немає фото
            </div>
          )}
        </div>

        {/* Инфо */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column' }}>
          <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{product.category}</p>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{product.name}</h1>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '30px' }}>{product.price} ₴</h2>
          
          <div style={{ marginBottom: '40px', lineHeight: '1.8', color: 'var(--text-muted)' }}>
            <h3>Опис товару:</h3>
            <p style={{ marginTop: '10px' }}>{product.description}</p>
          </div>

          <button className="btn btn-primary" style={{ padding: '15px', fontSize: '1.2rem' }} onClick={() => addToCart(product)}>
            🛒 Додати в кошик
          </button>
        </div>
      </div>
    </div>
  );
};