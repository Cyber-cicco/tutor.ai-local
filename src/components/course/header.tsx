import React from 'react';
import { BackIcon } from '../svg/BackIcon';
import type { Course } from '../../models/course';

interface CourseHeaderProps {
  course: Course;
  progress: number;
  onBackToCourseList: () => void;
}

export const CourseHeader: React.FC<CourseHeaderProps> = ({ 
  course, 
  progress, 
  onBackToCourseList 
}) => {
  const getLevelColor = (level: string) => {
    switch (level?.toUpperCase()) {
      case 'ABSOLUTE_BEGINNER': 
        return 'bg-green-100 text-green-800 border-green-200';
      case 'NOVICE': 
        return 'bg-green-100 text-green-800 border-green-200';
      case 'JUNIOR': 
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'MID_LEVEL': 
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ADVANCED': 
        return 'bg-red-100 text-red-800 border-red-200';
      case 'EXPERT': 
        return 'bg-red-100 text-red-800 border-red-200';
      default: 
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelDisplayName = (level: string) => {
    switch (level?.toUpperCase()) {
      case 'ABSOLUTE_BEGINNER': return 'Débutant absolu';
      case 'NOVICE': return 'Novice';
      case 'JUNIOR': return 'Débutant';
      case 'MID_LEVEL': return 'Intermédiaire';
      case 'ADVANCED': return 'Avancé';
      case 'EXPERT': return 'Expert';
      default: return level;
    }
  };

  return (
    <div className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBackToCourseList}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors hover:cursor-pointer"
              aria-label="Retour à la liste des cours"
            >
              <BackIcon className="h-5 w-5" />
            </button>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{course.name}</h1>
              <p className="text-gray-600 mt-1">{course.topic}</p>
              {course.author && (
                <p className="text-sm text-gray-500 mt-1">Par {course.author}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <span className={`px-3 py-1 rounded-full border text-sm font-medium ${getLevelColor(course.level)}`}>
              {getLevelDisplayName(course.level)}
            </span>
            
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Progression</div>
              <div className="flex items-center gap-3">
                <div className="w-24 bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      progress === 100 
                        ? 'bg-gradient-to-r from-gold-500 to-gold-600' 
                        : 'bg-gradient-to-r from-blue-500 to-blue-600'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <span className={`text-sm font-medium ${
                  progress === 100 ? 'text-gold-700' : 'text-gray-700'
                }`}>
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
