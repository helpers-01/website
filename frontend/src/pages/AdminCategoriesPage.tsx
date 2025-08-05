import React, { useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';
import { Plus, Trash2, Edit3, Save } from 'lucide-react';

const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) console.error(error);
    else setCategories(data || []);
  };

  const addCategory = async () => {
    if (newCategory.trim() === '') return;
    const { error } = await supabase
      .from('service_categories')
      .insert([{ name: newCategory.trim(), is_active: true }]);
    if (error) console.error(error);
    else {
      setNewCategory('');
      fetchCategories();
    }
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from('service_categories').delete().eq('id', id);
    if (error) console.error(error);
    else fetchCategories();
  };

  const updateCategory = async (id: string) => {
    const { error } = await supabase
      .from('service_categories')
      .update({ name: editingName })
      .eq('id', id);
    if (error) console.error(error);
    else {
      setEditingId(null);
      fetchCategories();
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Manage Service Categories</h1>

      <div className="flex space-x-2 mb-6">
        <input
          type="text"
          placeholder="New Category Name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-md"
        />
        <button
          onClick={addCategory}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          <Plus className="inline-block w-4 h-4 mr-1" /> Add
        </button>
      </div>

      <ul className="space-y-4">
        {categories.map((cat) => (
          <li key={cat.id} className="bg-white p-4 rounded-md shadow-sm flex justify-between items-center">
            {editingId === cat.id ? (
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md mr-3"
              />
            ) : (
              <span className="flex-1 text-gray-900">{cat.name}</span>
            )}
            <div className="flex space-x-2">
              {editingId === cat.id ? (
                <button onClick={() => updateCategory(cat.id)} className="text-green-600 hover:text-green-800">
                  <Save className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setEditingId(cat.id);
                    setEditingName(cat.name);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => deleteCategory(cat.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminCategoriesPage;