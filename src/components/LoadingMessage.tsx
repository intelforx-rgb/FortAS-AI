import React from 'react';
import { Bot, Cog } from 'lucide-react';

export const LoadingMessage: React.FC = () => {
  return (
    <div className="flex gap-4 mb-6">
      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center 
                      bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 shadow-lg">
        <Bot size={16} className="text-white" />
      </div>
      
      <div className="flex-1 max-w-4xl">
        <div className="inline-block px-4 py-3 rounded-xl rounded-bl-md 
                        bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <div className="flex items-center gap-2">
              <Cog className="text-gray-600 dark:text-gray-400 animate-spin" size={16} />
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">FortAS AI is analyzing your query...</span>
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
          AI by VS • Processing...
        </div>
      </div>
    </div>
  );
};