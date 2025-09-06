import React, { useState } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { EyeIcon } from '../svg/EyeIcon';
import { CheckmarkIcon } from '../svg/CheckmarkIcon';
import type { Practise } from '../../models/course';

interface PracticeProps {
  practice: Practise;
  isCompleted: boolean;
  onToggleCompleted: () => void;
}

export const PracticeComponent: React.FC<PracticeProps> = ({ 
  practice, 
  isCompleted, 
  onToggleCompleted 
}) => {
  const [showCorrection, setShowCorrection] = useState(false);

  const toggleCorrection = () => {
    setShowCorrection(!showCorrection);
  };

  const markdownComponents = {
    h1: ({ children }: any) => (
      <h1 className="text-xl font-bold text-gray-900 mt-4 mb-3">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-lg font-bold text-gray-900 mt-4 mb-2">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-base font-semibold text-gray-800 mt-3 mb-2">{children}</h3>
    ),
    p: ({ children }: any) => (
      <p className="mb-3 text-gray-700 leading-relaxed">{children}</p>
    ),
    ul: ({ children }: any) => (
      <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>
    ),
    ol: ({ children }: any) => (
      <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>
    ),
    li: ({ children }: any) => (
      <li className="text-gray-700">{children}</li>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-3 bg-blue-50 py-2">
        {children}
      </blockquote>
    ),
    code: ({ children, className }: any) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
            {children}
          </code>
        );
      }
      return (
        <pre className="bg-gray-50 p-4 rounded-lg text-sm font-mono overflow-x-auto my-3">
          <code>{children}</code>
        </pre>
      );
    },
    strong: ({ children }: any) => (
      <strong className="font-bold text-gray-900">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-gray-700">{children}</em>
    ),
  } as Components;

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {/* Exercise Content */}
        <div className="prose prose-sm max-w-none mb-6">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={markdownComponents}
          >
            {practice.content}
          </ReactMarkdown>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={toggleCorrection}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors hover:cursor-pointer ${
              showCorrection
                ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            <EyeIcon className="h-4 w-4" />
            <span>{showCorrection ? 'Masquer la correction' : 'Voir la correction'}</span>
          </button>

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

        {/* Correction */}
        {showCorrection && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                <CheckmarkIcon className="h-5 w-5 mr-2" />
                Correction
              </h4>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={markdownComponents}
                >
                  {practice.correction}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
