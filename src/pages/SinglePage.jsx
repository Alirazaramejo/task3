// SingleProduct.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const SingleProduct = () => {
  const { id } = useParams(); // Get the product id from the URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Fetch the details of the product with the given id
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        const data = await response.json();
        setProduct(data); // Set the product details in the state
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>; // Display a loading message while fetching product details
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">{product.name}</h2>
      <p className="text-gray-600">{product.description}</p>
      <p className="mt-2 text-gray-700">${product.price}</p>
    </div>
  );
};

export default SingleProduct;
