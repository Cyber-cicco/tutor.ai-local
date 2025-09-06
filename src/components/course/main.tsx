import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CourseHeader } from './header';
import { CourseContent } from './content';
import { QCMComponent } from './qcm';
import { PracticeComponent } from './practise';
import { useCoursePersistence } from '../../hooks/course.persistence';
import { DocumentIcon } from '../svg/DocumentIcon';
import { CheckmarkIcon } from '../svg/CheckmarkIcon';
import { ChevronDownIcon } from '../svg/ChevronDownIcon';
import { ListIcon } from '../svg/ListIcon';
import { ClockIcon } from '../svg/ClockIcon';
import type { Course } from '../../models/course';

export const CoursePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getCourse } = useCoursePersistence();
  
  const courseId = searchParams.get('id');
  const moduleIndex = parseInt(searchParams.get('module') || '0');
  
  const [course, setCourse] = useState<Course | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(new Set());
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load course data
  useEffect(() => {
    if (!courseId) {
      navigate('/home');
      return;
    }

    const result = getCourse(courseId);
    if (result.isOk()) {
      setCourse(result.value.course);
      
      // Load completed exercises from localStorage
      const savedCompleted = localStorage.getItem(`completed-exercises-${courseId}`);
      if (savedCompleted) {
        setCompletedExercises(new Set(JSON.parse(savedCompleted)));
      }
    } else {
      console.error(result.error)
      setError('Cours introuvable');
    }
    setLoading(false);
  }, [courseId, getCourse, navigate]);

  // Save completed exercises to localStorage
  useEffect(() => {
    if (courseId && completedExercises.size > 0) {
      localStorage.setItem(`completed-exercises-${courseId}`, JSON.stringify(Array.from(completedExercises)));
    }
  }, [completedExercises, courseId]);

  const handleModuleChange = (newModuleIndex: number) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('module', newModuleIndex.toString());
      return newParams;
    });
  };

  const toggleExercise = (exerciseKey: string) => {
    setExpandedExercises(prev => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseKey)) {
        newSet.delete(exerciseKey);
      } else {
        newSet.add(exerciseKey);
      }
      return newSet;
    });
  };

  const toggleExerciseCompleted = (exerciseKey: string) => {
    setCompletedExercises(prev => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseKey)) {
        newSet.delete(exerciseKey);
      } else {
        newSet.add(exerciseKey);
      }
      return newSet;
    });
  };

  const getProgressPercentage = () => {
    if (!course) return 0;
    const totalExercises = course.modules.reduce((total, module) => 
      total + (module.exercises ? module.exercises.length : 0), 0
    );
    return totalExercises > 0 ? Math.round((completedExercises.size / totalExercises) * 100) : 0;
  };

  const getModuleProgress = (moduleIndex: number) => {
    if (!course) return 0;
    const module = course.modules[moduleIndex];
    if (!module.exercises || module.exercises.length === 0) return 100;
    
    const moduleCompleted = module.exercises.filter((_, exIndex) => 
      completedExercises.has(`${moduleIndex}-${exIndex}`)
    ).length;
    
    return Math.round((moduleCompleted / module.exercises.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white/0 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du cours...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-white/0 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <DocumentIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Cours introuvable</h2>
          <p className="text-gray-600 mb-6">{error || 'Le cours demandé n\'existe pas ou n\'a pas pu être chargé.'}</p>
          <button
            onClick={() => navigate('/home')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors hover:cursor-pointer"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const currentModule = course.modules[moduleIndex];
  const progress = getProgressPercentage();

  return (
    <div className="bg-white/0 min-h-screen">
      <CourseHeader 
        course={course}
        progress={progress}
        onBackToCourseList={() => navigate('/home')}
      />

      <div className="flex">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 bg-white shadow-lg lg:shadow-none border-r border-gray-200
          transition-all duration-300 lg:transition-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${sidebarExpanded ? 'w-80' : 'w-12 lg:w-12'}
        `}>
          <div className="h-full flex flex-col">
            {/* Sidebar header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              {sidebarExpanded && (
                <h2 className="font-semibold text-gray-900">Modules du cours</h2>
              )}
              <button
                onClick={() => setSidebarExpanded(!sidebarExpanded)}
                className="p-1 text-gray-500 hover:text-gray-700 hover:cursor-pointer hidden lg:block"
              >
                <ListIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Module list */}
            <nav className="flex-1 overflow-y-auto p-2">
              {course.modules.map((module, index) => {
                const moduleProgress = getModuleProgress(index);
                const isActive = moduleIndex === index;
                
                return (
                  <button
                    key={index}
                    onClick={() => {
                      handleModuleChange(index);
                      setSidebarOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors mb-2 hover:cursor-pointer ${
                      isActive
                        ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-600'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {sidebarExpanded ? (
                      <div>
                        <div className="font-medium text-sm mb-1">
                          Module {index + 1}
                        </div>
                        <div className="text-xs text-gray-600 leading-tight mb-2">
                          {module.title}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <ClockIcon className="h-3 w-3" />
                            <span className="text-xs">
                              {module.exercises ? module.exercises.length : 0} exercices
                            </span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            moduleProgress === 100 
                              ? 'bg-gold-100 text-gold-800'
                              : moduleProgress > 0
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {moduleProgress}%
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="text-sm font-medium">{index + 1}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main content */}
        <main className={`flex-1 transition-all duration-300 ${
          sidebarExpanded ? 'lg:ml-0' : 'lg:ml-0'
        }`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Mobile menu button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors hover:cursor-pointer"
              >
                <ListIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Module content */}
            <CourseContent module={currentModule} />

            {/* Exercises */}
            {currentModule.exercises && currentModule.exercises.length > 0 && (
              <div className="mt-8 bg-gray-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CheckmarkIcon className="h-6 w-6 text-blue-600" />
                  Exercices pratiques
                </h3>
                
                <div className="space-y-6">
                  {currentModule.exercises.map((exercise, exerciseIndex) => {
                    const exerciseKey = `${moduleIndex}-${exerciseIndex}`;
                    const isExpanded = expandedExercises.has(exerciseKey);
                    const isCompleted = completedExercises.has(exerciseKey);

                    return (
                      <div key={exerciseIndex} className="bg-white rounded-lg shadow-sm border">
                        <div 
                          className="p-4 cursor-pointer hover:bg-gray-50 transition-colors hover:cursor-pointer"
                          onClick={() => toggleExercise(exerciseKey)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <ChevronDownIcon 
                                className={`h-5 w-5 text-gray-500 transition-transform ${
                                  isExpanded ? 'rotate-0' : '-rotate-90'
                                }`}
                              />
                              <h4 className="font-medium text-gray-900">
                                Exercice {exerciseIndex + 1}
                              </h4>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                exercise.type === 'PRACTICE' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                              </span>
                            </div>
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              isCompleted
                                ? 'bg-gold-500 border-gold-500'
                                : 'border-gray-300'
                            }`}>
                              {isCompleted && (
                                <CheckmarkIcon className="h-3 w-3 text-white m-0.5" />
                              )}
                            </div>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="border-t bg-gray-50 p-4">
                            {'questions' in exercise ? (
                              <QCMComponent
                                qcm={exercise}
                                isCompleted={isCompleted}
                                onToggleCompleted={() => toggleExerciseCompleted(exerciseKey)}
                              />
                            ) : (
                              <PracticeComponent
                                practice={exercise}
                                isCompleted={isCompleted}
                                onToggleCompleted={() => toggleExerciseCompleted(exerciseKey)}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => handleModuleChange(Math.max(0, moduleIndex - 1))}
                disabled={moduleIndex === 0}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:cursor-pointer"
              >
                ← Module précédent
              </button>
              <button
                onClick={() => handleModuleChange(Math.min(course.modules.length - 1, moduleIndex + 1))}
                disabled={moduleIndex === course.modules.length - 1}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg hover:from-blue-700 hover:to-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:cursor-pointer"
              >
                Module suivant →
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
