import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import type { RootState } from '../store';
import { useSelector } from 'react-redux';

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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editSku, setEditSku] = useState('');
  const [editQuantity, setEditQuantity] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [search, products]);

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/products');
      setProducts(res.data.data);
    } catch (err) {
      console.error(err);
      setMessage('Failed to load products');
      openModal();
    }
    setLoading(false);
  };

  const handleSearch = () => {
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
      setMessage('Product deleted successfully.');
      openModal();
    } catch (err) {
      console.error(err);
      setMessage('Failed to delete product.');
      openModal();
    }
  };

  const openEditModal = async (id: number) => {
    try {
      const res = await axios.get(`/products/${id}`);
      const product = res.data.data;
      setSelectedProductId(id);
      setEditName(product.name);
      setEditSku(product.sku);
      setEditQuantity(product.quantity);
      setIsEditing(true);
      const modal = document.getElementById('product_modal') as HTMLDialogElement;
      modal.showModal();
    } catch (err) {
      console.error(err);
      setMessage('Failed to load product details.');
      openModal();
    }
  };

  const openCreateModal = () => {
    setSelectedProductId(null);
    setEditName('');
    setEditSku('');
    setEditQuantity(0);
    setIsEditing(false);
    const modal = document.getElementById('product_modal') as HTMLDialogElement;
    modal.showModal();
  };

  const openModal = () => {
    const modal = document.getElementById('message_modal') as HTMLDialogElement;
    modal.showModal();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isEditing && selectedProductId) {
        const existingRes = await axios.get(`/products/${selectedProductId}`);
        const existingProduct = existingRes.data.data;
        const res = await axios.put(`/products/${selectedProductId}`, {
          id: selectedProductId,
          name: editName,
          sku: editSku,
          quantity: editQuantity,
          createdDate: existingProduct.createdDate,
          updatedDate: new Date().toISOString(),
        });
        setProducts(products.map((p) => p.id === selectedProductId ? res.data.data : p));
        setMessage('Product updated successfully.');
      } else {
        const res = await axios.post('/products', {
          name: editName,
          sku: editSku,
          quantity: editQuantity,
        });
        setProducts([...products, res.data.data]);
        setMessage('Product created successfully.');
      }
      const modal = document.getElementById('product_modal') as HTMLDialogElement;
      modal.close();
      openModal();
    } catch (err) {
      console.error(err);
      setMessage(isEditing ? 'Failed to update product.' : 'Failed to create product.');
      openModal();
    }
    setSaving(false);
  };


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full px-4 m-10">
        <h2 className="text-2xl font-bold mb-4">Product List</h2>

        <div className="mb-4 flex justify-between items-center">
          <button className="btn btn-primary" onClick={openCreateModal}>Add Product</button>
          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered w-1/5"
          />
        </div>

        {loading ? (
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded shadow border border-gray-300 min-h-[300px]">
              <table className="table table-zebra w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th>No.</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>SKU</th>
                    <th>Quantity</th>
                    {auth.user?.role === 'admin' && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((p, index) => (
                    <tr key={p.id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td> {/* penomoran global */}
                      <td>{p.id}</td>
                      <td>{p.name}</td>
                      <td>{p.sku}</td>
                      <td>{p.quantity}</td>
                      {auth.user?.role === 'admin' && (
                        <td>
                          <div className="flex space-x-2">
                            <button className="btn btn-xs btn-warning" onClick={() => openEditModal(p.id)}>Edit</button>
                            <button className="btn btn-xs btn-error" onClick={() => handleDelete(p.id)}>Delete</button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Untuk pagination */}
            <div className="mt-4 flex justify-center space-x-2">
              {Array.from({ length: Math.ceil(filteredProducts.length / itemsPerPage) }, (_, i) => (
                <button
                  key={i + 1}
                  className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : ''}`}
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}
{/* Modal untuk edit dan simpan */}
        <dialog id="product_modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{isEditing ? 'Edit Product' : 'Create Product'}</h3>
            <div className="py-4 space-y-2">
              <input
                type="text"
                placeholder="Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="input input-bordered w-full"
              />
              <input
                type="text"
                placeholder="SKU"
                value={editSku}
                onChange={(e) => setEditSku(e.target.value)}
                className="input input-bordered w-full"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={editQuantity}
                onChange={(e) => setEditQuantity(Number(e.target.value))}
                className="input input-bordered w-full"
              />
            </div>
            <div className="modal-action">
              <form method="dialog">
                <button
                  className={`btn btn-primary ${saving ? 'btn-disabled' : ''}`}
                  type="button"
                  onClick={handleSave}
                >
                  {saving ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    isEditing ? 'Update' : 'Create'
                  )}
                </button>
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>

      
        <dialog id="message_modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Notification</h3>
            <p className="py-4">{message}</p>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn btn-primary">OK</button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default Product;
