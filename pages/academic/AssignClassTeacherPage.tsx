
import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';

const AssignClassTeacherPage = () => {
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');

  const handleSave = () => {
    console.log('Saving assignment:', { selectedSchool, selectedClass, selectedSection, selectedTeacher });
  };

  const mockAssignments = [
    { id: 1, school: 'Icon School & College', teacher: 'Summer Simpson', class: 'Six', section: 'A' },
    { id: 2, school: 'Icon School & College', teacher: 'Jose McKinley', class: 'Seven', section: 'A' },
    { id: 3, school: 'Icon School & College', teacher: 'Nannie Henriques', class: 'Eight', section: 'A' },
    { id: 4, school: 'Oxford International', teacher: 'Shannon Ellis', class: 'Six', section: 'A' },
    { id: 5, school: 'Oxford International', teacher: 'George Foxall', class: 'Seven', section: 'B' }
  ];

  return (
    <DashboardLayout title="Academic - Assign Class Teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-card dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-text-primary dark:text-gray-100">Assign Class Teacher</h2>
          <p className="mt-2 text-text-secondary dark:text-gray-400">
            This page is under construction. Functionality to assign teachers to classes will be available here.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Class Teacher Allocation Form */}
          <div className="bg-card dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-700 dark:bg-gray-900 px-6 py-4 border-b border-gray-600">
              <h3 className="text-lg font-medium text-white flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Class Teacher Allocation
              </h3>
            </div>

            <div className="p-6 space-y-5">
              {/* School Field */}
              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-2">
                  School <span className="text-primary">*</span>
                </label>
                <select
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-text-primary dark:text-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="">Select</option>
                  <option value="icon">Icon School & College</option>
                  <option value="oxford">Oxford International</option>
                </select>
              </div>

              {/* Class Field */}
              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-2">
                  Class <span className="text-primary">*</span>
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  disabled={!selectedSchool}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-text-primary dark:text-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">First Select The School</option>
                  <option value="six">Six</option>
                  <option value="seven">Seven</option>
                  <option value="eight">Eight</option>
                </select>
              </div>

              {/* Section Field */}
              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-2">
                  Section <span className="text-primary">*</span>
                </label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  disabled={!selectedClass}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-text-primary dark:text-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select Class First</option>
                  <option value="a">A</option>
                  <option value="b">B</option>
                  <option value="c">C</option>
                </select>
              </div>

              {/* Class Teacher Field */}
              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-2">
                  Class Teacher <span className="text-primary">*</span>
                </label>
                <select
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  disabled={!selectedSchool}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-text-primary dark:text-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">First Select The School</option>
                  <option value="summer">Summer Simpson</option>
                  <option value="jose">Jose McKinley</option>
                  <option value="nannie">Nannie Henriques</option>
                </select>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-6 py-2.5 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-md transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save
                </button>
              </div>
            </div>
          </div>

          {/* Class Teacher List */}
          <div className="bg-card dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-700 dark:bg-gray-900 px-6 py-4 border-b border-gray-600">
              <h3 className="text-lg font-medium text-white flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Class Teacher List
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wider">#</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wider">School</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wider">Class Teacher</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wider">Class</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wider">Section</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {mockAssignments.map((assignment, index) => (
                    <tr key={assignment.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3 text-sm text-text-secondary dark:text-gray-400">{index + 1}</td>
                      <td className="px-4 py-3 text-sm text-text-primary dark:text-gray-300">{assignment.school}</td>
                      <td className="px-4 py-3 text-sm text-text-primary dark:text-gray-300">{assignment.teacher}</td>
                      <td className="px-4 py-3 text-sm text-text-primary dark:text-gray-300">{assignment.class}</td>
                      <td className="px-4 py-3 text-sm text-text-primary dark:text-gray-300">{assignment.section}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex space-x-2">
                          <button
                            className="p-2 bg-primary hover:bg-primary-hover text-white rounded transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            className="p-2 bg-primary hover:bg-primary-hover text-white rounded transition-colors"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AssignClassTeacherPage;
