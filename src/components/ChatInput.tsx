import React, { useState } from 'react';
import { Send, Mic, Paperclip, X, FileText, Image } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { FileUpload } from '../types';
interface ChatInputProps {
  onSend: (message: string) => void;
  onSendWithFiles: (message: string, files: FileUpload[]) => void;
  isLoading: boolean;
  placeholder?: string;
}
export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSend, 
  onSendWithFiles, 
  isLoading, 
  placeholder 
}) => {
  const { isAuthenticated } = useAuth();
  const [input, setInput] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
    e.target.value = ''; // Reset input
  };

  const handleFiles = async (files: File[]) => {
    if (!isAuthenticated) return;

    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
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

    setUploadedFiles(prev => [...prev, ...fileUploads]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
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
    if (isAuthenticated) {
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    }
  };

  const onRemoveFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  return (
    <div className="space-y-3">
      {/* Uploaded Files Display */}
      {isAuthenticated && uploadedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2"
            >
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300 truncate max-w-32">
                {file.name}
              </span>
              <button
                onClick={() => onRemoveFile(file.id)}
                className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200"
              >
                <X size={14} />
              </button>
            </div>
          ))}
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
            placeholder={placeholder || "Describe your plant challenge or question..."}
            placeholder={placeholder || "Describe your industrial plant challenge or question..."}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     disabled:opacity-50 disabled:cursor-not-allowed
                     text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm
                     transition-all duration-200"
          />
          
          {/* File Upload Button (Authenticated Users Only) */}
          {isAuthenticated && (
            <>
              <input
                type="file"
                id="file-upload"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="absolute right-16 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                title="Upload files (PDF, Images)"
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
      {isDragOver && isAuthenticated && (
        <div className="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-500 rounded-xl flex items-center justify-center pointer-events-none">
          <div className="text-blue-600 dark:text-blue-400 font-semibold">
            Drop files here to upload
          </div>
        </div>
      )}
    </div>
  );
};