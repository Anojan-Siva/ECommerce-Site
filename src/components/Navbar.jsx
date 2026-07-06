import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { cartCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  function handleSearch(e) {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/store?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  }

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">🎮</span>
          <span className="navbar__logo-text">
            EZ<span className="gradient-text">GAMES</span>
          </span>
        </Link>

        <form className="navbar__search" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="Search games..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="navbar__search-input"
            aria-label="Search games"
          />
          <button type="submit" className="navbar__search-btn" aria-label="Submit search">
            🔍
          </button>
        </form>

        <div className="navbar__links">
          <Link to="/" className={`navbar__link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/store" className={`navbar__link ${location.pathname.startsWith('/store') ? 'active' : ''}`}>Store</Link>
          <Link to="/deals" className={`navbar__link navbar__link--deals ${location.pathname === '/deals' ? 'active' : ''}`}>
            🔥 Deals
          </Link>
          <Link to="/survey" className={`navbar__link ${location.pathname === '/survey' ? 'active' : ''}`}>Survey</Link>
        </div>

        <div className="navbar__actions">
          <Link to="/cart" className="navbar__cart-btn" aria-label={`Cart: ${cartCount} items`}>
            <span className="navbar__cart-icon">🛒</span>
            {cartCount > 0 && (
              <span className="navbar__cart-badge">{cartCount}</span>
            )}
          </Link>

          <button
            className="navbar__hamburger btn btn-icon"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="navbar__mobile">
          <form className="navbar__mobile-search" onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Search games..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-control"
              aria-label="Mobile search"
            />
            <button type="submit" className="btn btn-primary btn-sm">Go</button>
          </form>
          <Link to="/" className="navbar__mobile-link">🏠 Home</Link>
          <Link to="/store" className="navbar__mobile-link">🎮 Store</Link>
          <Link to="/deals" className="navbar__mobile-link">🔥 Deals</Link>
          <Link to="/survey" className="navbar__mobile-link">📝 Survey</Link>
          <Link to="/cart" className="navbar__mobile-link">🛒 Cart ({cartCount})</Link>
        </div>
      )}
    </nav>
  );
}
