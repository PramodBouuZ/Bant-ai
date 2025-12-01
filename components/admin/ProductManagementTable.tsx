
import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import { Product, ProductCategory } from '../../types';
import LoadingSpinner from '../LoadingSpinner';
import Modal from '../Modal';

const ProductManagementTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedProducts: Product[] = (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        image: p.image,
        shortFeatures: p.short_features || [],
        pricing: p.pricing,
        category: p.category,
        description: p.description,
        rating: p.rating,
        tags: p.tags || [],
        originalPrice: p.original_price
      }));
      setProducts(mappedProducts);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Ensure the "products" table exists.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setCurrentProduct({
      name: '',
      category: ProductCategory.CUSTOM_REQUIREMENT,
      pricing: '',
      image: 'https://picsum.photos/400/250',
      shortFeatures: [],
      tags: [],
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const convertBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result as string);
      fileReader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) { // 500KB Limit
        alert("Image size too large (Max 500KB)");
        return;
      }
      try {
        const base64 = await convertBase64(file);
        setCurrentProduct(prev => ({ ...prev, image: base64 }));
      } catch (err) {
        alert("Failed to process image");
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        name: currentProduct.name,
        image: currentProduct.image,
        category: currentProduct.category,
        pricing: currentProduct.pricing,
        description: currentProduct.description,
        short_features: currentProduct.shortFeatures,
        tags: currentProduct.tags,
        rating: currentProduct.rating || 4.5 
      };

      if (currentProduct.id) {
        const { error } = await supabase.from('products').update(payload).eq('id', currentProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert([payload]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      console.error('Save failed:', err);
      alert('Failed to save product: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><LoadingSpinner /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Product Catalog</h2>
        <button 
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
        >
          + Add New Product
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pricing</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img className="h-10 w-10 rounded object-cover mr-3" src={product.image} alt="" />
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{product.category}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{product.pricing}</td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
             {products.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No products found. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentProduct.id ? "Edit Product" : "Add New Product"}>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input 
              type="text" 
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={currentProduct.name || ''}
              onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select 
               className="mt-1 block w-full border border-gray-300 rounded-md p-2"
               value={currentProduct.category || ''}
               onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})}
            >
              {Object.values(ProductCategory).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700">Pricing Label</label>
             <input 
              type="text" 
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="e.g. ₹500/mo"
              value={currentProduct.pricing || ''}
              onChange={e => setCurrentProduct({...currentProduct, pricing: e.target.value})}
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700">Product Image</label>
             <div className="flex items-center space-x-4">
               {currentProduct.image && (
                 <img src={currentProduct.image} alt="Preview" className="h-12 w-12 object-cover rounded border" />
               )}
               <input 
                type="file" 
                accept="image/*"
                className="mt-1 block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                onChange={handleImageUpload}
              />
             </div>
             <p className="text-xs text-gray-500 mt-1">Upload PNG/JPG (Max 500KB)</p>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700">Description</label>
             <textarea 
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              rows={3}
              value={currentProduct.description || ''}
              onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})}
            />
          </div>

          <button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ProductManagementTable;
