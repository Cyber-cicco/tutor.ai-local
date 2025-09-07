import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DocumentIcon } from '../svg/DocumentIcon';
import { ClockIcon } from '../svg/ClockIcon';
import { CrossIcon } from '../svg/CrossIcon';
import { ListIcon } from '../svg/ListIcon';
import type { CourseMetadata } from '../../models/list';

interface CourseListSidebarProps {
  courses: CourseMetadata[];
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  sidebarExpanded: boolean;
  onSidebarExpandedChange: (expanded: boolean) => void;
}

export const CourseListSidebar: React.FC<CourseListSidebarProps> = ({
  courses,
  isOpen,
  onToggle,
  onClose,
  sidebarExpanded,
  onSidebarExpandedChange
}) => {
  const navigate = useNavigate();

  const navigateToCourse = (courseId: string) => {
    navigate(`/course?id=${courseId}`);
    onClose(); // Close mobile sidebar after navigation
  };

  const toggleSidebarSize = () => {
    onSidebarExpandedChange(!sidebarExpanded);
  };

  if (courses.length === 0) {
    return null;
  }

  return (
    <>
      {/* Mobile sidebar toggle - positioned below navbar */}
      <div className="lg:hidden fixed top-20 left-4 z-40">
        <button
          onClick={onToggle}
          className="bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors hover:cursor-pointer"
        >
          {isOpen ? <CrossIcon className="h-5 w-5" /> : <ListIcon className="h-5 w-5" />}
        </button>
      </div>

      {/* Desktop sidebar - positioned below navbar with higher z-index */}
      <aside 
        className={`hidden lg:block fixed left-0 top-16 bg-white/10 backdrop-blur-sm border-r overflow-y-auto border-gray-200/50 h-[calc(100vh-4rem)] z-[60] transition-all duration-300 ease-in-out ${
          sidebarExpanded ? 'w-80' : 'w-12 overflow-hidden'
        }`}
      >
        {/* Content wrapper - handles the opacity transition */}
        <div className={`transition-opacity duration-300 ${sidebarExpanded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="p-6 border-b border-gray-200/50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <DocumentIcon className="h-6 w-6 mr-2 text-blue-600" />
              Mes Cours
            </h2>
          </div>
          
          <div className="p-4 space-y-3 overflow-y-auto pb-20">
            {courses.map((course) => (
              <div
                key={course.id}
                onClick={() => navigateToCourse(course.id)}
                className="bg-white/80 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:cursor-pointer border border-gray-200/70 hover:border-blue-300 p-4"
              >
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm">
                  {course.name}
                </h3>
                <div className="flex items-center text-xs text-gray-500 mb-3">
                  <ClockIcon className="h-3 w-3 mr-1" />
                  <span>{new Date(course.updatedAt).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-full inline-block">
                  Continuer
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Toggle button - positioned at the right edge of the sidebar */}
        <button
          onClick={toggleSidebarSize}
          className={`absolute top-4 right-2 h-8 w-8 bg-white rounded-md border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:text-blue-600 hover:cursor-pointer focus:outline-none transition-all duration-300 ${
            !sidebarExpanded ? 'opacity-100' : ''
          }`}
          aria-expanded={sidebarExpanded}
          aria-label={sidebarExpanded ? "Réduire la sidebar" : "Étendre la sidebar"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transform transition-transform duration-300 ${
              sidebarExpanded ? '' : 'rotate-180'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </aside>

      {/* Mobile sidebar overlay - positioned below navbar */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-50 bg-black/50" onClick={onClose}>
          <aside className="w-80 bg-white h-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <DocumentIcon className="h-6 w-6 mr-2 text-blue-600" />
                Mes Cours
              </h2>
            </div>
            <div className="p-4 space-y-3 h-full overflow-y-auto pb-20">
              {courses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => navigateToCourse(course.id)}
                  className="bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors hover:cursor-pointer border border-gray-200 p-4"
                >
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm">
                    {course.name}
                  </h3>
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    <span>{new Date(course.updatedAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-full inline-block">
                    Continuer
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
