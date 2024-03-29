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
     
      <section className="flex flex-col justify-center bg-white rounded-2xl shadow-xl shadow-gray-400/20 w-full">
              <img className="aspect-video w-full rounded-t-2xl object-cover object-center" src={product.thumbnail} alt="Placeholder" />
              <div className="p-6">
                <small className="text-gray-900 text-xs">{product.category}</small>
                <h1 className="text-2xl font-medium text-gray-700 pb-2">{product.name}</h1>
                <p className="text text-gray-500 leading-6">{product.description}</p>
                <p className="text-gray-700">{product.price}</p>
               
              </div>
            </section>
    </div>
  );
};

export default SingleProduct;
