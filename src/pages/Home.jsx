import React, { useState, useEffect, useCallback, useMemo, useLayoutEffect, useDeferredValue } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const user = useMemo(() => JSON.parse(localStorage.getItem('user')), []);
  const navigate = useNavigate();

  // Function to fetch all products initially
  const fetchAllProducts = useCallback(async () => {
    try {
      const response = await fetch(`https://dummyjson.com/products`);
      const data = await response.json();
      if (Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        console.error('Invalid API response:', data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, []);

  // Function to fetch products based on search term
  const fetchProducts = useCallback(async (searchTerm) => {
    try {
      const response = await fetch(`https://dummyjson.com/products/search?q=${searchTerm}`);
      const data = await response.json();
      if (Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        console.error('Invalid API response:', data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, []);

  // Effect to fetch all products initially
  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // Effect to fetch products based on search term
  useLayoutEffect(() => {
    if (deferredSearchTerm.trim() !== '') {
      const timer = setTimeout(() => {
        fetchProducts(deferredSearchTerm);
      }, 500); // Debounce time

      return () => clearTimeout(timer);
    } else {
      // If search term is empty, fetch all products again
      fetchAllProducts();
    }
  }, [deferredSearchTerm, fetchProducts, fetchAllProducts]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate("/login");
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }, [navigate]);

  const handleProductClick = useCallback((productId) => {
    // Navigate to the single product page
    navigate(`/product/${productId}`);
  }, [navigate]);

  return (
    <div className="max-w-md mx-auto mt-8">
      {user && <h2 className="text-center mb-4">Logged in as: {user.email}</h2>}
      
      <div className="flex justify-center mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search..."
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          onClick={handleLogout}
          className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Logout
        </button>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Products</h3>
        <div className="grid grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product.id} className="bg-white p-4 shadow-md rounded-md" onClick={() => handleProductClick(product.id)}>
              <h4 className="font-bold text-lg">{product.name}</h4>
              <p className="mt-2 text-gray-600">{product.description}</p>
              <p className="mt-2 text-gray-700">${product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;