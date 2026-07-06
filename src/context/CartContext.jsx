import { createContext, useContext, useReducer, useCallback } from 'react';

const CartContext = createContext(null);

const initialState = {
  items: [],      
  wishlist: [],   
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.game.id === action.game.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.game.id === action.game.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, { game: action.game, quantity: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.game.id !== action.gameId) };
    case 'UPDATE_QTY': {
      if (action.qty <= 0) {
        return { ...state, items: state.items.filter(i => i.game.id !== action.gameId) };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.game.id === action.gameId ? { ...i, quantity: action.qty } : i
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'TOGGLE_WISHLIST': {
      const inWish = state.wishlist.includes(action.gameId);
      return {
        ...state,
        wishlist: inWish
          ? state.wishlist.filter(id => id !== action.gameId)
          : [...state.wishlist, action.gameId],
      };
    }
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = useCallback((game) => dispatch({ type: 'ADD_ITEM', game }), []);
  const removeItem = useCallback((gameId) => dispatch({ type: 'REMOVE_ITEM', gameId }), []);
  const updateQty = useCallback((gameId, qty) => dispatch({ type: 'UPDATE_QTY', gameId, qty }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);
  const toggleWishlist = useCallback((gameId) => dispatch({ type: 'TOGGLE_WISHLIST', gameId }), []);

  const cartTotal = state.items.reduce((acc, i) => acc + i.game.price * i.quantity, 0);
  const cartCount = state.items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, updateQty, clearCart, toggleWishlist, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
