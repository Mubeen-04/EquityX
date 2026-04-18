import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getFavorites, addFavorite, removeFavorite } from "./api";

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getFavorites();
      setFavorites(response.data || []);
      console.log("Favorites loaded:", response.data);
    } catch (err) {
      console.error("Error loading favorites:", err);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFavorite = useCallback(async (stockName) => {
    try {
      const isFavorite = favorites.includes(stockName);
      
      if (isFavorite) {
        await removeFavorite(stockName);
        setFavorites(prev => prev.filter(fav => fav !== stockName));
        console.log(`Removed ${stockName} from favorites`);
      } else {
        await addFavorite(stockName);
        setFavorites(prev => [...prev, stockName]);
        console.log(`Added ${stockName} to favorites`);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      // Reload from backend in case of error to keep state consistent
      loadFavorites();
      throw err;
    }
  }, [favorites, loadFavorites]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        toggleFavorite,
        loadFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
