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

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [highestPrice, setHighestPrice] = useState<number>(100000);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiProducts.get<IProduct[]>('/products');
        setProducts(response.data);
        
        if (response.data.length > 0) {
          const maxP = Math.max(...response.data.map(p => p.price));
          setHighestPrice(maxP);
          setMaxPrice(maxP);
        }
      } catch (error) {
        console.error('Помилка завантаження товарів:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = Array.from(new Set(products.map(p => p.category)));

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === '' || p.category === selectedCategory;
    const matchPrice = p.price <= maxPrice;
    
    return matchSearch && matchCategory && matchPrice;
  });

  return (
    <div className="container">
      <h1 style={{ marginBottom: '20px' }}>{t('catalog')}</h1>

      {!loading && products.length > 0 && (
        <div className="card" style={{ display: 'flex', flexDirection: 'row', gap: '20px', marginBottom: '30px', flexWrap: 'wrap', alignItems: 'center', padding: '20px' }}>
          <input 
            type="text" 
            placeholder="Пошук за назвою або описом..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            style={{ flex: '1 1 250px' }} 
          />
          
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)} 
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', flex: '1 1 200px', backgroundColor: 'white' }}
          >
            <option value="">Всі категорії</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          
          <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Ціна до: <strong style={{ color: 'var(--primary)', fontSize: '16px' }}>{maxPrice} ₴</strong>
            </label>
            <input 
              type="range" 
              min="0" 
              max={highestPrice} 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(Number(e.target.value))} 
              style={{ width: '100%', cursor: 'pointer' }} 
            />
          </div>
        </div>
      )}

      {loading ? (
        <p>{t('loading')}</p>
      ) : filteredProducts.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
          Нічого не знайдено за вашими критеріями
        </p>
      ) : (
        <div className="grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="card">
              <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="card-image" />
                ) : (
                  <div className="card-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>📷</div>
                )}
                <h3 style={{ marginTop: '10px' }}>{product.name}</h3>
                <p className="category">{product.category}</p>
                <p className="description">{product.description}</p>
              </Link>
              <div className="spacer"></div>
              <h2 className="price">{product.price} ₴</h2>
              <button className="btn btn-primary" onClick={() => addToCart(product)}>🛒 {t('add_to_cart')}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};