import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { games, getCoverUrl, getReviewColor, getReviewPercent } from '../data/gameUtils';
import { useCart } from '../context/CartContext';
import GameCard from '../components/GameCard';
import './GameDetail.css';

export default function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const game = games.find(g => g.id === id);
  const { addItem, items, toggleWishlist, wishlist } = useCart();
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);

  if (!game) {
    return (
      <div className="not-found" style={{ paddingTop: '140px', textAlign: 'center' }}>
        <h2>Game not found 🕵️</h2>
        <Link to="/store" className="btn btn-primary" style={{ marginTop: '24px' }}>
          ← Back to Store
        </Link>
      </div>
    );
  }

  const inCart = items.some(i => i.game.id === game.id);
  const inWishlist = wishlist.includes(game.id);
  const reviewPct = getReviewPercent(game);
  const reviewColor = getReviewColor(game.review_desc);

  const related = games
    .filter(g => g.id !== game.id && g.genres.some(genre => game.genres.includes(genre)))
    .sort((a, b) => b.review_score - a.review_score)
    .slice(0, 4);

  function handleAddToCart() {
    addItem(game);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    addItem(game);
    navigate('/cart');
  }

  const coverUrl = imgError
    ? `https://via.placeholder.com/920x430/151c2f/7c3aed?text=${encodeURIComponent(game.name)}`
    : getCoverUrl(game.id);

  const releaseYear = game.release_date
    ? new Date(game.release_date).getFullYear()
    : 'Unknown';

  return (
    <div className="game-detail">
      <div className="game-detail__hero">
        <div
          className="game-detail__hero-bg"
          style={{
            backgroundImage: `url(https://cdn.akamai.steamstatic.com/steam/apps/${game.id}/library_hero.jpg)`,
          }}
        />
        <div className="game-detail__hero-overlay" />
        <div className="container game-detail__hero-inner">
          <button className="btn btn-secondary btn-sm game-detail__back" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>
      </div>

      <div className="container game-detail__main">
        <aside className="game-detail__sidebar">
          <div className="game-detail__cover-wrap">
            <img
              src={coverUrl}
              alt={`${game.name} cover art`}
              className="game-detail__cover"
              onError={() => setImgError(true)}
            />
            {game.discount_pct > 0 && (
              <span className="badge badge-sale game-detail__sale-badge">
                -{game.discount_pct}%
              </span>
            )}
          </div>

          <div className="game-detail__purchase glass-card">
            <div className="game-detail__price-row">
              {game.discount_pct > 0 && (
                <div className="game-detail__original">${game.original_price.toFixed(2)}</div>
              )}
              <div className="game-detail__price">
                ${game.price.toFixed(2)}
              </div>
              {game.discount_pct > 0 && (
                <span className="badge badge-sale">-{game.discount_pct}% OFF</span>
              )}
            </div>

            {game.discount_pct > 0 && (
              <p className="game-detail__save-msg">
                💰 You save ${(game.original_price - game.price).toFixed(2)}!
              </p>
            )}

            <button
              className={`btn btn-primary btn-lg game-detail__buy-btn ${added ? 'added' : ''}`}
              onClick={handleAddToCart}
              id="add-to-cart-btn"
              aria-label={`Add ${game.name} to cart`}
            >
              {added ? '✓ Added to Cart!' : inCart ? '🛒 Add Another' : '🛒 Add to Cart'}
            </button>

            <button
              className="btn btn-secondary btn-lg"
              onClick={handleBuyNow}
              id="buy-now-btn"
              aria-label="Buy now"
            >
              ⚡ Buy Now
            </button>

            <button
              className={`btn game-detail__wish-btn ${inWishlist ? 'game-detail__wish-btn--active' : 'btn-secondary'}`}
              onClick={() => toggleWishlist(game.id)}
              id="wishlist-btn"
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {inWishlist ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
            </button>
          </div>

          <div className="game-detail__meta-box glass-card">
            {game.developer && (
              <div className="game-detail__meta-row">
                <span className="game-detail__meta-key">Developer</span>
                <span className="game-detail__meta-val">{game.developer.split(',')[0]}</span>
              </div>
            )}
            {game.publisher && (
              <div className="game-detail__meta-row">
                <span className="game-detail__meta-key">Publisher</span>
                <span className="game-detail__meta-val">{game.publisher.split(',')[0]}</span>
              </div>
            )}
            <div className="game-detail__meta-row">
              <span className="game-detail__meta-key">Release Year</span>
              <span className="game-detail__meta-val">{releaseYear}</span>
            </div>
            {game.playtime_avg > 0 && (
              <div className="game-detail__meta-row">
                <span className="game-detail__meta-key">Avg. Playtime</span>
                <span className="game-detail__meta-val">
                  {Math.round(game.playtime_avg / 60)} hrs
                </span>
              </div>
            )}
            {game.metacritic && (
              <div className="game-detail__meta-row">
                <span className="game-detail__meta-key">Metacritic</span>
                <span className="game-detail__meta-val game-detail__metacritic">
                  {game.metacritic}
                </span>
              </div>
            )}
          </div>
        </aside>

        <div className="game-detail__info">
          <nav className="game-detail__breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <Link to="/store">Store</Link>
            <span>›</span>
            <span>{game.name}</span>
          </nav>

          <h1 className="game-detail__title">{game.name}</h1>

          <div className="game-detail__genres">
            {game.genres.map(g => (
              <Link key={g} to={`/store?genre=${encodeURIComponent(g)}`} className="badge badge-genre">
                {g}
              </Link>
            ))}
          </div>

          {game.review_desc && game.review_desc !== 'No Rating' && (
            <div className="game-detail__reviews">
              <div
                className="game-detail__review-bar-bg"
                role="progressbar"
                aria-valuenow={reviewPct ?? 0}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${game.review_desc}: ${reviewPct ?? 0}% positive`}
              >
                <div
                  className="game-detail__review-bar-fill"
                  style={{
                    width: `${reviewPct ?? 0}%`,
                    background: reviewColor,
                  }}
                />
              </div>
              <div className="game-detail__review-stats">
                <span className="game-detail__review-desc" style={{ color: reviewColor }}>
                  {game.review_desc}
                </span>
                {reviewPct != null && (
                  <span className="game-detail__review-pct">
                    {reviewPct}% of {(game.positive + game.negative).toLocaleString()} reviews
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="game-detail__desc-section">
            <h2 className="game-detail__section-title">About This Game</h2>
            <p className="game-detail__desc">
              <strong>{game.name}</strong> is a highly acclaimed title developed by{' '}
              {game.developer ? game.developer.split(',')[0] : 'an acclaimed studio'}.
              {game.genres.length > 0 && ` It spans ${game.genres.join(', ')} genres, `}
              offering players a rich and immersive experience with over{' '}
              {game.playtime_avg > 0
                ? `${Math.round(game.playtime_avg / 60)} hours of average playtime.`
                : 'countless hours of gameplay.'}
              {game.review_desc && game.review_desc !== 'No Rating'
                ? ` The community has rated it "${game.review_desc}" — a testament to its quality.`
                : ''}
            </p>
          </div>

          {game.tags.length > 0 && (
            <div className="game-detail__tags-section">
              <h2 className="game-detail__section-title">Tags</h2>
              <div className="game-detail__tags">
                {game.tags.map(t => (
                  <Link
                    key={t}
                    to={`/store?tag=${encodeURIComponent(t)}`}
                    className="badge badge-tag"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {game.owners_range && (
            <div className="game-detail__owners glass-card">
              <span className="game-detail__owners-icon">👥</span>
              <div>
                <div className="game-detail__owners-label">Estimated Owners</div>
                <div className="game-detail__owners-val">{game.owners_range}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="game-detail__related" aria-labelledby="related-title">
          <div className="container">
            <h2 id="related-title" className="game-detail__related-title">
              You Might Also Like
            </h2>
            <div className="grid grid-4 gap-3">
              {related.map(g => <GameCard key={g.id} game={g} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
