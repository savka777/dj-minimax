'use client';

interface HeaderProps {
  isAuthenticated?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
}

export function Header({ isAuthenticated, onLogin, onLogout }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between bg-black px-4">
      {/* Left side - Logo and navigation */}
      <div className="flex items-center gap-4 w-[200px]">
        {/* Spotify Logo */}
        <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>

        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-white hover:bg-zinc-800">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.957 2.793a1 1 0 010 1.414L8.164 12l7.793 7.793a1 1 0 11-1.414 1.414L5.336 12l9.207-9.207a1 1 0 011.414 0z" />
            </svg>
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-white hover:bg-zinc-800">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.043 2.793a1 1 0 000 1.414L15.836 12l-7.793 7.793a1 1 0 101.414 1.414L18.664 12 9.457 2.793a1 1 0 00-1.414 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Center - Home button and Search bar */}
      <div className="flex items-center gap-2 flex-1 justify-center">
        {/* Home button */}
        <button className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-white hover:bg-zinc-700">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.5 3.247a1 1 0 00-1 0L4 7.577V20h4.5v-6a1 1 0 011-1h5a1 1 0 011 1v6H20V7.577l-7.5-4.33z" />
          </svg>
        </button>

        {/* Search bar */}
        <div className="relative flex items-center">
          <div className="flex h-12 w-96 items-center gap-3 rounded-full bg-zinc-800 px-4 hover:bg-zinc-700 focus-within:ring-2 focus-within:ring-white">
            <svg className="h-5 w-5 text-zinc-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353 1.414-1.414-4.291-4.291a9.284 9.284 0 002.024-5.87c0-5.139-4.226-9.278-9.407-9.278zm0 2c4.08 0 7.407 3.239 7.407 7.279s-3.326 7.279-7.407 7.279c-4.08 0-7.407-3.239-7.407-7.279s3.326-7.279 7.407-7.279z" />
            </svg>
            <input
              type="text"
              placeholder="What do you want to play?"
              className="flex-1 bg-transparent text-sm text-white placeholder-zinc-400 outline-none"
            />
            <div className="h-6 w-px bg-zinc-600" />
            <button className="text-zinc-400 hover:text-white">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 2a1 1 0 00-1 1v18a1 1 0 001 1h16a1 1 0 001-1V3a1 1 0 00-1-1H4zm1 2h14v16H5V4zm3 3v2h2V7H8zm4 0v2h4V7h-4zm-4 4v2h2v-2H8zm4 0v2h4v-2h-4zm-4 4v2h2v-2H8zm4 0v2h4v-2h-4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 w-[200px] justify-end">
        {/* Login/Logout button */}
        {isAuthenticated ? (
          <button
            onClick={onLogout}
            className="flex items-center gap-2 rounded-full bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 13v-2H7V8l-5 4 5 4v-3z" />
              <path d="M20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z" />
            </svg>
            Logout
          </button>
        ) : (
          <button
            onClick={onLogin}
            className="flex items-center gap-2 rounded-full bg-[#1DB954] px-4 py-2 text-sm font-bold text-black hover:bg-[#1ed760]"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            Connect Spotify
          </button>
        )}

        {/* Notifications */}
        <button className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:text-white">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3a7 7 0 00-7 7v4.586l-1.707 1.707A1 1 0 004 18h16a1 1 0 00.707-1.707L19 14.586V10a7 7 0 00-7-7zm0 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        </button>

        {/* Friends Activity */}
        <button className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:text-white">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z" />
          </svg>
        </button>

        {/* Profile */}
        <button className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-zinc-700">
          <span className="text-sm font-medium text-white">S</span>
        </button>
      </div>
    </header>
  );
}
