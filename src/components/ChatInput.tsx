import React, { useState } from 'react';
import { Send, Mic, Paperclip, X, FileText, Image } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AuthService } from '../services/authService';
import type { FileUpload } from '../types';
interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
  onFileUpload?: (files: FileUpload[]) => void;
  uploadedFiles?: FileUpload[];
  onRemoveFile?: (fileId: string) => void;
}
export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSend, 
  isLoading, 
  placeholder,
  onFileUpload,
  uploadedFiles = [],
  onRemoveFile
}) => {
  const { user, isAuthenticated } = useAuth();
  const [input, setInput] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  
  const isPremium = user?.membershipType === 'Premium';
  const canUploadFiles = isAuthenticated && isPremium;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput('');
      
      // Update activity stats
      if (user) {
        AuthService.updateActivityStats(user.id, 'chat');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
    e.target.value = ''; // Reset input
  };

  const handleFiles = async (files: File[]) => {
    if (!canUploadFiles) return;

    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || 
                         file.type === 'application/pdf' ||
                         file.type.includes('spreadsheet') ||
                         file.type.includes('excel');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length === 0) return;

    const fileUploads: FileUpload[] = await Promise.all(
      validFiles.map(async (file) => {
        return new Promise<FileUpload>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              id: `file_${Date.now()}_${Math.random()}`,
              name: file.name,
              type: file.type,
              size: file.size,
              content: reader.result as string,
              uploadDate: new Date()
            });
          };
          reader.readAsDataURL(file);
        });
      })
    );

    if (onFileUpload) {
      onFileUpload(fileUploads);
    }
    
    // Update activity stats
    if (user) {
      AuthService.updateActivityStats(user.id, 'file');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (canUploadFiles) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (canUploadFiles) {
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    }
  };

  return (
    <div className="space-y-3">
      {/* Uploaded Files Display */}
      {canUploadFiles && uploadedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2"
            >
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300 truncate max-w-32">
                {file.name}
              </span>
              {onRemoveFile && (
                <button
                  onClick={() => onRemoveFile(file.id)}
                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Premium Feature Notice for Free Users */}
      {isAuthenticated && !isPremium && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-3">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm font-semibold">
            🔒 Upgrade to Premium to upload files and get advanced AI responses
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-3">
        <div 
          className={`flex-1 relative ${isDragOver ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder || "Describe your industrial plant challenge or question..."}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     disabled:opacity-50 disabled:cursor-not-allowed
                     text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm
                     transition-all duration-200"
          />
          
          {/* File Upload Button (Authenticated Users Only) */}
          {canUploadFiles && (
            <>
              <input
                type="file"
                id="file-upload"
                multiple
                accept="image/*,.pdf,.xlsx,.xls,.csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="absolute right-16 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                title="Upload files (PDF, Images, Excel)"
              >
                <Paperclip size={16} />
              </label>
            </>
          )}
          
          <button
            type="button"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <Mic size={16} />
          </button>
        </div>
        
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200 flex items-center gap-2 
                   font-semibold text-sm"
        >
          <Send size={16} />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>

      {/* Drag & Drop Overlay */}
      {isDragOver && canUploadFiles && (
        <div className="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-500 rounded-xl flex items-center justify-center pointer-events-none">
          <div className="text-blue-600 dark:text-blue-400 font-semibold">
            Drop files here to upload
          </div>
        </div>
      )}
    </div>
  );
};