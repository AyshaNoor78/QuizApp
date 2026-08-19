import React, { useState } from 'react';
import { adminApi } from '../../api/admin.api';
import toast from 'react-hot-toast';
import { UploadCloud } from 'lucide-react';

const AdminImport: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      await adminApi.importQuestions(file);
      toast.success('Questions imported successfully');
      setFile(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to import questions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Import Questions</h1>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-xl text-center">
        <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <UploadCloud className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold mb-2">Upload CSV/JSON</h2>
        <p className="text-sm text-gray-500 mb-6">File must contain sectionId, question text, options, and difficulty.</p>
        
        <input 
          type="file" 
          accept=".csv,.json"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 mb-6"
        />

        <button 
          onClick={handleUpload}
          disabled={!file || loading}
          className="px-6 py-2 bg-primary-600 text-white font-bold rounded-lg disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Confirm Import'}
        </button>
      </div>
    </div>
  );
};

export default AdminImport;
