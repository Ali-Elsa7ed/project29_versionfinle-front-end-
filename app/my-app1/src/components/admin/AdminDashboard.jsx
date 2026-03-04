// src/components/admin/AdminDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Globe } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import AdminOverview from './AdminOverview';
import AdminUsers from './AdminUsers';
import AdminProjects from './AdminProjects';
import AdminDonations from './AdminDonations';
import AdminSubscriptions from './AdminSubscriptions';
import AdminReports from './AdminReports';
import { adminTranslations, t } from '../../utils/adminTranslations';

export default function AdminDashboard({ darkMode, currentUser, setCurrentUser, setView }) {
  const [currentPage, setCurrentPage] = useState('overview');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [language, setLanguage] = useState('ar'); // ar أو en
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Admin access guard
  if (!currentUser || currentUser.type !== 'admin') {
    setView('home');
    return null;
  }

  // Refresh data when page changes
  useEffect(() => {
    setRefreshTrigger(prev => prev + 1);
  }, [currentPage]);

  // Listen for data updates from other parts of the app
  useEffect(() => {
    const handleUpdate = () => {
      setRefreshTrigger(prev => prev + 1);
    };

    window.addEventListener('projectsUpdated', handleUpdate);
    window.addEventListener('donationsUpdated', handleUpdate);
    window.addEventListener('subscriptionsUpdated', handleUpdate);
    window.addEventListener('usersUpdated', handleUpdate);

    return () => {
      window.removeEventListener('projectsUpdated', handleUpdate);
      window.removeEventListener('donationsUpdated', handleUpdate);
      window.removeEventListener('subscriptionsUpdated', handleUpdate);
      window.removeEventListener('usersUpdated', handleUpdate);
    };
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setView('home');
  };

  const refreshAllData = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <AdminOverview darkMode={darkMode} language={language} key={refreshTrigger} />;
      case 'users':
        return <AdminUsers darkMode={darkMode} language={language} key={refreshTrigger} />;
      case 'projects':
        return <AdminProjects darkMode={darkMode} language={language} key={refreshTrigger} />;
      case 'donations':
        return <AdminDonations darkMode={darkMode} language={language} key={refreshTrigger} />;
      case 'subscriptions':
        return <AdminSubscriptions darkMode={darkMode} language={language} key={refreshTrigger} />;
      case 'reports':
        return <AdminReports darkMode={darkMode} language={language} key={refreshTrigger} />;
      default:
        return <AdminOverview darkMode={darkMode} language={language} key={refreshTrigger} />;
    }
  };

  return (
    <div className={`flex h-screen flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Top Header with Language Toggle */}
      <div className={`fixed top-0 right-0 left-0 z-40 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b flex items-center justify-between px-4 py-3 md:hidden`}>
        <h1 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {t(language, 'dashboard')}
        </h1>
        <button
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition-colors ${darkMode
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          title={language === 'ar' ? 'Switch to English' : 'تبديل إلى العربية'}
        >
          <Globe size={16} />
          <span className="text-xs">{language.toUpperCase()}</span>
        </button>
      </div>

      <div className={`flex h-full ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Sidebar */}
        <AdminSidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          darkMode={darkMode}
          onLogout={handleLogout}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
          language={language}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto md:ml-0 mt-16 md:mt-0 relative">
          {/* Language Toggle - Desktop */}
          <div className="hidden md:flex absolute top-4 right-4 z-20">
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
              title={language === 'ar' ? 'Switch to English' : 'تبديل إلى العربية'}
            >
              <Globe size={18} />
              <span>{language === 'ar' ? '🇸🇦 العربية' : '🇺🇸 English'}</span>
            </button>
          </div>

          <div className={`p-4 md:p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}
