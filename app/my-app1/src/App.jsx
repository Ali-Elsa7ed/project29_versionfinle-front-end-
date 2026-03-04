// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Moon, Sun, Heart, TrendingUp, Users, DollarSign, Plus,
  LogIn, LogOut, User, Settings, Eye, MessageCircle, Calendar,
  Target, Star, Bell, Receipt, Download, Filter
} from 'lucide-react';
import AdminDashboard from './components/admin/AdminDashboard';
import LoginModal from './components/LoginModal';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  Legend, BarChart, Bar // ← إضافة
} from 'recharts';

// --------- بيانات المشاريع الابتدائية (مضاف لها backersList, updates, deadlineNotifiedFor, shareCounts, donationsHistory) ----------
const initialProjects = [
  {
    id: 1,
    title: "تطبيق توصيل الطعام المحلي",
    description: "منصة ذكية لربط المطاعم المحلية بالعملاء مع نظام توصيل سريع",
    category: "تقنية",
    goal: 50000,
    raised: 32000,
    backers: 156,
    daysLeft: 15,
    image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&auto=format&fit=crop",
    owner: "أحمد محمد",
    ownerAvatar: "👨‍💼",
    ratings: [],
    averageRating: 0,
    backersList: [],
    comments: [],
    updates: [],
    deadlineNotifiedFor: [],
    shareCounts: { whatsapp: 0, twitter: 0, facebook: 0, copy: 0 },
    views: 245,
    status: 'Active',
    donationsHistory: [
      { date: getPastDate(14), amount: 2000, total: 2000 },
      { date: getPastDate(12), amount: 3000, total: 5000 },
      { date: getPastDate(9), amount: 2000, total: 7000 },
      { date: getPastDate(5), amount: 15000, total: 22000 },
      { date: getPastDate(2), amount: 10000, total: 32000 }
    ]
  },
  {
    id: 2,
    title: "مشروع الزراعة العضوية",
    description: "مزرعة عضوية صغيرة لإنتاج خضروات طازجة وصحية للمجتمع المحلي",
    category: "زراعة",
    goal: 30000,
    raised: 28500,
    backers: 89,
    daysLeft: 5,
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&auto=format&fit=crop",
    owner: "فاطمة أحمد",
    ownerAvatar: "👩‍🌾",
    ratings: [],
    averageRating: 0,
    backersList: [],
    comments: [],
    updates: [],
    deadlineNotifiedFor: [],
    shareCounts: { whatsapp: 0, twitter: 0, facebook: 0, copy: 0 },
    views: 245,
    status: 'Active',
    donationsHistory: [
      { date: getPastDate(10), amount: 5000, total: 5000 },
      { date: getPastDate(6), amount: 10000, total: 15000 },
      { date: getPastDate(3), amount: 13500, total: 28500 }
    ]
  },
  {
    id: 3,
    title: "ورشة صناعة الحرف اليدوية",
    description: "مشروع لتمكين النساء من خلال صناعة وبيع المنتجات الحرفية التقليدية",
    category: "حرف",
    goal: 20000,
    raised: 12000,
    backers: 67,
    daysLeft: 22,
    image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&auto=format&fit=crop",
    owner: "ليلى حسن",
    ownerAvatar: "👩‍🎨",
    ratings: [],
    averageRating: 0,
    backersList: [],
    comments: [],
    updates: [],
    deadlineNotifiedFor: [],
    shareCounts: { whatsapp: 0, twitter: 0, facebook: 0, copy: 0 },
    views: 245,
    status: 'Active',
    donationsHistory: [
      { date: getPastDate(20), amount: 4000, total: 4000 },
      { date: getPastDate(12), amount: 3000, total: 7000 },
      { date: getPastDate(4), amount: 5000, total: 12000 }
    ]
  },
  {
    id: 4,
    title: "مقهى الكتب والثقافة",
    description: "مساحة ثقافية تجمع بين القراءة والقهوة والفعاليات الثقافية",
    category: "ثقافة",
    goal: 40000,
    raised: 15000,
    backers: 92,
    daysLeft: 30,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&auto=format&fit=crop",
    owner: "عمر السيد",
    ownerAvatar: "📚",
    ratings: [],
    averageRating: 0,
    backersList: [],
    comments: [],
    updates: [],
    deadlineNotifiedFor: [],
    shareCounts: { whatsapp: 0, twitter: 0, facebook: 0, copy: 0 },
    views: 245,
    status: 'Active',
    donationsHistory: [
      { date: getPastDate(25), amount: 3000, total: 3000 },
      { date: getPastDate(15), amount: 5000, total: 8000 },
      { date: getPastDate(6), amount: 7000, total: 15000 }
    ]
  }
];

// helper: create a date string for x days ago (format YYYY-MM-DD)
function getPastDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

const CHART_COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const App = () => {

  // حالات التطبيق
  const [darkMode, setDarkMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('home');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [projects, setProjects] = useState(initialProjects);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [favorites, setFavorites] = useState([]);
  const [userDonations, setUserDonations] = useState([]);
  const [showAdminDebug, setShowAdminDebug] = useState(false);
  const [isAdminLoginPage, setIsAdminLoginPage] = useState(false);

  const categories = ['الكل', 'تقنية', 'زراعة', 'حرف', 'ثقافة', 'تعليم', 'صحة'];
  // ------------- صفحة عن المنصة (About) -------------
  // ------------- صفحة عن المنصة (About) - محدثة -------------
  // ------------- صفحة عن المنصة (About) - تصميم مختلف وأطول -------------
  const AboutPage = () => {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Hero Section - تصميم Timeline */}
        <div className={`relative ${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden`}>
          {/* خلفية هندسية */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-96 h-96 border-4 border-blue-500 rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 border-4 border-purple-500 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 w-72 h-72 border-4 border-indigo-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 py-24">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-4 mb-8">
                <div className={`w-20 h-20 rounded-2xl ${darkMode ? 'bg-gradient-to-br from-blue-600 to-indigo-700' : 'bg-gradient-to-br from-blue-500 to-indigo-600'} flex items-center justify-center shadow-2xl transform rotate-12`}>
                  <Target className="w-12 h-12 text-white transform -rotate-12" />
                </div>
                <h1 className={`text-6xl md:text-7xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  من نحن
                </h1>
              </div>
              <p className={`text-2xl md:text-3xl font-light max-w-4xl mx-auto leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                رحلة بدأت من حلم بسيط: <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">منح كل فكرة عظيمة فرصة للحياة</span>
              </p>
            </div>

            {/* بطاقات الإحصائيات - تصميم مختلف */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
              <div className={`relative p-8 rounded-3xl ${darkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-white to-gray-50'} shadow-xl border-2 ${darkMode ? 'border-gray-600' : 'border-gray-200'} group hover:border-blue-500 transition-all`}>
                <div className="absolute -top-6 right-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-center pt-6">
                  <div className={`text-5xl font-black mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {projects.length}+
                  </div>
                  <div className={`text-lg font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    مشروع ناجح
                  </div>
                  <div className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    تم تمويله بنجاح
                  </div>
                </div>
              </div>

              <div className={`relative p-8 rounded-3xl ${darkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-white to-gray-50'} shadow-xl border-2 ${darkMode ? 'border-gray-600' : 'border-gray-200'} group hover:border-green-500 transition-all`}>
                <div className="absolute -top-6 right-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-center pt-6">
                  <div className={`text-5xl font-black mb-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    {projects.reduce((sum, p) => sum + p.backers, 0)}+
                  </div>
                  <div className={`text-lg font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    داعم متحمس
                  </div>
                  <div className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    ساهموا في تحقيق الأحلام
                  </div>
                </div>
              </div>

              <div className={`relative p-8 rounded-3xl ${darkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-white to-gray-50'} shadow-xl border-2 ${darkMode ? 'border-gray-600' : 'border-gray-200'} group hover:border-purple-500 transition-all`}>
                <div className="absolute -top-6 right-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-center pt-6">
                  <div className={`text-5xl font-black mb-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    {(projects.reduce((sum, p) => sum + p.raised, 0) / 1000).toFixed(0)}K+
                  </div>
                  <div className={`text-lg font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    ريال سعودي
                  </div>
                  <div className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    تم جمعها لتمويل الأفكار
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* قصة المنصة - Timeline Design */}
        <div className="max-w-7xl mx-auto px-4 py-24">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block mb-6">
                <span className={`px-6 py-2 rounded-full text-sm font-bold ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                  📖 قصتنا
                </span>
              </div>
              <h2 className={`text-5xl font-black mb-8 leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                كيف بدأت<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  رحلة الأحلام
                </span>
              </h2>
              <div className="space-y-6">
                <p className={`text-xl leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  في عام 2024، اجتمعت مجموعة من رواد الأعمال والمبرمجين الذين يؤمنون بقوة الأفكار المبتكرة. لاحظنا أن هناك المئات من الأفكار العظيمة التي تموت قبل أن ترى النور، ليس لأنها سيئة، بل لأن أصحابها لا يملكون الموارد الكافية.
                </p>
                <p className={`text-xl leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  من هنا ولدت فكرة منصة المشاريع - جسر يربط بين أصحاب الأحلام والداعمين الذين يؤمنون بهذه الأحلام. أردنا خلق مجتمع حقيقي يدعم بعضه البعض، حيث النجاح ليس حكراً على من يملك المال، بل على من يملك الإرادة والإبداع.
                </p>
                <p className={`text-xl leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  اليوم، بعد مساعدة العشرات من المشاريع على رؤية النور، نفخر بكوننا جزءاً من قصص نجاح حقيقية غيّرت حياة أصحابها ومجتمعاتهم.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className={`p-8 rounded-3xl ${darkMode ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-700' : 'bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200'} backdrop-blur-sm`}>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-3xl">💡</span>
                    </div>
                    <div>
                      <h4 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>الفكرة</h4>
                      <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                        كل مشروع عظيم بدأ بفكرة بسيطة. نحن نؤمن بقوة الأفكار وقدرتها على تغيير العالم.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-3xl">🤝</span>
                    </div>
                    <div>
                      <h4 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>المجتمع</h4>
                      <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                        بناء مجتمع قوي من الداعمين ورواد الأعمال الذين يساندون بعضهم البعض.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-3xl">🚀</span>
                    </div>
                    <div>
                      <h4 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>النجاح</h4>
                      <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                        تحويل الأحلام إلى مشاريع ناجحة تخلق قيمة حقيقية في المجتمع.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* الرؤية والرسالة - Box Design */}
        <div className={`py-24 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              {/* الرؤية */}
              <div className={`relative p-12 rounded-3xl ${darkMode ? 'bg-gradient-to-br from-blue-900 to-blue-800' : 'bg-gradient-to-br from-blue-600 to-indigo-700'} text-white overflow-hidden`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                    <Eye className="w-10 h-10" />
                  </div>
                  <h3 className="text-4xl font-black mb-6">رؤيتنا</h3>
                  <p className="text-xl leading-relaxed opacity-90 mb-6">
                    أن نكون المنصة الأولى في العالم العربي لدعم المشاريع الريادية، حيث يجد كل صاحب فكرة مبتكرة الدعم والتمويل اللازم لتحقيق حلمه.
                  </p>
                  <p className="text-lg leading-relaxed opacity-80">
                    نحلم بمستقبل لا تموت فيه الأفكار العظيمة بسبب قلة الموارد، بل تزدهر وتنمو لتخلق قيمة حقيقية للمجتمع.
                  </p>
                </div>
              </div>

              {/* الرسالة */}
              <div className={`relative p-12 rounded-3xl ${darkMode ? 'bg-gradient-to-br from-purple-900 to-pink-800' : 'bg-gradient-to-br from-purple-600 to-pink-600'} text-white overflow-hidden`}>
                <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 -translate-x-1/2"></div>
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-1/2 translate-x-1/2"></div>

                <div className="relative z-10">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                    <Target className="w-10 h-10" />
                  </div>
                  <h3 className="text-4xl font-black mb-6">رسالتنا</h3>
                  <p className="text-xl leading-relaxed opacity-90 mb-6">
                    توفير منصة آمنة وشفافة وسهلة الاستخدام تربط بين أصحاب المشاريع الطموحين والداعمين المتحمسين، مع ضمان أعلى معايير الجودة والمصداقية.
                  </p>
                  <p className="text-lg leading-relaxed opacity-80">
                    نلتزم بتمكين رواد الأعمال وبناء مجتمع يؤمن بقوة التعاون والدعم المتبادل.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* الأهداف - Card Grid */}
        <div className="max-w-7xl mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <span className={`inline-block px-6 py-2 rounded-full text-sm font-bold mb-6 ${darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'}`}>
              🎯 أهدافنا
            </span>
            <h2 className={`text-5xl font-black mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              ما نسعى لتحقيقه
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              نعمل كل يوم لتحقيق أهداف واضحة تصب في مصلحة مجتمع رواد الأعمال
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* هدف 1 */}
            <div className={`group p-8 rounded-3xl ${darkMode ? 'bg-gray-800 border-2 border-gray-700' : 'bg-white border-2 border-gray-200'} hover:border-blue-500 transition-all hover:shadow-2xl`}>
              <div className={`w-16 h-16 rounded-2xl ${darkMode ? 'bg-blue-900' : 'bg-blue-100'} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <span className="text-4xl">💡</span>
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                تمكين رواد الأعمال
              </h3>
              <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                نوفر الأدوات والموارد والدعم اللازم لكل رائد أعمال لتحويل فكرته إلى مشروع ناجح على أرض الواقع.
              </p>
              <div className={`mt-6 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>دعم فني متواصل</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>استشارات مجانية</span>
                </div>
              </div>
            </div>

            {/* هدف 2 */}
            <div className={`group p-8 rounded-3xl ${darkMode ? 'bg-gray-800 border-2 border-gray-700' : 'bg-white border-2 border-gray-200'} hover:border-green-500 transition-all hover:shadow-2xl`}>
              <div className={`w-16 h-16 rounded-2xl ${darkMode ? 'bg-green-900' : 'bg-green-100'} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <span className="text-4xl">🤝</span>
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                بناء مجتمع قوي
              </h3>
              <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                خلق بيئة داعمة حيث يلتقي رواد الأعمال والداعمون والخبراء لتبادل الخبرات والمعرفة والدعم.
              </p>
              <div className={`mt-6 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>فعاليات شهرية</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>منتدى تفاعلي</span>
                </div>
              </div>
            </div>

            {/* هدف 3 */}
            <div className={`group p-8 rounded-3xl ${darkMode ? 'bg-gray-800 border-2 border-gray-700' : 'bg-white border-2 border-gray-200'} hover:border-purple-500 transition-all hover:shadow-2xl`}>
              <div className={`w-16 h-16 rounded-2xl ${darkMode ? 'bg-purple-900' : 'bg-purple-100'} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <span className="text-4xl">📈</span>
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                دعم الاقتصاد المحلي
              </h3>
              <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                المساهمة في تنمية الاقتصاد الوطني من خلال دعم المشاريع الصغيرة والمتوسطة وخلق فرص عمل جديدة.
              </p>
              <div className={`mt-6 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>توظيف محلي</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>شراكات استراتيجية</span>
                </div>
              </div>
            </div>

            {/* هدف 4 */}
            <div className={`group p-8 rounded-3xl ${darkMode ? 'bg-gray-800 border-2 border-gray-700' : 'bg-white border-2 border-gray-200'} hover:border-orange-500 transition-all hover:shadow-2xl`}>
              <div className={`w-16 h-16 rounded-2xl ${darkMode ? 'bg-orange-900' : 'bg-orange-100'} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <span className="text-4xl">🔒</span>
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                الشفافية المطلقة
              </h3>
              <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                ضمان أعلى معايير الشفافية في جميع المعاملات مع حماية حقوق جميع الأطراف وبناء الثقة.
              </p>
              <div className={`mt-6 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>تقارير دورية</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>تدقيق مستقل</span>
                </div>
              </div>
            </div>

            {/* هدف 5 */}
            <div className={`group p-8 rounded-3xl ${darkMode ? 'bg-gray-800 border-2 border-gray-700' : 'bg-white border-2 border-gray-200'} hover:border-pink-500 transition-all hover:shadow-2xl`}>
              <div className={`w-16 h-16 rounded-2xl ${darkMode ? 'bg-pink-900' : 'bg-pink-100'} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <span className="text-4xl">🌟</span>
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                الابتكار المستمر
              </h3>
              <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                التطوير المستمر للمنصة وإضافة ميزات جديدة لتحسين تجربة المستخدمين وتلبية احتياجاتهم المتغيرة.
              </p>
              <div className={`mt-6 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>تحديثات شهرية</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>استماع للمقترحات</span>
                </div>
              </div>
            </div>

            {/* هدف 6 */}
            <div className={`group p-8 rounded-3xl ${darkMode ? 'bg-gray-800 border-2 border-gray-700' : 'bg-white border-2 border-gray-200'} hover:border-indigo-500 transition-all hover:shadow-2xl`}>
              <div className={`w-16 h-16 rounded-2xl ${darkMode ? 'bg-indigo-900' : 'bg-indigo-100'} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <span className="text-4xl">🎓</span>
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                التعليم والتطوير
              </h3>

              <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                توفير موارد تعليمية ودورات تدريبية لمساعدة رواد الأعمال على تطوير مهاراتهم وإدارة مشاريعهم بكفاءة.
              </p>
              <div className={`mt-6 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>              <div className="flex items-center gap-2">                 <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>دورات مجانية</span>               </div>               <div className="flex items-center gap-2 mt-2">                 <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>ورش عمل تفاعلية</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* القيم - Bento Box Style */}
        <div className={`py-24 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <span className={`inline-block px-6 py-2 rounded-full text-sm font-bold mb-6 ${darkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-700'}`}>
                ⭐ قيمنا الأساسية
              </span>
              <h2 className={`text-5xl font-black mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                ما نؤمن به
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                قيم راسخة تحكم طريقة عملنا وتعاملنا مع مجتمعنا
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* قيمة 1 - Large */}
              <div className={`md:col-span-2 p-10 rounded-3xl ${darkMode ? 'bg-gradient-to-br from-blue-900/50 to-indigo-900/50 border-2 border-blue-700' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200'}`}>
                <div className="flex items-start gap-6">
                  <div className={`w-20 h-20 rounded-2xl ${darkMode ? 'bg-blue-800' : 'bg-blue-500'} flex items-center justify-center flex-shrink-0 shadow-xl`}>
                    <span className="text-4xl">✨</span>
                  </div>
                  <div>
                    <h3 className={`text-3xl font-black mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      الابتكار والإبداع
                    </h3>
                    <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      نشجع التفكير خارج الصندوق ونحتفي بالأفكار الجريئة والمبتكرة. نؤمن أن الابتكار هو مفتاح التقدم، ونوفر البيئة المثالية لازدهار الإبداع.
                    </p>
                    <div className="flex flex-wrap gap-3 mt-6">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-200 text-blue-800'}`}>
                        أفكار جديدة
                      </span>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-200 text-blue-800'}`}>
                        حلول مبتكرة
                      </span>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-200 text-blue-800'}`}>
                        تجربة فريدة
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* قيمة 2 */}
              <div className={`p-8 rounded-3xl ${darkMode ? 'bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-2 border-green-700' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200'}`}>
                <div className={`w-16 h-16 rounded-2xl ${darkMode ? 'bg-green-800' : 'bg-green-500'} flex items-center justify-center mb-6 shadow-xl`}>
                  <span className="text-3xl">🔒</span>
                </div>
                <h3 className={`text-2xl font-black mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  الأمان والثقة
                </h3>
                <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  نحمي بيانات مستخدمينا بأعلى معايير الأمان، ونضمن سلامة جميع المعاملات المالية.
                </p>
              </div>

              {/* قيمة 3 */}
              <div className={`p-8 rounded-3xl ${darkMode ? 'bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-2 border-purple-700' : 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200'}`}>
                <div className={`w-16 h-16 rounded-2xl ${darkMode ? 'bg-purple-800' : 'bg-purple-500'} flex items-center justify-center mb-6 shadow-xl`}>
                  <span className="text-3xl">💪</span>
                </div>
                <h3 className={`text-2xl font-black mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  التمكين للجميع
                </h3>
                <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  نؤمن أن الجميع يستحق فرصة لتحقيق أحلامه، بغض النظر عن خلفيته أو موارده المالية.
                </p>
              </div>

              {/* قيمة 4 - Large */}
              <div className={`md:col-span-2 p-10 rounded-3xl ${darkMode ? 'bg-gradient-to-br from-orange-900/50 to-red-900/50 border-2 border-orange-700' : 'bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200'}`}>
                <div className="flex items-start gap-6">
                  <div className={`w-20 h-20 rounded-2xl ${darkMode ? 'bg-orange-800' : 'bg-orange-500'} flex items-center justify-center flex-shrink-0 shadow-xl`}>
                    <span className="text-4xl">🌟</span>
                  </div>
                  <div>
                    <h3 className={`text-3xl font-black mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      الجودة والتميز
                    </h3>
                    <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      نسعى دائماً لتقديم أفضل تجربة ممكنة، ونحرص على جودة كل تفصيلة في منصتنا. نراجع المشاريع بعناية ونساعد أصحابها على تقديم أفضل ما لديهم.
                    </p>
                    <div className="flex flex-wrap gap-3 mt-6">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${darkMode ? 'bg-orange-800 text-orange-200' : 'bg-orange-200 text-orange-800'}`}>
                        معايير عالية
                      </span>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${darkMode ? 'bg-orange-800 text-orange-200' : 'bg-orange-200 text-orange-800'}`}>
                        تحسين مستمر
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* قيمة 5 */}
              <div className={`p-8 rounded-3xl ${darkMode ? 'bg-gradient-to-br from-indigo-900/50 to-blue-900/50 border-2 border-indigo-700' : 'bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200'}`}>
                <div className={`w-16 h-16 rounded-2xl ${darkMode ? 'bg-indigo-800' : 'bg-indigo-500'} flex items-center justify-center mb-6 shadow-xl`}>
                  <span className="text-3xl">🤝</span>
                </div>
                <h3 className={`text-2xl font-black mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  الشراكة الحقيقية
                </h3>
                <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  نعامل كل مستخدم كشريك، ونستمع لآرائهم، ونعمل معهم لتحقيق النجاح المشترك.
                </p>
              </div>

              {/* قيمة 6 */}
              <div className={`p-8 rounded-3xl ${darkMode ? 'bg-gradient-to-br from-teal-900/50 to-cyan-900/50 border-2 border-teal-700' : 'bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200'}`}>
                <div className={`w-16 h-16 rounded-2xl ${darkMode ? 'bg-teal-800' : 'bg-teal-500'} flex items-center justify-center mb-6 shadow-xl`}>
                  <span className="text-3xl">🌍</span>
                </div>
                <h3 className={`text-2xl font-black mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  المسؤولية المجتمعية
                </h3>
                <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  نساهم في بناء مجتمع أفضل من خلال دعم المشاريع التي تخلق قيمة حقيقية للمجتمع.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* الفريق أو الشهادات */}
        <div className="max-w-7xl mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <span className={`inline-block px-6 py-2 rounded-full text-sm font-bold mb-6 ${darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
              💬 قصص النجاح
            </span>
            <h2 className={`text-5xl font-black mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              كلمات من مستخدمينا
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              استمع إلى تجارب حقيقية من رواد أعمال حققوا أحلامهم عبر منصتنا
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* شهادة 1 */}
            <div className={`p-8 rounded-3xl ${darkMode ? 'bg-gray-800 border-2 border-gray-700' : 'bg-white border-2 border-gray-200'} hover:scale-105 transition-transform`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                  أ
                </div>
                <div>
                  <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>أحمد محمد</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>صاحب مشروع توصيل</p>
                </div>
              </div>
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                "المنصة غيّرت حياتي! جمعت التمويل في أقل من شهر وبدأت مشروعي. الدعم كان رائع والمجتمع متعاون جداً."
              </p>
            </div>

            {/* شهادة 2 */}
            <div className={`p-8 rounded-3xl ${darkMode ? 'bg-gray-800 border-2 border-gray-700' : 'bg-white border-2 border-gray-200'} hover:scale-105 transition-transform`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold">
                  ف
                </div>
                <div>
                  <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>فاطمة أحمد</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>صاحبة مزرعة عضوية</p>
                </div>
              </div>
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                "كنت أحلم بمزرعتي الخاصة، والمنصة ساعدتني أحقق الحلم. الشفافية والمصداقية شيء رائع فعلاً!"
              </p>
            </div>

            {/* شهادة 3 */}
            <div className={`p-8 rounded-3xl ${darkMode ? 'bg-gray-800 border-2 border-gray-700' : 'bg-white border-2 border-gray-200'} hover:scale-105 transition-transform`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-2xl font-bold">
                  ل
                </div>
                <div>
                  <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>ليلى حسن</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>صاحبة ورشة حرفية</p>
                </div>
              </div>
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                "المنصة مش بس مولت المشروع، كمان ساعدتني أتعرف على ناس ملهمة ومبدعة. شكراً من القلب!"
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action - تصميم مختلف */}
        <div className={`relative overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} py-24`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4">
            <div className={`rounded-3xl overflow-hidden ${darkMode ? 'bg-gradient-to-br from-blue-900 to-purple-900' : 'bg-gradient-to-br from-blue-600 to-purple-600'} p-12 md:p-16`}>
              <div className="max-w-4xl mx-auto text-center text-white">
                <h2 className="text-5xl md:text-6xl font-black mb-6">
                  جاهز لبدء رحلتك؟
                </h2>
                <p className="text-xl md:text-2xl mb-12 opacity-90">
                  انضم لآلاف رواد الأعمال والداعمين الذين يحققون أحلامهم معنا كل يوم
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  {!currentUser ? (
                    <>
                      <button
                        onClick={() => setView('login')}
                        className="group px-10 py-5 bg-white text-blue-600 rounded-2xl font-black text-xl shadow-2xl hover:shadow-3xl transition-all hover:scale-105 flex items-center justify-center gap-3"
                      >
                        انضم الآن مجاناً
                        <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setView('home')}
                        className="px-10 py-5 bg-white/10 backdrop-blur-lg border-3 border-white text-white rounded-2xl font-black text-xl hover:bg-white/20 transition-all hover:scale-105"
                      >
                        استكشف المشاريع
                      </button>
                    </>
                  ) : (
                    <>
                      {currentUser.type === 'owner' && (
                        <button
                          onClick={() => setView('add-project')}
                          className="group px-10 py-5 bg-white text-blue-600 rounded-2xl font-black text-xl shadow-2xl hover:shadow-3xl transition-all hover:scale-105 flex items-center justify-center gap-3"
                        >
                          أطلق مشروعك الآن
                          <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => setView('home')}
                        className="px-10 py-5 bg-white/10 backdrop-blur-lg border-3 border-white text-white rounded-2xl font-black text-xl hover:bg-white/20 transition-all hover:scale-105"
                      >
                        تصفح المشاريع
                      </button>
                    </>
                  )}
                </div>

                {/* إحصائيات سريعة */}
                <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/20">
                  <div>
                    <div className="text-4xl font-black mb-2">{projects.length}+</div>
                    <div className="text-sm opacity-80">مشروع نشط</div>
                  </div>
                  <div>
                    <div className="text-4xl font-black mb-2">{projects.reduce((sum, p) => sum + p.backers, 0)}+</div>
                    <div className="text-sm opacity-80">داعم سعيد</div>
                  </div>
                  <div>
                    <div className="text-4xl font-black mb-2">98%</div>
                    <div className="text-sm opacity-80">نسبة الرضا</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  // ----- تحميل من localStorage عند بدء التطبيق -----
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedProjects = localStorage.getItem('projects');
    const savedDonations = localStorage.getItem('donations');

    // إعداد بيانات اختبار سريعة إذا لم تكن موجودة
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // التحقق من عدم وجود بيانات اختبار
    const testEmails = ['ali@admin.com', 'john@example.com', 'sarah@example.com'];
    const hasTestUsers = testEmails.some(email => users.some(u => u.email === email));
    
    if (!hasTestUsers) {
      const testUsers = [
        {
          id: Date.now() + 1,
          email: 'ali@admin.com',
          password: 'admin',
          type: 'admin',
          name: 'علي - مسؤول النظام',
          fullName: 'علي محمود - مسؤول النظام',
          nationalId: '12345678901234',
          phoneNumber: '01012345678',
          address: 'مصر، القاهرة',
          governorate: 'القاهرة',
          notifications: [],
          points: 1000,
          balance: 99999
        },
        {
          id: Date.now() + 2,
          email: 'john@example.com',
          password: 'owner123',
          type: 'owner',
          name: 'أحمد صاحب المشروع',
          fullName: 'أحمد محمد علي',
          nationalId: '22345678901234',
          phoneNumber: '01112345678',
          address: 'مصر، الجيزة',
          governorate: 'الجيزة',
          notifications: [],
          points: 500,
          balance: 5000
        },
        {
          id: Date.now() + 3,
          email: 'sarah@example.com',
          password: 'user123',
          type: 'user',
          name: 'سارة المستخدمة',
          fullName: 'سارة أحمد سعيد',
          nationalId: '32345678901234',
          phoneNumber: '01212345678',
          address: 'مصر، الإسكندرية',
          governorate: 'الإسكندرية',
          notifications: [],
          points: 150,
          balance: 2000
        }
      ];
      
      const updatedUsers = [...users, ...testUsers];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }

    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setCurrentUser({ ...parsed, id: String(parsed.id) });

      // تحميل المفضلة الخاصة بالمستخدم الحالي فقط
      const userFavorites = localStorage.getItem(`favorites_${parsed.id}`);
      if (userFavorites) {
        setFavorites(JSON.parse(userFavorites));
      }
    }

    if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));

    // تحميل المشاريع
    if (savedProjects) {
      const allProjects = JSON.parse(savedProjects);
      setProjects(allProjects);
    } else {
      // إذا لم توجد مشاريع محفوظة، استخدم المشاريع الابتدائية
      setProjects(initialProjects);
      localStorage.setItem('projects', JSON.stringify(initialProjects));
    }

    // إضافة حالة status للمشاريع إذا لم تكن موجودة
    if (savedProjects) {
      const projects = JSON.parse(savedProjects);
      const hasStatus = projects.some(p => p.status);
      if (!hasStatus) {
        const projectsWithStatus = projects.map(p => ({
          ...p,
          status: 'Active'
        }));
        localStorage.setItem('projects', JSON.stringify(projectsWithStatus));
        setProjects(projectsWithStatus);
      }
    }

    if (savedDonations) setUserDonations(JSON.parse(savedDonations));
  }, []);

  // حفظ بعض الحالات
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    if (projects.length > 0) {
      // حفظ جميع المشاريع مع التحديثات
      const allProjects = projects.map(p => ({
        ...p,
        // التأكد من حفظ جميع البيانات المهمة
        ratings: p.ratings || [],
        backersList: p.backersList || [],
        updates: p.updates || [],
        deadlineNotifiedFor: p.deadlineNotifiedFor || [],
        shareCounts: p.shareCounts || { whatsapp: 0, twitter: 0, facebook: 0, copy: 0 },
        views: p.views || 0,
        donationsHistory: p.donationsHistory || [],
        status: p.status || 'Active'
      }));

      localStorage.setItem('projects', JSON.stringify(allProjects));
    }
  }, [projects]);

  useEffect(() => {
    if (currentUser) {
      // حفظ المفضلة الخاصة بالمستخدم الحالي
      localStorage.setItem(`favorites_${currentUser.id}`, JSON.stringify(favorites));
    }
  }, [favorites, currentUser]);

  useEffect(() => {
    localStorage.setItem('donations', JSON.stringify(userDonations));
  }, [userDonations]);

  // تحويل userDonations إلى donations format للـ Admin Dashboard
  useEffect(() => {
    if (userDonations.length > 0) {
      const adminDonations = userDonations.map((donation, idx) => ({
        id: donation.id || idx + 1,
        userId: donation.userId || currentUser?.id || '1',
        projectId: donation.projectId || 1,
        amount: donation.amount || 0,
        date: donation.date || new Date().toISOString()
      }));
      localStorage.setItem('donations', JSON.stringify(adminDonations));
    }
  }, [userDonations, currentUser]);

  // إنشاء subscriptions افتراضية إذا لم تكن موجودة و تنظيف الاشتراكات المكررة
  useEffect(() => {
    const savedSubscriptions = localStorage.getItem('subscriptions');
    if (savedSubscriptions) {
      try {
        // تنظيف الاشتراكات المكررة - احتفظ فقط بآخر اشتراك لكل مستخدم
        const subscriptions = JSON.parse(savedSubscriptions);
        const uniqueSubscriptions = {};
        
        subscriptions.forEach(sub => {
          // احتفظ بآخر اشتراك (بناءً على startDate)
          const userId = sub.userId;
          if (!uniqueSubscriptions[userId] || new Date(sub.startDate) > new Date(uniqueSubscriptions[userId].startDate)) {
            uniqueSubscriptions[userId] = sub;
          }
        });
        
        const cleanedSubscriptions = Object.values(uniqueSubscriptions);
        
        // احفظ البيانات المنظفة (فقط إذا كان هناك تغييرات)
        if (cleanedSubscriptions.length !== subscriptions.length) {
          localStorage.setItem('subscriptions', JSON.stringify(cleanedSubscriptions));
        }
      } catch (e) {
        console.error('Error cleaning subscriptions:', e);
      }
    } else {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // إنشاء اشتراكات للمستخدمين
      const subscriptions = [];
      
      users.forEach((user, idx) => {
        // تخطي المسؤولين
        if (user.type === 'admin') return;
        
        // إنشاء تاريخ البداية
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - (30 - idx * 5));
        const startDateStr = startDate.toISOString().split('T')[0];
        
        // إنشاء تاريخ الانتهاء (شهر واحد بعد البداية)
        const expiryDate = new Date(startDate);
        expiryDate.setMonth(expiryDate.getMonth() + 1);
        const expiryDateStr = expiryDate.toISOString().split('T')[0];
        
        // تحديد خطة الاشتراك
        const plans = ['basic', 'pro', 'premium'];
        const plan = plans[idx % plans.length];
        
        subscriptions.push({
          id: subscriptions.length + 1,
          userId: user.id,
          userName: user.name || user.fullName || 'Unknown',
          userEmail: user.email || 'N/A',
          plan: plan,
          startDate: startDateStr,
          expiryDate: expiryDateStr
        });
      });
      
      if (subscriptions.length > 0) {
        localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
      }
    }
  }, []);

  // تحميل الرسائل عند تسجيل الدخول
  useEffect(() => {
    if (currentUser) {
      const savedMessages = localStorage.getItem('chatMessages');
      if (savedMessages) {
        setChatMessages(JSON.parse(savedMessages));
      }

      // إضافة المستخدم للقائمة النشطة
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const activeUsers = users
        .filter(u => String(u.id) !== String(currentUser.id)) // استبعاد المستخدم الحالي
        .map(u => ({
          id: String(u.id),
          name: u.name || u.email,
          avatar: u.profileImage || '👤',
          online: true // جميع المستخدمين متصلين للتبسيط
        }));
      setOnlineUsers(activeUsers);
    } else {
      setOnlineUsers([]);
      setChatMessages([]); // 🔥 إضافة: تنظيف الرسائل عند الخروج
    }
  }, [currentUser]);
  // حفظ الرسائل
  useEffect(() => {
    if (chatMessages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
    }
  }, [chatMessages]);

  // ------------- نظام الاشعارات المحلي -------------
  const addNotificationToUser = (userId, notification) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    // work with normalized ids (strings)
    const updated = users.map(u => {
      if (String(u.id) === String(userId)) {
        const nots = u.notifications || [];
        return { ...u, id: String(u.id), notifications: [{ id: Date.now(), icon: notification.icon || '🔔', ...notification, read: false }, ...nots] };
      }
      return { ...u, id: String(u.id) };
    });
    localStorage.setItem('users', JSON.stringify(updated));

    // إذا المستخدم الحالي هو المستهدف حدّثه فوراً
    if (currentUser && String(currentUser.id) === String(userId)) {
      const updatedCurrent = updated.find(u => String(u.id) === String(userId));
      if (updatedCurrent) {
        setCurrentUser({ ...updatedCurrent, id: String(updatedCurrent.id) });
        localStorage.setItem('currentUser', JSON.stringify({ ...updatedCurrent, id: String(updatedCurrent.id) }));
      }
    }
  };

  // ----------- دالة تسجيل دخول سريع للمسؤول (للاختبار) ----------
  const quickAdminLogin = () => {
    setIsAdminLoginPage(true);
  };

  // ------------- دالة تسجيل الدخول من LoginModal -------------
  const handleLoginModalSubmit = (credentials) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
    
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentUser(user);

      // تحميل المفضلة الخاصة بهذا المستخدم
      const userFavorites = localStorage.getItem(`favorites_${user.id}`);
      if (userFavorites) {
        setFavorites(JSON.parse(userFavorites));
      } else {
        setFavorites([]);
      }

      // إذا كان مالك مشروع، اعرض صفحة الاشتراك
      if (user.type === 'owner') {
        setIsLoginModalOpen(false);
        setView('subscription-plan');
      } else {
        setIsLoginModalOpen(false);
        setView('home');
      }
    } else {
      alert('بيانات الدخول غير صحيحة');
    }
  };

  // مساعدة للحصول على مستخدم حسب الاسم (مستخدم في الأماكن التي نعرف بها owner by name)
  const findUserByName = (name) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(u => u.name === name);
  };

  // ------------- وظائف المشاركة و المكافآت -------------
  const getProjectUrl = (projectId) => {
    const base = window.location.origin;
    return `${base}/project/${projectId}`;
  };

  const openShareWindow = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  const registerShare = (projectId, channel) => {
    // تحديث shareCounts في المشروع
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        const counts = { ...(p.shareCounts || { whatsapp: 0, twitter: 0, facebook: 0, copy: 0 }) };
        counts[channel] = (counts[channel] || 0) + 1;
        return { ...p, shareCounts: counts };
      }
      return p;
    });
    setProjects(updatedProjects);

    // حفظ مشاريع محلية
    const localProjects = updatedProjects.filter(pr => !initialProjects.find(ip => ip.id === pr.id));
    localStorage.setItem('localProjects', JSON.stringify(localProjects));

    // منح نقاط للمستخدم الحالي (مثلاً 5 نقاط لكل مشاركة)
    if (currentUser) {
      const reward = 5;
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map(u => {
        if (u.id === currentUser.id) {
          const newPoints = (u.points || 0) + reward;
          return { ...u, points: newPoints };
        }
        return u;
      });
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      const updatedCurrent = updatedUsers.find(u => u.id === currentUser.id);
      setCurrentUser(updatedCurrent);
      localStorage.setItem('currentUser', JSON.stringify(updatedCurrent));

      // اخطار / اشعار للمستخدم حول النقاط
      addNotificationToUser(currentUser.id, {
        title: '✅ شكراً للمشاركة!',
        message: `حصلت على ${reward} نقطة لمشاركتك مشروع "${projects.find(p => p.id === projectId)?.title || ''}".`,
        icon: '🎁',
        link: { view: 'project-details', projectId }
      });
    }
  };

  // ------------- المفضلة والتصفية -------------
  const toggleFavorite = (projectId) => {
    if (!currentUser) {
      alert('يرجى تسجيل الدخول أولاً');
      return;
    }
    setFavorites(prev => prev.includes(projectId) ? prev.filter(id => id !== projectId) : [...prev, projectId]);
  };
  const isFavorite = (projectId) => favorites.includes(projectId);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.includes(searchTerm) || project.description.includes(searchTerm);
    const matchesCategory = selectedCategory === 'الكل' || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // ------------- مكون النجوم للتقييم -------------
  const StarRating = ({ rating, onRate, readonly = false, size = 'medium' }) => {
    const [hover, setHover] = useState(0);
    const sizeClasses = { small: 'w-4 h-4', medium: 'w-6 h-6', large: 'w-8 h-8' };
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onRate && onRate(star)}
            onMouseEnter={() => !readonly && setHover(star)}
            onMouseLeave={() => !readonly && setHover(0)}
            className={`transition-all ${!readonly && 'cursor-pointer hover:scale-110'} ${readonly && 'cursor-default'}`}
          >
            <Star className={`${sizeClasses[size]} ${star <= (hover || rating)
              ? 'fill-yellow-400 text-yellow-400'
              : darkMode ? 'text-gray-600' : 'text-gray-300'
              }`} />
          </button>
        ))}
      </div>
    );
  };

  // ----------------- Charts components -----------------
  // ----------------- Charts components -----------------
  const DonationsLineChart = ({ data }) => {
    const chartData = (data || []).map(d => ({ date: d.date, total: d.total }));
    if (!chartData || chartData.length === 0) {
      return (
        <div style={{ width: '100%', height: '256px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>لا توجد بيانات</p>
        </div>
      );
    }
    return (
      <div style={{ width: '100%', height: '256px', minHeight: '256px' }}>
        <ResponsiveContainer width="100%" height={256}>
          <LineChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#2d3748' : '#e6edf3'} />
            <XAxis dataKey="date" stroke={darkMode ? '#cbd5e1' : '#374151'} />
            <YAxis stroke={darkMode ? '#cbd5e1' : '#374151'} />
            <Tooltip wrapperStyle={{ background: darkMode ? '#1f2937' : '#fff', borderRadius: 6 }} />
            <Line type="monotone" dataKey="total" stroke={CHART_COLORS[0]} strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const ProgressPie = ({ raised, goal }) => {
    const remaining = Math.max(goal - raised, 0);
    const pieData = [
      { name: 'مجموع تمّ', value: raised },
      { name: 'المتبقي', value: remaining }
    ];
    return (
      <div style={{ width: '100%', height: '224px', minHeight: '224px' }}>
        <ResponsiveContainer width="100%" height={224}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4}>
              {pieData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={idx === 0 ? CHART_COLORS[0] : '#e5e7eb'} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: darkMode ? '#e5e7eb' : '#374151' }} />
            <Tooltip wrapperStyle={{ background: darkMode ? '#1f2937' : '#fff', borderRadius: 6 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // ------------- صفحة تسجيل الدخول/التسجيل -------------
  const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const [userType, setUserType] = useState('user');

    // حقول جديدة للتسجيل
    const [fullName, setFullName] = useState('');
    const [nationalId, setNationalId] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [governorate, setGovernorate] = useState('');
    const [errors, setErrors] = useState({});

    // قائمة المحافظات المصرية
    const governorates = [
      'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'البحيرة', 'الفيوم',
      'الغربية', 'الإسماعيلية', 'المنوفية', 'المنيا', 'القليوبية', 'الوادي الجديد',
      'الشرقية', 'أسيوط', 'سوهاج', 'قنا', 'أسوان', 'الأقصر', 'البحر الأحمر',
      'مطروح', 'شمال سيناء', 'جنوب سيناء', 'بورسعيد', 'دمياط', 'السويس',
      'كفر الشيخ', 'بني سويف'
    ];

    // التحقق من صحة البيانات
    const validateSignup = () => {
      const newErrors = {};

      // التحقق من الاسم الكامل
      if (!fullName.trim()) {
        newErrors.fullName = 'الاسم الكامل مطلوب';
      } else if (fullName.trim().split(' ').length < 3) {
        newErrors.fullName = 'يجب إدخال الاسم الثلاثي على الأقل';
      }

      // التحقق من الرقم القومي
      if (!nationalId.trim()) {
        newErrors.nationalId = 'الرقم القومي مطلوب';
      } else if (!/^\d{14}$/.test(nationalId)) {
        newErrors.nationalId = 'الرقم القومي يجب أن يتكون من 14 رقم';
      }

      // التحقق من رقم الهاتف
      if (!phoneNumber.trim()) {
        newErrors.phoneNumber = 'رقم الهاتف مطلوب';
      } else if (!/^01[0125][0-9]{8}$/.test(phoneNumber)) {
        newErrors.phoneNumber = 'رقم الهاتف يجب أن يكون 11 رقم ويبدأ بـ 01';
      }

      // التحقق من العنوان
      if (!address.trim()) {
        newErrors.address = 'العنوان مطلوب';
      } else if (address.trim().length < 10) {
        newErrors.address = 'العنوان يجب أن يكون مفصلاً (10 أحرف على الأقل)';
      }

      // التحقق من المحافظة
      if (!governorate) {
        newErrors.governorate = 'اختيار المحافظة مطلوب';
      }

      // التحقق من البريد الإلكتروني
      if (!email.trim()) {
        newErrors.email = 'البريد الإلكتروني مطلوب';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = 'البريد الإلكتروني غير صالح';
      }

      // التحقق من كلمة المرور
      if (!password) {
        newErrors.password = 'كلمة المرور مطلوبة';
      } else if (password.length < 6) {
        newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleAuth = (e) => {
      e.preventDefault();

      if (isSignup) {
        // التحقق من صحة البيانات
        if (!validateSignup()) {
          alert('يرجى تصحيح الأخطاء في النموذج');
          return;
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');

        // التحقق من عدم تكرار البريد الإلكتروني
        if (users.some(u => u.email === email)) {
          setErrors({ ...errors, email: 'البريد الإلكتروني مسجل مسبقاً' });
          alert('البريد الإلكتروني مسجل مسبقاً');
          return;
        }

        // التحقق من عدم تكرار الرقم القومي
        if (users.some(u => u.nationalId === nationalId)) {
          setErrors({ ...errors, nationalId: 'الرقم القومي مسجل مسبقاً' });
          alert('الرقم القومي مسجل مسبقاً');
          return;
        }

        // التحقق من عدم تكرار رقم الهاتف
        if (users.some(u => u.phoneNumber === phoneNumber)) {
          setErrors({ ...errors, phoneNumber: 'رقم الهاتف مسجل مسبقاً' });
          alert('رقم الهاتف مسجل مسبقاً');
          return;
        }

        // إنشاء المستخدم الجديد
        const newUser = {
          id: Date.now(),
          email,
          password,
          type: userType,
          name: fullName,
          fullName: fullName,
          nationalId: nationalId,
          phoneNumber: phoneNumber,
          address: address,
          governorate: governorate,
          notifications: [],
          points: 0,
          balance: 1000 // رصيد ابتدائي 1000 ريال
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        setCurrentUser(newUser);

        // إضافة اشتراك افتراضي للمستخدم الجديد
        const subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
        const startDate = new Date();
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1);
        
        const newSubscription = {
          id: subscriptions.length + 1,
          userId: newUser.id,
          userName: fullName,
          userEmail: email,
          plan: 'basic',
          startDate: startDate.toISOString().split('T')[0],
          expiryDate: expiryDate.toISOString().split('T')[0]
        };
        
        subscriptions.push(newSubscription);
        localStorage.setItem('subscriptions', JSON.stringify(subscriptions));

        // إرسال event لتحديث Admin Dashboard
        window.dispatchEvent(new Event('usersUpdated'));
        window.dispatchEvent(new Event('subscriptionsUpdated'));

        // مسح المفضلة القديمة عند إنشاء حساب جديد
        setFavorites([]);

        // إذا كان المستخدم مالك مشروع، اعرض صفحة الاشتراك
        if (userType === 'owner') {
          setView('subscription-plan');
        } else {
          setView('home');
        }
        alert('تم إنشاء الحساب بنجاح! 🎉');
      } else {
        // تسجيل الدخول
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          setCurrentUser(user);

          // تحميل المفضلة الخاصة بهذا المستخدم
          const userFavorites = localStorage.getItem(`favorites_${user.id}`);
          if (userFavorites) {
            setFavorites(JSON.parse(userFavorites));
          } else {
            setFavorites([]);
          }

          setView('home');
        } else {
          alert('بيانات الدخول غير صحيحة');
        }
      }
    };

    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
        {/* زر الرجوع */}
        <div className="absolute top-6 right-6 z-10">
          <button
            onClick={() => setView('home')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg ${darkMode
              ? 'bg-gray-800 text-white hover:bg-gray-700'
              : 'bg-white text-gray-800 hover:bg-gray-50'
              }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            العودة للرئيسية
          </button>
        </div>

        <div className="flex items-center justify-center min-h-screen py-12 px-4">
          <div className={`max-w-2xl w-full p-8 md:p-10 rounded-3xl shadow-2xl backdrop-blur-sm ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'
            }`}>
            {/* الأيقونة والعنوان */}
            <div className="text-center mb-8">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode
                ? 'bg-gradient-to-br from-blue-600 to-indigo-600'
                : 'bg-gradient-to-br from-blue-500 to-indigo-500'
                } shadow-lg`}>
                {isSignup ? (
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                ) : (
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                )}
              </div>

              <h2 className={`text-4xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {isSignup ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
              </h2>
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {isSignup ? 'انضم إلى منصة دعم المشاريع' : 'مرحباً بعودتك 👋'}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-5">
              {isSignup ? (
                <div className="space-y-5">
                  {/* الاسم الكامل */}
                  <div className="relative">
                    <label className={`block mb-2 font-semibold text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      🧑‍💼 الاسم الكامل (ثلاثي) *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        setErrors({ ...errors, fullName: '' });
                      }}
                      placeholder="مثال: أحمد محمد علي"
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 placeholder-gray-500'
                        } ${errors.fullName ? 'border-red-500 shake' : ''}`}
                    />
                    {errors.fullName && (
                      <p className="mt-2 text-red-500 text-sm flex items-center gap-2 animate-fadeIn">
                        <span>⚠️</span> {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* الرقم القومي */}
                  <div className="relative">
                    <label className={`block mb-2 font-semibold text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      🆔 الرقم القومي (14 رقم) *
                    </label>
                    <input
                      type="text"
                      value={nationalId}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 14);
                        setNationalId(value);
                        setErrors({ ...errors, nationalId: '' });
                      }}
                      placeholder="12345678901234"
                      maxLength="14"
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 placeholder-gray-500'
                        } ${errors.nationalId ? 'border-red-500 shake' : ''}`}
                    />
                    <div className="flex justify-between items-center mt-2">
                      {errors.nationalId && (
                        <p className="text-red-500 text-sm flex items-center gap-2 animate-fadeIn">
                          <span>⚠️</span> {errors.nationalId}
                        </p>
                      )}
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-auto`}>
                        {nationalId.length} / 14
                      </p>
                    </div>
                  </div>

                  {/* رقم الهاتف */}
                  <div className="relative">
                    <label className={`block mb-2 font-semibold text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      📱 رقم الهاتف (11 رقم) *
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                        setPhoneNumber(value);
                        setErrors({ ...errors, phoneNumber: '' });
                      }}
                      placeholder="01012345678"
                      maxLength="11"
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 placeholder-gray-500'
                        } ${errors.phoneNumber ? 'border-red-500 shake' : ''}`}
                    />
                    <div className="flex justify-between items-center mt-2">
                      {errors.phoneNumber && (
                        <p className="text-red-500 text-sm flex items-center gap-2 animate-fadeIn">
                          <span>⚠️</span> {errors.phoneNumber}
                        </p>
                      )}
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-auto`}>
                        {phoneNumber.length} / 11
                      </p>
                    </div>
                  </div>

                  {/* المحافظة */}
                  <div className="relative">
                    <label className={`block mb-2 font-semibold text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      📍 المحافظة *
                    </label>
                    <select
                      value={governorate}
                      onChange={(e) => {
                        setGovernorate(e.target.value);
                        setErrors({ ...errors, governorate: '' });
                      }}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
                        } ${errors.governorate ? 'border-red-500 shake' : ''}`}
                    >
                      <option value="">اختر المحافظة</option>
                      {governorates.map(gov => (
                        <option key={gov} value={gov}>{gov}</option>
                      ))}
                    </select>
                    {errors.governorate && (
                      <p className="mt-2 text-red-500 text-sm flex items-center gap-2 animate-fadeIn">
                        <span>⚠️</span> {errors.governorate}
                      </p>
                    )}
                  </div>

                  {/* العنوان */}
                  <div className="relative">
                    <label className={`block mb-2 font-semibold text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      🏠 العنوان التفصيلي *
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        setErrors({ ...errors, address: '' });
                      }}
                      placeholder="مثال: شارع النيل، عمارة 15، الدور الثالث، شقة 8"
                      rows="3"
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-blue-500 resize-none transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 placeholder-gray-500'
                        } ${errors.address ? 'border-red-500 shake' : ''}`}
                    />
                    {errors.address && (
                      <p className="mt-2 text-red-500 text-sm flex items-center gap-2 animate-fadeIn">
                        <span>⚠️</span> {errors.address}
                      </p>
                    )}
                  </div>
                </div>
              ) : null}

              {/* البريد الإلكتروني */}
              <div className="relative">
                <label className={`block mb-2 font-semibold text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  📧 البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors, email: '' });
                  }}
                  placeholder="example@email.com"
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 placeholder-gray-500'
                    } ${errors.email ? 'border-red-500 shake' : ''}`}
                  required
                />
                {errors.email && (
                  <p className="mt-2 text-red-500 text-sm flex items-center gap-2 animate-fadeIn">
                    <span>⚠️</span> {errors.email}
                  </p>
                )}
              </div>

              {/* كلمة المرور */}
              <div className="relative">
                <label className={`block mb-2 font-semibold text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  🔒 كلمة المرور *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: '' });
                  }}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 placeholder-gray-500'
                    } ${errors.password ? 'border-red-500 shake' : ''}`}
                  required
                />
                {errors.password && (
                  <p className="mt-2 text-red-500 text-sm flex items-center gap-2 animate-fadeIn">
                    <span>⚠️</span> {errors.password}
                  </p>
                )}
              </div>

              {/* نوع الحساب */}
              {isSignup && (
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-blue-50'}`}>
                  <label className={`block mb-3 font-semibold text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    👤 نوع الحساب *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`relative flex items-center justify-center gap-2 cursor-pointer p-4 rounded-xl border-2 transition-all ${userType === 'user'
                      ? 'border-blue-500 bg-blue-500/10 scale-105'
                      : darkMode
                        ? 'border-gray-600 hover:border-gray-500'
                        : 'border-gray-300 hover:border-gray-400'
                      }`}>
                      <input
                        type="radio"
                        value="user"
                        checked={userType === 'user'}
                        onChange={(e) => setUserType(e.target.value)}
                        className="absolute opacity-0"
                      />
                      <span className="text-2xl">👤</span>
                      <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        مستخدم عادي
                      </span>
                    </label>

                    <label className={`relative flex items-center justify-center gap-2 cursor-pointer p-4 rounded-xl border-2 transition-all ${userType === 'owner'
                      ? 'border-blue-500 bg-blue-500/10 scale-105'
                      : darkMode
                        ? 'border-gray-600 hover:border-gray-500'
                        : 'border-gray-300 hover:border-gray-400'
                      }`}>
                      <input
                        type="radio"
                        value="owner"
                        checked={userType === 'owner'}
                        onChange={(e) => setUserType(e.target.value)}
                        className="absolute opacity-0"
                      />
                      <span className="text-2xl">👨‍💼</span>
                      <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        صاحب مشروع
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* زر الإرسال */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                {isSignup ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    إنشاء حساب
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    تسجيل الدخول
                  </>
                )}
              </button>
            </form>

            {/* التبديل بين التسجيل وتسجيل الدخول */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsSignup(!isSignup);
                  setErrors({});
                  setFullName('');
                  setNationalId('');
                  setPhoneNumber('');
                  setAddress('');
                  setGovernorate('');
                }}
                className={`font-semibold transition-colors ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                  }`}
              >
                {isSignup ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    لديك حساب؟ سجل الدخول
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    ليس لديك حساب؟ سجل الآن
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
      </div>
    );
  };

  // ------------- صفحة تسجيل دخول الأدمن فقط (Admin Login) -------------
  const AdminLoginPage = () => {
    const [adminEmail, setAdminEmail] = useState('ali@admin.com');
    const [adminPassword, setAdminPassword] = useState('admin');
    const [adminError, setAdminError] = useState('');
    const [adminLoading, setAdminLoading] = useState(false);

    const handleAdminLogin = (e) => {
      e.preventDefault();
      setAdminError('');
      setAdminLoading(true);

      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const admin = users.find(u => u.email === adminEmail && u.password === adminPassword && u.type === 'admin');

        if (admin) {
          localStorage.setItem('currentUser', JSON.stringify(admin));
          setCurrentUser(admin);
          setIsAdminLoginPage(false);
          setView('admin');
        } else {
          setAdminError('بيانات دخول غير صحيحة أو ليس حساب مسؤول');
        }
        setAdminLoading(false);
      }, 500);
    };

    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
        {/* زر الرجوع */}
        <div className="absolute top-6 right-6 z-10">
          <button
            onClick={() => setIsAdminLoginPage(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg ${darkMode
              ? 'bg-gray-800 text-white hover:bg-gray-700'
              : 'bg-white text-gray-800 hover:bg-gray-50'
              }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            العودة للرئيسية
          </button>
        </div>

        <div className="flex items-center justify-center min-h-screen py-12 px-4">
          <div className={`max-w-md w-full p-10 rounded-3xl shadow-2xl backdrop-blur-sm ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'}`}>
            {/* الأيقونة والعنوان */}
            <div className="text-center mb-10">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode
                ? 'bg-gradient-to-br from-red-600 to-orange-600'
                : 'bg-gradient-to-br from-red-500 to-orange-500'
                } shadow-lg`}>
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
              </div>

              <h2 className={`text-4xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                لوحة التحكم
              </h2>
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                دخول حصري للمسؤولين فقط 🔒
              </p>
            </div>

            {/* Error Message */}
            {adminError && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">!</span>
                </div>
                <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{adminError}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAdminLogin} className="space-y-5 mb-8">
              {/* Email */}
              <div>
                <label className={`block mb-2 font-semibold text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  📧 البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="ali@admin.com"
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-red-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 placeholder-gray-500'}`}
                />
              </div>

              {/* Password */}
              <div>
                <label className={`block mb-2 font-semibold text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  🔑 كلمة المرور
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-red-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 placeholder-gray-500'}`}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={adminLoading}
                className="w-full mt-8 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-xl transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {adminLoading ? '⏳ جاري التحقق...' : '🔓 دخول المسؤول'}
              </button>
            </form>

            {/* Info Box */}
            <div className={`p-4 rounded-lg ${
              darkMode
                ? 'bg-blue-500/10 border border-blue-500/20'
                : 'bg-blue-50 border border-blue-200'
            }`}>
              <p className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                <strong>ملاحظة:</strong> هذه الصفحة حصرية لمسؤولي النظام فقط. تأكد من سرية بيانات الدخول الخاصة بك.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ------------- مكون البطاقة (ProjectCard) -------------
  const ProjectCard = ({ project, showFavoriteButton = true }) => {
    const progress = (project.raised / project.goal) * 100;
    return (
      <div className={`rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} relative`}>
        {showFavoriteButton && (
          <button onClick={(e) => { e.stopPropagation(); toggleFavorite(project.id); }} className={`absolute top-4 left-4 z-10 p-2 rounded-full backdrop-blur-sm transition-all ${isFavorite(project.id) ? 'bg-red-500 text-white scale-110' : 'bg-white/80 text-gray-600 hover:bg-white'}`}>
            <Heart className={`w-5 h-5 ${isFavorite(project.id) ? 'fill-current' : ''}`} />
          </button>
        )}

        <div className="cursor-pointer" onClick={() => { setSelectedProject(project); setView('project-details'); }}>
          <div className="relative h-48 overflow-hidden">
            <img src={project.image} alt={project.title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
            <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">{project.category}</div>
          </div>

          <div className="p-6">
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{project.title}</h3>

            <div className="flex items-center gap-2 mb-3">
              <StarRating rating={project.averageRating || 0} readonly size="small" />
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{project.averageRating > 0 ? `${project.averageRating.toFixed(1)} (${project.ratings?.length || 0} تقييم)` : 'لا توجد تقييمات'}</span>
            </div>

            <p className={`mb-4 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{project.description}</p>

            <div className="mb-4">
              <div className="flex justify-between mb-2 text-sm">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>التقدم</span>
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{progress.toFixed(0)}%</span>
              </div>
              <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500" style={{ width: `${Math.min(progress, 100)}%` }} />
              </div>
            </div>

            <div className="flex justify-between items-center text-sm mb-4">
              <div>
                <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{project.raised.toLocaleString()} ر.س</span>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{' '}من {project.goal.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2"><Users className="w-4 h-4 text-blue-600" /><span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{project.backers} داعم</span></div>
              <div className="flex items-center gap-2"><Eye className="w-4 h-4 text-purple-600" /><span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{project.views || 0} مشاهدة</span></div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-600" /><span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{project.daysLeft} يوم متبقي</span></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ------------- صفحة تفاصيل المشروع (مع مشاركة اجتماعية + رسوم) -------------
  const ProjectDetails = () => {
    const [donationAmount, setDonationAmount] = useState('');
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [userRating, setUserRating] = useState(0);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [updateTitle, setUpdateTitle] = useState('');
    const [updateContent, setUpdateContent] = useState('');

    useEffect(() => {
      if (!selectedProject) return;

      // تحميل التعليقات من المشروع
      setComments(selectedProject.comments || []);

      if (currentUser && selectedProject.ratings) {
        const existingRating = selectedProject.ratings.find(r => r.userId === currentUser.id);
        if (existingRating) setUserRating(existingRating.rating);
      } else {
        setUserRating(0);
      }
    }, [selectedProject, currentUser]);

    if (!selectedProject) return <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}><div className="max-w-6xl mx-auto p-8">لم يتم اختيار مشروع.</div></div>;

    const progress = (selectedProject.raised / selectedProject.goal) * 100;

    const handleDonate = () => {
      if (!currentUser) { alert('يرجى تسجيل الدخول أولاً'); return; }
      const amount = parseInt(donationAmount);
      if (isNaN(amount) || amount <= 0) return alert('أدخل مبلغ صالح');

      // التحقق من الرصيد
      if (amount > (currentUser.balance || 0)) {
        alert('رصيدك غير كافٍ. يرجى شحن محفظتك أولاً.');
        setView('wallet');
        return;
      }

      // 🔥 الحصول على المستخدمين مرة واحدة فقط
      let allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const projectOwner = allUsers.find(u => u.name === selectedProject.owner);

      // 🔥 إضافة المبلغ لرصيد صاحب المشروع
      if (projectOwner) {
        allUsers = allUsers.map(u => {
          if (u.id === projectOwner.id) {
            return { ...u, balance: (u.balance || 0) + amount };
          }
          return u;
        });

        // 🔥 إضافة معاملة إيداع لمحفظة صاحب المشروع
        const ownerTransactionsKey = `transactions_${projectOwner.id}`;
        const ownerTransactions = JSON.parse(localStorage.getItem(ownerTransactionsKey) || '[]');
        const ownerDepositTransaction = {
          id: Date.now() + 1, // +1 لتجنب تكرار ID
          type: 'deposit',
          amount: amount,
          date: new Date().toISOString(),
          balance: (projectOwner.balance || 0) + amount,
          from: currentUser.name,
          projectTitle: selectedProject.title
        };
        localStorage.setItem(ownerTransactionsKey, JSON.stringify([ownerDepositTransaction, ...ownerTransactions]));

        // 🔥 إشعار لصاحب المشروع
        addNotificationToUser(projectOwner.id, {
          title: '💰 تبرع جديد لمشروعك!',
          message: `${currentUser.name} تبرع بمبلغ ${amount.toLocaleString()} ر.س لمشروع "${selectedProject.title}"`,
          icon: '💰',
          link: { view: 'project-details', projectId: selectedProject.id }
        });
      }

      const updatedProjects = projects.map(p => {
        if (p.id === selectedProject.id) {
          const backersSet = new Set(p.backersList || []);
          backersSet.add(currentUser.id);
          const newBackersList = Array.from(backersSet);
          const newRaised = p.raised + amount;
          const newHistory = [...(p.donationsHistory || []), { date: new Date().toISOString().slice(0, 10), amount, total: newRaised }];

          const updated = { ...p, raised: newRaised, backers: p.backers + 1, backersList: newBackersList, donationsHistory: newHistory };

          if (p.raised < p.goal && newRaised >= p.goal) {
            const ownerUser = findUserByName(p.owner);
            if (ownerUser) {
              addNotificationToUser(ownerUser.id, {
                title: '🏁 مشروعك وصل إلى الهدف!',
                message: `مشروع "${p.title}" تحقق هدفه (${p.goal.toLocaleString()} ر.س).`,
                icon: '🎉',
                link: { view: 'project-details', projectId: p.id }
              });
            }
            newBackersList.forEach(uid => {
              addNotificationToUser(uid, {
                title: '🎉 مشروع مدعوم وصل للهدف',
                message: `المشروع "${p.title}" الذي دعمتَه وصل للهدف!`,
                icon: '🎉',
                link: { view: 'project-details', projectId: p.id }
              });
            });
          }

          return updated;
        }
        return p;
      });

      setProjects(updatedProjects);

      // 🔥 خصم المبلغ من رصيد المستخدم الحالي
      allUsers = allUsers.map(u => {
        if (u.id === currentUser.id) {
          return { ...u, balance: (u.balance || 0) - amount };
        }
        return u;
      });

      // 🔥 حفظ جميع المستخدمين مرة واحدة
      localStorage.setItem('users', JSON.stringify(allUsers));

      const updatedCurrentUser = allUsers.find(u => u.id === currentUser.id);
      setCurrentUser(updatedCurrentUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));

      // إضافة المعاملة لسجل المحفظة
      const transactionsKey = `transactions_${currentUser.id}`;
      const savedTransactions = JSON.parse(localStorage.getItem(transactionsKey) || '[]');
      const donationTransaction = {
        id: Date.now() + 2, // +2 لتجنب تكرار ID
        type: 'donation',
        projectId: selectedProject.id,
        projectTitle: selectedProject.title,
        amount: amount,
        date: new Date().toISOString(),
        balance: updatedCurrentUser.balance
      };
      localStorage.setItem(transactionsKey, JSON.stringify([donationTransaction, ...savedTransactions]));

      const updatedProject = updatedProjects.find(p => p.id === selectedProject.id);
      setSelectedProject(updatedProject);

      // إضافة التبرع لسجل المستخدم
      const newDonation = {
        id: Date.now() + 3, // +3 لتجنب تكرار ID
        projectId: selectedProject.id,
        projectTitle: selectedProject.title,
        projectImage: selectedProject.image,
        projectCategory: selectedProject.category,
        amount: amount,
        date: new Date().toISOString(),
        userId: currentUser.id
      };

      setUserDonations(prev => [newDonation, ...prev]);

      // إرسال event لتحديث Admin Dashboard
      window.dispatchEvent(new Event('donationsUpdated'));

      alert(`شكراً لدعمك بمبلغ ${amount} ر.س!`);
      setDonationAmount('');
      if (userRating === 0) setTimeout(() => setShowRatingModal(true), 1000);
    };


    // تعليق -> إشعار للمالك
    const handleComment = () => {
      if (!currentUser) { alert('يرجى تسجيل الدخول أولاً'); return; }
      if (!comment.trim()) return;

      const newComment = {
        id: Date.now(),
        user: currentUser.name,
        text: comment,
        date: new Date().toLocaleDateString('ar-SA'),
        userId: currentUser.id
      };

      // حفظ التعليق في المشروع
      const updatedProjects = projects.map(p => {
        if (p.id === selectedProject.id) {
          const updatedComments = [newComment, ...(p.comments || [])];
          return { ...p, comments: updatedComments };
        }
        return p;
      });

      setProjects(updatedProjects);
      setComments(prev => [newComment, ...prev]);
      setComment('');

      // تحديث المشروع المحدد
      const updatedProject = updatedProjects.find(p => p.id === selectedProject.id);
      setSelectedProject(updatedProject);

      const ownerUser = findUserByName(selectedProject.owner);
      if (ownerUser) {
        addNotificationToUser(ownerUser.id, {
          title: '💬 تعليق جديد على مشروعك',
          message: `${currentUser.name} علّق على مشروع "${selectedProject.title}".`,
          icon: '💬',
          link: { view: 'project-details', projectId: selectedProject.id }
        });
      }
    };

    // تقييم -> إشعار للمالك
    const handleRating = (rating) => {
      if (!currentUser) { alert('يرجى تسجيل الدخول أولاً'); return; }
      const updatedProjects = projects.map(p => {
        if (p.id === selectedProject.id) {
          const filteredRatings = (p.ratings || []).filter(r => r.userId !== currentUser.id);
          const newRatings = [...filteredRatings, { userId: currentUser.id, rating, userName: currentUser.name }];
          const average = newRatings.reduce((sum, r) => sum + r.rating, 0) / newRatings.length;
          return { ...p, ratings: newRatings, averageRating: average };
        }
        return p;
      });
      setProjects(updatedProjects);
      const updatedProject = updatedProjects.find(p => p.id === selectedProject.id);
      setSelectedProject(updatedProject);
      setUserRating(rating);
      setShowRatingModal(false);

      const ownerUser = findUserByName(selectedProject.owner);
      if (ownerUser) {
        addNotificationToUser(ownerUser.id, {
          title: '⭐ تقييم جديد',
          message: `${currentUser.name} قيّم مشروع "${selectedProject.title}" بـ ${rating} نجوم.`,
          icon: '⭐',
          link: { view: 'project-details', projectId: selectedProject.id }
        });
      }
      alert('شكراً لتقييمك!');
    };

    // نشر تحديث من صاحب المشروع -> إشعارات للداعمين
    const postUpdate = () => {
      if (!currentUser || currentUser.name !== selectedProject.owner) {
        alert('فقط صاحب المشروع يمكنه نشر تحديثات');
        return;
      }
      if (!updateTitle.trim() || !updateContent.trim()) return alert('أدخل عنوان ومحتوى للتحديث');

      const updatedProjects = projects.map(p => {
        if (p.id === selectedProject.id) {
          const newUpdate = { id: Date.now(), title: updateTitle, content: updateContent, date: new Date().toLocaleDateString('ar-SA') };
          const updates = [newUpdate, ...(p.updates || [])];

          // إشعار الداعمين
          (p.backersList || []).forEach(uid => {
            addNotificationToUser(uid, {
              title: `📝 تحديث جديد على ${p.title}`,
              message: `${p.owner} نشر تحديث: ${updateTitle}`,
              icon: '📝',
              link: { view: 'project-details', projectId: p.id }
            });
          });

          return { ...p, updates };
        }
        return p;
      });

      setProjects(updatedProjects);
      setSelectedProject(updatedProjects.find(p => p.id === selectedProject.id));
      setUpdateTitle('');
      setUpdateContent('');
      alert('تم نشر التحديث');
    };

    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <button onClick={() => setView('home')} className={`mb-6 px-6 py-2 rounded-lg font-semibold ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white hover:bg-gray-100'}`}>← العودة للرئيسية</button>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-96 object-cover rounded-2xl mb-6" />
              <div className={`p-6 rounded-2xl mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{selectedProject.ownerAvatar}</span>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>صاحب المشروع</p>
                    <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedProject.owner}</p>
                  </div>
                </div>

                <h1 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedProject.title}</h1>

                <div className="flex gap-4 mb-6">
                  <span className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">{selectedProject.category}</span>
                </div>

                <p className={`text-lg leading-relaxed mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{selectedProject.description}</p>

                {/* Charts area (تمّت الإضافة هنا) */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>تطور التبرعات (خطّي)</h3>
                    <DonationsLineChart data={selectedProject.donationsHistory || []} />
                  </div>

                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>نسبة التقدم</h3>
                    <ProgressPie raised={selectedProject.raised} goal={selectedProject.goal} />
                    <div className="mt-2 text-center">
                      <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedProject.raised.toLocaleString()} ر.س</div>
                      <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>من {selectedProject.goal.toLocaleString()} — {progress.toFixed(0)}%</div>
                    </div>
                  </div>
                </div>

                {/* --- قسم المشاركة الاجتماعية --- */}
                <div className="mt-6 p-4 rounded-lg border flex flex-col gap-3">
                  <h4 className={`${darkMode ? 'text-white' : 'text-gray-800'} font-bold`}>مشاركة المشروع</h4>

                  <div className="flex flex-wrap gap-3">
                    {/* واتساب */}
                    <button
                      onClick={() => {
                        const text = encodeURIComponent(`${selectedProject.title} - ${selectedProject.description}\n${getProjectUrl(selectedProject.id)}`);
                        openShareWindow(`https://api.whatsapp.com/send?text=${text}`);
                        registerShare(selectedProject.id, 'whatsapp');
                      }}
                      className="px-4 py-2 rounded-lg bg-green-500 text-white font-semibold flex items-center gap-2"
                      title="مشاركة على واتساب"
                    >
                      📱 واتساب
                      <span className="text-sm opacity-90">({selectedProject.shareCounts?.whatsapp || 0})</span>
                    </button>

                    {/* تويتر */}
                    <button
                      onClick={() => {
                        const url = encodeURIComponent(getProjectUrl(selectedProject.id));
                        const text = encodeURIComponent(`${selectedProject.title} — دعم مشاريع صغيرة`);
                        openShareWindow(`https://twitter.com/intent/tweet?text=${text}&url=${url}`);
                        registerShare(selectedProject.id, 'twitter');
                      }}
                      className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold flex items-center gap-2"
                      title="مشاركة على تويتر"
                    >
                      🐦 تويتر
                      <span className="text-sm opacity-90">({selectedProject.shareCounts?.twitter || 0})</span>
                    </button>

                    {/* فيسبوك */}
                    <button
                      onClick={() => {
                        const url = encodeURIComponent(getProjectUrl(selectedProject.id));
                        openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
                        registerShare(selectedProject.id, 'facebook');
                      }}
                      className="px-4 py-2 rounded-lg bg-blue-800 text-white font-semibold flex items-center gap-2"
                      title="مشاركة على فيسبوك"
                    >
                      📘 فيسبوك
                      <span className="text-sm opacity-90">({selectedProject.shareCounts?.facebook || 0})</span>
                    </button>

                    {/* نسخ رابط */}
                    <button
                      onClick={() => {
                        const url = getProjectUrl(selectedProject.id);
                        navigator.clipboard.writeText(url).then(() => {
                          registerShare(selectedProject.id, 'copy');
                          alert('تم نسخ رابط المشروع إلى الحافظة');
                        }).catch(() => alert('فشل نسخ الرابط'));
                      }}
                      className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold flex items-center gap-2"
                      title="نسخ الرابط"
                    >
                      🔗 نسخ الرابط
                      <span className="text-sm opacity-90">({selectedProject.shareCounts?.copy || 0})</span>
                    </button>
                  </div>

                  {/* إحصائيات المشاركة الإجمالية للمشروع */}
                  <div className="mt-3 text-sm text-gray-600">
                    إجمالي المشاركات: {(Object.values(selectedProject.shareCounts || {}).reduce((s, v) => s + v, 0))}
                  </div>
                </div>

                {/* التحديثات */}
                <div className="mb-6 mt-6">
                  <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>تحديثات المشروع</h3>
                  {selectedProject.updates && selectedProject.updates.length === 0 && <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>لا توجد تحديثات بعد</p>}
                  {selectedProject.updates && selectedProject.updates.map(u => (
                    <div key={u.id} className={`p-3 rounded-lg mb-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{u.title}</div>
                          <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{u.content}</div>
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{u.date}</div>
                      </div>
                    </div>
                  ))}

                  {/* نموذج نشر التحديث لصاحب المشروع */}
                  {currentUser && currentUser.name === selectedProject.owner && (
                    <div className="mt-4 p-4 rounded-lg border">
                      <input value={updateTitle} onChange={(e) => setUpdateTitle(e.target.value)} placeholder="عنوان التحديث" className="w-full mb-2 px-3 py-2 rounded-lg border" />
                      <textarea value={updateContent} onChange={(e) => setUpdateContent(e.target.value)} placeholder="محتوى التحديث" className="w-full mb-2 px-3 py-2 rounded-lg border" rows={3} />
                      <button onClick={postUpdate} className="px-4 py-2 bg-blue-600 text-white rounded-lg">نشر تحديث</button>
                    </div>
                  )}
                </div>

                {/* التقييمات */}
                <div className={`p-4 rounded-lg border-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <h3 className={`text-lg font-bold mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}><Star className="w-5 h-5 text-yellow-400" /> التقييمات</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedProject.averageRating > 0 ? selectedProject.averageRating.toFixed(1) : '0.0'}</div>
                      <StarRating rating={selectedProject.averageRating || 0} readonly size="small" />
                      <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedProject.ratings?.length || 0} تقييم</div>
                    </div>

                    <div className="flex-1">
                      {currentUser ? (
                        <div>
                          <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{userRating > 0 ? 'تقييمك:' : 'قيّم هذا المشروع:'}</p>
                          <StarRating rating={userRating} onRate={handleRating} size="large" />
                          {userRating > 0 && <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>يمكنك تغيير تقييمك في أي وقت</p>}
                        </div>
                      ) : (
                        <button onClick={() => setView('login')} className="text-blue-600 hover:text-blue-700 font-semibold text-sm">سجل الدخول لتقييم المشروع</button>
                      )}
                    </div>
                  </div>

                  {selectedProject.ratings && selectedProject.ratings.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>آراء المستخدمين:</p>
                      {selectedProject.ratings.slice(-5).reverse().map((r, index) => (
                        <div key={index} className={`flex items-center gap-3 p-2 rounded ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                          <span className={`font-semibold text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{r.userName}</span>
                          <StarRating rating={r.rating} readonly size="small" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* التعليقات */}
              <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}><MessageCircle className="w-5 h-5" /> التعليقات</h3>
                {currentUser && (
                  <div className="mb-6">
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="اكتب تعليقك..." className={`w-full p-4 rounded-lg border-2 focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} rows="3" />
                    <button onClick={handleComment} className="mt-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">إضافة تعليق</button>
                  </div>
                )}

                <div className="space-y-4">
                  {comments.map(c => (
                    <div key={c.id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{c.user}</span>
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{c.date}</span>
                      </div>
                      <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* الشريط الجانبي للتمويل والإحصاءات */}
            <div>
              <div className={`p-6 rounded-2xl sticky top-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="mb-6">
                  <div className="flex justify-between mb-2"><span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>تم جمع</span><span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{progress.toFixed(0)}%</span></div>
                  <div className={`w-full h-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}><div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }} /></div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <span className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedProject.raised.toLocaleString()} ر.س</span>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>من {selectedProject.goal.toLocaleString()} ر.س</p>
                  </div>

                  <div className="flex items-center gap-2"><Users className="w-5 h-5 text-blue-600" /><span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{selectedProject.backers} داعم</span></div>
                  <div className="flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-600" /><span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{selectedProject.daysLeft} يوم متبقي</span></div>
                </div>

                {currentUser ? (
                  <div className="space-y-4">
                    <input type="number" value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} placeholder="أدخل المبلغ بالريال" className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                    <button onClick={handleDonate} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors"><Heart className="w-5 h-5" /> ادعم المشروع</button>

                    {/* زر التواصل مع صاحب المشروع */}
                    <button
                      onClick={() => {
                        const users = JSON.parse(localStorage.getItem('users') || '[]');
                        const owner = users.find(u => u.name === selectedProject.owner);
                        if (owner) {
                          setView('chat');
                          // سيتم فتح الشات مع صاحب المشروع تلقائياً
                          setTimeout(() => {
                            const ownerUser = onlineUsers.find(u => u.id === owner.id);
                            if (ownerUser) {
                              // هذا سيعمل في المرة القادمة التي تدخل فيها للشات
                              localStorage.setItem('lastChatUser', JSON.stringify(ownerUser));
                            }
                          }, 100);
                        } else {
                          alert('لم يتم العثور على صاحب المشروع');
                        }
                      }}
                      className={`w-full font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors border-2 ${darkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600'
                        : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-300'
                        }`}
                    >
                      <MessageCircle className="w-5 h-5" />
                      تواصل مع صاحب المشروع
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setView('login')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg">سجل الدخول للدعم</button>
                )}
              </div>
            </div>
          </div>
        </div>

        {showRatingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`max-w-md w-full p-8 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-2xl font-bold mb-4 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>شكراً لدعمك! 🎉</h3>
              <p className={`text-center mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>هل يمكنك تقييم هذا المشروع؟</p>
              <div className="flex justify-center mb-6"><StarRating rating={0} onRate={handleRating} size="large" /></div>
              <button onClick={() => setShowRatingModal(false)} className={`w-full py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}>لاحقاً</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ------------- صفحة المفضلة -------------
  const FavoritesPage = () => {
    const favoriteProjects = projects.filter(p => favorites.includes(p.id));
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-8">
            <Heart className="w-8 h-8 text-red-500" />
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>مشاريعي المفضلة</h1>
            <span className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>({favoriteProjects.length})</span>
          </div>

          {favoriteProjects.length === 0 ? (
            <div className="text-center py-20">
              <Heart className={`w-24 h-24 mx-auto mb-4 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`} />
              <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>لا توجد مشاريع مفضلة بعد</h3>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>ابدأ بإضافة المشاريع التي تهمك إلى المفضلة</p>
              <button onClick={() => setView('home')} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">تصفح المشاريع</button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProjects.map(project => <ProjectCard key={project.id} project={project} />)}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ------------- لوحة تحكم أصحاب المشاريع -------------
  // ------------- لوحة تحكم أصحاب المشاريع -------------
  const DashboardPage = () => {
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const userProjects = projects.filter(p => p.owner === currentUser?.name);
    const totalRaised = userProjects.reduce((sum, p) => sum + p.raised, 0);
    const totalBackers = userProjects.reduce((sum, p) => sum + p.backers, 0);
    const averageProgress = userProjects.length > 0 ? userProjects.reduce((sum, p) => sum + (p.raised / p.goal * 100), 0) / userProjects.length : 0;
    const totalViews = userProjects.reduce((sum, p) => sum + (p.views || 0), 0);

    // دالة حذف المشروع
    const handleDeleteProject = () => {
      if (!projectToDelete) return;

      // حذف المشروع من القائمة
      const updatedProjects = projects.filter(p => p.id !== projectToDelete.id);
      setProjects(updatedProjects);

      // تحديث localStorage
      const localProjects = updatedProjects.filter(p => !initialProjects.find(ip => ip.id === p.id));
      localStorage.setItem('localProjects', JSON.stringify(localProjects));

      // حذف المشروع من المفضلة
      const updatedFavorites = favorites.filter(fid => fid !== projectToDelete.id);
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

      // إشعار للداعمين
      (projectToDelete.backersList || []).forEach(uid => {
        addNotificationToUser(uid, {
          title: '❌ تم حذف مشروع',
          message: `تم حذف مشروع "${projectToDelete.title}" الذي دعمتَه`,
          icon: '❌'
        });
      });

      // إشعار للمستخدم الحالي
      addNotificationToUser(currentUser.id, {
        title: '🗑️ تم حذف المشروع',
        message: `تم حذف مشروع "${projectToDelete.title}" بنجاح`,
        icon: '🗑️'
      });

      setShowDeleteModal(false);
      setProjectToDelete(null);
      alert('تم حذف المشروع بنجاح');
    };

    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-800'}`}>لوحة التحكم</h1>

          {/* الإحصائيات */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>المشاريع النشطة</span>
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{userProjects.length}</div>
            </div>

            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>إجمالي التمويل</span>
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{totalRaised.toLocaleString()}</div>
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>ر.س</span>
            </div>

            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>إجمالي الداعمين</span>
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{totalBackers}</div>
            </div>

            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>إجمالي المشاهدات</span>
                <Eye className="w-5 h-5 text-orange-600" />
              </div>
              <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{totalViews.toLocaleString()}</div>
            </div>
          </div>

          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>مشاريعي</h2>
              <button onClick={() => setView('add-project')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">
                <Plus className="w-5 h-5" /> مشروع جديد
              </button>
            </div>

            {userProjects.length === 0 ? (
              <div className="text-center py-12">
                <Target className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`} />
                <p className={`text-lg mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>لم تقم بإنشاء أي مشروع بعد</p>
                <button onClick={() => setView('add-project')} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">إنشاء مشروعك الأول</button>
              </div>
            ) : (
              <div className="space-y-4">
                {userProjects.map(project => {
                  const prog = (project.raised / project.goal) * 100;
                  return (
                    <div key={project.id} className={`p-6 rounded-lg border-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} hover:border-blue-500 transition-all`}>
                      <div className="flex items-start gap-4">
                        <img src={project.image} alt={project.title} className="w-24 h-24 rounded-lg object-cover cursor-pointer hover:scale-105 transition-transform" onClick={() => { setSelectedProject(project); setView('project-details'); }} />

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className={`text-xl font-bold mb-1 cursor-pointer hover:text-blue-600 transition-colors ${darkMode ? 'text-white' : 'text-gray-800'}`} onClick={() => { setSelectedProject(project); setView('project-details'); }}>
                                {project.title}
                              </h3>
                              <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">{project.category}</span>
                                <div className="flex items-center gap-1">
                                  <StarRating rating={project.averageRating || 0} readonly size="small" />
                                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>({project.ratings?.length || 0})</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="text-left">
                                <div className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{prog.toFixed(0)}%</div>
                                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{project.daysLeft} يوم متبقي</div>
                              </div>

                              {/* زر الحذف */}
                              <button
                                onClick={() => {
                                  setProjectToDelete(project);
                                  setShowDeleteModal(true);
                                }}
                                className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                                title="حذف المشروع"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}>
                              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: `${Math.min(prog, 100)}%` }} />
                            </div>
                          </div>

                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{project.raised.toLocaleString()} / {project.goal.toLocaleString()} ر.س</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-blue-600" />
                              <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{project.backers} داعم</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Eye className="w-4 h-4 text-purple-600" />
                              <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{project.views || 0} مشاهدة</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* مودال تأكيد الحذف */}
        {showDeleteModal && projectToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`max-w-md w-full p-8 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  تأكيد حذف المشروع
                </h3>
                <p className={`text-lg mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  هل أنت متأكد من حذف مشروع:
                </p>
                <p className={`font-bold text-xl mb-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                  "{projectToDelete.title}"
                </p>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-red-900/20 border border-red-700' : 'bg-red-50 border border-red-200'} text-right mb-6`}>
                  <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-700'} mb-2`}>
                    ⚠️ تحذير: هذا الإجراء لا يمكن التراجع عنه
                  </p>
                  <ul className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'} space-y-1`}>
                    <li>• سيتم حذف جميع بيانات المشروع</li>
                    <li>• سيتم إشعار جميع الداعمين ({projectToDelete.backers})</li>
                    <li>• سيتم حذف جميع التعليقات والتقييمات</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDeleteProject}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
                >
                  نعم، احذف المشروع
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setProjectToDelete(null);
                  }}
                  className={`flex-1 py-3 rounded-lg font-bold transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ------------- صفحة إضافة مشروع -------------
  // ------------- صفحة إضافة مشروع (محسّنة) -------------
  const AddProjectPage = () => {
    const [newProject, setNewProject] = useState({
      title: '',
      description: '',
      category: 'تقنية',
      goal: '',
      daysLeft: '',
      image: ''
    });
    const [imagePreview, setImagePreview] = useState('');
    const [imageSource, setImageSource] = useState('url'); // 'url' أو 'upload'
    const [errors, setErrors] = useState({});

    // التحقق من صحة البيانات
    const validateForm = () => {
      const newErrors = {};

      if (!newProject.title.trim()) {
        newErrors.title = 'عنوان المشروع مطلوب';
      } else if (newProject.title.length < 10) {
        newErrors.title = 'العنوان يجب أن يكون 10 أحرف على الأقل';
      }

      if (!newProject.description.trim()) {
        newErrors.description = 'وصف المشروع مطلوب';
      } else if (newProject.description.length < 50) {
        newErrors.description = 'الوصف يجب أن يكون 50 حرف على الأقل';
      }

      if (!newProject.goal || parseInt(newProject.goal) <= 0) {
        newErrors.goal = 'المبلغ المستهدف يجب أن يكون أكبر من صفر';
      }

      if (!newProject.daysLeft || parseInt(newProject.daysLeft) <= 0) {
        newErrors.daysLeft = 'عدد الأيام يجب أن يكون أكبر من صفر';
      }

      if (!imagePreview && !newProject.image) {
        newErrors.image = 'صورة المشروع مطلوبة';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    // معالجة رفع الصورة
    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          setErrors({ ...errors, image: 'حجم الصورة يجب أن يكون أقل من 5 ميجابايت' });
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
          setNewProject({ ...newProject, image: reader.result });
          setErrors({ ...errors, image: '' });
        };
        reader.readAsDataURL(file);
      }
    };

    // معالجة رابط الصورة
    const handleImageUrl = (url) => {
      setNewProject({ ...newProject, image: url });
      setImagePreview(url);
      setErrors({ ...errors, image: '' });
    };

    // إرسال النموذج
    const handleSubmit = (e) => {
      e.preventDefault();

      if (!validateForm()) {
        alert('يرجى تصحيح الأخطاء في النموذج');
        return;
      }

      if (!currentUser) {
        alert('يرجى تسجيل الدخول');
        setView('login');
        return;
      }

      const project = {
        id: Date.now(),
        ...newProject,
        goal: parseInt(newProject.goal),
        daysLeft: parseInt(newProject.daysLeft),
        raised: 0,
        backers: 0,
        owner: currentUser.name,
        ownerAvatar: '👤',
        ratings: [],
        averageRating: 0,
        backersList: [],
        comments: [],
        updates: [],
        deadlineNotifiedFor: [],
        shareCounts: { whatsapp: 0, twitter: 0, facebook: 0, copy: 0 },
        views: 0,
        donationsHistory: [],
        status: 'Active'
      };

      // حفظ في 'projects' لـ Admin Dashboard
      const allProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      allProjects.push(project);
      localStorage.setItem('projects', JSON.stringify(allProjects));
      setProjects([...projects, project]);

      // إرسال event لتحديث Admin Dashboard
      window.dispatchEvent(new Event('projectsUpdated'));

      // إشعار للمستخدم
      addNotificationToUser(currentUser.id, {
        title: '✅ تم إضافة المشروع بنجاح',
        message: `مشروعك "${project.title}" أصبح الآن متاح للدعم`,
        icon: '🎉',
        link: { view: 'project-details', projectId: project.id }
      });

      alert('تم إضافة المشروع بنجاح! 🎉');
      setView('dashboard');
    };

    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* زر الرجوع والعنوان */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setView(currentUser?.type === 'owner' ? 'dashboard' : 'home')}
              className={`p-3 rounded-xl transition-all hover:scale-105 ${darkMode
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-white hover:bg-gray-100 shadow-md'
                }`}
              title="رجوع"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div>
              <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                إضافة مشروع جديد
              </h1>
              <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                املأ البيانات التالية لنشر مشروعك
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* قسم الصورة */}
            <div className={`p-8 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <span className="text-3xl">📸</span>
                صورة المشروع
              </h2>

              {/* خيارات الصورة */}
              <div className="flex gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setImageSource('url')}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-all ${imageSource === 'url'
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  رابط صورة
                </button>
                <button
                  type="button"
                  onClick={() => setImageSource('upload')}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-all ${imageSource === 'upload'
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  رفع صورة
                </button>
              </div>

              {/* معاينة الصورة */}
              {imagePreview && (
                <div className="mb-6 relative group">
                  <img
                    src={imagePreview}
                    alt="معاينة"
                    className="w-full h-64 object-cover rounded-xl shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setNewProject({ ...newProject, image: '' });
                    }}
                    className="absolute top-4 left-4 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              {/* حقل الرابط */}
              {imageSource === 'url' && (
                <div>
                  <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    رابط الصورة
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={newProject.image}
                    onChange={(e) => handleImageUrl(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-blue-500 transition-all ${darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                      } ${errors.image ? 'border-red-500' : ''}`}
                  />
                  <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    يمكنك استخدام روابط من Unsplash أو Pexels
                  </p>
                </div>
              )}

              {/* حقل الرفع */}
              {imageSource === 'upload' && (
                <div>
                  <label
                    className={`block w-full border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-50/5 ${darkMode ? 'border-gray-600' : 'border-gray-300'
                      } ${errors.image ? 'border-red-500' : ''}`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="text-6xl mb-3">📤</div>
                    <div className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      اضغط لرفع صورة
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      PNG, JPG, GIF (أقصى حجم: 5MB)
                    </div>
                  </label>
                </div>
              )}

              {errors.image && (
                <p className="mt-2 text-red-500 text-sm flex items-center gap-2">
                  <span>⚠️</span> {errors.image}
                </p>
              )}
            </div>

            {/* قسم المعلومات الأساسية */}
            <div className={`p-8 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <span className="text-3xl">📝</span>
                المعلومات الأساسية
              </h2>

              <div className="space-y-6">
                {/* العنوان */}
                <div>
                  <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    عنوان المشروع *
                  </label>
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) => {
                      setNewProject({ ...newProject, title: e.target.value });
                      setErrors({ ...errors, title: '' });
                    }}
                    placeholder="مثال: تطبيق توصيل الطعام المحلي"
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-blue-500 transition-all ${darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                      } ${errors.title ? 'border-red-500' : ''}`}
                  />
                  <div className="flex justify-between items-center mt-2">
                    {errors.title && (
                      <p className="text-red-500 text-sm flex items-center gap-2">
                        <span>⚠️</span> {errors.title}
                      </p>
                    )}
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-auto`}>
                      {newProject.title.length} / 10 أحرف كحد أدنى
                    </p>
                  </div>
                </div>

                {/* الوصف */}
                <div>
                  <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    وصف المشروع *
                  </label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => {
                      setNewProject({ ...newProject, description: e.target.value });
                      setErrors({ ...errors, description: '' });
                    }}
                    placeholder="اشرح فكرة مشروعك بالتفصيل... ما الذي يميزه؟ ما الفائدة منه؟"
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-blue-500 transition-all resize-none ${darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                      } ${errors.description ? 'border-red-500' : ''}`}
                    rows="6"
                  />
                  <div className="flex justify-between items-center mt-2">
                    {errors.description && (
                      <p className="text-red-500 text-sm flex items-center gap-2">
                        <span>⚠️</span> {errors.description}
                      </p>
                    )}
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-auto`}>
                      {newProject.description.length} / 50 حرف كحد أدنى
                    </p>
                  </div>
                </div>

                {/* التصنيف */}
                <div>
                  <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    التصنيف *
                  </label>
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-blue-500 transition-all ${darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                      }`}
                  >
                    {categories.filter(cat => cat !== 'الكل').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* قسم التمويل والمدة */}
            <div className={`p-8 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <span className="text-3xl">💰</span>
                التمويل والمدة
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* المبلغ المستهدف */}
                <div>
                  <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    المبلغ المستهدف (ر.س) *
                  </label>
                  <input
                    type="number"
                    value={newProject.goal}
                    onChange={(e) => {
                      setNewProject({ ...newProject, goal: e.target.value });
                      setErrors({ ...errors, goal: '' });
                    }}
                    placeholder="50000"
                    min="1"
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-blue-500 transition-all ${darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                      } ${errors.goal ? 'border-red-500' : ''}`}
                  />
                  {errors.goal && (
                    <p className="mt-2 text-red-500 text-sm flex items-center gap-2">
                      <span>⚠️</span> {errors.goal}
                    </p>
                  )}
                  {newProject.goal && !errors.goal && (
                    <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      ≈ {(parseInt(newProject.goal) / 3.75).toFixed(0)} دولار
                    </p>
                  )}
                </div>

                {/* عدد الأيام */}
                <div>
                  <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    مدة الحملة (يوم) *
                  </label>
                  <input
                    type="number"
                    value={newProject.daysLeft}
                    onChange={(e) => {
                      setNewProject({ ...newProject, daysLeft: e.target.value });
                      setErrors({ ...errors, daysLeft: '' });
                    }}
                    placeholder="30"
                    min="1"
                    max="90"
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-blue-500 transition-all ${darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                      } ${errors.daysLeft ? 'border-red-500' : ''}`}
                  />
                  {errors.daysLeft && (
                    <p className="mt-2 text-red-500 text-sm flex items-center gap-2">
                      <span>⚠️</span> {errors.daysLeft}
                    </p>
                  )}
                  <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    يُنصح بمدة بين 30-60 يوماً
                  </p>
                </div>
              </div>
            </div>

            {/* أزرار الإرسال */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                نشر المشروع
              </button>

              <button
                type="button"
                onClick={() => setView(currentUser?.type === 'owner' ? 'dashboard' : 'home')}
                className={`px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 ${darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
              >
                إلغاء
              </button>
            </div>

            {/* ملاحظة */}
            <div className={`p-6 rounded-xl border-2 ${darkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex gap-3">
                <div className="text-2xl">💡</div>
                <div>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    نصائح لمشروع ناجح:
                  </h3>
                  <ul className={`space-y-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <li>• اختر عنواناً جذاباً وواضحاً</li>
                    <li>• اكتب وصفاً تفصيلياً يشرح القيمة المضافة لمشروعك</li>
                    <li>• استخدم صورة عالية الجودة تعبّر عن مشروعك</li>
                    <li>• حدد هدفاً مالياً واقعياً قابل للتحقيق</li>
                    <li>• تواصل مع الداعمين باستمرار عبر التحديثات</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // ------------- صفحة إعدادات المستخدم -------------
  // ------------- صفحة إعدادات المستخدم -------------
  const UserSettingsPage = () => {
    const [fullName, setFullName] = useState(currentUser?.fullName || currentUser?.name || "");
    const [email, setEmail] = useState(currentUser?.email || "");
    const [password, setPassword] = useState(currentUser?.password || "");
    const [nationalId, setNationalId] = useState(currentUser?.nationalId || "");
    const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber || "");
    const [address, setAddress] = useState(currentUser?.address || "");
    const [governorate, setGovernorate] = useState(currentUser?.governorate || "");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [profileImage, setProfileImage] = useState(currentUser?.profileImage || "");
    const [imagePreview, setImagePreview] = useState(currentUser?.profileImage || "");
    // قائمة المحافظات
    const governorates = [
      'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'البحيرة', 'الفيوم',
      'الغربية', 'الإسماعيلية', 'المنوفية', 'المنيا', 'القليوبية', 'الوادي الجديد',
      'الشرقية', 'أسيوط', 'سوهاج', 'قنا', 'أسوان', 'الأقصر', 'البحر الأحمر',
      'مطروح', 'شمال سيناء', 'جنوب سيناء', 'بورسعيد', 'دمياط', 'السويس',
      'كفر الشيخ', 'بني سويف'
    ];

    useEffect(() => {
      if (currentUser) {
        setFullName(currentUser.fullName || currentUser.name || "");
        setEmail(currentUser.email || "");
        setPassword(currentUser.password || "");
        setNationalId(currentUser.nationalId || "");
        setPhoneNumber(currentUser.phoneNumber || "");
        setAddress(currentUser.address || "");
        setGovernorate(currentUser.governorate || "");
        setProfileImage(currentUser.profileImage || "");
        setImagePreview(currentUser.profileImage || "");
        setMessage("");
        setErrors({});
      }
    }, [currentUser]);


    // معالجة رفع الصورة الشخصية
    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          setErrors({ ...errors, image: 'حجم الصورة يجب أن يكون أقل من 2 ميجابايت' });
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
          setProfileImage(reader.result);
          setErrors({ ...errors, image: '' });
        };
        reader.readAsDataURL(file);
      }
    };

    // حذف الصورة الشخصية
    const handleRemoveImage = () => {
      setImagePreview("");
      setProfileImage("");
    };





    // التحقق من صحة البيانات
    const validateForm = () => {
      const newErrors = {};

      // التحقق من الاسم الكامل
      if (!fullName.trim()) {
        newErrors.fullName = 'الاسم الكامل مطلوب';
      } else if (fullName.trim().split(' ').length < 3) {
        newErrors.fullName = 'يجب إدخال الاسم الثلاثي على الأقل';
      }

      // التحقق من البريد الإلكتروني
      if (!email.trim()) {
        newErrors.email = 'البريد الإلكتروني مطلوب';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = 'البريد الإلكتروني غير صالح';
      }

      // التحقق من كلمة المرور
      if (!password) {
        newErrors.password = 'كلمة المرور مطلوبة';
      } else if (password.length < 6) {
        newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
      }

      // التحقق من الرقم القومي (إذا كان موجوداً)
      if (nationalId && !/^\d{14}$/.test(nationalId)) {
        newErrors.nationalId = 'الرقم القومي يجب أن يتكون من 14 رقم';
      }

      // التحقق من رقم الهاتف (إذا كان موجوداً)
      if (phoneNumber && !/^01[0125][0-9]{8}$/.test(phoneNumber)) {
        newErrors.phoneNumber = 'رقم الهاتف يجب أن يكون 11 رقم ويبدأ بـ 01';
      }

      // التحقق من العنوان (إذا كان موجوداً)
      if (address && address.trim().length < 10) {
        newErrors.address = 'العنوان يجب أن يكون مفصلاً (10 أحرف على الأقل)';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
      if (!validateForm()) {
        setMessage("⚠️ يرجى تصحيح الأخطاء في النموذج");
        return;
      }

      const users = JSON.parse(localStorage.getItem('users') || '[]');

      // التحقق من عدم تكرار البريد الإلكتروني
      if (users.some(u => u.email === email && u.id !== currentUser.id)) {
        setErrors({ ...errors, email: 'البريد الإلكتروني مسجل مسبقاً' });
        setMessage("⚠️ البريد الإلكتروني مسجل مسبقاً");
        return;
      }

      // التحقق من عدم تكرار الرقم القومي
      if (nationalId && users.some(u => u.nationalId === nationalId && u.id !== currentUser.id)) {
        setErrors({ ...errors, nationalId: 'الرقم القومي مسجل مسبقاً' });
        setMessage("⚠️ الرقم القومي مسجل مسبقاً");
        return;
      }

      // التحقق من عدم تكرار رقم الهاتف
      if (phoneNumber && users.some(u => u.phoneNumber === phoneNumber && u.id !== currentUser.id)) {
        setErrors({ ...errors, phoneNumber: 'رقم الهاتف مسجل مسبقاً' });
        setMessage("⚠️ رقم الهاتف مسجل مسبقاً");
        return;
      }

      const updatedUsers = users.map(u =>
        u.id === currentUser.id
          ? {
            ...u,
            name: fullName,
            fullName: fullName,
            email,
            password,
            nationalId: nationalId || u.nationalId,
            phoneNumber: phoneNumber || u.phoneNumber,
            address: address || u.address,
            governorate: governorate || u.governorate,
            profileImage: profileImage || u.profileImage
          }
          : u
      );

      localStorage.setItem('users', JSON.stringify(updatedUsers));
      const updatedUser = updatedUsers.find(u => u.id === currentUser.id);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      setMessage("✅ تم تحديث البيانات بنجاح");

      // إخفاء الرسالة بعد 3 ثواني
      setTimeout(() => setMessage(""), 3000);
    };

    const handleDeleteAccount = () => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const remaining = users.filter(u => u.id !== currentUser.id);
      localStorage.setItem('users', JSON.stringify(remaining));
      localStorage.removeItem('currentUser');
      setCurrentUser(null);
      setView('home');
    };

    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* زر الرجوع والعنوان */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setView('home')}
              className={`p-3 rounded-xl transition-all hover:scale-105 ${darkMode
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-white hover:bg-gray-100 shadow-md'
                }`}
              title="رجوع للصفحة الرئيسية"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div>
              <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                إعدادات الحساب
              </h1>
              <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                قم بتحديث معلومات حسابك الشخصية
              </p>
            </div>
          </div>

          {/* بطاقة معلومات المستخدم */}
          <div className={`p-6 rounded-xl shadow-lg mb-6 ${darkMode ? 'bg-gradient-to-r from-blue-900 to-indigo-900' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} text-white`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden border-4 border-white/30">
                  {imagePreview ? (
                    <img src={imagePreview} alt="صورة شخصية" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{currentUser?.name}</h2>
                  <p className="opacity-90">{currentUser?.email}</p>
                  <div className="flex gap-4 mt-2">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                      {currentUser?.type === 'owner' ? '👨‍💼 صاحب مشروع' : '👤 مستخدم'}
                    </span>
                    <span className="px-3 py-1 bg-yellow-500/30 backdrop-blur-sm rounded-full text-sm">
                      ⭐ {currentUser?.points || 0} نقطة
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* رسالة النجاح/الخطأ */}
          {message && (
            <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${message.includes('✅')
              ? 'bg-green-100 text-green-800 border-2 border-green-300'
              : 'bg-red-100 text-red-800 border-2 border-red-300'
              }`}>
              <span className="text-2xl">{message.includes('✅') ? '✅' : '⚠️'}</span>
              <span className="font-semibold">{message}</span>
            </div>
          )}

          {/* نموذج التعديل */}
          <div className={`p-8 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="space-y-6">

              {/* الصورة الشخصية */}
              <div className="text-center pb-6 border-b border-gray-200 dark:border-gray-700">
                <label className={`block mb-4 font-bold text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  الصورة الشخصية
                </label>

                {/* معاينة الصورة */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 bg-gray-100">
                      {imagePreview ? (
                        <img src={imagePreview} alt="صورة شخصية" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                          <User className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* زر حذف الصورة */}
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-0 right-0 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        title="حذف الصورة"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* زر رفع الصورة */}
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {imagePreview ? 'تغيير الصورة' : 'رفع صورة'}
                    </div>
                  </label>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    PNG, JPG, GIF (أقصى حجم: 2MB)
                  </p>

                  {errors.image && (
                    <p className="text-red-500 text-sm flex items-center gap-2">
                      <span>⚠️</span> {errors.image}
                    </p>
                  )}
                </div>
              </div>

              {/* الاسم الكامل */}
              <div>
                <label className={`block mb-2 font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  الاسم الكامل (ثلاثي) *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setErrors({ ...errors, fullName: '' });
                    setMessage("");
                  }}
                  placeholder="أحمد محمد علي"
                  className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
                    } ${errors.fullName ? 'border-red-500' : ''}`}
                />
                {errors.fullName && (
                  <p className="mt-2 text-red-500 text-sm flex items-center gap-2">
                    <span>⚠️</span> {errors.fullName}
                  </p>
                )}
              </div>

              {/* البريد الإلكتروني */}
              <div>
                <label className={`block mb-2 font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors, email: '' });
                    setMessage("");
                  }}
                  placeholder="example@email.com"
                  className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
                    } ${errors.email ? 'border-red-500' : ''}`}
                />


                {errors.email && (
                  <p className="mt-2 text-red-500 text-sm flex items-center gap-2">
                    <span>⚠️</span> {errors.email}
                  </p>
                )}
              </div>

              {/* كلمة المرور */}
              {/* كلمة المرور */}
              <div>
                <label className={`block mb-2 font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  كلمة المرور *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors({ ...errors, password: '' });
                      setMessage("");
                    }}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-blue-500 pr-12 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
                      } ${errors.password ? 'border-red-500' : ''}`}
                  />

                  {/* زر إظهار/إخفاء كلمة المرور */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
                      }`}
                    title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-red-500 text-sm flex items-center gap-2">
                    <span>⚠️</span> {errors.password}
                  </p>
                )}
              </div>

              {/* الرقم القومي */}
              <div>
                <label className={`block mb-2 font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  الرقم القومي (14 رقم)
                </label>
                <input
                  type="text"
                  value={nationalId}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 14);
                    setNationalId(value);
                    setErrors({ ...errors, nationalId: '' });
                    setMessage("");
                  }}
                  placeholder="12345678901234"
                  maxLength="14"
                  className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
                    } ${errors.nationalId ? 'border-red-500' : ''}`}
                />
                <div className="flex justify-between items-center mt-2">
                  {errors.nationalId && (
                    <p className="text-red-500 text-sm flex items-center gap-2">
                      <span>⚠️</span> {errors.nationalId}
                    </p>
                  )}
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-auto`}>
                    {nationalId.length} / 14 رقم
                  </p>
                </div>
              </div>

              {/* رقم الهاتف */}
              <div>
                <label className={`block mb-2 font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  رقم الهاتف (11 رقم)
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                    setPhoneNumber(value);
                    setErrors({ ...errors, phoneNumber: '' });
                    setMessage("");
                  }}
                  placeholder="01012345678"
                  maxLength="11"
                  className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
                    } ${errors.phoneNumber ? 'border-red-500' : ''}`}
                />
                <div className="flex justify-between items-center mt-2">
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm flex items-center gap-2">
                      <span>⚠️</span> {errors.phoneNumber}
                    </p>
                  )}
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-auto`}>
                    {phoneNumber.length} / 11 رقم
                  </p>
                </div>
              </div>

              {/* المحافظة */}
              <div>
                <label className={`block mb-2 font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  المحافظة
                </label>
                <select
                  value={governorate}
                  onChange={(e) => {
                    setGovernorate(e.target.value);
                    setErrors({ ...errors, governorate: '' });
                    setMessage("");
                  }}
                  className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
                    }`}
                >
                  <option value="">اختر المحافظة</option>
                  {governorates.map(gov => (
                    <option key={gov} value={gov}>{gov}</option>
                  ))}
                </select>
              </div>

              {/* العنوان */}
              <div>
                <label className={`block mb-2 font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  العنوان التفصيلي
                </label>
                <textarea
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setErrors({ ...errors, address: '' });
                    setMessage("");
                  }}
                  placeholder="شارع النيل، عمارة 15، الدور الثالث"
                  rows="3"
                  className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-blue-500 resize-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
                    } ${errors.address ? 'border-red-500' : ''}`}
                />
                {errors.address && (
                  <p className="mt-2 text-red-500 text-sm flex items-center gap-2">
                    <span>⚠️</span> {errors.address}
                  </p>
                )}
              </div>

              {/* معلومات إضافية */}
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} border-2 ${darkMode ? 'border-gray-600' : 'border-blue-200'}`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📊</span>
                  <div className="flex-1">
                    <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      معلومات الحساب
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                        <strong>النقاط:</strong> {currentUser?.points || 0}
                      </div>
                      <div className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                        <strong>الرصيد:</strong> {(currentUser?.balance || 0).toLocaleString()} ر.س
                      </div>
                      <div className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                        <strong>نوع الحساب:</strong> {currentUser?.type === 'owner' ? 'صاحب مشروع' : 'مستخدم'}
                      </div>
                      <div className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                        <strong>تاريخ الانضمام:</strong> {new Date(currentUser?.id).toLocaleDateString('ar-SA')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* أزرار الحفظ */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  حفظ التغييرات
                </button>

                <button
                  onClick={() => setView('home')}
                  className={`px-8 py-3 rounded-lg font-bold transition-colors ${darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>

          {/* منطقة الخطر */}
          <div className={`mt-8 p-6 rounded-xl border-2 ${darkMode ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-start gap-3 mb-4">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className={`font-bold text-lg mb-2 ${darkMode ? 'text-red-400' : 'text-red-800'}`}>
                  منطقة الخطر
                </h3>
                <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                  حذف الحساب إجراء نهائي ولا يمكن التراجع عنه. سيتم حذف جميع بياناتك ومشاريعك بشكل دائم.
                </p>
              </div>
            </div>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
              >
                حذف الحساب نهائياً
              </button>
            ) : (
              <div className="space-y-3">
                <p className={`font-bold ${darkMode ? 'text-red-400' : 'text-red-800'}`}>
                  هل أنت متأكد من حذف حسابك؟
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteAccount}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
                  >
                    نعم، احذف حسابي
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className={`px-6 py-3 rounded-lg font-bold transition-colors ${darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      }`}
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  // ------------- صفحة الإشعارات -------------
  const NotificationsPage = () => {
    const nots = currentUser?.notifications || [];

    const markAsRead = (nid) => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updated = users.map(u => {
        if (u.id === currentUser.id) {
          return { ...u, notifications: u.notifications.map(n => n.id === nid ? { ...n, read: true } : n) };
        }
        return u;
      });
      localStorage.setItem('users', JSON.stringify(updated));
      const updatedCurrent = updated.find(u => u.id === currentUser.id);
      setCurrentUser(updatedCurrent);
      localStorage.setItem('currentUser', JSON.stringify(updatedCurrent));
    };

    const handleOpen = (n) => {
      if (n.link) {
        setView(n.link.view);
        if (n.link.projectId) {
          const p = projects.find(pr => pr.id === n.link.projectId);
          if (p) setSelectedProject(p);
        }
      }
    };

    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>الإشعارات</h1>
          <div className="space-y-3">
            {nots.length === 0 && <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>لا توجد إشعارات</p>}
            {nots.map(n => (
              <div key={n.id} className={`p-4 rounded-lg ${n.read ? (darkMode ? 'bg-gray-800' : 'bg-white') : (darkMode ? 'bg-gray-700' : 'bg-white shadow')}`}>
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="text-2xl">{n.icon || '🔔'}</div>
                    <div>
                      <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{n.title}</div>
                      <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{n.message}</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {!n.read && <button onClick={() => markAsRead(n.id)} className="text-sm text-blue-600">وضع كمقروء</button>}
                    {n.link && <button onClick={() => handleOpen(n)} className="text-sm text-green-600">عرض</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  // ------------- صفحة سجل التبرعات -------------
  const DonationsHistoryPage = () => {
    const [filterCategory, setFilterCategory] = useState('الكل');
    const [sortBy, setSortBy] = useState('recent'); // recent, amount-high, amount-low
    const [searchTerm, setSearchTerm] = useState('');

    if (!currentUser) {
      return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="max-w-4xl mx-auto px-4 py-20 text-center">
            <Receipt className={`w-24 h-24 mx-auto mb-4 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`} />
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>يرجى تسجيل الدخول</h2>
            <button onClick={() => setView('login')} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">
              تسجيل الدخول
            </button>
          </div>
        </div>
      );
    }

    const myDonations = userDonations.filter(d => d.userId === currentUser.id);

    // تصفية وترتيب التبرعات
    let filteredDonations = myDonations.filter(d => {
      const matchesSearch = d.projectTitle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'الكل' || d.projectCategory === filterCategory;
      return matchesSearch && matchesCategory;
    });

    // الترتيب
    if (sortBy === 'recent') {
      filteredDonations.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'amount-high') {
      filteredDonations.sort((a, b) => b.amount - a.amount);
    } else if (sortBy === 'amount-low') {
      filteredDonations.sort((a, b) => a.amount - b.amount);
    }

    // إحصائيات
    const totalDonated = myDonations.reduce((sum, d) => sum + d.amount, 0);
    const projectsSupported = new Set(myDonations.map(d => d.projectId)).size;
    const averageDonation = myDonations.length > 0 ? totalDonated / myDonations.length : 0;

    // بيانات للرسم البياني - التبرعات حسب الفئة
    const donationsByCategory = {};
    myDonations.forEach(d => {
      donationsByCategory[d.projectCategory] = (donationsByCategory[d.projectCategory] || 0) + d.amount;
    });
    const categoryChartData = Object.keys(donationsByCategory).map(cat => ({
      category: cat,
      amount: donationsByCategory[cat]
    }));

    // بيانات للرسم البياني - التبرعات الشهرية
    const donationsByMonth = {};
    myDonations.forEach(d => {
      const month = new Date(d.date).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short' });
      donationsByMonth[month] = (donationsByMonth[month] || 0) + d.amount;
    });
    const monthChartData = Object.keys(donationsByMonth).map(month => ({
      month,
      amount: donationsByMonth[month]
    })).reverse();

    const CHART_COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    const exportToCSV = () => {
      const headers = ['التاريخ', 'المشروع', 'الفئة', 'المبلغ (ر.س)'];
      const rows = myDonations.map(d => [
        new Date(d.date).toLocaleDateString('ar-SA'),
        d.projectTitle,
        d.projectCategory,
        d.amount
      ]);

      let csv = headers.join(',') + '\n';
      rows.forEach(row => {
        csv += row.join(',') + '\n';
      });

      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `donations_${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
    };

    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* العنوان */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Receipt className="w-8 h-8 text-blue-600" />
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>سجل تبرعاتي</h1>
            </div>
            {myDonations.length > 0 && (
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
              >
                <Download className="w-5 h-5" />
                تصدير CSV
              </button>
            )}
          </div>

          {myDonations.length === 0 ? (
            <div className="text-center py-20">
              <Receipt className={`w-24 h-24 mx-auto mb-4 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`} />
              <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>لم تقم بأي تبرع بعد</h3>
              <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>ابدأ بدعم المشاريع التي تهمك</p>
              <button
                onClick={() => setView('home')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
              >
                تصفح المشاريع
              </button>
            </div>
          ) : (
            <>
              {/* الإحصائيات */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>إجمالي التبرعات</span>
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {totalDonated.toLocaleString()}
                  </div>
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>ر.س</span>
                </div>

                <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>المشاريع المدعومة</span>
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {projectsSupported}
                  </div>
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>مشروع</span>
                </div>

                <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>متوسط التبرع</span>
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {averageDonation.toFixed(0)}
                  </div>
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>ر.س</span>
                </div>
              </div>

              {/* الرسوم البيانية */}
              {myDonations.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* التبرعات حسب الفئة */}
                  <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      التبرعات حسب الفئة
                    </h3>
                    <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={categoryChartData}
                            dataKey="amount"
                            nameKey="category"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                          >
                            {categoryChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* التبرعات الشهرية */}
                  {monthChartData.length > 1 && (
                    <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        التبرعات الشهرية
                      </h3>
                      <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={monthChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#2d3748' : '#e6edf3'} />
                            <XAxis dataKey="month" stroke={darkMode ? '#cbd5e1' : '#374151'} />
                            <YAxis stroke={darkMode ? '#cbd5e1' : '#374151'} />
                            <Tooltip />
                            <Bar dataKey="amount" fill="#4f46e5" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* الفلاتر والبحث */}
              <div className={`p-6 rounded-xl shadow-lg mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="grid md:grid-cols-3 gap-4">
                  {/* البحث */}
                  <div className="relative">
                    <Search className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    <input
                      type="text"
                      placeholder="ابحث عن مشروع..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full pr-10 pl-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    />
                  </div>

                  {/* الفلترة حسب الفئة */}
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className={`flex-1 px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    >
                      <option value="الكل">جميع الفئات</option>
                      {categories.filter(c => c !== 'الكل').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* الترتيب */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  >
                    <option value="recent">الأحدث أولاً</option>
                    <option value="amount-high">المبلغ (الأعلى)</option>
                    <option value="amount-low">المبلغ (الأقل)</option>
                  </select>
                </div>
              </div>

              {/* قائمة التبرعات */}
              <div className="space-y-4">
                {filteredDonations.length === 0 ? (
                  <div className={`text-center py-12 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>لا توجد تبرعات تطابق البحث</p>
                  </div>
                ) : (
                  filteredDonations.map(donation => {
                    const project = projects.find(p => p.id === donation.projectId);
                    return (
                      <div
                        key={donation.id}
                        className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                      >
                        <div className="flex items-start gap-4">
                          {/* صورة المشروع */}
                          <img
                            src={donation.projectImage}
                            alt={donation.projectTitle}
                            className="w-24 h-24 rounded-lg object-cover cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => {
                              if (project) {
                                setSelectedProject(project);
                                setView('project-details');
                              }
                            }}
                          />

                          {/* معلومات التبرع */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3
                                  className={`text-xl font-bold mb-1 cursor-pointer hover:text-blue-600 transition-colors ${darkMode ? 'text-white' : 'text-gray-800'}`}
                                  onClick={() => {
                                    if (project) {
                                      setSelectedProject(project);
                                      setView('project-details');
                                    }
                                  }}
                                >
                                  {donation.projectTitle}
                                </h3>
                                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
                                  {donation.projectCategory}
                                </span>
                              </div>

                              <div className="text-left">
                                <div className={`text-2xl font-bold text-green-600`}>
                                  {donation.amount.toLocaleString()} ر.س
                                </div>
                                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {new Date(donation.date).toLocaleDateString('ar-SA', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </div>
                              </div>
                            </div>

                            {/* معلومات المشروع الحالية */}
                            {project && (
                              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-6 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-blue-600" />
                                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                      {((project.raised / project.goal) * 100).toFixed(0)}% مكتمل
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-purple-600" />
                                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                      {project.backers} داعم
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-orange-600" />
                                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                      {project.daysLeft} يوم متبقي
                                    </span>
                                  </div>
                                </div>

                                {/* شريط التقدم */}
                                <div className="mt-3">
                                  <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                    <div
                                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                                      style={{ width: `${Math.min((project.raised / project.goal) * 100, 100)}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {!project && (
                              <div className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                (المشروع غير متوفر حالياً)
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* الملخص في الأسفل */}
              <div className={`mt-8 p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gradient-to-r from-blue-900 to-indigo-900' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} text-white`}>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">شكراً لدعمك! 🎉</h3>
                  <p className="text-lg opacity-90">
                    لقد ساهمت في دعم {projectsSupported} مشروع بإجمالي {totalDonated.toLocaleString()} ر.س
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // ------------- صفحة المحفظة (Wallet) -------------
  const WalletPage = () => {
    const [amount, setAmount] = useState('');
    const [operation, setOperation] = useState('deposit'); // deposit or withdraw
    const [showModal, setShowModal] = useState(false);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
      if (currentUser) {
        // تحميل المعاملات من localStorage
        const savedTransactions = localStorage.getItem(`transactions_${currentUser.id}`);
        if (savedTransactions) {
          setTransactions(JSON.parse(savedTransactions));
        }
      }
    }, [currentUser]);

    const handleDeposit = () => {
      const value = parseFloat(amount);
      if (isNaN(value) || value <= 0) {
        alert('أدخل مبلغ صالح');
        return;
      }

      // تحديث رصيد المستخدم
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map(u => {
        if (u.id === currentUser.id) {
          return { ...u, balance: (u.balance || 0) + value };
        }
        return u;
      });
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      const updatedUser = updatedUsers.find(u => u.id === currentUser.id);
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      // إضافة المعاملة للسجل
      const newTransaction = {
        id: Date.now(),
        type: 'deposit',
        amount: value,
        date: new Date().toISOString(),
        balance: updatedUser.balance
      };

      const newTransactions = [newTransaction, ...transactions];
      setTransactions(newTransactions);
      localStorage.setItem(`transactions_${currentUser.id}`, JSON.stringify(newTransactions));

      // إشعار
      addNotificationToUser(currentUser.id, {
        title: '💰 إيداع ناجح',
        message: `تم إيداع ${value.toLocaleString()} ر.س في محفظتك`,
        icon: '💰'
      });

      setAmount('');
      setShowModal(false);
      alert(`تم إيداع ${value.toLocaleString()} ر.س بنجاح`);
    };

    const handleWithdraw = () => {
      const value = parseFloat(amount);
      if (isNaN(value) || value <= 0) {
        alert('أدخل مبلغ صالح');
        return;
      }

      if (value > (currentUser.balance || 0)) {
        alert('رصيدك غير كافٍ');
        return;
      }

      // تحديث رصيد المستخدم
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map(u => {
        if (u.id === currentUser.id) {
          return { ...u, balance: (u.balance || 0) - value };
        }
        return u;
      });
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      const updatedUser = updatedUsers.find(u => u.id === currentUser.id);
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      // إضافة المعاملة للسجل
      const newTransaction = {
        id: Date.now(),
        type: 'withdraw',
        amount: value,
        date: new Date().toISOString(),
        balance: updatedUser.balance
      };

      const newTransactions = [newTransaction, ...transactions];
      setTransactions(newTransactions);
      localStorage.setItem(`transactions_${currentUser.id}`, JSON.stringify(newTransactions));

      // إشعار
      addNotificationToUser(currentUser.id, {
        title: '💳 سحب ناجح',
        message: `تم سحب ${value.toLocaleString()} ر.س من محفظتك`,
        icon: '💳'
      });

      setAmount('');
      setShowModal(false);
      alert(`تم سحب ${value.toLocaleString()} ر.س بنجاح`);
    };

    if (!currentUser) {
      return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="max-w-4xl mx-auto px-4 py-20 text-center">
            <DollarSign className={`w-24 h-24 mx-auto mb-4 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`} />
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>يرجى تسجيل الدخول</h2>
            <button onClick={() => setView('login')} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">
              تسجيل الدخول
            </button>
          </div>
        </div>
      );
    }

    // فلترة المعاملات (الودائع والسحوبات فقط - لا التبرعات)
    const walletTransactions = transactions.filter(t => t.type === 'deposit' || t.type === 'withdraw');

    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* العنوان */}
          <div className="flex items-center gap-3 mb-8">
            <DollarSign className="w-8 h-8 text-green-600" />
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>محفظتي</h1>
          </div>

          {/* بطاقة الرصيد */}
          <div className={`p-8 rounded-2xl shadow-lg mb-8 ${darkMode ? 'bg-gradient-to-r from-blue-900 to-indigo-900' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80 mb-2">رصيدك الحالي</p>
                <p className="text-5xl font-bold mb-4">{(currentUser.balance || 0).toLocaleString()} ر.س</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => { setOperation('deposit'); setShowModal(true); }}
                    className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    إيداع
                  </button>
                  <button
                    onClick={() => { setOperation('withdraw'); setShowModal(true); }}
                    className="px-6 py-3 bg-white/20 backdrop-blur-sm border-2 border-white text-white rounded-lg font-semibold hover:bg-white/30 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    سحب
                  </button>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <DollarSign className="w-16 h-16" />
                </div>
              </div>
            </div>
          </div>

          {/* إحصائيات */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>إجمالي الإيداعات</span>
                <Plus className="w-5 h-5 text-green-600" />
              </div>
              <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {transactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
              </div>
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>ر.س</span>
            </div>

            <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>إجمالي السحوبات</span>
                <Download className="w-5 h-5 text-red-600" />
              </div>
              <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {transactions.filter(t => t.type === 'withdraw').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
              </div>
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>ر.س</span>
            </div>

            <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>إجمالي التبرعات</span>
                <Heart className="w-5 h-5 text-blue-600" />
              </div>
              <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {userDonations.filter(d => d.userId === currentUser.id).reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
              </div>
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>ر.س</span>
            </div>
          </div>

          {/* سجل المعاملات */}
          <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>سجل المعاملات</h2>

            {walletTransactions.length === 0 ? (
              <div className="text-center py-12">
                <Receipt className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`} />
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>لا توجد معاملات بعد</p>
              </div>
            ) : (
              <div className="space-y-3">
                {walletTransactions.map(transaction => (
                  <div
                    key={transaction.id}
                    className={`p-4 rounded-lg flex items-center justify-between ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${transaction.type === 'deposit'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                        }`}>
                        {transaction.type === 'deposit' ? <Plus className="w-6 h-6" /> : <Download className="w-6 h-6" />}
                      </div>
                      <div>
                        <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {transaction.type === 'deposit' ? 'إيداع' : 'سحب'}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {new Date(transaction.date).toLocaleDateString('ar-SA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {transaction.type === 'deposit' ? '+' : '-'}{transaction.amount.toLocaleString()} ر.س
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        الرصيد: {transaction.balance.toLocaleString()} ر.س
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* مودال الإيداع/السحب */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className={`max-w-md w-full p-8 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {operation === 'deposit' ? 'إيداع أموال' : 'سحب أموال'}
                </h3>

                <div className="mb-6">
                  <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    المبلغ (ر.س)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                  />
                  {operation === 'withdraw' && (
                    <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      الرصيد المتاح: {(currentUser.balance || 0).toLocaleString()} ر.س
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={operation === 'deposit' ? handleDeposit : handleWithdraw}
                    className={`flex-1 py-3 rounded-lg font-semibold ${operation === 'deposit'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                  >
                    {operation === 'deposit' ? 'إيداع' : 'سحب'}
                  </button>
                  <button
                    onClick={() => { setShowModal(false); setAmount(''); }}
                    className={`flex-1 py-3 rounded-lg font-semibold ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      }`}
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ------------- صفحة الشات -------------
  const ChatPage = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState('');
    const [searchUser, setSearchUser] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
      scrollToBottom();
    }, [chatMessages, selectedUser]);

    // تحميل آخر مستخدم تم التواصل معه
    useEffect(() => {
      const lastUser = localStorage.getItem('lastChatUser');
      if (lastUser && !selectedUser) {
        try {
          const user = JSON.parse(lastUser);
          const foundUser = onlineUsers.find(u => u.id == user.id);
          if (foundUser) {
            setSelectedUser(foundUser);
            localStorage.removeItem('lastChatUser');
          }
        } catch (e) {
          console.error('Error loading last chat user:', e);
        }
      }
    }, [onlineUsers, selectedUser]);

    if (!currentUser) {
      return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="max-w-4xl mx-auto px-4 py-20 text-center">
            <MessageCircle className={`w-24 h-24 mx-auto mb-4 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`} />
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>يرجى تسجيل الدخول</h2>
            <button onClick={() => setView('login')} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">
              تسجيل الدخول
            </button>
          </div>
        </div>
      );
    }

    const handleSendMessage = () => {
      if (!message.trim() || !selectedUser) return;

      const messageToSend = message.trim();
      const newMessage = {
        id: Date.now(),
        from: currentUser.id,
        to: selectedUser.id,
        fromName: currentUser.name,
        toName: selectedUser.name,
        message: messageToSend,
        timestamp: new Date().toISOString(),
        read: false
      };

      // حفظ المستخدم الحالي للحفاظ على المحادثة
      localStorage.setItem('lastChatUser', JSON.stringify(selectedUser));

      // إفراغ حقل النص أولاً
      setMessage('');

      // ثم إضافة الرسالة
      setChatMessages(prev => {
        const updatedMessages = [...prev, newMessage];
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });

      addNotificationToUser(selectedUser.id, {
        title: '💬 رسالة جديدة',
        message: `${currentUser.name}: ${messageToSend.slice(0, 50)}${messageToSend.length > 50 ? '...' : ''}`,
        icon: '💬',
        link: { view: 'chat' }
      });
    };

    // فلترة المستخدمين
    const filteredUsers = onlineUsers.filter(u =>
      u.name.toLowerCase().includes(searchUser.toLowerCase())
    );

    // الرسائل مع المستخدم المحدد
    const conversationMessages = selectedUser
      ? chatMessages.filter(m =>
        (m.from == currentUser.id && m.to == selectedUser.id) ||
        (m.from == selectedUser.id && m.to == currentUser.id)
      ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      : [];

    // عدد الرسائل غير المقروءة لكل مستخدم
    const getUnreadCount = (userId) => {
      return chatMessages.filter(m => m.from == userId && m.to == currentUser.id && !m.read).length;
    };

    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="w-8 h-8 text-blue-600" />
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>المحادثات</h1>
            <span className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              ({onlineUsers.length} مستخدم)
            </span>
          </div>

          {onlineUsers.length === 0 ? (
            <div className={`p-8 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} text-center`}>
              <Users className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`} />
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                لا يوجد مستخدمين آخرين
              </h3>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                انتظر حتى ينضم مستخدمون آخرون للمنصة
              </p>
            </div>
          ) : (
            <div className={`rounded-2xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`} style={{ height: 'calc(100vh - 200px)' }}>
              <div className="grid grid-cols-12 h-full">
                {/* قائمة المستخدمين */}
                <div className={`col-span-12 md:col-span-4 border-l ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} overflow-y-auto`}>
                  {/* البحث */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="relative">
                      <Search className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                      <input
                        type="text"
                        placeholder="ابحث عن مستخدم..."
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                        className={`w-full pr-10 pl-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                      />
                    </div>
                  </div>

                  {/* المستخدمين */}
                  <div className="overflow-y-auto" style={{ maxHeight: 'calc(100% - 80px)' }}>
                    {filteredUsers.length === 0 ? (
                      <div className="p-8 text-center">
                        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>لا يوجد مستخدمين</p>
                      </div>
                    ) : (
                      filteredUsers.map(user => {
                        const unreadCount = getUnreadCount(user.id);
                        const isSelected = selectedUser?.id == user.id;

                        const handleUserClick = () => {
                          console.log('🔥 Clicking on user:', user.name, 'ID:', user.id);

                          setSelectedUser(user);
                          localStorage.setItem('lastChatUser', JSON.stringify(user));

                          setChatMessages(prev => {
                            const updated = prev.map(m =>
                              m.from == user.id && m.to == currentUser.id
                                ? { ...m, read: true }
                                : m
                            );
                            localStorage.setItem('chatMessages', JSON.stringify(updated));
                            return updated;
                          });

                          console.log('✅ User selected successfully');
                        };

                        return (
                          <div
                            key={user.id}
                            onClick={handleUserClick}
                            className={`p-4 cursor-pointer border-b transition-colors ${isSelected
                              ? darkMode ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200'
                              : darkMode ? 'hover:bg-gray-700 border-gray-700' : 'hover:bg-gray-100 border-gray-200'
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-600">
                                  {user.avatar && user.avatar.startsWith('data:') ? (
                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-white font-bold text-lg">{user.name.charAt(0).toUpperCase()}</span>
                                  )}
                                </div>
                                {user.online && (
                                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                  {user.name}
                                </h3>
                                <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {user.online ? 'متصل الآن' : 'غير متصل'}
                                </p>
                              </div>
                              {unreadCount > 0 && (
                                <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                  {unreadCount}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* منطقة المحادثة */}
                <div className="col-span-12 md:col-span-8 flex flex-col">
                  {!selectedUser ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <MessageCircle className={`w-24 h-24 mx-auto mb-4 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`} />
                        <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          اختر محادثة
                        </h3>
                        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                          حدد مستخدماً من القائمة لبدء المحادثة
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* رأس المحادثة */}
                      <div className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500 flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-600">
                            {selectedUser.avatar && selectedUser.avatar.startsWith('data:') ? (
                              <img src={selectedUser.avatar} alt={selectedUser.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-white font-bold">{selectedUser.name.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <div>
                            <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                              {selectedUser.name}
                            </h3>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {selectedUser.online ? 'متصل الآن' : 'غير متصل'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* الرسائل */}
                      <div
                        className={`flex-1 p-4 space-y-4 overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
                        style={{
                          maxHeight: 'calc(100vh - 350px)',
                          overflowY: 'scroll',
                          scrollBehavior: 'smooth'
                        }}
                      >
                        {conversationMessages.length === 0 ? (
                          <div className="text-center py-8">
                            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                              لا توجد رسائل بعد. ابدأ المحادثة! 👋
                            </p>
                          </div>
                        ) : (
                          conversationMessages.map(msg => {
                            const isMe = msg.from === currentUser.id;
                            return (
                              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isMe ? 'order-2' : 'order-1'}`}>
                                  <div className={`rounded-2xl px-4 py-2 ${isMe
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : darkMode
                                      ? 'bg-gray-800 text-white rounded-bl-none'
                                      : 'bg-white text-gray-800 rounded-bl-none shadow-md'
                                    }`}>
                                    <p className="break-words">{msg.message}</p>
                                  </div>
                                  <p className={`text-xs mt-1 ${isMe ? 'text-left' : 'text-right'} ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString('ar-SA', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                              </div>
                            );
                          })
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* إرسال رسالة */}
                      <div className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="اكتب رسالتك..."
                            className={`flex-1 px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                              }`}
                          />
                          <button
                            onClick={handleSendMessage}
                            disabled={!message.trim()}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                          >
                            إرسال
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };


  // ------------- الشريط العلوي (Navbar) مع جرس الاشعارات ونقاط المستخدم -------------
  const Navbar = () => (
    <nav role="navigation" aria-label="الشريط العلوي الرئيسي" className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button type="button" aria-label="الانتقال إلى الصفحة الرئيسية" onClick={() => setView('home')} className="flex items-center gap-3 cursor-pointer">
            <Target className="w-8 h-8 text-blue-600" />
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>منصة المشاريع</h1>
          </button>

          {/* زر عن المنصة */}
          <button
            onClick={() => setView('about')}
            className={`
    px-5 py-2.5 rounded-xl font-semibold backdrop-blur-sm border
    transition-all duration-300
    ${view === 'about'
                ? 'bg-blue-600 text-white shadow-lg scale-105 border-blue-500'
                : darkMode
                  ? 'bg-gray-800/40 text-gray-200 border-gray-600 hover:bg-gray-700/50 hover:scale-105 hover:shadow-md'
                  : 'bg-white/40 text-gray-800 border-gray-300 hover:bg-gray-100/60 hover:scale-105 hover:shadow-md'
              }
  `}
          >
            عن المنصة
          </button>



          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'} hover:scale-110 transition-transform`}
              title={darkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
              aria-pressed={darkMode}
              aria-label={darkMode ? 'تبديل إلى الوضع النهاري' : 'تبديل إلى الوضع الليلي'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">


                {/* زر الشات */}
                <button
                  type="button"
                  onClick={() => setView('chat')}
                  className={`relative p-2 rounded-lg transition-colors ${view === 'chat'
                    ? 'bg-blue-100 text-blue-600'
                    : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  title="المحادثات"
                  aria-label="المحادثات"
                >
                  <MessageCircle className="w-5 h-5" />
                  {chatMessages.filter(m => m.to === currentUser.id && !m.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {chatMessages.filter(m => m.to === currentUser.id && !m.read).length}
                    </span>
                  )}
                </button>


                {/* زر المحفظة */}
                <button
                  type="button"
                  onClick={() => setView('wallet')}
                  className={`relative p-2 rounded-lg transition-colors ${view === 'wallet'
                    ? 'bg-green-100 text-green-600'
                    : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  title={`المحفظة - الرصيد: ${(currentUser.balance || 0).toLocaleString()} ر.س`}
                  aria-label="المحفظة"
                >
                  <DollarSign className="w-5 h-5" />
                </button>

                {/* زر المفضلة */}
                <button
                  type="button"
                  onClick={() => setView('favorites')}
                  className={`relative p-2 rounded-lg transition-colors ${view === 'favorites' ? 'bg-red-100 text-red-600' : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  title="المفضلة"
                  aria-label={`المفضلة، ${favorites.length} عناصر`}
                >
                  <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'fill-current' : ''}`} />
                  {favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold" aria-hidden="true">
                      {favorites.length}
                    </span>
                  )}
                </button>
                {/* زر سجل التبرعات */}
                <button
                  type="button"
                  onClick={() => setView('donations-history')}
                  className={`relative p-2 rounded-lg transition-colors ${view === 'donations-history' ? 'bg-purple-100 text-purple-600' : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  title="سجل التبرعات"
                  aria-label={`سجل التبرعات، ${userDonations.filter(d => d.userId === currentUser.id).length} تبرع`}
                >
                  <Receipt className="w-5 h-5" />
                  {userDonations.filter(d => d.userId === currentUser.id).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold" aria-hidden="true">
                      {userDonations.filter(d => d.userId === currentUser.id).length}
                    </span>
                  )}
                </button>


                {/* أزرار أصحاب المشاريع */}
                {currentUser.type === 'owner' && (
                  <>
                    <button
                      onClick={() => setView('dashboard')}
                      className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${view === 'dashboard' ? 'bg-blue-600 text-white' : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      title="لوحة التحكم"
                    >
                      <Settings className="w-5 h-5" />
                      <span className="hidden lg:inline">لوحة التحكم</span>
                    </button>

                    <button
                      onClick={() => setView('add-project')}
                      className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                      title="إضافة مشروع"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="hidden md:inline">إضافة مشروع</span>
                    </button>
                  </>
                )}

                {/* زر الإشعارات */}
                <button
                  type="button"
                  onClick={() => setView('notifications')}
                  className={`relative p-2 rounded-lg transition-colors ${view === 'notifications' ? 'bg-blue-100 text-blue-600' : darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                  title="الإشعارات"
                  aria-label={`الإشعارات، ${(currentUser.notifications || []).filter(n => !n.read).length} غير مقروءة`}
                >
                  <Bell className="w-5 h-5" />
                  {(currentUser.notifications || []).filter(n => !n.read).length > 0 && (
                    <>
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold" aria-hidden="true">
                        {(currentUser.notifications || []).filter(n => !n.read).length}
                      </span>
                      <span className="sr-only">{(currentUser.notifications || []).filter(n => !n.read).length} إشعارات غير مقروءة</span>
                    </>
                  )}
                </button>

                {/* زر الإعدادات */}
                <button
                  type="button"
                  onClick={() => setView('settings')}
                  className={`p-2 rounded-lg transition-colors ${view === 'settings' ? 'bg-purple-100 text-purple-600' : darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                  title="الإعدادات"
                  aria-label="الإعدادات"
                >
                  <Settings className="w-5 h-5" />
                </button>

                {/* معلومات المستخدم */}
                <button
                  type="button"
                  onClick={() => setView('settings')}
                  className={`hidden md:block p-2 rounded-xl transition-all hover:scale-110 ${view === 'settings'
                    ? 'bg-blue-600 shadow-lg ring-2 ring-blue-400'
                    : darkMode
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-white hover:bg-gray-50 shadow-md'
                    }`}
                  title={`${currentUser.name} - ${currentUser.points || 0} نقطة`}
                  aria-label={`الملف الشخصي - ${currentUser.name} - ${currentUser.points || 0} نقاط`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center overflow-hidden ${view === 'settings'
                    ? 'bg-white/20'
                    : darkMode
                      ? 'bg-gray-600'
                      : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                    }`}>
                    {currentUser.profileImage ? (
                      <img
                        src={currentUser.profileImage}
                        alt={currentUser.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className={`font-bold ${view === 'settings' || !darkMode ? 'text-white' : 'text-gray-300'}`}>
                        {currentUser.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </button>
                {/* زر تسجيل الخروج */}
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('currentUser');
                    setCurrentUser(null);
                    setView('home');
                  }}
                  className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 hover:bg-red-600' : 'bg-gray-100 hover:bg-red-500 hover:text-white'}`}
                  title="تسجيل الخروج"
                  aria-label="تسجيل الخروج"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setView('login')}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                aria-label="تسجيل الدخول"
              >
                <LogIn className="w-5 h-5" />
                تسجيل الدخول
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  // ------------- صفحة الهبوط (Landing Page) -------------
  const LandingPage = () => (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Hero Section */}
      <div className={`relative overflow-hidden ${darkMode ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' : 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600'}`}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center text-white">
            <div className="flex justify-center mb-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-full p-6 shadow-2xl">
                <Target className="w-20 h-20 md:w-24 md:h-24" />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              حوّل فكرتك إلى واقع
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              منصة عربية متكاملة لدعم المشاريع الصغيرة وتحويل الأحلام إلى حقيقة
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="group relative px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all hover:scale-105"
              >
                <span className="relative z-10">ابدأ الآن مجاناً</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>

              <button
                onClick={() => setView('projects')}
                className="px-8 py-4 bg-white/10 backdrop-blur-lg border-2 border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all hover:scale-105"
              >
                استكشف المشاريع
              </button>
            </div>

            {/* الإحصائيات */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="text-4xl md:text-5xl font-bold mb-2">{projects.length}+</div>
                <div className="text-lg opacity-90">مشروع نشط</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="text-4xl md:text-5xl font-bold mb-2">{projects.reduce((sum, p) => sum + p.backers, 0)}+</div>
                <div className="text-lg opacity-90">داعم نشط</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="text-4xl md:text-5xl font-bold mb-2">{(projects.reduce((sum, p) => sum + p.raised, 0) / 1000).toFixed(0)}K+</div>
                <div className="text-lg opacity-90">ريال تم جمعه</div>
              </div>
            </div>
          </div>
        </div>

        {/* الموجة السفلية */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
              fill={darkMode ? '#111827' : '#F9FAFB'} />
          </svg>
        </div>
      </div>

      {/* المميزات */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            لماذا تختار منصتنا؟
          </h2>
          <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            نوفر لك كل ما تحتاجه لإطلاق مشروعك بنجاح
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* ميزة 1 */}
          <div className={`p-8 rounded-2xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-xl'} hover:scale-105 transition-transform`}>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              تمويل سريع
            </h3>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              احصل على التمويل اللازم لمشروعك في وقت قياسي من داعمين حقيقيين
            </p>
          </div>

          {/* ميزة 2 */}
          <div className={`p-8 rounded-2xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-xl'} hover:scale-105 transition-transform`}>
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              مجتمع داعم
            </h3>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              انضم لمجتمع من رواد الأعمال والداعمين الذين يؤمنون بالأفكار المبتكرة
            </p>
          </div>

          {/* ميزة 3 */}
          <div className={`p-8 rounded-2xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-xl'} hover:scale-105 transition-transform`}>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              شفافية كاملة
            </h3>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              تتبع تقدم مشروعك بشفافية تامة مع تحديثات مستمرة للداعمين
            </p>
          </div>

          {/* ميزة 4 */}
          <div className={`p-8 rounded-2xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-xl'} hover:scale-105 transition-transform`}>
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              سهولة الاستخدام
            </h3>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              واجهة بسيطة وسهلة تجعل إطلاق مشروعك ودعم الآخرين أمراً ممتعاً
            </p>
          </div>
        </div>
      </div>

      {/* كيف يعمل */}
      <div className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              كيف تعمل المنصة؟
            </h2>
            <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              ثلاث خطوات بسيطة لتحقيق حلمك
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* خطوة 1 */}
            <div className="text-center">
              <div className={`w-20 h-20 mx-auto mb-6 rounded-full ${darkMode ? 'bg-blue-900' : 'bg-blue-600'} text-white flex items-center justify-center text-3xl font-bold shadow-xl`}>
                1
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                أنشئ حساب
              </h3>
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                سجل مجاناً وابدأ رحلتك في عالم ريادة الأعمال
              </p>
            </div>

            {/* خطوة 2 */}
            <div className="text-center">
              <div className={`w-20 h-20 mx-auto mb-6 rounded-full ${darkMode ? 'bg-blue-900' : 'bg-blue-600'} text-white flex items-center justify-center text-3xl font-bold shadow-xl`}>
                2
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                أطلق مشروعك
              </h3>
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                اعرض فكرتك بطريقة احترافية واجذب الداعمين
              </p>
            </div>

            {/* خطوة 3 */}
            <div className="text-center">
              <div className={`w-20 h-20 mx-auto mb-6 rounded-full ${darkMode ? 'bg-blue-900' : 'bg-blue-600'} text-white flex items-center justify-center text-3xl font-bold shadow-xl`}>
                3
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                احصل على التمويل
              </h3>
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                اجمع التمويل وحقق حلمك مع دعم المجتمع
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => setView('login')}
              className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              ابدأ رحلتك الآن
            </button>
          </div>
        </div>
      </div>

      {/* مشاريع مميزة */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            مشاريع مميزة
          </h2>
          <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            اكتشف أحدث المشاريع المبتكرة
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {projects.slice(0, 3).map(project => (
            <div key={project.id} className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-xl'} hover:scale-105 transition-transform cursor-pointer`}
              onClick={() => {
                setSelectedProject(project);
                setView('project-details');
              }}
            >
              <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">{project.category}</span>
                <h3 className={`text-xl font-bold mt-3 mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{project.title}</h3>
                <p className={`mb-4 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{project.description}</p>

                <div className={`w-full h-2 rounded-full mb-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: `${Math.min((project.raised / project.goal) * 100, 100)}%` }} />
                </div>

                <div className="flex justify-between items-center">
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{project.raised.toLocaleString()} ر.س</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{project.backers} داعم</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => setView('projects')}
            className={`px-8 py-3 rounded-xl font-bold text-lg transition-all hover:scale-105 ${darkMode
              ? 'bg-gray-800 border-2 border-gray-700 text-white hover:bg-gray-700'
              : 'bg-white border-2 border-gray-300 text-gray-800 hover:bg-gray-50 shadow-lg'
              }`}
          >
            عرض جميع المشاريع
          </button>
        </div>
      </div>

      {/* Call to Action النهائي */}
      <div className={`py-20 ${darkMode ? 'bg-gradient-to-r from-blue-900 to-indigo-900' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} text-white`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            جاهز لبدء رحلتك؟
          </h2>
          <p className="text-xl mb-8 opacity-90">
            انضم لآلاف رواد الأعمال الذين حققوا أحلامهم عبر منصتنا
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setView('login')}
              className="px-10 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all hover:scale-105"
            >
              إنشاء حساب مجاني
            </button>
            <button
              onClick={() => setView('about')}
              className="px-10 py-4 bg-white/10 backdrop-blur-lg border-2 border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all hover:scale-105"
            >
              تعرّف علينا أكثر
            </button>
          </div>
        </div>
      </div>
    </div>
  );




  // ------------- الصفحة الرئيسية -------------
  const HomePage = () => (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`${darkMode ? 'bg-gradient-to-r from-blue-900 to-indigo-900' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} text-white py-20`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">ادعم المشاريع الصغيرة وحقق الأحلام</h2>
          <p className="text-xl mb-8 opacity-90">منصة عربية لدعم رواد الأعمال وأصحاب المشاريع الصغيرة</p>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6"><TrendingUp className="w-8 h-8 mx-auto mb-2" /><div className="text-3xl font-bold mb-1">{projects.length}</div><div className="text-sm opacity-90">مشروع نشط</div></div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6"><Users className="w-8 h-8 mx-auto mb-2" /><div className="text-3xl font-bold mb-1">{projects.reduce((sum, p) => sum + p.backers, 0)}</div><div className="text-sm opacity-90">داعم</div></div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6"><DollarSign className="w-8 h-8 mx-auto mb-2" /><div className="text-3xl font-bold mb-1">{projects.reduce((sum, p) => sum + p.raised, 0).toLocaleString()}</div><div className="text-sm opacity-90">ر.س تم جمعها</div></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
            <input type="text" placeholder="ابحث عن مشروع..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`w-full pr-12 pl-4 py-3 rounded-lg border-2 focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`} />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map(category => (
            <button key={category} onClick={() => setSelectedCategory(category)} className={`px-6 py-2 rounded-full font-semibold transition-all ${selectedCategory === category ? 'bg-blue-600 text-white shadow-lg scale-105' : darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>{category}</button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => <ProjectCard key={project.id} project={project} />)}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <div className={`text-6xl mb-4`}>🔍</div>
            <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>لم يتم العثور على مشاريع</h3>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>جرب البحث بكلمات مختلفة أو اختر تصنيفاً آخر</p>
          </div>
        )}
      </div>
    </div>
  );







  // ------------- فحص الاقتراب من الانتهاء (ينفذ عند التحميل وأيضًا عند تغيير المشاريع) -------------
  // ------------- فحص الاقتراب من الانتهاء (ينفذ مرة واحدة عند التحميل فقط) -------------
  useEffect(() => {
    const checkDeadlines = () => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      // work on copies to avoid multiple setState calls inside loops
      const updatedUsers = users.map(u => ({ ...u }));
      let hasChanges = false;

      const updatedProjects = projects.map(p => {
        if (!p.daysLeft && p.daysLeft !== 0) return p;
        if (p.daysLeft <= 3) {
          const alreadyNotified = p.deadlineNotifiedFor || [];
          const toNotify = [...(p.backersList || [])];
          const ownerUser = users.find(u => u.name === p.owner);
          if (ownerUser) toNotify.push(ownerUser.id);

          const newNotificationsForThisProject = [];
          toNotify.forEach(uid => {
            if (!alreadyNotified.includes(uid)) {
              // add notification to the copied users array
              const idx = updatedUsers.findIndex(uu => uu.id === uid);
              if (idx !== -1) {
                const note = {
                  id: Date.now() + Math.floor(Math.random() * 1000),
                  icon: '⏳',
                  title: '⏳ اقتراب انتهاء المشروع',
                  message: `مشروع "${p.title}" سينتهي خلال ${p.daysLeft} يوم${p.daysLeft > 1 ? 'ات' : ''}.`,
                  link: { view: 'project-details', projectId: p.id },
                  read: false
                };
                updatedUsers[idx].notifications = [note, ...(updatedUsers[idx].notifications || [])];
              }
              newNotificationsForThisProject.push(uid);
            }
          });

          if (newNotificationsForThisProject.length > 0) {
            hasChanges = true;
            return { ...p, deadlineNotifiedFor: [...alreadyNotified, ...newNotificationsForThisProject] };
          }
        }
        return p;
      });

      if (hasChanges) {
        // write users and projects once to avoid repeated setState inside loops
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        setProjects(updatedProjects);
        const localProjects = updatedProjects.filter(pr => !initialProjects.find(ip => ip.id === pr.id));
        localStorage.setItem('localProjects', JSON.stringify(localProjects));

        // update currentUser once if it changed
        if (currentUser) {
          const updatedCurrent = updatedUsers.find(u => u.id === currentUser.id);
          if (updatedCurrent) {
            setCurrentUser(updatedCurrent);
            localStorage.setItem('currentUser', JSON.stringify(updatedCurrent));
          }
        }
      }
    };

    // نفّذ الفحص مرة واحدة فقط عند التحميل
    const timer = setTimeout(() => {
      checkDeadlines();
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // مصفوفة فارغة = ينفذ مرة واحدة فقط

  // ------------- صفحة خطط الاشتراك الجديدة (Subscription Plans) -----------
  const SubscriptionPlanPage = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('credit-card');
    const [showPaymentForm, setShowPaymentForm] = useState(false);

    const plans = [
      {
        id: 'basic',
        name: 'Basic Plan',
        duration: '30 يوم',
        price: '4.99',
        color: 'from-gray-500 to-gray-600',
        features: [
          '✅ لوحة تحكم كاملة',
          '✅ إنشاء مشروع واحد',
          '✅ الوصول لـ 10 عملاء',
          '✅ 50 طلب API',
          '❌ دعم فني محدود',
          '❌ لا توجد تحليلات متقدمة'
        ],
        popular: false
      },
      {
        id: 'pro',
        name: 'Pro Plan',
        duration: '30 يوم',
        price: '9.99',
        color: 'from-blue-500 to-blue-600',
        features: [
          '✅ لوحة تحكم كاملة',
          '✅ إنشاء 5 مشاريع',
          '✅ الوصول لـ 50 عميل',
          '✅ 500 طلب API',
          '✅ دعم فني أساسي',
          '❌ لا توجد تحليلات متقدمة'
        ],
        popular: true
      },
      {
        id: 'premium',
        name: 'Premium Plan',
        duration: '30 يوم',
        price: '19.99',
        color: 'from-purple-500 to-purple-600',
        features: [
          '✅ لوحة تحكم متقدمة',
          '✅ مشاريع غير محدودة',
          '✅ الوصول لـ 500 عميل',
          '✅ 5000 طلب API',
          '✅ دعم فني 24/7',
          '✅ تحليلات متقدمة'
        ],
        popular: false
      }
    ];

    const handleSelectPlan = (plan) => {
      setSelectedPlan(plan);
      setShowPaymentForm(true);
    };

    const handleSubscription = () => {
      if (!selectedPlan) {
        alert('اختر خطة اشتراك أولاً');
        return;
      }

      // إنشاء subscription record بصيغة Admin compatible
      const today = new Date();
      const startDateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // حساب تاريخ الانتهاء (شهر واحد)
      const expiryDate = new Date(today);
      expiryDate.setMonth(expiryDate.getMonth() + 1);
      const expiryDateStr = expiryDate.toISOString().split('T')[0]; // YYYY-MM-DD format

      const updatedUser = {
        ...currentUser,
        subscription: {
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          price: selectedPlan.price,
          duration: selectedPlan.duration,
          startDate: today.toISOString(),
          endDate: expiryDate.toISOString(),
          status: 'active',
          paymentMethod: paymentMethod,
          autoRenew: true
        }
      };

      // احفظ البيانات
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);

      // احفظ الاشتراك في قائمة الاشتراكات مع نفس صيغة Admin
      const subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
      
      // البحث عن اشتراك قديم لنفس المستخدم وحذفه
      const existingSubscriptionIndex = subscriptions.findIndex(s => s.userId == currentUser.id);
      
      const newSubscription = {
        id: existingSubscriptionIndex >= 0 ? subscriptions[existingSubscriptionIndex].id : subscriptions.length + 1,
        userId: currentUser.id,
        userName: currentUser.name || currentUser.fullName || 'Unknown',
        userEmail: currentUser.email || 'N/A',
        plan: selectedPlan.id, // basic, pro, or premium
        startDate: startDateStr,
        expiryDate: expiryDateStr
      };
      
      // تحديث الاشتراك القديم أو إضافة اشتراك جديد
      if (existingSubscriptionIndex >= 0) {
        subscriptions[existingSubscriptionIndex] = newSubscription;
      } else {
        subscriptions.push(newSubscription);
      }
      
      localStorage.setItem('subscriptions', JSON.stringify(subscriptions));

      // إرسال event لتحديث Admin Dashboard
      window.dispatchEvent(new Event('subscriptionsUpdated'));

      alert(`✅ تم الاشتراك في ${selectedPlan.name} بنجاح!`);
      setView('home');
    };

    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'} py-12`}>
        {/* زر العودة */}
        <div className="absolute top-6 right-6 z-10">
          <button
            onClick={() => setView('home')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
              }`}
          >
            ← العودة
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          {/* العنوان */}
          <div className="text-center mb-16">
            <h1 className={`text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              اختر خطة اشتراك
            </h1>
            <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              ابدأ رحلتك كصاحب مشروع اليوم
            </p>
          </div>

          {/* البطاقات */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative p-8 rounded-2xl transition-all ${selectedPlan?.id === plan.id
                  ? `ring-2 ring-offset-2 ${darkMode ? 'ring-offset-gray-900 ring-blue-500' : 'ring-offset-white ring-blue-500'} scale-105`
                  : ''
                  } ${darkMode
                    ? `bg-gray-800 ${plan.popular ? 'border-2 border-purple-500' : 'border border-gray-700'}`
                    : `bg-white ${plan.popular ? 'shadow-2xl' : 'shadow-lg'}`
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 right-8 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                    ⭐ الأكثر شيوعاً
                  </div>
                )}

                {/* العنوان والسعر */}
                <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {plan.duration}
                </p>

                {/* السعر */}
                <div className="mb-8">
                  <span className={`text-5xl font-black bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                    {plan.price}
                  </span>
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {' '}$
                  </span>
                </div>

                {/* الميزات */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* الزر */}
                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-3 rounded-lg font-bold transition-all ${selectedPlan?.id === plan.id
                    ? `bg-gradient-to-r ${plan.color} text-white`
                    : `${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`
                    }`}
                >
                  {selectedPlan?.id === plan.id ? '✓ محدد' : 'اختر'}
                </button>
              </div>
            ))}
          </div>

          {/* نموذج الدفع */}
          {showPaymentForm && selectedPlan && (
            <div className={`max-w-2xl mx-auto p-8 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}>
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                📋 إتمام العملية الشرائية
              </h2>

              {/* ملخص الطلب */}
              <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex justify-between mb-2">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>الخطة:</span>
                  <span className="font-bold">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>السعر:</span>
                  <span className="font-bold text-lg text-green-500">${selectedPlan.price}/شهر</span>
                </div>
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>المدة:</span>
                  <span className="font-bold">{selectedPlan.duration}</span>
                </div>
              </div>

              {/* طرق الدفع */}
              <div className="mb-6">
                <label className={`block mb-4 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  🏦 طريقة الدفع:
                </label>
                <div className="space-y-3">
                  {[
                    { id: 'credit-card', label: 'بطاقة ائتمان', icon: '' },
                    { id: 'debit-card', label: ' بطاقة باقة', icon: '' },
                    { id: 'paypal', label: ' PayPal', icon: '' },
                    { id: 'apple-pay', label: ' Apple Pay', icon: '' },
                    { id: 'google-pay', label: ' Google Pay', icon: '' },
                    { id: 'bank-transfer', label: ' تحويل بنكي', icon: '' }
                  ].map((method) => (
                    <label key={method.id} className={`flex items-center p-3 rounded-lg cursor-pointer transition-all border-2 ${paymentMethod === method.id
                      ? darkMode ? 'border-blue-500 bg-blue-500/10' : 'border-blue-500 bg-blue-50'
                      : darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="ml-3 cursor-pointer"
                      />
                      <span className="text-lg mr-2">{method.icon}</span>
                      <span className="font-semibold">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* أزرار الإجراء */}
              <div className="flex gap-4">
                <button
                  onClick={handleSubscription}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all transform hover:scale-105"
                >
                  ✓ تأكيد الاشتراك
                </button>
                <button
                  onClick={() => {
                    setShowPaymentForm(false);
                    setSelectedPlan(null);
                  }}
                  className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${darkMode
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    }`}
                >
                  ✕ إلغاء
                </button>
              </div>

              {/* شروط الخدمة */}
              <p className={`text-center mt-6 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                بالاشتراك، فإنك توافق على <span className="text-blue-500 cursor-pointer hover:underline">شروط الخدمة</span> و <span className="text-blue-500 cursor-pointer hover:underline">سياسة الخصوصية</span>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ------------- التجميع النهائي للعرض -------------
  return (
    <div className={`${darkMode ? 'dark' : ''}`} style={{ fontFamily: 'Cairo, sans-serif' }}>
      {/* شريط تديبوج مخفي */}
      <button
        onClick={() => setShowAdminDebug(!showAdminDebug)}
        className="fixed bottom-4 right-4 z-40 w-10 h-10 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center font-bold text-sm"
        title="Click to toggle debug"
      >
        🔧
      </button>
      
      {showAdminDebug && (
        <div className={`fixed bottom-16 right-4 z-40 p-4 rounded-lg shadow-xl max-w-xs ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} border-2 border-purple-600`}>
          <p className="text-sm mb-3">📊 <strong>حالة التطبيق:</strong></p>
          <p className="text-xs mb-2">👤 المستخدم: {currentUser ? `${currentUser.name} (${currentUser.type})` : 'لا أحد'}</p>
          <p className="text-xs mb-3">📄 الصفحة الحالية: {view}</p>
          <button
            onClick={quickAdminLogin}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-xs font-bold mb-2"
          >
            🔓 فتح صفحة دخول المسؤول
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-xs font-bold"
          >
            🔄 مسح البيانات وتحديث
          </button>
        </div>
      )}
      
      {view !== 'login' && view !== 'subscription-plan' && view !== 'admin' && <Navbar darkMode={darkMode} setDarkMode={setDarkMode} currentUser={currentUser} setCurrentUser={setCurrentUser} view={view} setView={setView} favorites={favorites} />}

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLogin={handleLoginModalSubmit} 
        onAdminLogin={() => {
          setIsLoginModalOpen(false);
          setIsAdminLoginPage(true);
        }}
        darkMode={darkMode} 
      />

      {view === 'login' && <LoginPage />}
      {isAdminLoginPage && <AdminLoginPage />}
      {view === 'subscription-plan' && <SubscriptionPlanPage />}
      {view === 'admin' && <AdminDashboard darkMode={darkMode} currentUser={currentUser} setCurrentUser={setCurrentUser} setView={setView} />}
      {view === 'home' && !currentUser && <LandingPage />}
      {view === 'home' && currentUser && <HomePage />}
      {view === 'projects' && <HomePage />}
      {view === 'about' && <AboutPage />}
      {view === 'favorites' && currentUser && <FavoritesPage />}
      {view === 'dashboard' && currentUser?.type === 'owner' && <DashboardPage />}
      {view === 'project-details' && <ProjectDetails />}
      {view === 'add-project' && currentUser?.type === 'owner' && <AddProjectPage />}
      {view === 'settings' && currentUser && <UserSettingsPage />}
      {view === 'notifications' && currentUser && <NotificationsPage />}
      {view === 'donations-history' && currentUser && <DonationsHistoryPage />}
      {view === 'wallet' && currentUser && <WalletPage />}
      {view === 'chat' && currentUser && <ChatPage />}
    </div>
  );
};

export default App;
