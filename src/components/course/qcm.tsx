// src/components/course/qcm.tsx
import React, { useState } from 'react';
import { CheckmarkIcon } from '../svg/CheckmarkIcon';
import { CrossIcon } from '../svg/CrossIcon';
import type { QCM, QCMQuestion } from '../../models/course';

interface QCMProps {
  qcm: QCM;
  isCompleted: boolean;
  onToggleCompleted: () => void;
}

export const QCMComponent: React.FC<QCMProps> = ({ qcm, isCompleted, onToggleCompleted }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Map<number, Set<number>>>(new Map());
  const [showResults, setShowResults] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    if (hasSubmitted) return;
    
    const newSelected = new Map(selectedAnswers);
    const answersForQuestion = newSelected.get(questionIndex) || new Set();
    
    if (answersForQuestion.has(answerIndex)) {
      answersForQuestion.delete(answerIndex);
    } else {
      answersForQuestion.add(answerIndex);
    }

    if (answersForQuestion.size === 0) {
      newSelected.delete(questionIndex);
    } else {
      newSelected.set(questionIndex, answersForQuestion);
    }
    
    setSelectedAnswers(newSelected);
  };

  const handleSubmit = () => {
    setHasSubmitted(true);
    setShowResults(true);
    
    let allCorrect = true;
    for (let i = 0; i < qcm.questions.length; i++) {
      const question = qcm.questions[i];
      const correctAnswers = question.responses
        .map((response, index) => ({ response, index }))
        .filter(({ response }) => response.rightAnswer)
        .map(({ index }) => index);

      const userSelected = selectedAnswers.get(i) || new Set();

      const isQuestionCorrect = correctAnswers.every(index => userSelected.has(index)) &&
                               Array.from(userSelected).every(index => question.responses[index].rightAnswer);
      
      if (!isQuestionCorrect) {
        allCorrect = false;
        break;
      }
    }

    if (allCorrect && !isCompleted) {
      onToggleCompleted();
    }
  };

  const handleReset = () => {
    setSelectedAnswers(new Map());
    setShowResults(false);
    setHasSubmitted(false);
  };

  const getAnswerClassName = (questionIndex: number, answerIndex: number) => {
    const isSelected = selectedAnswers.get(questionIndex)?.has(answerIndex);
    const isCorrect = qcm.questions[questionIndex].responses[answerIndex].rightAnswer;

    if (!showResults) {
      return `p-4 border rounded-lg transition-all hover:cursor-pointer ${
        isSelected
          ? 'border-blue-500 bg-blue-50 text-blue-900'
          : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
      }`;
    }

    if (isCorrect && isSelected) {
      return 'p-4 border rounded-lg border-gold-500 bg-gold-50 text-gold-900';
    } else if (isCorrect && !isSelected) {
      return 'p-4 border rounded-lg border-gold-500 bg-gold-50 text-gold-900 opacity-70';
    } else if (!isCorrect && isSelected) {
      return 'p-4 border rounded-lg border-red-500 bg-red-50 text-red-900';
    } else {
      return 'p-4 border rounded-lg border-gray-300 bg-gray-50 text-gray-700 opacity-70';
    }
  };

  const getIcon = (questionIndex: number, answerIndex: number) => {
    if (!showResults) return null;
    
    const isCorrect = qcm.questions[questionIndex].responses[answerIndex].rightAnswer;
    const isSelected = selectedAnswers.get(questionIndex)?.has(answerIndex);
    
    if (isCorrect) {
      return <CheckmarkIcon className="h-5 w-5 text-gold-600" />;
    } else if (isSelected && !isCorrect) {
      return <CrossIcon className="h-5 w-5 text-red-600" />;
    }
    
    return null;
  };
  console.log(qcm)

  return (
    <div className="space-y-6">
      {qcm.questions.map((q: QCMQuestion, questionIndex: number) => (
        <div key={questionIndex} className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            {q.question}
          </h4>
          
          <div className="space-y-3">
            {q.responses.map((response, answerIndex) => {
              const isSelected = selectedAnswers.get(questionIndex)?.has(answerIndex);
              
              return (
                <div
                  key={answerIndex}
                  className={getAnswerClassName(questionIndex, answerIndex)}
                  onClick={() => handleAnswerSelect(questionIndex, answerIndex)}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex-1">{response.content}</span>
                    <div className="flex items-center space-x-2">
                      {getIcon(questionIndex, answerIndex)}
                      <div className={`w-4 h-4 border-2 rounded ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <div className="w-full h-full bg-white rounded-sm m-0.5"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="mt-6 flex items-center justify-between">
        <div className="flex space-x-3">
          {!hasSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswers.size === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:cursor-pointer"
            >
              Valider les réponses
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors hover:cursor-pointer"
            >
              Recommencer
            </button>
          )}
        </div>
        
        <button
          onClick={onToggleCompleted}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors hover:cursor-pointer ${
            isCompleted
              ? 'bg-gold-100 text-gold-800 hover:bg-gold-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <CheckmarkIcon className="h-4 w-4" />
          <span>{isCompleted ? 'Complété' : 'Marquer comme complété'}</span>
        </button>
      </div>
    </div>
  );
};
