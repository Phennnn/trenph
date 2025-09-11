import React from 'react';

// Error Boundary Component to catch JavaScript errors in child components.
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-100">
                    <div className="text-center p-6 bg-white rounded-lg shadow-lg">
                        <h1 className="text-2xl font-bold text-red-600">Oops! Something Went Wrong</h1>
                        <p className="text-gray-600 mt-2">We encountered an error. Please try refreshing the page.</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
