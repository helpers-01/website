export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center animate-pulse">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"></circle>
            <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
        </div>
        <span className="text-purple-700 font-medium">Loading users...</span>
      </div>
    </div>
  )
}
