import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../supabase';

type School = {
  id: string;
  name: string;
};

type Class = {
  id: string;
  school_id: string;
  name: string;
  class_numeric: number;
  section: string;
  created_at: string;
  school?: School;
};

type Section = {
  id: string;
  school_id: string;
  name: string;
  capacity: number;
  created_at: string;
  school?: School;
};

const ControlClassesPage = () => {
  const [activeTab, setActiveTab] = useState<'class' | 'section'>('class');
  const [schools, setSchools] = useState<School[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  const [classForm, setClassForm] = useState({
    school_id: '',
    name: '',
    class_numeric: '',
    section: ''
  });

  const [sectionForm, setSectionForm] = useState({
    school_id: '',
    name: '',
    capacity: ''
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const { data: schoolsData, error: schoolsError } = await supabase
        .from('schools')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (schoolsError) throw schoolsError;
      setSchools(schoolsData || []);

      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('*, school:schools(id, name)')
        .order('class_numeric');

      if (classesError) throw classesError;
      setClasses(classesData || []);

      const { data: sectionsData, error: sectionsError } = await supabase
        .from('sections')
        .select('*, school:schools(id, name)')
        .order('name');

      if (sectionsError) throw sectionsError;
      setSections(sectionsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!classForm.school_id || !classForm.name || !classForm.class_numeric || !classForm.section) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('classes')
          .update({
            school_id: classForm.school_id,
            name: classForm.name,
            class_numeric: parseInt(classForm.class_numeric),
            section: classForm.section
          })
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('classes')
          .insert({
            school_id: classForm.school_id,
            name: classForm.name,
            class_numeric: parseInt(classForm.class_numeric),
            section: classForm.section
          });

        if (error) throw error;
      }

      setClassForm({ school_id: '', name: '', class_numeric: '', section: '' });
      setEditingId(null);
      fetchData();
    } catch (error) {
      console.error('Error saving class:', error);
      alert('Failed to save class');
    }
  };

  const handleSectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sectionForm.school_id || !sectionForm.name) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('sections')
          .update({
            school_id: sectionForm.school_id,
            name: sectionForm.name,
            capacity: parseInt(sectionForm.capacity) || 0
          })
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('sections')
          .insert({
            school_id: sectionForm.school_id,
            name: sectionForm.name,
            capacity: parseInt(sectionForm.capacity) || 0
          });

        if (error) throw error;
      }

      setSectionForm({ school_id: '', name: '', capacity: '' });
      setEditingId(null);
      fetchData();
    } catch (error) {
      console.error('Error saving section:', error);
      alert('Failed to save section');
    }
  };

  const handleDeleteClass = async (id: string) => {
    if (!confirm('Are you sure you want to delete this class?')) return;

    try {
      const { error } = await supabase.from('classes').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error deleting class:', error);
      alert('Failed to delete class');
    }
  };

  const handleDeleteSection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return;

    try {
      const { error } = await supabase.from('sections').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error deleting section:', error);
      alert('Failed to delete section');
    }
  };

  const handleEditClass = (classItem: Class) => {
    setEditingId(classItem.id);
    setClassForm({
      school_id: classItem.school_id,
      name: classItem.name,
      class_numeric: classItem.class_numeric.toString(),
      section: classItem.section
    });
  };

  const handleEditSection = (section: Section) => {
    setEditingId(section.id);
    setSectionForm({
      school_id: section.school_id,
      name: section.name,
      capacity: section.capacity.toString()
    });
  };

  return (
    <DashboardLayout title="Academic - Control Classes">
      <div className="bg-card dark:bg-gray-800 rounded-lg shadow-md">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab('class')}
              className={`px-6 py-4 font-semibold transition-colors relative ${
                activeTab === 'class'
                  ? 'text-red-500 dark:text-red-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Class
              </div>
              {activeTab === 'class' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('section')}
              className={`px-6 py-4 font-semibold transition-colors relative ${
                activeTab === 'section'
                  ? 'text-red-500 dark:text-red-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Section
              </div>
              {activeTab === 'section' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></div>
              )}
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'class' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-text-primary dark:text-gray-100 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {editingId ? 'Edit Class' : 'Create Class'}
                </h3>
                <form onSubmit={handleClassSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-2">
                      School <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={classForm.school_id}
                      onChange={(e) => setClassForm({ ...classForm, school_id: e.target.value })}
                      className="form-select"
                      required
                    >
                      <option value="">Select</option>
                      {schools.map((school) => (
                        <option key={school.id} value={school.id}>
                          {school.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={classForm.name}
                      onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                      className="form-input"
                      placeholder="e.g., Six, Seven"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-2">
                      Class Numeric
                    </label>
                    <input
                      type="number"
                      value={classForm.class_numeric}
                      onChange={(e) => setClassForm({ ...classForm, class_numeric: e.target.value })}
                      className="form-input"
                      placeholder="e.g., 6, 7, 8"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-2">
                      Section <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={classForm.section}
                      onChange={(e) => setClassForm({ ...classForm, section: e.target.value })}
                      className="form-input"
                      placeholder={classForm.school_id ? 'e.g., A, B' : 'First Select The School'}
                      disabled={!classForm.school_id}
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setClassForm({ school_id: '', name: '', class_numeric: '', section: '' });
                        }}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-text-secondary dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-text-primary dark:text-gray-100 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  Class List
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-200 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-text-primary dark:text-gray-100 uppercase">#</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-text-primary dark:text-gray-100 uppercase">School</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-text-primary dark:text-gray-100 uppercase">Class Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-text-primary dark:text-gray-100 uppercase">Class Numeric</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-text-primary dark:text-gray-100 uppercase">Section</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-text-primary dark:text-gray-100 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-text-secondary dark:text-gray-400">
                            Loading...
                          </td>
                        </tr>
                      ) : classes.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-text-secondary dark:text-gray-400">
                            No classes found
                          </td>
                        </tr>
                      ) : (
                        classes.map((classItem, index) => (
                          <tr key={classItem.id} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <td className="px-4 py-3 text-sm text-text-secondary dark:text-gray-400">{index + 1}</td>
                            <td className="px-4 py-3 text-sm text-text-secondary dark:text-gray-400">{classItem.school?.name}</td>
                            <td className="px-4 py-3 text-sm text-text-secondary dark:text-gray-400">{classItem.name}</td>
                            <td className="px-4 py-3 text-sm text-text-secondary dark:text-gray-400">{classItem.class_numeric}</td>
                            <td className="px-4 py-3 text-sm text-text-secondary dark:text-gray-400">{classItem.section}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEditClass(classItem)}
                                  className="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                                  title="Edit"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDeleteClass(classItem.id)}
                                  className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                                  title="Delete"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-text-primary dark:text-gray-100 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {editingId ? 'Edit Section' : 'Create Section'}
                </h3>
                <form onSubmit={handleSectionSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-2">
                      School <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={sectionForm.school_id}
                      onChange={(e) => setSectionForm({ ...sectionForm, school_id: e.target.value })}
                      className="form-select"
                      required
                    >
                      <option value="">Select</option>
                      {schools.map((school) => (
                        <option key={school.id} value={school.id}>
                          {school.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={sectionForm.name}
                      onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })}
                      className="form-input"
                      placeholder="e.g., A, B"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-gray-100 mb-2">
                      Capacity
                    </label>
                    <input
                      type="number"
                      value={sectionForm.capacity}
                      onChange={(e) => setSectionForm({ ...sectionForm, capacity: e.target.value })}
                      className="form-input"
                      placeholder="e.g., 100"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setSectionForm({ school_id: '', name: '', capacity: '' });
                        }}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-text-secondary dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-text-primary dark:text-gray-100 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  Section List
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-200 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-text-primary dark:text-gray-100 uppercase">#</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-text-primary dark:text-gray-100 uppercase">School</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-text-primary dark:text-gray-100 uppercase">Section Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-text-primary dark:text-gray-100 uppercase">Capacity</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-text-primary dark:text-gray-100 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {loading ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-text-secondary dark:text-gray-400">
                            Loading...
                          </td>
                        </tr>
                      ) : sections.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-text-secondary dark:text-gray-400">
                            No sections found
                          </td>
                        </tr>
                      ) : (
                        sections.map((section, index) => (
                          <tr key={section.id} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <td className="px-4 py-3 text-sm text-text-secondary dark:text-gray-400">{index + 1}</td>
                            <td className="px-4 py-3 text-sm text-text-secondary dark:text-gray-400">{section.school?.name}</td>
                            <td className="px-4 py-3 text-sm text-text-secondary dark:text-gray-400">{section.name}</td>
                            <td className="px-4 py-3 text-sm text-text-secondary dark:text-gray-400">{section.capacity}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEditSection(section)}
                                  className="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                                  title="Edit"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDeleteSection(section.id)}
                                  className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                                  title="Delete"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ControlClassesPage;
