import React from "react";

function ServerError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-200 to-red-300">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-xl p-8 text-center m-4">
        <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#e53e3e"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Server Error</h1>
        <p className="text-gray-500 mb-6">
          Something went wrong on our end. Please try again later.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition"
          >
            Try Again
          </button>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-800 transition"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default ServerError;