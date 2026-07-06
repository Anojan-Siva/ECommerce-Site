import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getCoverUrl, getReviewColor, getReviewPercent } from '../data/gameUtils';
import './GameCard.css';

export default function GameCard({ game, featured = false }) {
  const { addItem, toggleWishlist, wishlist } = useCart();
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);

  const inWishlist = wishlist.includes(game.id);
  const pct = getReviewPercent(game);

  function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    addItem(game);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleWishlist(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(game.id);
  }

  const coverUrl = imgError
    ? `https://via.placeholder.com/460x215/151c2f/7c3aed?text=${encodeURIComponent(game.name)}`
    : getCoverUrl(game.id);

  return (
    <article className={`game-card ${featured ? 'game-card--featured' : ''}`}>
      <Link to={`/game/${game.id}`} className="game-card__link">
        <div className="game-card__cover">
          <img
            src={coverUrl}
            alt={`${game.name} cover art`}
            className="game-card__img"
            onError={() => setImgError(true)}
            loading="lazy"
          />

          {game.discount_pct > 0 && (
            <span className="game-card__sale-badge badge badge-sale">
              -{game.discount_pct}%
            </span>
          )}

          <button
            className={`game-card__wish-btn ${inWishlist ? 'game-card__wish-btn--active' : ''}`}
            onClick={handleWishlist}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {inWishlist ? '❤️' : '🤍'}
          </button>

          <div className="game-card__overlay">
            <p className="game-card__overlay-text">View Details →</p>
          </div>
        </div>

        <div className="game-card__body">
          <h3 className="game-card__title">{game.name}</h3>

          <div className="game-card__genres">
            {game.genres.slice(0, 3).map(g => (
              <span key={g} className="badge badge-genre">{g}</span>
            ))}
          </div>

          {game.review_desc && game.review_desc !== 'No Rating' && (
            <div className="game-card__rating">
              <span
                className="game-card__rating-dot"
                style={{ background: getReviewColor(game.review_desc) }}
              />
              <span className="game-card__rating-label">{game.review_desc}</span>
              {pct != null && (
                <span className="game-card__rating-pct">({pct}%)</span>
              )}
            </div>
          )}

          <div className="game-card__price-row">
            <div className="game-card__prices">
              {game.discount_pct > 0 && (
                <span className="game-card__original-price">
                  ${game.original_price.toFixed(2)}
                </span>
              )}
              <span className={`game-card__price ${game.discount_pct > 0 ? 'game-card__price--sale' : ''}`}>
                ${game.price.toFixed(2)}
              </span>
            </div>
            <button
              className={`btn btn-primary btn-sm game-card__add-btn ${added ? 'game-card__add-btn--added' : ''}`}
              onClick={handleAddToCart}
              aria-label={`Add ${game.name} to cart`}
            >
              {added ? '✓ Added' : '+ Cart'}
            </button>
          </div>
        </div>
      </Link>
    </article>
  );
}
