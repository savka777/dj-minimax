'use client';

interface DJAvatarProps {
  size?: 'sm' | 'lg';
  isSpeaking?: boolean;
}

export function DJAvatar({ size = 'lg', isSpeaking = false }: DJAvatarProps) {
  const dimensions = size === 'sm' ? 'h-14 w-14' : 'h-48 w-48';
  const innerSize = size === 'sm' ? 'h-10 w-10' : 'h-32 w-32';
  const iconSize = size === 'sm' ? 'h-5 w-5' : 'h-16 w-16';

  return (
    <div className={`relative flex items-center justify-center ${dimensions}`}>
      {/* Animated pulse rings - only show when speaking */}
      {isSpeaking && (
        <>
          <div
            className="absolute inset-0 rounded-full bg-purple-500/30 animate-pulse-ring"
            style={{ animationDelay: '0s' }}
          />
          <div
            className="absolute inset-0 rounded-full bg-purple-500/30 animate-pulse-ring"
            style={{ animationDelay: '0.4s' }}
          />
          <div
            className="absolute inset-0 rounded-full bg-purple-500/30 animate-pulse-ring"
            style={{ animationDelay: '0.8s' }}
          />
        </>
      )}

      {/* Center avatar circle */}
      <div
        className={`relative ${innerSize} rounded-full bg-gradient-to-br from-purple-500 via-purple-600 to-purple-800 flex items-center justify-center shadow-lg`}
      >
        {/* DJ icon */}
        <svg
          className={`${iconSize} text-white`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          {/* Headphones icon */}
          <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
        </svg>
      </div>
    </div>
  );
}
