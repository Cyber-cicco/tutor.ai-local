import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import type { Module } from '../../models/course';

interface CourseContentProps {
  module: Module;
}

export const CourseContent: React.FC<CourseContentProps> = ({ module }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Module Header */}
      <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-xl">
        <h2 className="text-2xl font-bold mb-2">{module.title}</h2>
        <p className="text-blue-100">{module.description}</p>
      </div>

      {/* Module Content */}
      <div className="p-6">
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold text-blue-900 mt-6 mb-4">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-bold text-blue-900 mt-6 mb-3">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-semibold text-blue-800 mt-4 mb-2">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="mb-4 text-gray-700">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-gray-700">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4">
                  {children}
                </blockquote>
              ),
              code: ({ children, className }) => {
                const isInline = !className;
                if (isInline) {
                  return (
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                      {children}
                    </code>
                  );
                }
                return (
                  <code className="block bg-gray-50 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                    {children}
                  </code>
                );
              },
              strong: ({ children }) => (
                <strong className="font-bold text-gray-900">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic text-gray-700">{children}</em>
              ),
            }}
          >
            {module.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
