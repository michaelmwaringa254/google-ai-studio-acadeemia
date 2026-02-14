import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../supabase';

interface CMSPage {
  id: string;
  title: string;
  slug: string;
  description: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

interface CMSSection {
  id: string;
  page_id: string;
  title: string;
  order: number;
  created_at: string;
}

interface CMSContent {
  id: string;
  section_id: string;
  type: 'text' | 'image' | 'heading' | 'paragraph';
  content: Record<string, any>;
  order: number;
}

interface CMSImage {
  id: string;
  page_id: string;
  url: string;
  alt_text: string;
  title: string;
}

const icons = {
  add: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>,
  edit: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  delete: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  save: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>,
  image: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  file: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  back: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
};

const CMSPageEditor = ({ pageId, onBack }: { pageId: string | null; onBack: () => void }) => {
  const [page, setPage] = useState<CMSPage | null>(null);
  const [sections, setSections] = useState<CMSSection[]>([]);
  const [loading, setLoading] = useState(!!pageId);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sectionTitle, setSectionTitle] = useState('');
  const [sectionContent, setSectionContent] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!pageId) return;
    fetchPageData();
  }, [pageId]);

  const fetchPageData = async () => {
    if (!pageId) return;
    try {
      const { data: pageData, error: pageError } = await supabase
        .from('cms_pages')
        .select('*')
        .eq('id', pageId)
        .maybeSingle();

      if (pageError) throw pageError;
      setPage(pageData);

      const { data: sectionsData, error: sectionsError } = await supabase
        .from('cms_sections')
        .select('*')
        .eq('page_id', pageId)
        .order('order');

      if (sectionsError) throw sectionsError;
      setSections(sectionsData || []);
    } catch (error) {
      console.error('Error fetching page data:', error);
      alert('Failed to load page data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSection = async () => {
    if (!pageId || !sectionTitle.trim()) {
      alert('Please enter a section title');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('cms_sections')
        .insert({
          page_id: pageId,
          title: sectionTitle,
          order: sections.length,
        })
        .select()
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setSections([...sections, data]);
        setSectionTitle('');
      }
    } catch (error) {
      console.error('Error adding section:', error);
      alert('Failed to add section');
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm('Delete this section and all its content?')) return;

    try {
      const { error } = await supabase
        .from('cms_sections')
        .delete()
        .eq('id', sectionId);

      if (error) throw error;
      setSections(sections.filter(s => s.id !== sectionId));
    } catch (error) {
      console.error('Error deleting section:', error);
      alert('Failed to delete section');
    }
  };

  if (!pageId) return null;

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-primary hover:text-primary-hover transition-colors mb-4"
      >
        {icons.back}
        Back to Pages
      </button>

      {loading ? (
        <div className="text-center py-12">Loading page...</div>
      ) : page ? (
        <>
          <div className="bg-card dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-text-primary dark:text-gray-100 mb-2">{page.title}</h2>
            <p className="text-text-secondary dark:text-gray-400 mb-4">{page.description}</p>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${page.is_published ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400'}`}>
                {page.is_published ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>

          <div className="bg-card dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-text-primary dark:text-gray-100 mb-4">Page Sections</h3>

            <div className="space-y-4">
              {sections.map(section => (
                <div key={section.id} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-text-primary dark:text-gray-100">{section.title}</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteSection(section.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        {icons.delete}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Created: {new Date(section.created_at).toLocaleDateString()}</p>
                </div>
              ))}

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Add New Section</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sectionTitle}
                    onChange={(e) => setSectionTitle(e.target.value)}
                    placeholder="Section title (e.g., Hero, Features, Testimonials)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={handleAddSection}
                    className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                  >
                    {icons.add}
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-text-secondary dark:text-gray-400">Page not found</div>
      )}
    </div>
  );
};

const CMSManagementPage = () => {
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [newPageDescription, setNewPageDescription] = useState('');

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('cms_pages')
        .select('*')
        .eq('created_by', userData.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
      alert('Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPageTitle.trim() || !newPageSlug.trim()) {
      alert('Please fill in title and slug');
      return;
    }

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('cms_pages')
        .insert({
          title: newPageTitle,
          slug: newPageSlug.toLowerCase().replace(/\s+/g, '-'),
          description: newPageDescription,
          created_by: userData.user.id,
        })
        .select()
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setPages([data, ...pages]);
        setNewPageTitle('');
        setNewPageSlug('');
        setNewPageDescription('');
        alert('Page created successfully');
      }
    } catch (error) {
      console.error('Error creating page:', error);
      alert('Failed to create page');
    }
  };

  const handleDeletePage = async (id: string) => {
    if (!confirm('Delete this page and all its sections and content?')) return;

    try {
      const { error } = await supabase
        .from('cms_pages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPages(pages.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('Failed to delete page');
    }
  };

  const handleEditPage = (pageId: string) => {
    setSelectedPageId(pageId);
    setView('editor');
  };

  if (view === 'editor' && selectedPageId) {
    return (
      <DashboardLayout title="CMS - Page Editor">
        <div className="bg-card dark:bg-gray-800 rounded-lg shadow-md p-6">
          <CMSPageEditor
            pageId={selectedPageId}
            onBack={() => {
              setView('list');
              setSelectedPageId(null);
              fetchPages();
            }}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="CMS Management">
      <div className="space-y-6">
        <div className="bg-card dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-text-primary dark:text-gray-100 mb-6">Create New Page</h2>
          <form onSubmit={handleCreatePage} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Page Title</label>
                <input
                  type="text"
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  placeholder="e.g., About Us, Features, Pricing"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Page Slug</label>
                <input
                  type="text"
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(e.target.value)}
                  placeholder="e.g., about-us, features, pricing"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <textarea
                value={newPageDescription}
                onChange={(e) => setNewPageDescription(e.target.value)}
                placeholder="Brief description of the page"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-md transition-colors flex items-center gap-2"
            >
              {icons.add}
              Create Page
            </button>
          </form>
        </div>

        <div className="bg-card dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-text-primary dark:text-gray-100 mb-6">Your Pages</h2>

          {loading ? (
            <div className="text-center py-12">Loading pages...</div>
          ) : pages.length === 0 ? (
            <div className="text-center py-12 text-text-secondary dark:text-gray-400">
              No pages created yet. Create your first page above!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pages.map(page => (
                <div key={page.id} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-colors">
                  <h3 className="font-semibold text-text-primary dark:text-gray-100 mb-2 truncate">{page.title}</h3>
                  <p className="text-sm text-text-secondary dark:text-gray-400 mb-3 line-clamp-2">{page.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${page.is_published ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400'}`}>
                      {page.is_published ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(page.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditPage(page.id)}
                      className="flex-1 bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded text-sm transition-colors flex items-center justify-center gap-1"
                    >
                      {icons.edit}
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePage(page.id)}
                      className="px-3 py-1.5 border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 rounded text-sm transition-colors"
                    >
                      {icons.delete}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CMSManagementPage;
