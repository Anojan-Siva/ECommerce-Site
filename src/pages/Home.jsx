import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { games } from '../data/gameUtils';
import { useCart } from '../context/CartContext';
import GameCard from '../components/GameCard';
import './Home.css';

const featuredGames = games
  .filter(g => g.review_score >= 8)
  .sort((a, b) => b.positive - a.positive)
  .slice(0, 6);

const dealGames = games
  .filter(g => g.discount_pct > 0)
  .sort((a, b) => b.discount_pct - a.discount_pct)
  .slice(0, 4);

const newReleases = games
  .filter(g => g.release_date)
  .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
  .slice(0, 4);

const HERO_GAME = games.find(g => g.review_score >= 9 && g.positive > 10000) || games[0];

const STATS = [
  { value: `${games.length}+`, label: 'Games Available' },
  { value: '100%', label: 'Secure Checkout' },
  { value: '24/7', label: 'Customer Support' },
  { value: '⭐ 4.9', label: 'Average Rating' },
];

const CATEGORIES = [
  { genre: 'Action', icon: '⚔️', desc: 'Fast-paced combat & battles' },
  { genre: 'RPG', icon: '🧙', desc: 'Epic stories & character growth' },
  { genre: 'Strategy', icon: '♟️', desc: 'Outthink and outmaneuver' },
  { genre: 'Adventure', icon: '🗺️', desc: 'Explore vast open worlds' },
  { genre: 'Simulation', icon: '🏗️', desc: 'Build, manage, create' },
  { genre: 'Indie', icon: '💎', desc: 'Hidden gems & creative visions' },
];

export default function Home() {
  const [heroIdx, setHeroIdx] = useState(0);
  const topHeroes = games.filter(g => g.review_score >= 8 && g.positive > 5000).slice(0, 4);
  const currentHero = topHeroes[heroIdx] || HERO_GAME;
  const { addItem } = useCart();

  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % topHeroes.length), 5000);
    return () => clearInterval(t);
  }, [topHeroes.length]);

  return (
    <main className="home">
      <section className="hero" aria-label="Featured game spotlight">
        <div
          className="hero__bg"
          style={{
            backgroundImage: `url(https://cdn.akamai.steamstatic.com/steam/apps/${currentHero.id}/library_hero.jpg)`,
          }}
        />
        <div className="hero__overlay" />
        <div className="container hero__content">
          <div className="hero__text">
            <span className="section-eyebrow">🎮 Game of the Moment</span>
            <h1 className="hero__title">{currentHero.name}</h1>
            <div className="hero__meta">
              {currentHero.genres.slice(0, 3).map(g => (
                <span key={g} className="badge badge-genre">{g}</span>
              ))}
              {currentHero.review_desc && currentHero.review_desc !== 'No Rating' && (
                <span className="badge badge-score">⭐ {currentHero.review_desc}</span>
              )}
            </div>
            <div className="hero__price-row">
              {currentHero.discount_pct > 0 && (
                <span className="hero__original-price">${currentHero.original_price.toFixed(2)}</span>
              )}
              <span className="hero__price">${currentHero.price.toFixed(2)}</span>
              {currentHero.discount_pct > 0 && (
                <span className="badge badge-sale hero__sale">-{currentHero.discount_pct}% OFF</span>
              )}
            </div>
            <div className="hero__actions">
              <Link to={`/game/${currentHero.id}`} className="btn btn-primary btn-xl">
                Explore Game →
              </Link>
              <button
                className="btn btn-secondary btn-xl"
                onClick={() => addItem(currentHero)}
              >
                🛒 Add to Cart
              </button>
            </div>
          </div>

          <div className="hero__dots">
            {topHeroes.map((_, i) => (
              <button
                key={i}
                className={`hero__dot ${i === heroIdx ? 'active' : ''}`}
                onClick={() => setHeroIdx(i)}
                aria-label={`Switch to hero ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="stats-bar" aria-label="Store highlights">
        <div className="container stats-bar__inner">
          {STATS.map(s => (
            <div key={s.label} className="stats-bar__item">
              <span className="stats-bar__value">{s.value}</span>
              <span className="stats-bar__label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="promo-banner" aria-label="Promotional deals">
        <div className="container">
          <div className="promo-banner__inner">
            <div className="promo-banner__text">
              <span className="promo-banner__eyebrow">🔥 Limited Time Offer</span>
              <h2 className="promo-banner__title">
                Save Up to <span className="gradient-text">75% Off</span> — Don't Miss Out!
              </h2>
              <p className="promo-banner__sub">
                Incredible deals on top-rated titles. These prices won't last — grab yours before the sale ends!
              </p>
            </div>
            <Link to="/deals" className="btn btn-primary btn-lg promo-banner__cta">
              🎁 Shop All Deals →
            </Link>
          </div>
        </div>
      </section>

      <section className="section-pad" aria-labelledby="featured-title">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">🏆 Top Picks</span>
            <h2 className="section-title" id="featured-title">
              Editor's Choice — <span className="gradient-text">Must-Play Titles</span>
            </h2>
            <p className="section-sub">
              Hand-selected based on community ratings, playtime hours, and critical acclaim.
            </p>
          </div>
          <div className="grid grid-3 gap-3">
            {featuredGames.map(g => (
              <GameCard key={g.id} game={g} featured />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/store" className="btn btn-secondary btn-lg">
              Browse All Games →
            </Link>
          </div>
        </div>
      </section>

      {dealGames.length > 0 && (
        <section className="section-pad deals-section" aria-labelledby="deals-title">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">🔥 Flash Sales</span>
              <h2 className="section-title" id="deals-title">
                Today's <span className="gradient-text">Hot Deals</span>
              </h2>
              <p className="section-sub">
                Act fast! These discounts are available for a limited time only. Your next favourite game might be here.
              </p>
            </div>
            <div className="grid grid-4 gap-3">
              {dealGames.map(g => (
                <GameCard key={g.id} game={g} />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <Link to="/deals" className="btn btn-primary btn-lg">
                See All Deals 🎉
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="section-pad" aria-labelledby="categories-title">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">🗂️ Browse By Genre</span>
            <h2 className="section-title" id="categories-title">
              What Kind of Gamer <span className="gradient-text">Are You?</span>
            </h2>
            <p className="section-sub">
              From adrenaline-fuelled action to calm simulation — find games that match your mood.
            </p>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.genre}
                to={`/store?genre=${encodeURIComponent(cat.genre)}`}
                className="category-card"
              >
                <span className="category-card__icon">{cat.icon}</span>
                <span className="category-card__genre">{cat.genre}</span>
                <span className="category-card__desc">{cat.desc}</span>
                <span className="category-card__arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {newReleases.length > 0 && (
        <section className="section-pad" aria-labelledby="new-title">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">✨ Just Released</span>
              <h2 className="section-title" id="new-title">
                Fresh on the <span className="gradient-text">EZGAMES Store</span>
              </h2>
              <p className="section-sub">
                The newest arrivals. Be among the first to experience them.
              </p>
            </div>
            <div className="grid grid-4 gap-3">
              {newReleases.map(g => (
                <GameCard key={g.id} game={g} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="survey-cta" aria-label="Feedback invitation">
        <div className="container">
          <div className="survey-cta__inner glass-card">
            <div className="survey-cta__emoji">💬</div>
            <h2 className="survey-cta__title">
              We'd Love to Hear From You!
            </h2>
            <p className="survey-cta__sub">
              Have you explored our store? Tell us what you think! Your feedback helps us bring you even better gaming deals.
              It only takes 2 minutes — and we genuinely appreciate every response. 🙏
            </p>
            <Link to="/survey" className="btn btn-primary btn-lg">
              Share Your Thoughts →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
