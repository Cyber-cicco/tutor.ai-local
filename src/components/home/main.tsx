import React, { useEffect, useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useNavigate } from 'react-router-dom';
import { useCoursePersistence } from "../../hooks/course.persistence";
import type { Course } from "../../models/course";
import { DocumentIcon } from '../svg/DocumentIcon';
import { AddIcon } from '../svg/AddIcon';
import { ClockIcon } from '../svg/ClockIcon';
import { CopyIcon } from '../svg/CopyIcon';
import { Button } from '../common/button';
import { CourseListSidebar } from './course-list-sidebar';

export const HomePage: React.FC = () => {
  const { persistCourse, getCourseList } = useCoursePersistence();
  const navigate = useNavigate();
  const [systemPrompt, setSystemPrompt] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  // Get existing courses
  const courseListResult = getCourseList();
  const existingCourses = courseListResult.isOk() ? courseListResult.value : [];

  // Load system prompt on component mount
  useEffect(() => {
    const loadSystemPrompt = async () => {
      try {
        const response = await fetch('/src/assets/prompt.txt');
        const text = await response.text();
        setSystemPrompt(text);
      } catch (error) {
        console.error('Error loading system prompt:', error);
      }
    };
    loadSystemPrompt();
  }, []);

  // Form for course JSON input
  const courseForm = useForm({
    defaultValues: {
      courseJson: '',
    },
    onSubmit: async ({ value }) => {
      try {
        const parsedCourse: Course = JSON.parse(value.courseJson);
        const result = await persistCourse(parsedCourse);

        if (result.isOk()) {
          navigate(`/course?id=${result.value}`);
        }
      } catch (error) {
        console.error('Error parsing course JSON:', error);
        alert('Erreur: Le JSON fourni n\'est pas valide');
      }
    },
  });

  // Form for prompt input
  const promptForm = useForm({
    defaultValues: {
      instruction: '',
    },
    onSubmit: async ({ value }) => {
      if (!systemPrompt) {
        alert('Erreur: Le prompt système n\'a pas pu être chargé');
        return;
      }

      if (!value.instruction.trim()) {
        alert('Veuillez saisir une instruction pour votre cours');
        return;
      }

      // Generate the complete prompt by inserting user instruction into the system prompt
      const completePrompt = systemPrompt.replace(
        '<instructions>\n  // the user instructions\n</instructions>',
        `<instructions>\n${value.instruction}\n</instructions>`
      );

      // Copy prompt to clipboard
      try {
        await navigator.clipboard.writeText(completePrompt);
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        alert('Erreur lors de la copie. Voici le prompt:\n\n' + completePrompt);
      }
    },
  });

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  }; const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  // Calculate the margin for main content based on sidebar state
  const getMainContentMargin = () => {
    if (existingCourses.length === 0) return '';
    return sidebarExpanded ? 'lg:ml-80' : 'lg:ml-12';
  };

  return (
    <div className="bg-white/0 min-h-screen">
      <div className="flex">
        {/* Sidebar */}
        <CourseListSidebar
          courses={existingCourses}
          isOpen={sidebarOpen}
          onToggle={handleSidebarToggle}
          onClose={handleSidebarClose}
          sidebarExpanded={sidebarExpanded}
          onSidebarExpandedChange={setSidebarExpanded}
        />

        {/* Main Content - Adapts to sidebar width */}
        <main className={`flex-1 transition-all duration-300 ${getMainContentMargin()}`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <section className='min-h-screen'>
              {/* Course Generation Section */}
              <div className="bg-white/10 bg-blur rounded-2xl shadow-xl overflow-hidden mb-8">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Choisissez le thème de votre cours</h2>

                  <div className="space-y-6">
                    <promptForm.Field
                      name="instruction"
                      children={(field) => (
                        <div>
                          <input
                            type='text'
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-full bg-white/20 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            placeholder="Crée un cours pour les débutants sur les fonctions dérivées"
                          />
                          {field.state.meta.errors.length > 0 && (
                            <p className="mt-2 text-sm text-red-600">
                              {field.state.meta.errors[0]}
                            </p>
                          )}
                        </div>
                      )}
                    />

                    <div className='flex justify-center'>
                      <promptForm.Subscribe
                        selector={(state) => [state.canSubmit, state.isSubmitting]}
                        children={([canSubmit, isSubmitting]) => (
                          <Button
                            type="submit"
                            model='base'
                            size='long'
                            onClick={promptForm.handleSubmit}
                            isDisabled={!canSubmit || isSubmitting || !systemPrompt}
                          >
                            <CopyIcon className="h-5 w-5 mr-2" />
                            {isSubmitting ? 'Copie en cours...' : 'Copier le prompt pour envoyer au LLM'}
                          </Button>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Course JSON Input Section */}
              <div className="bg-white/10 bg-blur rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-3">
                        Copiez votre cours correctement formaté ici.
                      </label>
                      <courseForm.Field
                        name="courseJson"
                        children={(field) => (
                          <div>
                            <textarea
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                              className="w-full bg-white/20 h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                              placeholder="Collez ici le JSON de votre cours..."
                            />
                            {field.state.meta.errors.length > 0 && (
                              <p className="mt-2 text-sm text-red-600">
                                {field.state.meta.errors[0]}
                              </p>
                            )}
                          </div>
                        )}
                      />
                    </div>

                    <div className='flex justify-center'>
                      <courseForm.Subscribe
                        selector={(state) => [state.canSubmit, state.isSubmitting]}
                        children={([canSubmit, isSubmitting]) => (
                          <Button
                            type="submit"
                            model='base'
                            size='long'
                            onClick={courseForm.handleSubmit}
                            isDisabled={!canSubmit || isSubmitting}
                          >
                            {isSubmitting ? 'Création en cours...' : 'Créer le Cours'}
                          </Button>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

            </section>

            {/* How It Works Section */}
            <section className="mb-12 bg-white/20 p-8 rounded-lg">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Comment ça marche ?</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  AI Learning transforme vos contenus en expériences d'apprentissage interactives et personnalisées
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Créez ou Importez</h3>
                  <p className="text-gray-600">
                    Collez votre contenu JSON ou utilisez notre générateur IA pour créer un cours sur mesure
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-orange-600">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Apprenez Interactivement</h3>
                  <p className="text-gray-600">
                    Suivez des modules progressifs avec des exercices pratiques et des corrections détaillées
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-gold-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-gold-600">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Progressez à Votre Rythme</h3>
                  <p className="text-gray-600">
                    Suivez votre progression, reprenez où vous vous êtes arrêté, maîtrisez à votre tempo
                  </p>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="bg-white/20 rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Pourquoi AI Learning ?</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <DocumentIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Apprentissage Autonome</h3>
                    <p className="text-gray-600">
                      Apprenez tout ce que vous voulez, quand vous voulez, sans professeur
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <ClockIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">À Votre Rythme</h3>
                    <p className="text-gray-600">
                      Progressez selon votre emploi du temps et vos capacités d'apprentissage
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-gold-100 p-3 rounded-lg">
                    <AddIcon className="h-6 w-6 text-gold-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Contenu Illimité</h3>
                    <p className="text-gray-600">
                      Créez des cours sur n'importe quel sujet grâce à l'intelligence artificielle
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <DocumentIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Exercices Pratiques</h3>
                    <p className="text-gray-600">
                      Validez vos connaissances avec des QCM et exercices pratiques intégrés
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};
