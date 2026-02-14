


import React, { useState, useEffect } from 'react';
// FIX: Corrected import path for react-router-dom.
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase';
import { useTheme } from './ThemeProvider';
import { useAuth } from '../App';
import { getSchools, School } from '../db';

const icons = {
  dashboard: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  school: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-4h1m-1 4h1m-1-4h1" /></svg>,
  students: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 006-5.197M12 12a4 4 0 110-8 4 4 0 010 8z" /></svg>,
  courses: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  attendance: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
  crm: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  hrm: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.284-1.255-.778-1.682M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.284-1.255.778-1.682m0 0A3.006 3.006 0 0112 13.489M12 13.489c1.218 0 2.33.507 3.111 1.329M12 13.489a3.006 3.006 0 01-3.111-1.329m0 0A3 3 0 016 10V7a3 3 0 013-3h6a3 3 0 013 3v3a3 3 0 01-2.111 2.818" /></svg>,
  accounting: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M12 8h.01M15 8h.01M15 5h.01M12 5h.01M9 5h.01M4 7h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z" /></svg>,
  profileSettings: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  settings: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  logout: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  chevronDown: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>,
  inventory: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  subscription: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  security: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  frontend: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  reception: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
  admission: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  addon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>,
  integrations: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zM18 10h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" /></svg>,
  forms: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
  back: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
};

type NavItemChild = {
  name: string;
  path?: string;
  children?: NavItemChild[];
  roles?: string[];
};

type NavItemType = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  children?: NavItemChild[];
  roles?: string[];
};

const NavItem: React.FC<{ item: NavItemType }> = ({ item }) => {
  const location = useLocation();
  const isActive = location.pathname === item.path;

  return (
    <Link
      to={item.path || '#'}
      className={`flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 text-sm ${
        isActive
          ? 'bg-primary text-white shadow-sm'
          : 'text-gray-700 dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary'
      }`}
    >
      {item.icon}
      <span className="ml-3 font-medium">{item.name}</span>
    </Link>
  );
};

const SubMenu: React.FC<{ item: NavItemChild }> = ({ item }) => {
    const location = useLocation();
    const isParentActive = item.children?.some(child => child.path && location.pathname.startsWith(child.path));
    const [isOpen, setIsOpen] = useState(!!isParentActive);

    useEffect(() => {
        if(isParentActive) setIsOpen(true);
    }, [isParentActive]);
    
    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between pl-5 py-2 text-sm rounded-md ${
                    isParentActive ? 'text-primary font-semibold' : 'text-gray-600 dark:text-gray-400 hover:text-primary'
                }`}
            >
                <span>{item.name}</span>
                <svg className={`h-4 w-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                 <div className="pl-5 pt-1 pb-1 space-y-1">
                    {item.children?.map(child => {
                        const isChildActive = child.path && location.pathname === child.path;
                        return (
                             <Link
                                key={child.name}
                                to={child.path!}
                                className={`block pl-5 py-2 text-sm rounded-md relative before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-1.5 before:rounded-full ${
                                    isChildActive
                                    ? 'text-primary font-semibold before:bg-primary'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-primary before:bg-gray-600 dark:before:bg-gray-500'
                                }`}
                            >
                                {child.name}
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

const CollapsibleNavItem: React.FC<{ item: NavItemType }> = ({ item }) => {
    const location = useLocation();
    const isParentActive = item.children?.some(child => 
        (child.path && location.pathname.startsWith(child.path)) || 
        (child.children && child.children.some(grandChild => grandChild.path && location.pathname.startsWith(grandChild.path)))
    );
    const [isOpen, setIsOpen] = useState(!!isParentActive);

    useEffect(() => {
        if(isParentActive) setIsOpen(true);
    }, [isParentActive]);

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors duration-200 text-sm ${
                    isParentActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary'
                }`}
                aria-expanded={isOpen}
            >
                <div className="flex items-center">
                    {item.icon}
                    <span className="ml-3 font-medium">{item.name}</span>
                </div>
                <svg className={`h-5 w-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="pl-8 pt-2 pb-1 space-y-1">
                    {item.children?.map(child => {
                         if (child.children) {
                            return <SubMenu key={child.name} item={child} />
                        }
                        const isChildActive = child.path && location.pathname === child.path;
                        return (
                            <Link
                                key={child.name}
                                to={child.path!}
                                className={`block pl-5 py-2 text-sm rounded-md relative before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-1.5 before:rounded-full ${
                                    isChildActive
                                    ? 'text-primary font-semibold before:bg-primary'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-primary before:bg-gray-600 dark:before:bg-gray-500'
                                }`}
                            >
                                {child.name}
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    );
};


const Sidebar = ({ isSidebarOpen, setSidebarOpen }: { isSidebarOpen: boolean, setSidebarOpen: (isOpen: boolean) => void}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const { profile } = useAuth();
  const [schools, setSchools] = useState<School[]>([]);
  
  const isSuperAdmin = profile?.role === 'Super Admin';
  const [adminView, setAdminView] = useState<'company' | 'school'>('company');
  const isAtAdminHome = location.pathname === '/admin-home';
  
  // Set the view state and persist it in sessionStorage
  const handleSetView = (view: 'company' | 'school') => {
      sessionStorage.setItem('adminView', view);
      setAdminView(view);
  };

  // On initial load, set the view from sessionStorage or derive from URL
  useEffect(() => {
      if (isSuperAdmin) {
          const storedView = sessionStorage.getItem('adminView');
          if (storedView === 'company' || storedView === 'school') {
              setAdminView(storedView);
          } else {
              const schoolManagementPaths = [
                '/dashboard', '/school/', '/students', '/attendance', '/hrm', '/inventory',
                '/security/', '/frontend/', '/reception/', '/admission/', '/alumni/', '/addon-manager',
                '/system-settings/role-permission', '/system-settings/session', '/system-settings/translations',
                '/system-settings/modules', '/system-settings/student-field', '/system-settings/custom-field',
                '/system-settings/user-login-log', '/system-settings/school-config/'
              ];
              const isSchoolView = schoolManagementPaths.some(path => location.pathname.startsWith(path));
              const initialView = isSchoolView ? 'school' : 'company';
              setAdminView(initialView);
              sessionStorage.setItem('adminView', initialView);
          }
      }
  }, [isSuperAdmin, location.pathname]);


  const logoLight = 'https://oqasxrkbosdqaldwydeu.supabase.co/storage/v1/object/sign/website_images/logo/logo-light.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yNWYwZjU5NS00NmQxLTRkOTctYTMxMS1lMmMxMTcyMzEyODUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ3ZWJzaXRlX2ltYWdlcy9sb2dvL2xvZ28tbGlnaHQucG5nIiwiaWF0IjoxNzU2NzU2NzkzLCJleHAiOjMzMjkyNzU2NzkzfQ.4sLXHZ9j2o5OpP6lSjYHzGEXYU_-hPkHmZJ1zjETiQI';
  const logoDark = 'https://oqasxrkbosdqaldwydeu.supabase.co/storage/v1/object/sign/website_images/logo/logo-dark.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yNWYwZjU5NS00NmQxLTRkOTctYTMxMS1lMmMxMTcyMzEyODUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ3ZWJzaXRlX2ltYWdlcy9sb2dvL2xvZ28tZGFyay5wbmciLCJpYXQiOjE3NTY3NTY3NjgsImV4cCI6MzMyOTI3NTY3Njh9.XpJbMk19-pJLNUoRSWyNbWDjvn4sUH9CmqOhAyxmzi0';
  const logoSrc = theme === 'light' ? logoLight : logoDark;
  
  useEffect(() => {
    if (isSuperAdmin) {
        getSchools().then(setSchools);
    }
  }, [isSuperAdmin]);
  
  const handleLogout = async () => {
    sessionStorage.removeItem('adminView'); // Clear the view on logout
    navigate('/');
    // FIX: The `signOut` method exists on `supabase.auth` in v1 and v2. This error was likely a cascade from other type issues. The call is correct.
    await supabase.auth.signOut();
  };

  const companyManagementNavItems: NavItemType[] = [
      { name: 'Company Dashboard', icon: icons.dashboard, path: '/company-dashboard' },
      { name: 'CRM', icon: icons.crm, path: '/crm' },
      { name: 'CMS', icon: icons.file, path: '/company/cms' },
      { name: 'Blog Manager', icon: icons.courses, children: [
          { name: 'Dashboard', path: '/company/blog-manager' },
          { name: 'Posts', path: '/company/blog-manager/posts' },
          { name: 'Categories & Tags', path: '/company/blog-manager/categories' },
          { name: 'Comments', path: '/company/blog-manager/comments' },
      ]},
      { name: 'Careers Manager', icon: icons.hrm, children: [
          { name: 'Job Postings', path: '/company/careers' },
          { name: 'Analytics', path: '/company/careers/analytics' },
      ]},
      { name: 'Affiliate Tools', icon: icons.courses, path: '/company/affiliate-tools' },
      { name: 'Subscription', icon: icons.subscription, children: [
          { name: 'Subscriptions', path: '/subscription/list' },
          { name: 'Pending Requests', path: '/subscription/pending' },
          { name: 'Custom Domain', path: '/subscription/domain' },
          { name: 'Plan', path: '/subscription/plan' },
          { name: 'Settings', path: '/subscription/settings' },
          { name: 'Transactions', path: '/subscription/transactions' },
          { name: 'Offline Payments', path: '/subscription/offline-payments' },
      ]},
      { name: 'Office Accounts', icon: icons.accounting, path: '/accounting' },
      { name: 'Integrations', icon: icons.integrations, path: '/integrations' },
      { name: 'Forms Manager', icon: icons.forms, children: [
          { name: 'Contact Us', path: '/forms-manager/contact-us' },
          { name: 'Demo Requests', path: '/forms-manager/demo-requests' },
          { name: 'Newsletter', path: '/forms-manager/newsletter' },
      ]},
      { name: 'Settings', icon: icons.settings, children: [
          { name: 'Currency Manager', path: '/currency-management' },
          { name: 'Global Settings', path: '/system-settings/global' },
          { name: 'School Settings', path: '/system-settings/school' },
          { name: 'Database Backup', path: '/system-settings/database-backup' },
          { name: 'System Update', path: '/system-settings/system-update' },
          { name: 'Modules Settings', path: '/system-settings/modules' },
      ]},
  ];
  
  const schoolManagementNavItems: NavItemType[] = [
    { name: 'Inventory', icon: icons.inventory, children: [
        { name: 'Product', path: '/inventory/products' },
        { name: 'Category', path: '/inventory/categories' },
        { name: 'Store', path: '/inventory/stores' },
        { name: 'Supplier', path: '/inventory/suppliers' },
        { name: 'Unit', path: '/inventory/units' },
        { name: 'Purchase', path: '/inventory/purchases' },
        { name: 'Sales', path: '/inventory/sales' },
        { name: 'Issue', path: '/inventory/issues' },
    ]},
    { name: 'School', icon: icons.school, path: '/school' },
    { name: '2 FA Security', icon: icons.security, children: [
        { name: 'My 2FA Setup', path: '/security/my-2fa-setup' },
        { name: 'Settings', path: '/security/settings' },
    ]},
    { name: 'Frontend', icon: icons.frontend, children: [
        { name: 'Setting', path: '/frontend/setting' },
        { name: 'Menu', path: '/frontend/menu' },
        { name: 'Page Section', path: '/frontend/page-section' },
        { name: 'Manage Page', path: '/frontend/manage-page' },
        { name: 'Slider', path: '/frontend/slider' },
        { name: 'Features', path: '/frontend/features' },
        { name: 'Testimonial', path: '/frontend/testimonial' },
        { name: 'Service', path: '/frontend/service' },
        { name: 'FAQ', path: '/frontend/faq' },
        { name: 'Gallery Category', path: '/frontend/gallery-category' },
        { name: 'Gallery', path: '/frontend/gallery' },
    ]},
    { name: 'Reception', icon: icons.reception, children: [
        { name: 'Admission Enquiry', path: '/reception/admission-enquiry' },
        { name: 'Postal Record', path: '/reception/postal-record' },
        { name: 'Call Log', path: '/reception/call-log' },
        { name: 'Visitor Log', path: '/reception/visitor-log' },
        { name: 'Complaint', path: '/reception/complaint' },
        { name: 'Config Reception', path: '/reception/config-reception' },
    ]},
    { name: 'Admission', icon: icons.admission, children: [
        { name: 'Create Admission', path: '/admission/create' },
        { name: 'Online Admission', path: '/admission/online' },
        { name: 'Multi Class Student', path: '/admission/multi-class' },
        { name: 'Multiple Import', path: '/admission/multiple-import' },
        { name: 'Category', path: '/admission/category' },
    ]},
    { name: 'Student Details', icon: icons.students, children: [
        { name: 'Student List', path: '/students' },
        { name: 'Login Deactivate', path: '/student/login-deactivate' },
        { name: 'Deactivate Reason', path: '/student/deactivate-reason' },
    ]},
    { name: 'Parents', icon: icons.hrm, children: [
        { name: 'Parents List', path: '/parents/list' },
        { name: 'Add Parent', path: '/parents/add' },
        { name: 'Login Deactivate', path: '/parents/login-deactivate' },
    ]},
    { name: 'Employee', icon: icons.hrm, children: [
        { name: 'Employee List', path: '/employee/list' },
        { name: 'Add Department', path: '/employee/department' },
        { name: 'Add Designation', path: '/employee/designation' },
        { name: 'Add Employee', path: '/employee/add' },
        { name: 'Login Deactivate', path: '/employee/login-deactivate' },
    ]},
    { name: 'Human Resource', icon: icons.hrm, children: [
        { 
            name: 'Payroll',
            children: [
                { name: 'Salary Template', path: '/payroll/salary-template' },
                { name: 'Salary Assign', path: '/payroll/salary-assign' },
                { name: 'Salary Payment', path: '/payroll/salary-payment' },
            ]
        },
        { 
            name: 'Advance Salary',
            children: [
                { name: 'My Application', path: '/advance-salary/apply' },
                { name: 'Manage Application', path: '/advance-salary/manage' },
            ]
        },
        {
            name: 'Leave',
            children: [
                { name: 'Category', path: '/leave/category' },
                { name: 'My Application', path: '/leave/my-apply' },
                { name: 'Manage Application', path: '/leave/manage' },
            ]
        },
        { name: 'Award', path: '/award' },
    ]},
    { name: 'Academic', icon: icons.courses, children: [
        {
            name: 'Class & Section',
            children: [
                { name: 'Control Classes', path: '/academic/control-classes' },
                { name: 'Assign Class Teacher', path: '/academic/assign-class-teacher' },
            ]
        },
        {
            name: 'Subject',
            children: [
                { name: 'Subject', path: '/academic/subject' },
                { name: 'Class Assign', path: '/academic/class-assign' },
            ]
        },
        { name: 'Class Schedule', path: '/academic/class-schedule' },
        { name: 'Teacher Schedule', path: '/academic/teacher-schedule' },
        { name: 'Promotion', path: '/academic/promotion' },
    ]},
    { name: 'Card Manager', icon: icons.subscription, children: [
        { name: 'ID Card Template', path: '/card-management/id-card-template' },
        { name: 'Student ID Card', path: '/card-management/student-id-card' },
        { name: 'Employee ID Card', path: '/card-management/employee-id-card' },
        { name: 'Admit Card Template', path: '/card-management/admit-card-template' },
        { name: 'Generate Admit Card', path: '/card-management/generate-admit-card' },
    ]},
    { name: 'Certificate', icon: icons.courses, children: [
        { name: 'Certificate Template', path: '/certificate/template' },
        { name: 'Generate Student', path: '/certificate/generate-student' },
        { name: 'Generate Employee', path: '/certificate/generate-employee' },
    ]},
    { name: 'Live Class Rooms', icon: icons.integrations, children: [
        { name: 'Live Class', path: '/live-class/main' },
        { name: 'Live Class Reports', path: '/live-class/reports' },
    ]},
    { name: 'Attachments', icon: icons.admission, children: [
        { name: 'Upload Content', path: '/attachments/upload' },
        { name: 'Attachment Type', path: '/attachments/type' },
    ]},
    { name: 'Homework', icon: icons.courses, children: [
        { name: 'Homework', path: '/homework/main' },
        { name: 'Evaluation Report', path: '/homework/evaluation-report' },
    ]},
    { name: 'Exam Master', icon: icons.attendance, children: [
        { name: 'Exam', path: '/exam-master/exam' },
        { name: 'Exam Schedule', path: '/exam-master/exam-schedule' },
        { name: 'Marks', path: '/exam-master/marks' },
    ]},
    { name: 'Online Exam', icon: icons.attendance, children: [
        { name: 'Online Exam', path: '/online-exam/main' },
        { name: 'Question Bank', path: '/online-exam/question-bank' },
        { name: 'Question Group', path: '/online-exam/question-group' },
        { name: 'Position Generate', path: '/online-exam/position-generate' },
        { name: 'Exam Result', path: '/online-exam/exam-result' },
    ]},
    { name: 'Supervision', icon: icons.security, children: [
        { name: 'Hostel', path: '/supervision/hostel' },
        { name: 'Transport', path: '/supervision/transport' },
    ]},
    { name: 'Attendance', icon: icons.attendance, children: [
        { name: 'Student', path: '/attendance/student' },
        { name: 'Subject Wise', path: '/attendance/subject-wise' },
        { name: 'Employee', path: '/attendance/employee' },
        { name: 'Exam', path: '/attendance/exam' },
    ]},
    { name: 'Qr Attendance', icon: icons.dashboard, children: [
        { name: 'Attendance', path: '/qr-code-attendance/attendance' },
        { name: 'Settings', path: '/qr-code-attendance/settings' },
        { 
            name: 'Reports',
            children: [
                { name: 'Student Reports By Date', path: '/qr-code-attendance/reports/student' },
                { name: 'Employee Reports By Date', path: '/qr-code-attendance/reports/employee' },
            ]
        },
    ]},
    { name: 'Library', icon: icons.courses, children: [
        { name: 'Books', path: '/library/books' },
        { name: 'Books Category', path: '/library/books-category' },
        { name: 'My Issued Book', path: '/library/my-issued-book' },
        { name: 'Book Issue/return', path: '/library/book-issue-return' },
    ]},
    { name: 'Events', icon: icons.crm, children: [
        { name: 'Event Type', path: '/events/type' },
        { name: 'Events', path: '/events/main' },
    ]},
    { name: 'Bulk Sms & Email', icon: icons.forms, children: [
        { name: 'Send Sms / Email', path: '/bulk-sms-email/send' },
        { name: 'Sms / Email Report', path: '/bulk-sms-email/report' },
        { name: 'Sms Template', path: '/bulk-sms-email/sms-template' },
        { name: 'Email Template', path: '/bulk-sms-email/email-template' },
        { name: 'Student Birthday Wishes', path: '/bulk-sms-email/student-birthday' },
        { name: 'Staff Birthday Wishes', path: '/bulk-sms-email/staff-birthday' },
    ]},
    { 
        name: 'Student Accounts', 
        icon: icons.accounting, 
        children: [
            { 
                name: 'Offline Payments',
                children: [
                    { name: 'Payments Type', path: '/student-accounting/offline-payments/type' },
                    { name: 'Offline Payments', path: '/student-accounting/offline-payments/main' },
                ]
            },
            { name: 'Fees Type', path: '/student-accounting/fees-type' },
            { name: 'Fees Group', path: '/student-accounting/fees-group' },
            { name: 'Fine Setup', path: '/student-accounting/fine-setup' },
            { name: 'Fees Allocation', path: '/student-accounting/fees-allocation' },
            { name: 'Fees Pay / Invoice', path: '/student-accounting/pay-invoice' },
            { name: 'Due Fees Invoice', path: '/student-accounting/due-invoice' },
            { name: 'Fees Reminder', path: '/student-accounting/fees-reminder' },
        ]
    },
    { 
        name: 'Office Accounts', 
        icon: icons.accounting, 
        children: [
            { name: 'Account', path: '/office-accounting/account' },
            { name: 'New Deposit', path: '/office-accounting/new-deposit' },
            { name: 'New Expense', path: '/office-accounting/new-expense' },
            { name: 'All Transactions', path: '/office-accounting/all-transactions' },
            { name: 'Voucher Head', path: '/office-accounting/voucher-head' },
        ]
    },
    { name: 'Message', icon: icons.crm, path: '/mailbox' },
    { 
        name: 'Reports', 
        icon: icons.accounting, 
        children: [
            {
                name: 'Student Reports',
                children: [
                    { name: 'Student Reports', path: '/reports/student-reports/student' },
                    { name: 'Login Credential', path: '/reports/student-reports/login-credential' },
                    { name: 'Admission Report', path: '/reports/student-reports/admission' },
                    { name: 'Class & Section Report', path: '/reports/student-reports/class-section' },
                    { name: 'Sibling Report', path: '/reports/student-reports/sibling' },
                ]
            },
            {
                name: 'Fees Reports',
                children: [
                    { name: 'Fees Report', path: '/reports/fees-reports/fees' },
                    { name: 'Receipts Report', path: '/reports/fees-reports/receipts' },
                    { name: 'Due Fees Report', path: '/reports/fees-reports/due-fees' },
                    { name: 'Fine Report', path: '/reports/fees-reports/fine' },
                ]
            },
            {
                name: 'Financial Reports',
                children: [
                    { name: 'Account Statement', path: '/reports/financial-reports/account-statement' },
                    { name: 'Income Reports', path: '/reports/financial-reports/income' },
                    { name: 'Expense Reports', path: '/reports/financial-reports/expense' },
                    { name: 'Transactions Reports', path: '/reports/financial-reports/transactions' },
                    { name: 'Balance Sheet', path: '/reports/financial-reports/balance-sheet' },
                    { name: 'Income Vs Expense', path: '/reports/financial-reports/income-vs-expense' },
                ]
            },
            {
                name: 'Attendance Reports',
                children: [
                    { name: 'Student Reports', path: '/reports/attendance-reports/student' },
                    { name: 'Student Daily Reports', path: '/reports/attendance-reports/student-daily' },
                    { name: 'Student Overview Reports', path: '/reports/attendance-reports/student-overview' },
                    { name: 'Subject Wise Reports', path: '/reports/attendance-reports/subject-wise' },
                    { name: 'Subject Wise By Day', path: '/reports/attendance-reports/subject-wise-day' },
                    { name: 'Subject Wise By Month', path: '/reports/attendance-reports/subject-wise-month' },
                    { name: 'Employee Reports', path: '/reports/attendance-reports/employee' },
                    { name: 'Exam Reports', path: '/reports/attendance-reports/exam' },
                ]
            },
            {
                name: 'Human Resource',
                children: [
                    { name: 'Payroll Summary', path: '/reports/hr-reports/payroll-summary' },
                    { name: 'Leave Reports', path: '/reports/hr-reports/leave' },
                ]
            },
            {
                name: 'Examination',
                children: [
                    { name: 'Report Card', path: '/reports/examination-reports/report-card' },
                    { name: 'Tabulation Sheet', path: '/reports/examination-reports/tabulation-sheet' },
                    { name: 'Progress Reports', path: '/reports/examination-reports/progress' },
                ]
            },
            {
                name: 'Inventory',
                children: [
                    { name: 'Stock Report', path: '/reports/inventory-reports/stock' },
                    { name: 'Purchase Report', path: '/reports/inventory-reports/purchase' },
                    { name: 'Sales Report', path: '/reports/inventory-reports/sales' },
                    { name: 'Issues Report', path: '/reports/inventory-reports/issues' },
                ]
            },
        ]
    },
    { name: 'Alumni', icon: icons.hrm, children: [{ name: 'Manage Alumni', path: '/alumni/manage'}, { name: 'Events', path: '/alumni/events' }] },
    { name: 'Addon Manager', icon: icons.addon, path: '/addon-manager' },
    { name: 'Settings', icon: icons.settings, children: [
        { name: 'Role Permission', path: '/system-settings/role-permission' },
        { name: 'Session Settings', path: '/system-settings/session' },
        { name: 'System Student Field', path: '/system-settings/student-field' },
        { name: 'Custom Field', path: '/system-settings/custom-field' },
        { name: 'User Login Log', path: '/system-settings/user-login-log'},
    ]},
];

  const SchoolSystemMenu = () => {
      const filteredNav = schoolManagementNavItems.filter(item => {
          if (!item.roles) return true;
          return item.roles.includes(profile?.role || '');
      }).map(item => {
          if (item.children) {
              const filteredChildren = item.children.filter(child => {
                  const parentItem = schoolManagementNavItems.find(i => i.name === item.name) as any;
                  if (!parentItem.roles || parentItem.roles.includes(profile?.role || '')) {
                     if(!child.roles) return true;
                     return child.roles.includes(profile?.role || '');
                  }
                  return false;
              });
              return { ...item, children: filteredChildren };
          }
          return item;
      }).filter(item => !item.children || item.children.length > 0);
      
      return (
        <div className="space-y-1">
        {filteredNav.map(item =>
            item.children ? <CollapsibleNavItem key={item.name} item={item} /> : <NavItem key={item.name} item={item} />
        )}
        </div>
      );
  };
  
  return (
    <>
        <div 
            className={`fixed inset-0 bg-black bg-opacity-50 z-20 xl:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
        />
        <aside className={`w-64 bg-card dark:bg-gray-800 text-text-primary flex flex-col fixed h-full border-r border-gray-200 dark:border-gray-700 z-30 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} xl:translate-x-0`}>
            <div className="flex items-center justify-center h-20 border-b border-gray-200 dark:border-gray-700 px-4">
                <Link to="/dashboard">
                    <img src={logoSrc} alt="Acadeemia Logo" className="h-10 w-auto" />
                </Link>
            </div>
            <nav className="flex-1 px-4 py-4 overflow-y-auto">
                {isSuperAdmin && isAtAdminHome ? (
                    <div className="text-center p-4 text-text-secondary dark:text-gray-400">
                        Select a management area to begin.
                    </div>
                ) : isSuperAdmin ? (
                    adminView === 'company' ? (
                        <div className="space-y-1">
                            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Company Management
                            </h3>
                            {companyManagementNavItems.map(item => {
                                return item.children ? <CollapsibleNavItem key={item.name} item={item} /> : <NavItem key={item.name} item={item} />;
                            })}
                        </div>
                    ) : (
                        <div>
                            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                School Management
                            </h3>
                            <div className="space-y-1">
                                <NavItem item={{ name: 'All Schools Dashboard', icon: icons.dashboard, path: '/dashboard' }} />
                                <CollapsibleNavItem item={{ name: 'Schools', icon: icons.school, children: schools.map(s => ({ name: s.name, path: `/school/${s.id}/dashboard`})) }}/>
                                {schoolManagementNavItems.map(item =>
                                    item.children ? <CollapsibleNavItem key={item.name} item={item} /> : <NavItem key={item.name} item={item} />
                                )}
                            </div>
                        </div>
                    )
                ) : (
                    <SchoolSystemMenu />
                )}
            </nav>
            <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
                {isSuperAdmin && !isAtAdminHome && (
                    <Link to="/admin-home" className="flex items-center w-full px-4 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary transition-colors duration-200">
                        {icons.back}
                        <span className="ml-3 font-medium">Back to Selection</span>
                    </Link>
                )}
            </div>
        </aside>
    </>
  );
};

export default Sidebar;