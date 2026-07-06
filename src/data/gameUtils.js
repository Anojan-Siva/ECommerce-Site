import gamesData from '../data/games.json';

const VALID_GENRES = ['Action', 'Adventure', 'Casual', 'Indie', 'Massively Multiplayer', 'RPG', 'Simulation', 'Strategy'];

export const games = gamesData.map(g => ({
  ...g,
  genres: g.genres.filter(genre => VALID_GENRES.includes(genre) && genre.toLowerCase() !== 'free to play'),
})).filter(g => g.price > 0);

export const allGenres = [...new Set(games.flatMap(g => g.genres))].sort();

const tagCount = {};
games.forEach(g => g.tags.forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1; }));
export const popularTags = Object.entries(tagCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 30)
  .map(([tag]) => tag);

export const PRICE_RANGES = [
  { label: 'Under $10', min: 0, max: 10 },
  { label: '$10 – $20', min: 10, max: 20 },
  { label: '$20 – $40', min: 20, max: 40 },
  { label: '$40 – $60', min: 40, max: 60 },
  { label: 'Over $60', min: 60, max: Infinity },
];

export const REVIEW_LEVELS = [
  'Overwhelmingly Positive',
  'Very Positive',
  'Mostly Positive',
  'Mixed',
  'Mostly Negative',
];

export function getReviewColor(desc) {
  if (!desc) return 'var(--text-muted)';
  if (desc.includes('Overwhelmingly Positive')) return '#4ade80';
  if (desc.includes('Very Positive')) return '#86efac';
  if (desc.includes('Mostly Positive')) return '#bef264';
  if (desc.includes('Mixed')) return '#fbbf24';
  if (desc.includes('Mostly Negative')) return '#f87171';
  if (desc.includes('Overwhelmingly Negative')) return '#ef4444';
  return 'var(--text-muted)';
}

export function getReviewPercent(game) {
  const total = game.positive + game.negative;
  if (!total) return null;
  return Math.round((game.positive / total) * 100);
}

export function getYearFromDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getFullYear()) ? null : d.getFullYear();
}

export function getCoverUrl(appId) {
  return `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;
}
