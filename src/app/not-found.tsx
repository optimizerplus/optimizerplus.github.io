import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-boo-dark flex items-center justify-center">
      <div className="text-center px-6">
        {/* Glowing 404 */}
        <div className="relative mb-8">
          <h1 className="text-[150px] md:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-boo-blue via-purple-500 to-boo-green animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-boo-blue/30 via-purple-500/30 to-boo-green/30 -z-10"></div>
        </div>

        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-white/60 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Back to Home Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-boo-blue via-purple-600 to-boo-green text-white font-bold text-lg shadow-[0_0_30px_rgba(0,163,255,0.5)] hover:shadow-[0_0_50px_rgba(0,163,255,0.7)] transition-all duration-300 hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 border border-boo-blue/20 rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 border border-boo-green/20 rounded-full animate-pulse"></div>
      </div>
    </div>
  )
}
