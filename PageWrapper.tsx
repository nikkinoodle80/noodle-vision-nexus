import React, { ReactNode, Suspense } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface PageWrapperProps {
  children: ReactNode;
  pageTitle?: string;
  showHeader?: boolean;
  className?: string;
}

/**
 * NOODLE-VISION PAGE WRAPPER
 * First-class page container with built-in error protection
 * Catches tool execution failures without crashing the entire UI
 */
export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  pageTitle,
  showHeader = true,
  className = '',
}) => {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Send to your error tracking service (optional)
        console.error('🔴 Page Error:', {
          page: pageTitle,
          error: error.message,
          stack: errorInfo.componentStack,
        });
      }}
      resetKeys={[pageTitle]} // Auto-reset when navigating to different pages
    >
      <div className={`page-wrapper ${className}`}>
        {showHeader && pageTitle && (
          <header className="page-header">
            <h1>{pageTitle}</h1>
          </header>
        )}

        <Suspense
          fallback={
            <div className="loading-container">
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading {pageTitle || 'content'}...</p>
              </div>
            </div>
          }
        >
          {/* Wrap content in nested boundary for tool-specific errors */}
          <ErrorBoundary
            fallback={
              <div className="tool-error-fallback">
                <span className="tool-error-icon">🔧</span>
                <p>Tool execution temporarily unavailable</p>
                <small>The page is still functional</small>
              </div>
            }
          >
            {children}
          </ErrorBoundary>
        </Suspense>

        <style>{`
          .page-wrapper {
            min-height: 100vh;
            background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%);
            padding: 2rem;
          }
          
          .page-header {
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid rgba(78, 205, 196, 0.3);
          }
          
          .page-header h1 {
            font-size: 2rem;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .loading-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 400px;
          }
          
          .loading-spinner {
            text-align: center;
            color: #4ecdc4;
          }
          
          .spinner {
            width: 50px;
            height: 50px;
            margin: 0 auto 1rem;
            border: 4px solid rgba(78, 205, 196, 0.2);
            border-top-color: #4ecdc4;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          .tool-error-fallback {
            padding: 2rem;
            text-align: center;
            background: rgba(255, 107, 107, 0.1);
            border: 2px solid rgba(255, 107, 107, 0.3);
            border-radius: 12px;
            color: #ff6b6b;
          }
          
          .tool-error-icon {
            font-size: 3rem;
            display: block;
            margin-bottom: 1rem;
          }
          
          .tool-error-fallback small {
            display: block;
            margin-top: 0.5rem;
            color: #4ecdc4;
          }
        `}</style>
      </div>
    </ErrorBoundary>
  );
};
