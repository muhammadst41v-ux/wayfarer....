import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Wayfarer Boundary] Caught error:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 my-6 max-w-xl mx-auto rounded-2xl bg-[#141720] border border-amber-400/30 text-center shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30 flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-serif text-white mb-2">
            {this.props.fallbackTitle || 'Viewport Gracefully Recovered'}
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed mb-6">
            A WebGL context or graphics pipeline anomaly was isolated so the rest of your expedition remains unaffected.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Rendering</span>
            </button>
            <a
              href="/"
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs border border-white/10 transition-colors"
            >
              Return Home
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
