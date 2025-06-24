// ===== src/components/common/ErrorBoundary.tsx =====
import React, { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  showHomeButton?: boolean
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ errorInfo })

    // Log to external service in production
    if (import.meta.env.PROD) {
      // Add error logging service here
      console.error('Production error logged:', { error, errorInfo })
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
          <Card className="max-w-lg w-full text-center p-8">
            <div className="flex flex-col items-center space-y-6">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Oops! Something went wrong
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                  We encountered an unexpected error. This has been logged and we're working to fix it.
                </p>

                {import.meta.env.DEV && this.state.error && (
                  <details className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Error Details (Development)
                    </summary>
                    <pre className="text-xs text-red-600 dark:text-red-400 whitespace-pre-wrap overflow-auto max-h-40">
                      {this.state.error.toString()}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </details>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={this.handleRetry} className="min-w-[120px]">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>

                {this.props.showHomeButton !== false && (
                  <Button
                    variant="outline"
                    onClick={this.handleGoHome}
                    className="min-w-[120px]"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                )}
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-500">
                If this problem persists, please contact our support team.
              </p>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}