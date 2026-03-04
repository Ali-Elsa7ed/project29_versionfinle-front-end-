// src/components/admin/AdminSubscriptions.jsx
import React, { useState, useMemo, useCallback } from 'react';
import {
  RefreshCw, AlertCircle, CheckCircle, Calendar, Search,
  Download
} from 'lucide-react';
import adminUtils from '../../utils/adminUtils';
import { t } from '../../utils/adminTranslations';

export default function AdminSubscriptions({ darkMode, language = 'ar' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const [renewedId, setRenewedId] = useState(null);

  // الحصول على المستخدم الحالي (Admin المسجل دخول)
  const currentUser = useMemo(() => {
    try {
      const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
      return user;
    } catch {
      return null;
    }
  }, [refreshKey]);

  const allSubscriptions = useMemo(() => {
    const subs = adminUtils.getAllSubscriptions();
    const users = adminUtils.getAllUsers();
    
    // تصفية الاشتراكات التي تحتوي على بيانات محققة و استبعاد المستخدم الحالي والمستخدمين العاديين
    return subs.filter(s => {
      // يجب أن يكون لديها userId و (userName أو userEmail)
      const isValid = s.userId && (s.userName || s.userEmail);
      
      // استبعاد المستخدم الحالي (Admin المسجل دخول)
      const isNotCurrent = currentUser ? s.userId != currentUser.id : true;
      
      // استبعاد المستخدمين العاديين (type === 'user')
      // فقط عرض المالكين (owners)
      const user = users.find(u => u.id == s.userId);
      const isOwner = user && (user.type === 'owner' || user.type === 'admin');
      
      return isValid && isNotCurrent && isOwner;
    });
  }, [refreshKey, currentUser]);
  const allUsers = useMemo(() => adminUtils.getAllUsers(), [refreshKey]);

  const subscriptions = useMemo(() => {
    let filtered = [...allSubscriptions];

    // Filter by status
    if (filterStatus === 'active') {
      filtered = filtered.filter(s => {
        try {
          return new Date(s.expiryDate) > new Date();
        } catch {
          return false;
        }
      });
    } else if (filterStatus === 'expired') {
      filtered = filtered.filter(s => {
        try {
          return new Date(s.expiryDate) <= new Date();
        } catch {
          return false;
        }
      });
    }

    // Search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(s => {
        const user = allUsers.find(u => u.id == s.userId);
        const userName = s.userName || user?.name || '';
        const userEmail = s.userEmail || user?.email || '';
        const planName = s.plan || 'basic';
        
        return userName.toLowerCase().includes(lowerQuery) ||
               userEmail.toLowerCase().includes(lowerQuery) ||
               planName.toLowerCase().includes(lowerQuery);
      });
    }

    return filtered;
  }, [searchQuery, filterStatus, allSubscriptions, allUsers]);

  const getPlanPrice = (plan) => {
    const planType = (plan || 'basic').toLowerCase();
    const prices = {
      'basic': 4.99,
      'pro': 9.99,
      'premium': 19.99,
    };
    return prices[planType] || 4.99;
  };

  const stats = useMemo(() => {
    let active = 0;
    let expired = 0;
    let revenue = 0;

    allSubscriptions.forEach(s => {
      try {
        const expiryDate = new Date(s.expiryDate);
        const now = new Date();
        
        if (expiryDate > now) {
          active++;
          // Only count active subscriptions for monthly revenue
          const planPrice = getPlanPrice(s.plan);
          revenue += planPrice;
        } else {
          expired++;
        }
      } catch (e) {
        // Skip invalid entries
      }
    });

    return { active, expired, revenue };
  }, [allSubscriptions]);

  const handleRenew = useCallback((subscriptionId) => {
    adminUtils.renewSubscription(subscriptionId);
    setRenewedId(subscriptionId);
    setRefreshKey(prev => prev + 1);
    // Clear the success message after 3 seconds
    setTimeout(() => setRenewedId(null), 3000);
  }, []);

  const isExpired = (expiryDate) => {
    try {
      if (!expiryDate) return true;
      const expDate = new Date(expiryDate);
      if (isNaN(expDate.getTime())) return true;
      return expDate <= new Date();
    } catch {
      return true;
    }
  };

  const daysUntilExpiry = (expiryDate) => {
    try {
      if (!expiryDate) return 0;
      const expDate = new Date(expiryDate);
      if (isNaN(expDate.getTime())) return 0;
      
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      expDate.setHours(0, 0, 0, 0);
      
      const days = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));
      return Math.max(days, 0);
    } catch {
      return 0;
    }
  };

  const getPlanColor = (plan) => {
    const colors = {
      'basic': 'bg-gray-100 text-gray-800',
      'pro': 'bg-blue-100 text-blue-800',
      'premium': 'bg-purple-100 text-purple-800',
    };
    return colors[plan] || 'bg-gray-100 text-gray-800';
  };

  const exportSubscriptions = () => {
    const data = subscriptions.map(s => {
      const user = allUsers.find(u => u.id == s.userId);
      const userName = s.userName || user?.name || 'Unknown';
      const userEmail = s.userEmail || user?.email || 'N/A';
      
      return {
        'User': userName,
        'Email': userEmail,
        'Plan': s.plan || 'basic',
        'Start Date': s.startDate ? new Date(s.startDate).toLocaleDateString() : 'N/A',
        'Expiry Date': s.expiryDate ? new Date(s.expiryDate).toLocaleDateString() : 'Invalid',
        'Status': isExpired(s.expiryDate) ? 'Expired' : 'Active',
      };
    });
    adminUtils.exportToCSV(data, 'subscriptions-report.csv');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}
        >
          Subscriptions Management
        </h1>
        <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Manage user subscriptions and memberships
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className={`p-4 rounded-lg border ${
            darkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Active Subscriptions
          </p>
          <p className={`text-2xl font-bold mt-2 text-green-600`}>
            {stats.active}
          </p>
        </div>
        <div
          className={`p-4 rounded-lg border ${
            darkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Expired Subscriptions
          </p>
          <p className={`text-2xl font-bold mt-2 text-red-600`}>
            {stats.expired}
          </p>
        </div>
        <div
          className={`p-4 rounded-lg border ${
            darkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Monthly Revenue (Active Plans)
          </p>
          <p className={`text-2xl font-bold mt-2 text-blue-600`}>
            ${stats.revenue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Pricing Plans Section */}
      <div
        className={`p-4 rounded-lg border ${
          darkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Subscription Plans & Pricing
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Basic</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>$4.99/month</p>
          </div>
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Pro</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>$9.99/month</p>
          </div>
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Premium</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>$19.99/month</p>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {renewedId && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg animate-pulse ${
          darkMode 
            ? 'bg-green-900 border border-green-700' 
            : 'bg-green-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle size={20} />
            <span className="font-medium">Subscription renewed successfully!</span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search
            size={20}
            className={`absolute left-3 top-3 ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`}
          />
          <input
            type="text"
            placeholder="Search by user name, email, or plan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              darkMode
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        {/* Filters and Export */}
        <div className="flex gap-3 flex-wrap items-center justify-between">
          <div className="flex gap-3 flex-wrap">
            {['all', 'active', 'expired'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white'
                    : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={exportSubscriptions}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors flex items-center gap-2"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div
        className={`rounded-lg border overflow-x-auto ${
          darkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <table className="w-full min-w-max">
          <thead>
            <tr
              className={`border-b ${
                darkMode
                  ? 'border-gray-700 bg-gray-900'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <th className={`px-6 py-4 text-left font-semibold ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                User
              </th>
              <th className={`px-6 py-4 text-left font-semibold ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Email
              </th>
              <th className={`px-6 py-4 text-left font-semibold ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Plan
              </th>
              <th className={`px-6 py-4 text-left font-semibold ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Price
              </th>
              <th className={`px-6 py-4 text-left font-semibold ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Start Date
              </th>
              <th className={`px-6 py-4 text-left font-semibold ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Expiry Date
              </th>
              <th className={`px-6 py-4 text-left font-semibold ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Status
              </th>
              <th className={`px-6 py-4 text-right font-semibold ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.length > 0 ? (
              subscriptions.map((subscription, idx) => {
                const user = allUsers.find(u => u.id == subscription.userId);
                const userName = subscription.userName || user?.name || '';
                const userEmail = subscription.userEmail || user?.email || 'N/A';
                
                // تخطي الاشتراكات غير الصحيحة
                if (!userName || !subscription.expiryDate) {
                  return null;
                }
                
                const expired = isExpired(subscription.expiryDate);
                const daysLeft = daysUntilExpiry(subscription.expiryDate);
                const planName = (subscription.plan || 'basic').charAt(0).toUpperCase() + (subscription.plan || 'basic').slice(1);

                return (
                  <tr
                    key={`${subscription.id}-${idx}`}
                    className={`border-b transition-all duration-500 ${
                      renewedId === subscription.id 
                        ? (darkMode ? 'bg-green-900 bg-opacity-30' : 'bg-green-100')
                        : expired 
                          ? (darkMode ? 'bg-red-900 bg-opacity-20' : 'bg-red-50') 
                          : 'hover:' + (darkMode ? 'bg-gray-700' : 'bg-gray-50')
                    }`}
                  >
                    <td className={`px-6 py-4 font-medium ${
                      darkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {userName}
                    </td>
                    <td className={`px-6 py-4 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {userEmail}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        getPlanColor(subscription.plan || 'basic')
                      }`}>
                        {planName}
                      </span>
                    </td>
                    <td className={`px-6 py-4 font-medium text-blue-600`}>
                      ${getPlanPrice(subscription.plan).toFixed(2)}/mo
                    </td>
                    <td className={`px-6 py-4 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        {subscription.startDate ? new Date(subscription.startDate + 'T00:00:00').toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${

                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        {subscription.expiryDate ? new Date(subscription.expiryDate + 'T00:00:00').toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {expired ? (
                          <>
                            <AlertCircle size={16} className="text-red-600" />
                            <span className="text-red-600 font-semibold">Expired</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle size={16} className="text-green-600" />
                            <span className="text-green-600 font-semibold">{daysLeft} days</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleRenew(subscription.id)}
                        className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center gap-2"
                      >
                        <RefreshCw size={16} />
                        Renew
                      </button>
                    </td>
                  </tr>
                );
              }).filter(Boolean) // تصفية null entries
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className={`px-6 py-8 text-center ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  No subscriptions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div
        className={`p-4 rounded-lg ${
          darkMode
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-gray-50 border border-gray-200'
        }`}
      >
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          Showing <span className="font-bold">{subscriptions.length}</span> subscription{subscriptions.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
