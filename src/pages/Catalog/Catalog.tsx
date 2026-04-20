import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiProducts } from '../../api';
import type { IProduct } from '../../types/product';
import { useCartStore } from '../../store/cartStore';

export const Catalog = () => {
  const { t } = useTranslation();
  const addToCart = useCartStore((state) => state.addToCart);
  
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiProducts.get<IProduct[]>('/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Помилка завантаження товарів:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container">
      <h1 style={{ marginBottom: '20px' }}>{t('catalog')}</h1>

      {loading ? (
        <p>{t('loading')}</p>
      ) : products.length === 0 ? (
        <p>{t('no_products')}</p>
      ) : (
        <div className="grid">
          {products.map((product) => (
            <div key={product.id} className="card">
              
              <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="card-image" />
                ) : (
                  <div className="card-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                    📷
                  </div>
                )}
                
                <h3 style={{ marginTop: '10px' }}>{product.name}</h3>
                <p className="category">{product.category}</p>
                <p className="description">{product.description}</p>
              </Link>
              
              <div className="spacer"></div>
              
              <h2 className="price">{product.price} ₴</h2>
              <button className="btn btn-primary" onClick={() => addToCart(product)}>
                🛒 {t('add_to_cart')}
              </button>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
};