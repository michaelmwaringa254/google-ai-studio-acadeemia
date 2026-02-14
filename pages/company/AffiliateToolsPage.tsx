import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../supabase';
import { useAuth } from '../../App';

interface AffiliateTool {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  affiliate_link: string;
  category: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface ToolFormData {
  name: string;
  description: string;
  logo_url: string;
  affiliate_link: string;
  category: string;
  is_active: boolean;
  display_order: number;
}

const AffiliateToolsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tools, setTools] = useState<AffiliateTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTool, setEditingTool] = useState<AffiliateTool | null>(null);
  const [formData, setFormData] = useState<ToolFormData>({
    name: '',
    description: '',
    logo_url: '',
    affiliate_link: '',
    category: '',
    is_active: true,
    display_order: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('affiliate_tools')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTools(data || []);
    } catch (error: any) {
      console.error('Error fetching tools:', error.message);
      alert('Failed to load tools');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingTool(null);
    setFormData({
      name: '',
      description: '',
      logo_url: '',
      affiliate_link: '',
      category: '',
      is_active: true,
      display_order: tools.length > 0 ? Math.max(...tools.map(t => t.display_order)) + 1 : 1,
    });
    setShowModal(true);
  };

  const openEditModal = (tool: AffiliateTool) => {
    setEditingTool(tool);
    setFormData({
      name: tool.name,
      description: tool.description,
      logo_url: tool.logo_url,
      affiliate_link: tool.affiliate_link,
      category: tool.category || '',
      is_active: tool.is_active,
      display_order: tool.display_order,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTool(null);
    setFormData({
      name: '',
      description: '',
      logo_url: '',
      affiliate_link: '',
      category: '',
      is_active: true,
      display_order: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!formData.name.trim()) {
        alert('Tool name is required');
        setSubmitting(false);
        return;
      }

      if (!formData.description.trim()) {
        alert('Description is required');
        setSubmitting(false);
        return;
      }

      if (!formData.logo_url.trim()) {
        alert('Logo URL is required');
        setSubmitting(false);
        return;
      }

      if (!formData.affiliate_link.trim()) {
        alert('Affiliate link is required');
        setSubmitting(false);
        return;
      }

      if (editingTool) {
        const { error } = await supabase
          .from('affiliate_tools')
          .update({
            name: formData.name.trim(),
            description: formData.description.trim(),
            logo_url: formData.logo_url.trim(),
            affiliate_link: formData.affiliate_link.trim(),
            category: formData.category?.trim() || null,
            is_active: formData.is_active,
            display_order: formData.display_order,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingTool.id);

        if (error) {
          console.error('Update error details:', error);
          throw error;
        }
        alert('Tool updated successfully!');
      } else {
        const { data, error } = await supabase
          .from('affiliate_tools')
          .insert([{
            name: formData.name.trim(),
            description: formData.description.trim(),
            logo_url: formData.logo_url.trim(),
            affiliate_link: formData.affiliate_link.trim(),
            category: formData.category?.trim() || null,
            is_active: formData.is_active,
            display_order: formData.display_order,
          }])
          .select();

        if (error) {
          console.error('Insert error details:', error);
          throw error;
        }
        alert('Tool added successfully!');
      }

      await fetchTools();
      closeModal();
    } catch (error: any) {
      console.error('Error saving tool:', error);
      alert(`Failed to save tool: ${error.message || 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tool? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('affiliate_tools')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('Tool deleted successfully!');
      fetchTools();
    } catch (error: any) {
      console.error('Error deleting tool:', error.message);
      alert('Failed to delete tool');
    }
  };

  const toggleActive = async (tool: AffiliateTool) => {
    try {
      const { error } = await supabase
        .from('affiliate_tools')
        .update({
          is_active: !tool.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', tool.id);

      if (error) throw error;
      await fetchTools();
    } catch (error: any) {
      console.error('Error toggling tool status:', error.message);
      alert('Failed to update tool status');
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-background dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Affiliate Tools</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage recommended tools displayed on the Affiliate Picks page
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Tool
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : tools.length === 0 ? (
              <div className="text-center py-12 px-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No tools</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Get started by adding a new affiliate tool.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Tool
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Order
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {tools.map((tool) => (
                      <tr key={tool.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img
                              src={tool.logo_url}
                              alt={tool.name}
                              className="h-10 w-10 object-contain mr-4"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://via.placeholder.com/40?text=Logo';
                              }}
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {tool.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                {tool.description.substring(0, 60)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {tool.category || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {tool.display_order}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleActive(tool)}
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              tool.is_active
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {tool.is_active ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => openEditModal(tool)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Edit"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(tool.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              title="Delete"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingTool ? 'Edit Tool' : 'Add New Tool'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tool Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Google Classroom"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Brief description of the tool (max 80 words recommended)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Logo URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="https://example.com/logo.png"
                />
                {formData.logo_url && (
                  <div className="mt-2">
                    <img
                      src={formData.logo_url}
                      alt="Logo preview"
                      className="h-16 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/64?text=Invalid';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Affiliate Link <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={formData.affiliate_link}
                  onChange={(e) => setFormData({ ...formData, affiliate_link: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="https://example.com/your-affiliate-link"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Learning Management"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Active (visible on public page)
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingTool ? 'Update Tool' : 'Add Tool'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AffiliateToolsPage;
