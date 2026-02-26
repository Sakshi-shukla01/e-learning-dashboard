// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../api";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const token = localStorage.getItem("token");

  const fetchCart = async () => {
    if (!token) return setCartCount(0);
    try {
      const res = await axios.get(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data.cart || []);
      setCartCount(res.data.cart?.length || 0);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCartItems([]);
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, cartCount, setCartCount, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook to use CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
