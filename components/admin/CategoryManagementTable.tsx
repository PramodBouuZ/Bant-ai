
import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import { Category } from '../../types';
import LoadingSpinner from '../LoadingSpinner';
import Modal from '../Modal';

const CategoryManagementTable: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({});
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      if (data) {
        setCategories(data);
      }
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Ensure the "categories" table exists.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = () => {
    setCurrentCategory({ name: '', icon: '📁' });
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setCurrentCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      alert('Failed to delete category: ' + err.message);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (!currentCategory.name) {
        alert("Category name is required");
        setSaving(false);
        return;
      }

      const payload = {
        name: currentCategory.name,
        icon: currentCategory.icon || '📁'
      };

      if (currentCategory.id) {
        // Update
        const { error } = await supabase
          .from('categories')
          .update(payload)
          .eq('id', currentCategory.id);
        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from('categories')
          .insert([payload]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      console.error('Save failed:', err);
      alert('Failed to save category: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><LoadingSpinner /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Category Management</h2>
        <button 
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
        >
          + Add Category
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Icon</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-2xl">
                  {category.icon}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {category.name}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button onClick={() => handleEdit(category)} className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  No categories found. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentCategory.id ? "Edit Category" : "Add New Category"}>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category Name</label>
            <input 
              type="text" 
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={currentCategory.name || ''}
              onChange={e => setCurrentCategory({...currentCategory, name: e.target.value})}
              placeholder="e.g. Cloud Services"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Icon (Emoji)</label>
            <input 
              type="text" 
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={currentCategory.icon || ''}
              onChange={e => setCurrentCategory({...currentCategory, icon: e.target.value})}
              placeholder="e.g. ☁️"
            />
          </div>

          <button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryManagementTable;
