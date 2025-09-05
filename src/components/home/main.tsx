// src/components/home/main.tsx
import React from 'react';
import { useForm } from '@tanstack/react-form';
import { useNavigate } from 'react-router-dom';
import { useCoursePersistence } from "../../hooks/course.persistence";
import type { Course } from "../../models/course";
import { DocumentIcon } from '../svg/DocumentIcon';
import { AddIcon } from '../svg/AddIcon';
import { ClockIcon } from '../svg/ClockIcon';

export const HomePage: React.FC = () => {
  const { persistCourse, getCourseList } = useCoursePersistence();
  const navigate = useNavigate();
  
  // Get existing courses
  const courseListResult = getCourseList();
  const existingCourses = courseListResult.isOk() ? courseListResult.value : [];

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
          // Navigate to course page - we need to get the course identifier
          // The persistence returns void, so we need to get the course key
          const courseKey = await import('../../utils/course.utils').then(utils => 
            utils.getCourseKey(parsedCourse)
          );
          
          if (courseKey.isOk()) {
            navigate(`/course?id=${courseKey.value}`);
          }
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
      topic: '',
      level: 'NOVICE' as const,
      language: 'FR' as const,
    },
    onSubmit: async ({ value }) => {
      // Generate the prompt for AI
      const prompt = `Je veux apprendre: ${value.topic}
Niveau: ${value.level}
Langue: ${value.language}

Crée-moi un cours interactif complet sur ce sujet en suivant exactement le format JSON spécifié dans les guidelines.`;
      
      // Copy prompt to clipboard
      try {
        await navigator.clipboard.writeText(prompt);
        alert('Prompt copié dans le presse-papier! Collez-le dans votre IA favorite.');
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        alert('Erreur lors de la copie. Voici le prompt:\n\n' + prompt);
      }
    },
  });

  const navigateToCourse = (courseId: string) => {
    navigate(`/course?id=${courseId}`);
  };

  return (
    <div className="max-w-7xl bg-white mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Existing Courses Section */}
      {existingCourses.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Mes Cours</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {existingCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => navigateToCourse(course.id)}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:cursor-pointer border border-gray-200 hover:border-blue-300 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {course.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span>Mis à jour le {new Date(course.updatedAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  <DocumentIcon className="h-8 w-8 text-blue-600 flex-shrink-0" />
                </div>
                <div className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-full inline-block">
                  Continuer le cours
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main Course Creation Section */}
      <section className="mb-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-gold-600 to-gold-700 text-white p-8">
            <div className="flex items-center space-x-4 mb-4">
              <AddIcon className="h-12 w-12" />
              <div>
                <h1 className="text-3xl font-bold">Créer un Nouveau Cours</h1>
                <p className="text-gold-100 mt-2">
                  Transformez vos connaissances en cours interactifs personnalisés
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
              <button className="flex-1 text-center py-2 px-4 rounded-md bg-blue-600 text-white font-medium">
                Importer un Cours
              </button>
              <button className="flex-1 text-center py-2 px-4 rounded-md text-gray-600 hover:text-gray-800 hover:cursor-pointer">
                Générer avec IA
              </button>
            </div>

            {/* Course JSON Input */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Contenu du cours (JSON)
                </label>
                <courseForm.Field
                  name="courseJson"
                  children={(field) => (
                    <div>
                      <textarea
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
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

              <courseForm.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <button
                    type="submit"
                    onClick={courseForm.handleSubmit}
                    disabled={!canSubmit || isSubmitting}
                    className="w-full bg-gradient-to-r from-gold-600 to-gold-700 text-white py-4 px-6 rounded-lg hover:from-gold-700 hover:to-gold-800 transition-colors font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
                  >
                    {isSubmitting ? 'Création en cours...' : 'Créer le Cours'}
                  </button>
                )}
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mb-12">
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
      <section className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Pourquoi AI Learning ?</h2>
        
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
  );
};
