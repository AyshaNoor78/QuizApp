import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizApi } from '../api/quiz.api';
import { Chapter, Subject } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, PlayCircle, BookX } from 'lucide-react';

const SubjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  
  const [subject, setSubject] = useState<Subject | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchDetails = async () => {
      try {
        const subs = await quizApi.getSubjects();
        const found = subs.find(s => s.id === id);
        if (found) setSubject(found);
        
        const chaps = await quizApi.getChapters(id);
        setChapters(chaps);
        if (chaps.length > 0) setExpandedChapter(chaps[0].id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div className="py-20"><LoadingSpinner /></div>;
  if (!subject) return <EmptyState icon={BookX} title="Subject not found" />;

  const subName = lang === 'en' ? subject.nameEn : subject.nameBn;

  return (
    <div className="space-y-6">
      <div 
        className="rounded-3xl p-6 sm:p-8 text-white shadow-sm"
        style={{ backgroundColor: subject.color || '#10b981' }}
      >
        <div className="text-5xl mb-4 bg-white/20 inline-block p-4 rounded-2xl">
          {subject.icon || '📚'}
        </div>
        <h1 className="text-3xl font-bold mb-2">{subName}</h1>
        <p className="text-white/80 max-w-2xl">
          {lang === 'en' ? subject.descriptionEn : subject.descriptionBn}
        </p>
      </div>

      <div className="space-y-4">
        {chapters.map(chap => {
          const isExpanded = expandedChapter === chap.id;
          const chapName = lang === 'en' ? chap.nameEn : chap.nameBn;
          
          return (
            <div key={chap.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <button
                onClick={() => setExpandedChapter(isExpanded ? null : chap.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-bold text-gray-900 text-lg text-left">{chapName}</h3>
                {isExpanded ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
              </button>
              
              {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50/50 p-3 space-y-2">
                  {chap.sections && chap.sections.length > 0 ? (
                    chap.sections.map(sec => {
                      const secName = lang === 'en' ? sec.nameEn : sec.nameBn;
                      return (
                        <div key={sec.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-primary-200 transition-colors">
                          <div>
                            <h4 className="font-semibold text-gray-800">{secName}</h4>
                            <p className="text-xs text-gray-500 mt-1">{sec.questionCount || 0} Questions</p>
                          </div>
                          <button
                            onClick={() => navigate(`/quiz/start?sectionId=${sec.id}`)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 hover:bg-primary-200 rounded-lg font-bold text-sm transition-colors"
                          >
                            <PlayCircle className="w-4 h-4" /> Start
                          </button>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-sm text-gray-500 p-4 text-center">No sections available.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {chapters.length === 0 && (
          <EmptyState icon={BookX} title="No chapters available" />
        )}
      </div>
    </div>
  );
};

export default SubjectDetailPage;
