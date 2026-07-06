import { Link } from 'react-router-dom';
import { games, getCoverUrl, getReviewColor } from '../data/gameUtils';
import { useCart } from '../context/CartContext';
import GameCard from '../components/GameCard';
import './Deals.css';

const dealGames = games
  .filter(g => g.discount_pct > 0)
  .sort((a, b) => b.discount_pct - a.discount_pct);

const DEAL_TIERS = [
  { label: '75%+ OFF', min: 75, icon: '🔥🔥🔥', color: '#ef4444' },
  { label: '50–74% OFF', min: 50, max: 74, icon: '🔥🔥', color: '#f97316' },
  { label: '25–49% OFF', min: 25, max: 49, icon: '🔥', color: '#f59e0b' },
  { label: 'Under 25% OFF', min: 1, max: 24, icon: '✨', color: '#84cc16' },
];

export default function Deals() {
  const { addItem } = useCart();

  function gamesForTier(tier) {
    return dealGames.filter(g =>
      g.discount_pct >= tier.min && (tier.max === undefined || g.discount_pct <= tier.max)
    );
  }

  return (
    <div className="deals-page">
      <div className="deals-hero">
        <div className="deals-hero__bg" />
        <div className="container deals-hero__content">
          <span className="section-eyebrow">💸 Limited Time</span>
          <h1 className="deals-hero__title">
            Today's <span className="gradient-text">Best Deals</span>
          </h1>
          <p className="deals-hero__sub">
            Why pay full price? These incredible discounts are live right now — but they won't last forever.
            Lock in your savings before time runs out! ⏰
          </p>
          {dealGames.length > 0 && (
            <div className="deals-hero__stats">
              <div className="deals-stat">
                <span className="deals-stat__val">{dealGames.length}</span>
                <span className="deals-stat__label">Games on Sale</span>
              </div>
              <div className="deals-stat">
                <span className="deals-stat__val">{Math.max(...dealGames.map(g => g.discount_pct))}%</span>
                <span className="deals-stat__label">Max Discount</span>
              </div>
              <div className="deals-stat">
                <span className="deals-stat__val">
                  ${Math.min(...dealGames.map(g => g.price)).toFixed(2)}
                </span>
                <span className="deals-stat__label">Lowest Price</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="deals-countdown">
        <div className="container deals-countdown__inner">
          <span className="deals-countdown__label">⚡ Flash Sale ends soon!</span>
          <span className="deals-countdown__cta">Add to cart now to secure your price</span>
        </div>
      </div>

      <div className="container">
        {dealGames.length === 0 ? (
          <div className="deals-empty">
            <span style={{ fontSize: '3rem' }}>😔</span>
            <h3>No deals available right now</h3>
            <p>Check back soon — new deals drop regularly!</p>
            <Link to="/store" className="btn btn-primary">Browse All Games</Link>
          </div>
        ) : (
          DEAL_TIERS.map(tier => {
            const tierGames = gamesForTier(tier);
            if (tierGames.length === 0) return null;
            return (
              <section key={tier.label} className="deals-tier" aria-labelledby={`tier-${tier.min}`}>
                <div className="deals-tier__header">
                  <div className="deals-tier__badge" style={{ borderColor: tier.color, color: tier.color }}>
                    {tier.icon} {tier.label}
                  </div>
                  <span className="deals-tier__count">{tierGames.length} game{tierGames.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="deals-tier__grid">
                  {tierGames.map(g => (
                    <DealCard key={g.id} game={g} addItem={addItem} />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}

function DealCard({ game, addItem }) {
  const savings = game.original_price - game.price;
  const reviewColor = getReviewColor(game.review_desc);

  return (
    <div className="deal-card">
      <Link to={`/game/${game.id}`} className="deal-card__link">
        <div className="deal-card__cover">
          <img
            src={getCoverUrl(game.id)}
            alt={game.name}
            className="deal-card__img"
            onError={e => { e.target.src = `https://via.placeholder.com/460x215/151c2f/7c3aed?text=Game`; }}
          />
          <div className="deal-card__discount-badge">
            -{game.discount_pct}%
          </div>
        </div>
        <div className="deal-card__body">
          <h3 className="deal-card__title">{game.name}</h3>
          {game.review_desc && game.review_desc !== 'No Rating' && (
            <div className="deal-card__rating" style={{ color: reviewColor }}>
              ● {game.review_desc}
            </div>
          )}
          <div className="deal-card__price-row">
            <div className="deal-card__prices">
              <span className="deal-card__original">${game.original_price.toFixed(2)}</span>
              <span className="deal-card__price">${game.price.toFixed(2)}</span>
            </div>
            <span className="deal-card__save">Save ${savings.toFixed(2)}</span>
          </div>
        </div>
      </Link>
      <button
        className="btn btn-primary deal-card__btn"
        onClick={() => addItem(game)}
        aria-label={`Add ${game.name} to cart`}
      >
        🛒 Add to Cart
      </button>
    </div>
  );
}
