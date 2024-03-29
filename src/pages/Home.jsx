import React, { useState, useEffect, useCallback, useLayoutEffect, useDeferredValue, useMemo } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 6; // Number of items per page

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  useLayoutEffect(() => {
    if (deferredSearchTerm.trim() !== '') {
      const timer = setTimeout(() => {
        fetchProducts(deferredSearchTerm);
      }, 500); // Debounce time

      return () => clearTimeout(timer);
    } else {
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
    navigate(`/product/${productId}`);
  }, [navigate]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return products.slice(startIndex, endIndex);
  }, [currentPage, products]);

  const totalPages = Math.ceil(products.length / PAGE_SIZE);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="text-center mb-4">
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

      <div className="flex flex-wrap justify-center">
        {paginatedProducts.map((product, index) => (
          <div key={index} className="mx-auto flex w-full md:w-1/2 px-2 mb-4">
            <section className="flex flex-col justify-center bg-white rounded-2xl shadow-xl shadow-gray-400/20 w-full">
              <img className="aspect-video w-full rounded-t-2xl object-cover object-center" src={product.thumbnail} alt="Placeholder" />
              <div className="p-6">
                <small className="text-gray-900 text-xs">{product.category}</small>
                <h1 className="text-2xl font-medium text-gray-700 pb-2">{product.name}</h1>
                <p className="text text-gray-500 leading-6">{product.description}</p>
                <p className="text-gray-700">{product.price}</p>
                <button onClick={() => handleProductClick(product.id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">View More</button>
              </div>
            </section>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`mx-1 px-3 py-1 border ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-200'}`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
