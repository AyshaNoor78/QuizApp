import React from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState';
import { BookOpen } from 'lucide-react';

const AdminQuestions: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manage Questions</h1>
        <Link to="/admin/import" className="px-4 py-2 bg-primary-600 text-white rounded-lg font-bold text-sm">
          Import Questions
        </Link>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <EmptyState 
          icon={BookOpen} 
          title="Question Management" 
          description="Select a subject and chapter to view questions, or use the import tool to add them in bulk." 
        />
      </div>
    </div>
  );
};

export default AdminQuestions;
