import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getCoverUrl } from '../data/gameUtils';
import './Cart.css';

const STEPS = [
  { id: 1, label: 'Cart',         icon: '🛒' },
  { id: 2, label: 'Information',  icon: '👤' },
  { id: 3, label: 'Payment',      icon: '💳' },
  { id: 4, label: 'Confirmation', icon: '✅' },
];

const BLANK_INFO = { firstName: '', lastName: '', email: '', address: '', city: '', province: '', postal: '', country: 'Canada' };
const BLANK_PAYMENT = { cardName: '', cardNumber: '', expiry: '', cvv: '' };

export default function Cart() {
  const { items, removeItem, updateQty, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [info, setInfo]       = useState(BLANK_INFO);
  const [payment, setPayment] = useState(BLANK_PAYMENT);
  const [infoErrors, setInfoErrors]       = useState({});
  const [paymentErrors, setPaymentErrors] = useState({});
  const [orderNumber]                      = useState(() => Math.floor(Math.random() * 900000) + 100000);
  const [finalTotal, setFinalTotal]        = useState(0);

  const tax = cartTotal * 0.13;
  const total = cartTotal + tax;

  function validateInfo() {
    const err = {};
    if (!info.firstName.trim()) err.firstName = 'First name is required';
    if (!info.lastName.trim())  err.lastName  = 'Last name is required';
    if (!info.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) err.email = 'Valid email required';
    if (!info.address.trim())   err.address   = 'Address is required';
    if (!info.city.trim())      err.city      = 'City is required';
    if (!info.postal.trim())    err.postal    = 'Postal code is required';
    return err;
  }

  function validatePayment() {
    const err = {};
    if (!payment.cardName.trim())             err.cardName = 'Name on card is required';
    const digits = payment.cardNumber.replace(/\D/g,'');
    if (digits.length < 13 || digits.length > 19) err.cardNumber = 'Enter a valid card number';
    if (!payment.expiry.match(/^\d{2}\/\d{2}$/)) err.expiry = 'Format: MM/YY';
    if (!payment.cvv.match(/^\d{3,4}$/))          err.cvv    = '3 or 4 digits';
    return err;
  }

  function goToInfo() {
    if (items.length > 0) setStep(2);
  }

  function goToPayment() {
    const err = validateInfo();
    setInfoErrors(err);
    if (Object.keys(err).length === 0) setStep(3);
  }

  function goToConfirmation() {
    const err = validatePayment();
    setPaymentErrors(err);
    if (Object.keys(err).length === 0) {
      setFinalTotal(total);
      clearCart();
      setStep(4);
    }
  }

  function formatCard(val) {
    return val.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
  }
  function formatExpiry(val) {
    const d = val.replace(/\D/g,'').slice(0,4);
    return d.length > 2 ? `${d.slice(0,2)}/${d.slice(2)}` : d;
  }

  return (
    <div className="checkout-page">
      <div className="checkout-progress" role="navigation" aria-label="Checkout steps">
        <div className="container checkout-progress__inner">
          {STEPS.map((s, i) => (
            <div key={s.id} className={`checkout-step ${step >= s.id ? 'checkout-step--done' : ''} ${step === s.id ? 'checkout-step--active' : ''}`}>
              <div className="checkout-step__circle" aria-label={`Step ${s.id}: ${s.label}`}>
                {step > s.id ? '✓' : s.icon}
              </div>
              <span className="checkout-step__label">{s.label}</span>
              {i < STEPS.length - 1 && (
                <div className={`checkout-step__line ${step > s.id ? 'checkout-step__line--done' : ''}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="container checkout-body">
        {step === 1 && (
          <div className={`checkout-layout animate-fadeUp ${items.length === 0 ? 'checkout-layout--empty' : ''}`}>
            <main className="checkout-main">
              <h1 className="checkout-title">Your Cart 🛒</h1>
              {items.length === 0 ? (
                <div className="cart-empty">
                  <span className="cart-empty__icon">🕹️</span>
                  <h3>Your cart is empty</h3>
                  <p>Looks like you haven't added any games yet!</p>
                  <Link to="/store" className="btn btn-primary">Browse Games →</Link>
                </div>
              ) : (
                <>
                  <ul className="cart-list" aria-label="Cart items">
                    {items.map(({ game, quantity }) => (
                      <li key={game.id} className="cart-item">
                        <img
                          src={getCoverUrl(game.id)}
                          alt={game.name}
                          className="cart-item__img"
                          onError={e => { e.target.src = `https://via.placeholder.com/120x56/151c2f/7c3aed?text=Game`; }}
                        />
                        <div className="cart-item__info">
                          <Link to={`/game/${game.id}`} className="cart-item__name">{game.name}</Link>
                          <div className="cart-item__badges">
                            {game.genres.slice(0,2).map(g => (
                              <span key={g} className="badge badge-genre">{g}</span>
                            ))}
                          </div>
                        </div>
                        <div className="cart-item__controls">
                          <div className="qty-ctrl">
                            <button
                              className="qty-btn"
                              onClick={() => updateQty(game.id, quantity - 1)}
                              aria-label="Decrease quantity"
                            >−</button>
                            <span className="qty-val" aria-live="polite">{quantity}</span>
                            <button
                              className="qty-btn"
                              onClick={() => updateQty(game.id, quantity + 1)}
                              aria-label="Increase quantity"
                            >+</button>
                          </div>
                          <div className="cart-item__price">
                            ${(game.price * quantity).toFixed(2)}
                          </div>
                          <button
                            className="btn btn-danger btn-sm cart-item__remove"
                            onClick={() => removeItem(game.id)}
                            aria-label={`Remove ${game.name} from cart`}
                          >🗑</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </main>

            {items.length > 0 && (
              <aside className="checkout-summary">
                <div className="glass-card checkout-summary__box">
                  <h2 className="checkout-summary__title">Order Summary</h2>
                  {items.map(({ game, quantity }) => (
                    <div key={game.id} className="checkout-summary__row">
                      <span className="checkout-summary__row-name">
                        {game.name.length > 24 ? game.name.slice(0,24)+'…' : game.name} ×{quantity}
                      </span>
                      <span>${(game.price * quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <hr className="divider" />
                  <div className="checkout-summary__row">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="checkout-summary__row">
                    <span>Tax (13% HST)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="checkout-summary__row checkout-summary__row--total">
                    <span>Total</span>
                    <span className="gradient-text">${total.toFixed(2)}</span>
                  </div>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={goToInfo}
                    id="proceed-to-info-btn"
                    style={{ width: '100%' }}
                  >
                    Proceed to Information →
                  </button>
                  <Link to="/store" className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: 8 }}>
                    ← Continue Shopping
                  </Link>
                </div>
              </aside>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="checkout-layout animate-fadeUp">
            <main className="checkout-main">
              <h1 className="checkout-title">Your Information 👤</h1>
              <p className="checkout-desc">Where should we send your order confirmation?</p>

              <form
                className="checkout-form"
                onSubmit={e => { e.preventDefault(); goToPayment(); }}
                noValidate
                id="info-form"
              >
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName" className="form-label">First Name *</label>
                    <input
                      id="firstName"
                      className={`form-control ${infoErrors.firstName ? 'form-control--error' : ''}`}
                      placeholder="Jane"
                      value={info.firstName}
                      onChange={e => setInfo(v => ({ ...v, firstName: e.target.value }))}
                      required
                    />
                    {infoErrors.firstName && <span className="form-error">{infoErrors.firstName}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName" className="form-label">Last Name *</label>
                    <input
                      id="lastName"
                      className={`form-control ${infoErrors.lastName ? 'form-control--error' : ''}`}
                      placeholder="Smith"
                      value={info.lastName}
                      onChange={e => setInfo(v => ({ ...v, lastName: e.target.value }))}
                      required
                    />
                    {infoErrors.lastName && <span className="form-error">{infoErrors.lastName}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    className={`form-control ${infoErrors.email ? 'form-control--error' : ''}`}
                    placeholder="jane@example.com"
                    value={info.email}
                    onChange={e => setInfo(v => ({ ...v, email: e.target.value }))}
                    required
                  />
                  {infoErrors.email && <span className="form-error">{infoErrors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="address" className="form-label">Street Address *</label>
                  <input
                    id="address"
                    className={`form-control ${infoErrors.address ? 'form-control--error' : ''}`}
                    placeholder="123 Main St"
                    value={info.address}
                    onChange={e => setInfo(v => ({ ...v, address: e.target.value }))}
                    required
                  />
                  {infoErrors.address && <span className="form-error">{infoErrors.address}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city" className="form-label">City *</label>
                    <input
                      id="city"
                      className={`form-control ${infoErrors.city ? 'form-control--error' : ''}`}
                      placeholder="Ottawa"
                      value={info.city}
                      onChange={e => setInfo(v => ({ ...v, city: e.target.value }))}
                      required
                    />
                    {infoErrors.city && <span className="form-error">{infoErrors.city}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="province" className="form-label">Province</label>
                    <select
                      id="province"
                      className="form-control"
                      value={info.province}
                      onChange={e => setInfo(v => ({ ...v, province: e.target.value }))}
                    >
                      <option value="">Select Province</option>
                      {['ON','QC','BC','AB','MB','SK','NS','NB','NL','PE','NT','YT','NU'].map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="postal" className="form-label">Postal Code *</label>
                    <input
                      id="postal"
                      className={`form-control ${infoErrors.postal ? 'form-control--error' : ''}`}
                      placeholder="K1A 0A6"
                      value={info.postal}
                      onChange={e => setInfo(v => ({ ...v, postal: e.target.value }))}
                      required
                    />
                    {infoErrors.postal && <span className="form-error">{infoErrors.postal}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="country" className="form-label">Country</label>
                    <select
                      id="country"
                      className="form-control"
                      value={info.country}
                      onChange={e => setInfo(v => ({ ...v, country: e.target.value }))}
                    >
                      <option>Canada</option>
                      <option>United States</option>
                    </select>
                  </div>
                </div>
              </form>
            </main>

            <aside className="checkout-summary">
              <div className="glass-card checkout-summary__box">
                <h2 className="checkout-summary__title">Order Summary</h2>
                {items.map(({ game, quantity }) => (
                  <div key={game.id} className="checkout-summary__row">
                    <span>{game.name.slice(0,22)}… ×{quantity}</span>
                    <span>${(game.price * quantity).toFixed(2)}</span>
                  </div>
                ))}
                <hr className="divider" />
                <div className="checkout-summary__row checkout-summary__row--total">
                  <span>Total</span>
                  <span className="gradient-text">${total.toFixed(2)}</span>
                </div>
                <button
                  form="info-form"
                  type="submit"
                  className="btn btn-primary btn-lg"
                  id="proceed-to-payment-btn"
                  style={{ width: '100%' }}
                >
                  Continue to Payment →
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', marginTop: 8 }}
                  onClick={() => setStep(1)}
                >
                  ← Back to Cart
                </button>
              </div>
            </aside>
          </div>
        )}

        {step === 3 && (
          <div className="checkout-layout animate-fadeUp">
            <main className="checkout-main">
              <h1 className="checkout-title">Payment Details 💳</h1>
              <p className="checkout-desc">
                Your payment information is protected with 256-bit encryption. 🔒
              </p>

              <form
                className="checkout-form"
                id="payment-form"
                onSubmit={e => { e.preventDefault(); goToConfirmation(); }}
                noValidate
              >
                <div className="form-group">
                  <label htmlFor="cardName" className="form-label">Name on Card *</label>
                  <input
                    id="cardName"
                    className={`form-control ${paymentErrors.cardName ? 'form-control--error' : ''}`}
                    placeholder="Jane Smith"
                    value={payment.cardName}
                    onChange={e => setPayment(v => ({ ...v, cardName: e.target.value }))}
                    required
                  />
                  {paymentErrors.cardName && <span className="form-error">{paymentErrors.cardName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="cardNumber" className="form-label">Card Number *</label>
                  <div className="card-input-wrap">
                    <input
                      id="cardNumber"
                      className={`form-control ${paymentErrors.cardNumber ? 'form-control--error' : ''}`}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      value={payment.cardNumber}
                      onChange={e => setPayment(v => ({ ...v, cardNumber: formatCard(e.target.value) }))}
                      inputMode="numeric"
                      required
                    />
                    <span className="card-icons">💳</span>
                  </div>
                  {paymentErrors.cardNumber && <span className="form-error">{paymentErrors.cardNumber}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiry" className="form-label">Expiry Date *</label>
                    <input
                      id="expiry"
                      className={`form-control ${paymentErrors.expiry ? 'form-control--error' : ''}`}
                      placeholder="MM/YY"
                      maxLength={5}
                      value={payment.expiry}
                      onChange={e => setPayment(v => ({ ...v, expiry: formatExpiry(e.target.value) }))}
                      inputMode="numeric"
                      required
                    />
                    {paymentErrors.expiry && <span className="form-error">{paymentErrors.expiry}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="cvv" className="form-label">CVV *</label>
                    <input
                      id="cvv"
                      className={`form-control ${paymentErrors.cvv ? 'form-control--error' : ''}`}
                      placeholder="123"
                      maxLength={4}
                      type="password"
                      value={payment.cvv}
                      onChange={e => setPayment(v => ({ ...v, cvv: e.target.value.replace(/\D/g,'') }))}
                      inputMode="numeric"
                      required
                    />
                    {paymentErrors.cvv && <span className="form-error">{paymentErrors.cvv}</span>}
                  </div>
                </div>

                <div className="payment-security">
                  🔒 <span>Payments are encrypted and secure. We never store your card details.</span>
                </div>
              </form>
            </main>

            <aside className="checkout-summary">
              <div className="glass-card checkout-summary__box">
                <h2 className="checkout-summary__title">Order Summary</h2>
                <div className="checkout-summary__row">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="checkout-summary__row">
                  <span>Tax (13%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <hr className="divider" />
                <div className="checkout-summary__row checkout-summary__row--total">
                  <span>Total</span>
                  <span className="gradient-text">${total.toFixed(2)}</span>
                </div>

                <div className="checkout-summary__shipping">
                  📬 Shipping to: <strong>{info.firstName} {info.lastName}</strong>
                  <br />{info.address}, {info.city} {info.province}
                </div>

                <button
                  form="payment-form"
                  type="submit"
                  className="btn btn-primary btn-lg"
                  id="place-order-btn"
                  style={{ width: '100%' }}
                >
                  🔒 Place Order — ${total.toFixed(2)}
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', marginTop: 8 }}
                  onClick={() => setStep(2)}
                >
                  ← Back to Information
                </button>
              </div>
            </aside>
          </div>
        )}

        {step === 4 && (
          <div className="checkout-confirm animate-fadeUp">
            <div className="confirm-card glass-card">
              <div className="confirm-icon">🎉</div>
              <h1 className="confirm-title">Order Confirmed!</h1>
              <p className="confirm-sub">
                Thank you, <strong>{info.firstName}</strong>! Your order has been placed successfully.
              </p>
              <div className="confirm-order-no">
                Order #{orderNumber}
              </div>
              <p className="confirm-email">
                A confirmation email has been sent to <strong>{info.email}</strong>.
              </p>
              <div className="confirm-total">
                Total charged: <span className="gradient-text">${finalTotal.toFixed(2)}</span>
              </div>
              <div className="confirm-actions">
                <Link to="/store" className="btn btn-primary btn-lg">
                  🎮 Keep Shopping
                </Link>
                <Link to="/survey" className="btn btn-secondary btn-lg">
                  💬 Share Your Feedback
                </Link>
              </div>
              <p className="confirm-survey-nudge">
                Loved your experience? We'd really appreciate hearing from you — it helps us make EZGAMES even better! 🙏
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
