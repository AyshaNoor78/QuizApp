import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Subject } from '../../types';

interface Props {
  subject: Subject;
}

const SubjectCard: React.FC<Props> = ({ subject }) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const name = lang === 'en' ? subject.nameEn : subject.nameBn;
  const desc = lang === 'en' ? subject.descriptionEn : subject.descriptionBn;

  return (
    <Link
      to={`/subjects/${subject.id}`}
      className="group relative flex flex-col bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all duration-200 overflow-hidden"
    >
      <div 
        className="absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 group-hover:w-2"
        style={{ backgroundColor: subject.color || '#10b981' }}
      />
      <div className="flex items-start gap-4">
        <div className="text-4xl bg-gray-50 p-2 rounded-xl group-hover:scale-110 transition-transform">
          {subject.icon || '📚'}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">
            {name}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {desc}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default SubjectCard;
