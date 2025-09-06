// src/components/course/qcm.tsx
import React, { useState } from 'react';
import { CheckmarkIcon } from '../svg/CheckmarkIcon';
import { CrossIcon } from '../svg/CrossIcon';
import type { QCM } from '../../models/course';

interface QCMProps {
  qcm: QCM;
  isCompleted: boolean;
  onToggleCompleted: () => void;
}

export const QCMComponent: React.FC<QCMProps> = ({ qcm, isCompleted, onToggleCompleted }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Set<number>>(new Set());
  const [showResults, setShowResults] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    if (hasSubmitted) return;
    
    const newSelected = new Set(selectedAnswers);
    if (newSelected.has(answerIndex)) {
      newSelected.delete(answerIndex);
    } else {
      newSelected.add(answerIndex);
    }
    setSelectedAnswers(newSelected);
  };

  const handleSubmit = () => {
    setHasSubmitted(true);
    setShowResults(true);
    
    // Check if all correct answers are selected and no incorrect ones
    const correctAnswers = qcm.questions.responses
      .map((response, index) => ({ response, index }))
      .filter(({ response }) => response.rightAnswer)
      .map(({ index }) => index);
    
    const allCorrect = correctAnswers.every(index => selectedAnswers.has(index)) &&
                     Array.from(selectedAnswers).every(index => 
                       qcm.questions.responses[index].rightAnswer
                     );
    
    if (allCorrect && !isCompleted) {
      onToggleCompleted();
    }
  };

  const handleReset = () => {
    setSelectedAnswers(new Set());
    setShowResults(false);
    setHasSubmitted(false);
  };

  const getAnswerClassName = (answerIndex: number, isSelected: boolean) => {
    if (!showResults) {
      return `p-4 border rounded-lg cursor-pointer transition-all hover:cursor-pointer ${
        isSelected
          ? 'border-blue-500 bg-blue-50 text-blue-900'
          : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
      }`;
    }

    const isCorrect = qcm.questions.responses[answerIndex].rightAnswer;
    
    if (isCorrect && isSelected) {
      return 'p-4 border rounded-lg border-green-500 bg-green-50 text-green-900';
    } else if (isCorrect && !isSelected) {
      return 'p-4 border rounded-lg border-green-500 bg-green-50 text-green-900 opacity-70';
    } else if (!isCorrect && isSelected) {
      return 'p-4 border rounded-lg border-red-500 bg-red-50 text-red-900';
    } else {
      return 'p-4 border rounded-lg border-gray-300 bg-gray-50 text-gray-700 opacity-70';
    }
  };

  const getIcon = (answerIndex: number, isSelected: boolean) => {
    if (!showResults) return null;
    
    const isCorrect = qcm.questions.responses[answerIndex].rightAnswer;
    
    if (isCorrect) {
      return <CheckmarkIcon className="h-5 w-5 text-green-600" />;
    } else if (isSelected && !isCorrect) {
      return <CrossIcon className="h-5 w-5 text-red-600" />;
    }
    
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          {qcm.questions.question}
        </h4>
        
        <div className="space-y-3">
          {qcm.questions.responses.map((response, index) => {
            const isSelected = selectedAnswers.has(index);
            
            return (
              <div
                key={index}
                className={getAnswerClassName(index, isSelected)}
                onClick={() => handleAnswerSelect(index)}
              >
                <div className="flex items-center justify-between">
                  <span className="flex-1">{response.content}</span>
                  <div className="flex items-center space-x-2">
                    {getIcon(index, isSelected)}
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
    </div>
  );
};
