import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../../store/userStore';

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { username, role, logout } = useUserStore();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language.startsWith('uk') ? 'en' : 'uk');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-links">
        <h2 style={{ margin: 0, color: 'white' }}>Shop</h2>
        <Link to="/">{t('catalog')}</Link>
        <Link to="/cart">{t('cart')}</Link>
        {role === 'Admin' && <Link to="/admin" className="admin-link">{t('admin_panel')}</Link>}
      </div>

      <div className="nav-links">
        {username ? (
          <>
          <Link to="/profile" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 'bold' }}>
              👤 {username}
            </Link>
            <button className="btn btn-danger" onClick={handleLogout}>{t('logout')}</button>
          </>
        ) : (
          <Link to="/login">{t('login')}</Link>
        )}
        <button className="btn" style={{ backgroundColor: '#374151', color: 'white' }} onClick={toggleLanguage}>
          🌍 {t('switch_lang')}
        </button>
      </div>
    </nav>
  );
};