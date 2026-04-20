import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiAuth } from '../../api';
import { useUserStore } from '../../store/userStore';

export const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setAuth = useUserStore((state) => state.setAuth);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        const response = await apiAuth.post('/auth/login', { email, password });
        setAuth(response.data.token, response.data.username, email, response.data.role);
        navigate('/');
      } else {
        await apiAuth.post('/auth/register', { username, email, password });
        setIsLogin(true);
        setError('✅ Реєстрація успішна! Тепер увійдіть.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Помилка з\'єднання');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '450px', marginTop: '40px' }}>
      <div className="card" style={{ padding: '30px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
          {isLogin ? t('login') : t('register')}
        </h2>
        
        {error && <p style={{ color: error.includes('✅') ? 'var(--success)' : 'var(--danger)', marginBottom: '15px', textAlign: 'center' }}>{error}</p>}

        <form className="form-group" onSubmit={handleSubmit}>
          {!isLogin && (
            <input 
              type="text" placeholder={t('username')} required 
              value={username} onChange={(e) => setUsername(e.target.value)}
            />
          )}
          <input 
            type="email" placeholder={t('email')} required 
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder={t('password')} required 
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          
          <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
            {isLogin ? t('login') : t('register')}
          </button>
        </form>

        <p 
          style={{ marginTop: '20px', textAlign: 'center', cursor: 'pointer', color: 'var(--primary)', fontWeight: '500' }} 
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? t('no_account') : t('have_account')}
        </p>
      </div>
    </div>
  );
};