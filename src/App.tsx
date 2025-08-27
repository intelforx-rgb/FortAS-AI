import React, { useState, useRef, useEffect } from 'react';
import { Factory } from 'lucide-react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { LoadingMessage } from './components/LoadingMessage';
import { ErrorMessage } from './components/ErrorMessage';
import { LoginScreen } from './components/LoginScreen';
import { AuthScreen } from './components/AuthScreen';
import { useAuth } from './contexts/AuthContext';
import { useChatHistory } from './contexts/ChatHistoryContext';
import { useTheme } from './contexts/ThemeContext';
import { generateResponse } from './utils/gemini';
import type { Message, UserRole, ChatState, ChatHistory } from './types';

function App() {
  const { user, isAuthenticated, logout } = useAuth();
  const { saveChatHistory, loadChatHistory, setCurrentChatId } = useChatHistory();
  const { isDarkMode } = useTheme();
  const [showLogin, setShowLogin] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    selectedRole: 'Operations',
    uploadedFiles: []
  });
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages, chatState.isLoading]);

  // Check authentication status on mount
  useEffect(() => {
    if (isAuthenticated) {
      setShowLogin(false);
      setShowAuth(false);
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    setShowLogin(false);
    setShowAuth(true);
  };

  const handleGuestAccess = () => {
    setShowLogin(false);
    setShowAuth(false);
  };

  const handleAuthComplete = () => {
    setShowAuth(false);
  };

  const handleSendMessage = async (content: string) => {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      setError('GEMINI_API_KEY is not configured. Please set VITE_GEMINI_API_KEY in your environment variables.');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
      files: chatState.uploadedFiles.length > 0 ? [...chatState.uploadedFiles] : undefined
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      uploadedFiles: [] // Clear uploaded files after sending
    }));

    setSidebarOpen(false);

    try {
      const aiResponse = await generateResponse(
        content, 
        chatState.selectedRole, 
        isAuthenticated,
        chatState.uploadedFiles
      );
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false
      }));
    } catch (err) {
      setChatState(prev => ({ ...prev, isLoading: false }));
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  // Auto-save chat when messages change (for authenticated users)
  useEffect(() => {
    if (isAuthenticated && chatState.messages.length >= 2) {
      const hasUserMessage = chatState.messages.some(m => m.role === 'user');
      const hasAIResponse = chatState.messages.some(m => m.role === 'assistant');
      
      if (hasUserMessage && hasAIResponse) {
        saveChatHistory({
          messages: chatState.messages,
          role: chatState.selectedRole
        });
      }
    }
  }, [chatState.messages, isAuthenticated, chatState.selectedRole, saveChatHistory]);

  const handleRoleChange = (role: UserRole | 'General AI') => {
    setChatState(prev => ({ ...prev, selectedRole: role }));
    setSidebarOpen(false);
  };

  const handleLoadChat = (history: ChatHistory) => {
    setChatState(prev => ({
      ...prev,
      messages: history.messages,
      selectedRole: history.role,
      isLoading: false
    }));
    setCurrentChatId(history.id);
    setSidebarOpen(false);
  };

  const handleNewChat = () => {
    setChatState(prev => ({
      ...prev,
      messages: [],
      isLoading: false,
      uploadedFiles: []
    }));
    setCurrentChatId(null);
    setSidebarOpen(false);
  };

  const handleFileUpload = (files: FileUpload[]) => {
    setChatState(prev => ({
      ...prev,
      uploadedFiles: [...prev.uploadedFiles, ...files]
    }));
  };

  const handleRemoveFile = (fileId: string) => {
    setChatState(prev => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter(f => f.id !== fileId)
    }));
  };
  const clearError = () => setError(null);

  if (showLogin && !isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} onGuestAccess={handleGuestAccess} />;
  }

  if (showAuth) {
    return <AuthScreen onComplete={handleAuthComplete} />;
  }

  return (
    <div className={`h-screen flex overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      <div className="h-full w-full flex bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          selectedRole={chatState.selectedRole}
          onRoleChange={handleRoleChange}
          onLoadChat={handleLoadChat}
          onNewChat={handleNewChat}
          messageCount={chatState.messages.length}
          isLoading={chatState.isLoading}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            selectedRole={chatState.selectedRole}
          />

          {/* Messages Container - Scrollable */}
          <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="p-4 space-y-4 min-h-full">
              {/* Error Display */}
              {error && (
                <ErrorMessage 
                  message={error} 
                  onRetry={error.includes('GEMINI_API_KEY') ? undefined : clearError}
                />
              )}

              {chatState.messages.length === 0 && !error ? (
                <div className="text-center py-12">
                  <div className="p-8 bg-gradient-to-br from-blue-600/10 to-blue-800/10 dark:from-blue-400/10 dark:to-blue-600/10 rounded-3xl w-32 h-32 mx-auto mb-8 flex items-center justify-center border-2 border-blue-200 dark:border-blue-800">
                    <Factory className="text-blue-600 dark:text-blue-400 w-16 h-16" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Welcome to FortAS AI</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                    AI-powered Industrial Plant Operations, Safety & Efficiency Expert — your trusted partner in building and optimizing world-class industrial plants.
                    {isAuthenticated && <span className="text-green-600 dark:text-green-400 font-semibold"><br/>✅ You have access to General AI mode and chat history!</span>}
                  </p>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-4xl mx-auto border border-gray-200 dark:border-gray-700 shadow-lg">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">🔧 Available Expertise Areas:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                      <div className="text-left space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full flex-shrink-0"></div>
                          <p className="text-gray-700 dark:text-gray-300 font-semibold">Plant Operations & Maintenance</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                          <p className="text-gray-700 dark:text-gray-300 font-semibold">Project Management</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                          <p className="text-gray-700 dark:text-gray-300 font-semibold">Sales & Marketing</p>
                        </div>
                      </div>
                      <div className="text-left space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0"></div>
                          <p className="text-gray-700 dark:text-gray-300 font-semibold">Procurement & Supply Chain</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                          <p className="text-gray-700 dark:text-gray-300 font-semibold">Erection & Commissioning</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"></div>
                          <p className="text-gray-700 dark:text-gray-300 font-semibold">Engineering & Design</p>
                        </div>
                      </div>
                      {isAuthenticated && (
                        <div className="text-left space-y-3 sm:col-span-2">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                            <p className="text-gray-700 dark:text-gray-300 font-semibold">🤖 General AI Assistant</p>
                          </div>
                        </div>
                      )}
                    </div>
                    {!isAuthenticated && (
                      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                        <p className="text-yellow-800 dark:text-yellow-200 font-semibold text-sm">
                          🔓 Login to unlock General AI mode, file uploads, and chat history!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {chatState.messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  {chatState.isLoading && <LoadingMessage />}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area - Fixed at Bottom */}
          <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 flex-shrink-0">
            <ChatInput 
              onSend={handleSendMessage}
              isLoading={chatState.isLoading || !!error}
              placeholder={`Ask about cement plant operations (${chatState.selectedRole} expertise)...`}
              onFileUpload={isAuthenticated ? handleFileUpload : undefined}
              uploadedFiles={chatState.uploadedFiles}
              onRemoveFile={isAuthenticated ? handleRemoveFile : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;