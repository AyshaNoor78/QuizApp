import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminRoute from './components/layout/AdminRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SubjectDetailPage from './pages/SubjectDetailPage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import SubscriptionPage from './pages/SubscriptionPage';
import ProfilePage from './pages/ProfilePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminQuestions from './pages/admin/AdminQuestions';
import AdminUsers from './pages/admin/AdminUsers';
import AdminImport from './pages/admin/AdminImport';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/subjects/:id" element={<SubjectDetailPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/quiz/:sessionId" element={<QuizPage />} />
            <Route path="/quiz/:sessionId/result" element={<ResultPage />} />
            <Route path="/subscribe" element={<SubscriptionPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            
            <Route path="/admin" element={<AdminRoute />}>
              <Route index element={<AdminDashboard />} />
              <Route path="questions" element={<AdminQuestions />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="import" element={<AdminImport />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
