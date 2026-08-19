import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';
import { AdminStats } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Users, BookOpen, Crown, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-20"><LoadingSpinner /></div>;
  if (!stats) return null;

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Active Subscribers', value: stats.activeSubscribers, icon: Crown, color: 'text-amber-500', bg: 'bg-amber-50' },
    { title: 'Total Questions', value: stats.totalQuestions, icon: BookOpen, color: 'text-primary-500', bg: 'bg-primary-50' },
    { title: 'SMS Sent Today', value: stats.smsSentToday, icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className={`w-10 h-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-gray-500 text-sm font-medium">{s.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{s.value.toLocaleString()}</h3>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <Link to="/admin/users" className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 font-bold hover:border-primary-500 transition-colors">
          Manage Users
        </Link>
        <Link to="/admin/questions" className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 font-bold hover:border-primary-500 transition-colors">
          Manage Questions
        </Link>
        <Link to="/admin/import" className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 font-bold hover:border-primary-500 transition-colors">
          Import Questions
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
