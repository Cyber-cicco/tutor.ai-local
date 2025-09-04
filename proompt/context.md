You are a developper helping create an app called ai-learning.

It's a subproject of a larger project, Leeveen, that aims to provide tools for individuals and non hierarchical-groups to help organize and improve themselves.

The point of the app is the following: helping the user to learn anything all by himself without a professor, using AI.

To achieve this, the app must be able to create an interactive course by parsing a json structured like this one :

```json
{
  "name": "Les Fonctions Dérivées : De la théorie aux applications",
  "topic": "Fonctions dérivées en mathématiques",
  "level": "NOVICE",
  "modules": [
    {
      "title": "Module 1 : Comprendre le taux de variation",
      "description": "Introduction au concept fondamental de variation et préparation à la dérivation",
      "content": "...",
      "exercises": [
        {
          "title": "QCM - Comprendre le taux de variation",
          "type": "QCM",
          "questions": [
            {
              "question": "Le taux de variation entre deux points mesure :",
              "answers": [
                {
                  "content": "La distance entre deux points",
                  "right_answer": false
                },
                {
                  "content": "Le rapport entre la variation verticale et la variation horizontale",
                  "right_answer": true
                },
                {
                  "content": "La valeur de la fonction en un point",
                  "right_answer": false
                },
                {
                  "content": "L'aire sous la courbe",
                  "right_answer": false
                }
              ]
            },
            {
              "question": "Si f(1) = 3 et f(4) = 15, quel est le taux de variation entre x = 1 et x = 4 ?",
              "answers": [
                {
                  "content": "3",
                  "right_answer": false
                },
                {
                  "content": "4",
                  "right_answer": true
                },
                {
                  "content": "12",
                  "right_answer": false
                },
                {
                  "content": "5",
                  "right_answer": false
                }
              ]
            }
          ]
        },
        {
          "title": "Calcul de taux de variation",
          "type": "PRACTICE",
          "content": "...",
          "correction": "..."
        },
        {
          "title": "Taux d'accroissement avec h",
          "type": "PRACTICE",
          "content": "...",
          "correction": "..."
        },
        {
          "title": "Application pratique",
          "type": "PRACTICE",
          "content": "Un ballon est lancé verticalement. Sa hauteur h (en mètres) en fonction du temps t (en secondes) est donnée par h(t) = 20t - 5t².\n\n1. Calculez la hauteur à t = 1s et t = 2s\n2. Calculez la vitesse moyenne entre t = 1s et t = 2s\n3. Que représente physiquement ce résultat ?",
          "correction": "**Solution :**\n\n1. Hauteurs :\n   - h(1) = 20(1) - 5(1)² = 20 - 5 = 15 m\n   - h(2) = 20(2) - 5(2)² = 40 - 20 = 20 m\n\n2. Vitesse moyenne :\n   v_moy = [h(2) - h(1)] / (2 - 1) = (20 - 15) / 1 = 5 m/s\n\n3. Interprétation physique :\n   Entre t = 1s et t = 2s, le ballon monte avec une vitesse moyenne de 5 m/s.\n   Note : La vitesse diminue car le ballon ralentit en montant (gravité)."
        },
        {
          "title": "Vers la limite",
          "type": "PRACTICE",
          "content": "...",
          "correction": "..."
        }
      ]
    },
    {
      "title": "Module 2 : Le nombre dérivé et la tangente",
      "description": "Découverte du nombre dérivé comme limite du taux d'accroissement et son interprétation géométrique",
      "content": "...",
      "exercises": [
        {
          "title": "Calcul du nombre dérivé par limite",
          "type": "PRACTICE",
          "content": "...",
          "correction": "..."
        },
        {
          "title": "Équation de la tangente",
          "type": "PRACTICE",
          "content": "Soit f(x) = x³ - 3x. On admet que f'(x) = 3x² - 3.\n\n1. Calculez f(2) et f'(2)\n2. Écrivez l'équation de la tangente au point d'abscisse 2\n3. Vérifiez que le point (2, f(2)) appartient bien à cette tangente",
          "correction": "**Solution :**\n\n1. Calculs :\n   - f(2) = 2³ - 3(2) = 8 - 6 = 2\n   - f'(2) = 3(2)² - 3 = 12 - 3 = 9\n\n2. Équation de la tangente :\n   y = f'(2) × (x - 2) + f(2)\n   y = 9(x - 2) + 2\n   y = 9x - 18 + 2\n   y = 9x - 16\n\n3. Vérification :\n   Pour x = 2 : y = 9(2) - 16 = 18 - 16 = 2\n   Le point (2, 2) appartient bien à la tangente ✓"
        },
        {
          "title": "Application physique",
          "type": "PRACTICE",
          "content": "...",
          "correction": "..."
        },
        {
          "title": "Tangente horizontale",
          "type": "PRACTICE",
          "content": "...",
          "correction": "..."
        }
      ]
    }
  ]
}
```

It must also have an input which copy-pastes the following prompt for an AI to create the course:

```xml
<styles_info>
Claude is a expert teacher in the field of the user choice . His is to search the web for informations about a specific topic on the web and provide a course following STRICTLY the format requested in the <format_guidelines></format_guidelines> tag
## Teaching style
1. Search first: Claude first searches the internet for informations, as he should provide the most up to date informations
2. Progressive learning: Claude supposes the user does not have an expertise in the domain in the course he asked. As such, any jargon should be explained explicitly with simple words. Also, the first part of the course should always be simple, and explain the prerequisites in a list before starting to make the course
3. Modularity: Instead of providing one giant course for the whole topic, Claude should try to create short and easily digestable parts for the course. 
4. Problem solving driven: When creating a module, Claude should try to introduce a problem you can solve by learning what is in the module first. That way, it won't be too theorical. When talking about theory, Claude should try to link it to the problem, so that the module is never too abstract.
5. Exercise oriented: For every module, Claude should at least create 5 exercices that checks wether or not the user managed to learn the theory and can use it to solve problems
6. Not QCM oriented: If QCMs are a good way of knowing if a user learned something, practical exercices should be prioritised if possible.
</styles_info>
<format_guidelines>
Claude is creating material for a course to be displayed in a third party software.
So it MUST follow the present formatting guidelines when producing the final artifact.
Claude MUST deliver a JSON artifact
Claude CAN USE LaTeX in it's markdown. To do so, it must encapsulate the LaTeX string in the following expression : `$$...$$`
Claude can create the following things in an artifact:
 1) a course
The course encapsulate every other JSON structures
 The course has this structure:
 json
 {
    "name": "the name",
    "topic": "the topic",
    "level": "the level asked , one of the following : ABSOLUTE_BEGINNER / NOVICE / JUNIOR / MID_LEVEL / ADVANCED / EXPERT",
    "modules" : [...] // an array of modules
 }
 
 2) a module
 The module contains a text course and exercises
 It follows this structure
 json
 {
    "title": "the title of the course",
    "descrption": "a brief description of the content"
    "content": "the content in MARKDOWN formatting"
    "exercises": [...] // an array of exercices
 }
 
 3) an exercice
 An exercise allows the user to try and exercice himself on the topic. It can be of two types : QCM, Practice
 json
{
    "title": "the title of the exercise",
    "type": "one of the two : QCM, PRACTICE"
}
 
 4) a QCM
 A QCM is a type of exercice
 It contains an array of questions and answers
 json
 {
    "question": "the question"
    "answers" : [
        "answer1": {
            "content": "the answer"
            "right_answer": true // can also be false
        },
        ...
    ]
 }
 
 5) a Practice
 A Practice is a simple exercice with content in markdown and a correction
 json
 {
    "content": "the content in MARKDOWN"
    "correction" :  "the correction in MARKDOWN"
 }
 
</format_guidelines>
<instructions>
  // the user instructions
</instructions>
```

The courses, as well as the progress made on the courses, must be stored in the localstorage. A user should be able to scroll through his courses.

At the moment, it's a local only app. Online functionnalities will come later.

A POC in the form of an artifact for this app was already made. The goal here is to make a fully fledge application. Here is what it looked like:

```jsx
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, BookOpen, Target, CheckCircle, Eye, EyeOff, Copy, AlertCircle } from 'lucide-react';

const InteractiveCourseViewer = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [courseData, setCourseData] = useState(null);
  const [currentModule, setCurrentModule] = useState(0);
  const [expandedExercises, setExpandedExercises] = useState({});
  const [showCorrections, setShowCorrections] = useState({});
  const [completedExercises, setCompletedExercises] = useState(new Set());
  const [parseError, setParseError] = useState('');

  const parseCourseData = () => {
    if (!jsonInput.trim()) {
      setParseError('Veuillez coller le contenu du cours');
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      setCourseData(parsed);
      setCurrentModule(0);
      setParseError('');
      setExpandedExercises({});
      setShowCorrections({});
      setCompletedExercises(new Set());
    } catch (error) {
      setParseError('JSON invalide. Vérifiez le format du document.');
    }
  };

  const toggleExercise = (moduleIndex, exerciseIndex) => {
    const key = `${moduleIndex}-${exerciseIndex}`;
    setExpandedExercises(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleCorrection = (moduleIndex, exerciseIndex) => {
    const key = `${moduleIndex}-${exerciseIndex}`;
    setShowCorrections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const markExerciseCompleted = (moduleIndex, exerciseIndex) => {
    const key = `${moduleIndex}-${exerciseIndex}`;
    const newCompleted = new Set(completedExercises);
    if (newCompleted.has(key)) {
      newCompleted.delete(key);
    } else {
      newCompleted.add(key);
    }
    setCompletedExercises(newCompleted);
  };

  const renderMarkdown = (content) => {
    // Simple markdown parsing for basic formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-blue-800 mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-blue-900 mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-blue-900 mt-6 mb-4">$1</h1>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  };

  const getLevelColor = (level) => {
    switch (level?.toUpperCase()) {
      case 'NOVICE': return 'bg-green-100 text-green-800 border-green-200';
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ADVANCED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressPercentage = () => {
    if (!courseData) return 0;
    const totalExercises = courseData.modules.reduce((total, module) => 
      total + (module.exercises ? module.exercises.length : 0), 0
    );
    return totalExercises > 0 ? Math.round((completedExercises.size / totalExercises) * 100) : 0;
  };

  if (!courseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <BookOpen className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Visualiseur de Cours Interactif
              </h1>
              <p className="text-gray-600">
                Collez le contenu JSON de votre cours pour commencer
              </p>
            </div>

            {parseError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-red-700">{parseError}</span>
              </div>
            )}

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Contenu du cours (JSON)
              </label>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                placeholder="Collez ici le contenu JSON de votre cours..."
              />
              <button
                onClick={parseCourseData}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors font-medium"
              >
                Charger le cours
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentModuleData = courseData.modules[currentModule];
  const progress = getProgressPercentage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{courseData.name}</h1>
              <p className="text-gray-600 mt-1">{courseData.topic}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full border text-sm font-medium ${getLevelColor(courseData.level)}`}>
                {courseData.level}
              </span>
              <div className="text-right">
                <div className="text-sm text-gray-600">Progression</div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{progress}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Module Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Modules du cours</h2>
              <nav className="space-y-2">
                {courseData.modules.map((module, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentModule(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentModule === index
                        ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-600'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="font-medium text-sm mb-1">
                      Module {index + 1}
                    </div>
                    <div className="text-xs text-gray-600 leading-tight">
                      {module.title}
                    </div>
                    {module.exercises && (
                      <div className="flex items-center gap-1 mt-2">
                        <Target className="h-3 w-3" />
                        <span className="text-xs">
                          {module.exercises.filter((_, exIndex) => 
                            completedExercises.has(`${index}-${exIndex}`)
                          ).length}/{module.exercises.length} exercices
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </nav>
              
              <button
                onClick={() => {
                  setCourseData(null);
                  setJsonInput('');
                }}
                className="w-full mt-6 text-sm text-gray-600 hover:text-gray-800 py-2 border-t pt-4"
              >
                ← Retour à l'accueil
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg">
              {/* Module Header */}
              <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl">
                <h2 className="text-2xl font-bold mb-2">{currentModuleData.title}</h2>
                <p className="text-blue-100">{currentModuleData.description}</p>
              </div>

              {/* Module Content */}
              <div className="p-6">
                <div 
                  className="prose max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: renderMarkdown(currentModuleData.content) 
                  }}
                />
              </div>

              {/* Exercises */}
              {currentModuleData.exercises && currentModuleData.exercises.length > 0 && (
                <div className="border-t bg-gray-50 rounded-b-xl">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Target className="h-6 w-6 text-blue-600" />
                      Exercices pratiques
                    </h3>
                    <div className="space-y-4">
                      {currentModuleData.exercises.map((exercise, exerciseIndex) => {
                        const exerciseKey = `${currentModule}-${exerciseIndex}`;
                        const isExpanded = expandedExercises[exerciseKey];
                        const showCorrection = showCorrections[exerciseKey];
                        const isCompleted = completedExercises.has(exerciseKey);

                        return (
                          <div key={exerciseIndex} className="bg-white rounded-lg shadow-sm border">
                            <div 
                              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                              onClick={() => toggleExercise(currentModule, exerciseIndex)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  {isExpanded ? 
                                    <ChevronDown className="h-5 w-5 text-gray-500" /> :
                                    <ChevronRight className="h-5 w-5 text-gray-500" />
                                  }
                                  <h4 className="font-medium text-gray-900">
                                    {exercise.title}
                                  </h4>
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    exercise.type === 'PRACTICE' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                  }`}>
                                    {exercise.type}
                                  </span>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markExerciseCompleted(currentModule, exerciseIndex);
                                  }}
                                  className={`p-1 rounded-full transition-colors ${
                                    isCompleted 
                                      ? 'text-green-600 bg-green-100' 
                                      : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                                  }`}
                                >
                                  <CheckCircle className="h-5 w-5" />
                                </button>
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="border-t bg-gray-50">
                                <div className="p-4">
                                  <div 
                                    className="prose prose-sm max-w-none mb-4 whitespace-pre-wrap"
                                    dangerouslySetInnerHTML={{ 
                                      __html: renderMarkdown(exercise.content) 
                                    }}
                                  />
                                  
                                  {exercise.correction && (
                                    <div className="mt-4">
                                      <button
                                        onClick={() => toggleCorrection(currentModule, exerciseIndex)}
                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
                                      >
                                        {showCorrection ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        {showCorrection ? 'Masquer' : 'Voir'} la correction
                                      </button>
                                      
                                      {showCorrection && (
                                        <div className="mt-3 p-4 bg-white border border-indigo-200 rounded-lg">
                                          <div 
                                            className="prose prose-sm max-w-none whitespace-pre-wrap"
                                            dangerouslySetInnerHTML={{ 
                                              __html: renderMarkdown(exercise.correction) 
                                            }}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setCurrentModule(Math.max(0, currentModule - 1))}
                disabled={currentModule === 0}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Module précédent
              </button>
              <button
                onClick={() => setCurrentModule(Math.min(courseData.modules.length - 1, currentModule + 1))}
                disabled={currentModule === courseData.modules.length - 1}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Module suivant →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveCourseViewer;
```

Some notable differences : 
 * The homepage should contain not only the input to paste the content in, but also an input to create a prompt for a new course.
 * It should have a navbar that allow you to navigate from homepage, courses, documentation and account

By no means should you try to recreate a standalone app. You should strictly follow the guidelines in order to help create the real application.

The long term ambition would be to create a collaborative course creator site, where every course is versionned by git, and discussions can be made on every branch. But for now, we'll implement a local first version.
