import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  games, allGenres, popularTags, PRICE_RANGES, REVIEW_LEVELS
} from '../data/gameUtils';
import GameCard from '../components/GameCard';
import './Store.css';

const SORT_OPTIONS = [
  { value: 'popular',   label: 'Most Popular' },
  { value: 'rating',    label: 'Highest Rated' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'newest',    label: 'Newest First' },
  { value: 'discount',  label: 'Biggest Discount' },
];

export default function Store() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [sort, setSort]             = useState('popular');
  const [searchQ, setSearchQ]       = useState(searchParams.get('q') || '');
  const [genres, setGenres]         = useState(
    searchParams.get('genre') ? [searchParams.get('genre')] : []
  );
  const [tags, setTags]             = useState([]);
  const [priceRange, setPriceRange] = useState(null); 
  const [reviews, setReviews]       = useState([]);   
  const [onSale, setOnSale]         = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    const g = searchParams.get('genre');
    if (q) setSearchQ(q);
    if (g) setGenres([g]);
  }, []); 

  const filtered = useMemo(() => {
    let list = [...games];

    if (searchQ.trim()) {
      const q = searchQ.toLowerCase();
      list = list.filter(g =>
        g.name.toLowerCase().includes(q) ||
        g.genres.some(gn => gn.toLowerCase().includes(q)) ||
        g.tags.some(t => t.toLowerCase().includes(q)) ||
        (g.developer && g.developer.toLowerCase().includes(q))
      );
    }

    if (genres.length > 0) {
      list = list.filter(g => genres.some(sel => g.genres.includes(sel)));
    }

    if (tags.length > 0) {
      list = list.filter(g => tags.every(t => g.tags.includes(t)));
    }

    if (priceRange !== null) {
      const { min, max } = PRICE_RANGES[priceRange];
      list = list.filter(g => g.price >= min && g.price < max);
    }

    if (reviews.length > 0) {
      list = list.filter(g => reviews.includes(g.review_desc));
    }

    if (onSale) {
      list = list.filter(g => g.discount_pct > 0);
    }

    switch (sort) {
      case 'rating':
        list.sort((a, b) => b.review_score - a.review_score || b.positive - a.positive);
        break;
      case 'price_asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        list.sort((a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0));
        break;
      case 'discount':
        list.sort((a, b) => b.discount_pct - a.discount_pct);
        break;
      case 'popular':
      default:
        list.sort((a, b) => b.positive - a.positive);
        break;
    }

    return list;
  }, [searchQ, genres, tags, priceRange, reviews, onSale, sort]);

  function toggleGenre(genre) {
    setGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  }

  function toggleTag(tag) {
    setTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  }

  function toggleReview(desc) {
    setReviews(prev =>
      prev.includes(desc) ? prev.filter(d => d !== desc) : [...prev, desc]
    );
  }

  function clearAll() {
    setSearchQ('');
    setGenres([]);
    setTags([]);
    setPriceRange(null);
    setReviews([]);
    setOnSale(false);
    setSort('popular');
    setSearchParams({});
  }

  const hasFilters = searchQ || genres.length > 0 || tags.length > 0 || priceRange !== null || reviews.length > 0 || onSale;

  return (
    <div className="store-page">
      <div className="store-page__header">
        <div className="container">
          <div className="store-page__header-inner">
            <div>
              <h1 className="store-page__title">
                Game <span className="gradient-text">Store</span>
              </h1>
              <p className="store-page__subtitle">
                {filtered.length} game{filtered.length !== 1 ? 's' : ''} found
                {hasFilters ? ' (filtered)' : ''}
              </p>
            </div>
            <div className="store-page__controls">
              <select
                className="form-control store-page__sort"
                value={sort}
                onChange={e => setSort(e.target.value)}
                aria-label="Sort games"
                id="sort-select"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <button
                className="btn btn-secondary btn-sm store-page__filter-toggle"
                onClick={() => setSidebarOpen(o => !o)}
                aria-expanded={sidebarOpen}
                aria-controls="filter-sidebar"
              >
                🔧 Filters {hasFilters ? `(${[genres.length, tags.length, priceRange !== null ? 1 : 0, reviews.length, onSale ? 1 : 0].reduce((a,b)=>a+b,0)})` : ''}
              </button>
            </div>
          </div>

          {hasFilters && (
            <div className="store-page__chips">
              {searchQ && (
                <button className="filter-chip" onClick={() => setSearchQ('')}>
                  🔍 "{searchQ}" ✕
                </button>
              )}
              {genres.map(g => (
                <button key={g} className="filter-chip" onClick={() => toggleGenre(g)}>
                  {g} ✕
                </button>
              ))}
              {tags.map(t => (
                <button key={t} className="filter-chip filter-chip--tag" onClick={() => toggleTag(t)}>
                  #{t} ✕
                </button>
              ))}
              {priceRange !== null && (
                <button className="filter-chip" onClick={() => setPriceRange(null)}>
                  {PRICE_RANGES[priceRange].label} ✕
                </button>
              )}
              {reviews.map(r => (
                <button key={r} className="filter-chip" onClick={() => toggleReview(r)}>
                  {r} ✕
                </button>
              ))}
              {onSale && (
                <button className="filter-chip filter-chip--sale" onClick={() => setOnSale(false)}>
                  On Sale ✕
                </button>
              )}
              <button className="filter-chip filter-chip--clear" onClick={clearAll}>
                Clear All ✕
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="store-page__body container">
        <aside
          id="filter-sidebar"
          className={`store-sidebar ${sidebarOpen ? 'store-sidebar--open' : ''}`}
          aria-label="Filter options"
        >
          <div className="store-sidebar__section">
            <h3 className="store-sidebar__heading">🔍 Search</h3>
            <input
              type="search"
              className="form-control"
              placeholder="Game name, genre, tag..."
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              aria-label="Search games by name, genre or tag"
            />
          </div>

          <div className="store-sidebar__section">
            <h3 className="store-sidebar__heading">🎭 Genre</h3>
            {allGenres.map(genre => (
              <label key={genre} className="form-checkbox">
                <input
                  type="checkbox"
                  checked={genres.includes(genre)}
                  onChange={() => toggleGenre(genre)}
                  id={`genre-${genre}`}
                />
                <span>{genre}</span>
                <span className="filter-count">
                  ({games.filter(g => g.genres.includes(genre)).length})
                </span>
              </label>
            ))}
          </div>

          <div className="store-sidebar__section">
            <h3 className="store-sidebar__heading">💰 Price Range</h3>
            {PRICE_RANGES.map((range, i) => (
              <label key={range.label} className="form-checkbox">
                <input
                  type="radio"
                  name="price-range"
                  checked={priceRange === i}
                  onChange={() => setPriceRange(priceRange === i ? null : i)}
                  id={`price-${i}`}
                />
                <span>{range.label}</span>
              </label>
            ))}
          </div>

          <div className="store-sidebar__section">
            <h3 className="store-sidebar__heading">⭐ Review Score</h3>
            {REVIEW_LEVELS.map(lvl => (
              <label key={lvl} className="form-checkbox">
                <input
                  type="checkbox"
                  checked={reviews.includes(lvl)}
                  onChange={() => toggleReview(lvl)}
                  id={`review-${lvl}`}
                />
                <span style={{ fontSize: '0.85rem' }}>{lvl}</span>
              </label>
            ))}
          </div>

          <div className="store-sidebar__section">
            <h3 className="store-sidebar__heading">🔖 Popular Tags</h3>
            <div className="tag-cloud">
              {popularTags.slice(0, 20).map(tag => (
                <button
                  key={tag}
                  className={`tag-btn ${tags.includes(tag) ? 'tag-btn--active' : ''}`}
                  onClick={() => toggleTag(tag)}
                  aria-pressed={tags.includes(tag)}
                  id={`tag-${tag.replace(/\s+/g, '-')}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="store-sidebar__section">
            <h3 className="store-sidebar__heading">🏷️ Special</h3>
            <label className="form-checkbox">
              <input
                type="checkbox"
                checked={onSale}
                onChange={() => setOnSale(v => !v)}
                id="on-sale-checkbox"
              />
              <span>On Sale Only</span>
            </label>
          </div>

          {hasFilters && (
            <button className="btn btn-secondary btn-sm" onClick={clearAll}
              style={{ width: '100%', marginTop: 8 }}>
              Clear All Filters
            </button>
          )}
        </aside>

        <section className="store-grid" aria-live="polite" aria-label="Game results">
          {filtered.length === 0 ? (
            <div className="store-empty">
              <span className="store-empty__icon">🕹️</span>
              <h3>No games match your filters</h3>
              <p>Try adjusting your search criteria or clearing some filters.</p>
              <button className="btn btn-primary" onClick={clearAll}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="store-grid__games">
              {filtered.map(g => (
                <GameCard key={g.id} game={g} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
