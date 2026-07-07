import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ViewModal from '../components/ViewModal';
import ImageViewer from '../components/ImageViewer';

export default function ProductQueuePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewProduct, setViewProduct] = useState(null);

  const fetchProducts = () => {
    api.get('/admin/products/pending')
      .then(res => setProducts(res.data.items))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleReview = async (id, decision) => {
    await api.patch(`/admin/products/${id}/review`, { decision, admin_notes: decision === 'APPROVED' ? 'Looks good' : 'Not appropriate' });
    fetchProducts();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#2A2A2A] mb-6">Product Approval Queue</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm font-semibold">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Seller</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan="6" className="p-6 text-center text-gray-500">No pending products.</td></tr>
            ) : (
              products.map(product => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-700">{product.title}</td>
                  <td className="px-6 py-4 text-gray-700">{product.seller?.email}</td>
                  <td className="px-6 py-4 text-gray-700">NRs. {product.starting_price}</td>
                  <td className="px-6 py-4 text-gray-700">{product.category}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-700">Pending</span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => setViewProduct(product)} className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg">View</button>
                    <button onClick={() => handleReview(product.id, 'APPROVED')} className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg">Approve</button>
                    <button onClick={() => handleReview(product.id, 'REJECTED')} className="px-3 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg">Reject</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {viewProduct && (
        <ViewModal title={viewProduct.title} onClose={() => setViewProduct(null)}>
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500">Category</p>
                <p className="font-semibold text-[#2A2A2A]">{viewProduct.category}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Condition</p>
                <p className="font-semibold text-[#2A2A2A]">{viewProduct.condition}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Starting Price</p>
                <p className="font-semibold text-[#C41E3A]">NRs. {viewProduct.starting_price?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Seller</p>
                <p className="font-semibold text-[#2A2A2A]">{viewProduct.seller?.email}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">{viewProduct.description}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Product Images</h3>
              {viewProduct.image_urls && viewProduct.image_urls.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {viewProduct.image_urls.map((url, i) => (
                    <div key={i} className="h-48">
                      <ImageViewer src={url} alt={`Product ${i+1}`} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">No images uploaded.</p>
              )}
            </div>
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button onClick={() => { handleReview(viewProduct.id, 'APPROVED'); setViewProduct(null); }}
                className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition">Approve Product</button>
              <button onClick={() => { handleReview(viewProduct.id, 'REJECTED'); setViewProduct(null); }}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-red-50 hover:text-red-600 transition">Reject Product</button>
            </div>
          </div>
        </ViewModal>
      )}
    </div>
  );
}