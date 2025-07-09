import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

interface Product {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  createdDate: string;
  updatedDate: string;
}

const Product: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/products');
        console.log(res.data.data)
        setProducts(res.data.data);
      } catch (err) {
        console.error(err);
        setMessage('Failed to load products');
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Product List</h2>
      {message && <p className="text-red-500">{message}</p>}
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">SKU</th>
            <th className="border px-2 py-1">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="border px-2 py-1">{p.id}</td>
              <td className="border px-2 py-1">{p.name}</td>
              <td className="border px-2 py-1">{p.sku}</td>
              <td className="border px-2 py-1">{p.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Product;