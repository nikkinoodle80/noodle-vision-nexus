import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * NOODLE-VISION ERROR BOUNDARY
 * First-class error protection - catches tool crashes without breaking UI
 * Auto-recovery on prop changes via resetKeys
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('🔴 ErrorBoundary caught:', error, errorInfo);
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    // Auto-reset on prop changes (resetKeys pattern)
    if (this.state.hasError && this.props.resetKeys !== prevProps.resetKeys) {
      this.reset();
    }
  }

  reset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default first-class error UI
      return (
        <div className="error-boundary-fallback">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h2>Tool Execution Failed</h2>
            <p className="error-message">{this.state.error?.message}</p>
            <details className="error-details">
              <summary>Technical Details</summary>
              <pre>{this.state.errorInfo?.componentStack}</pre>
            </details>
            <button onClick={this.reset} className="error-reset-btn">
              ↻ Retry
            </button>
          </div>
          <style>{`
            .error-boundary-fallback {
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 300px;
              padding: 2rem;
              background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
              border-radius: 12px;
              border: 2px solid #ff6b6b;
            }
            .error-content {
              text-align: center;
              max-width: 600px;
              color: #fff;
            }
            .error-icon {
              font-size: 4rem;
              margin-bottom: 1rem;
            }
            .error-content h2 {
              font-size: 1.5rem;
              margin-bottom: 1rem;
              color: #ff6b6b;
            }
            .error-message {
              margin-bottom: 1.5rem;
              color: #e0e0e0;
              font-family: monospace;
            }
            .error-details {
              margin: 1.5rem 0;
              text-align: left;
            }
            .error-details summary {
              cursor: pointer;
              color: #4ecdc4;
              font-weight: 600;
              margin-bottom: 0.5rem;
            }
            .error-details pre {
              background: #0f0f1e;
              padding: 1rem;
              border-radius: 8px;
              overflow: auto;
              max-height: 200px;
              font-size: 0.75rem;
              color: #ff6b6b;
            }
            .error-reset-btn {
              padding: 0.75rem 2rem;
              font-size: 1rem;
              font-weight: 600;
              color: #fff;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border: none;
              border-radius: 8px;
              cursor: pointer;
              transition: transform 0.2s;
            }
            .error-reset-btn:hover {
              transform: scale(1.05);
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}
