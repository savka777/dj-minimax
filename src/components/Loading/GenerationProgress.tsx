'use client';

interface GenerationProgressProps {
  step: string;
  percent: number;
}

const STEPS = [
  { key: 'script', label: 'Generating DJ script' },
  { key: 'song', label: 'Creating your song' },
  { key: 'voice', label: 'Recording DJ voice' },
  { key: 'prepare', label: 'Preparing experience' },
];

export function GenerationProgress({ step, percent }: GenerationProgressProps) {
  // Find current step index based on step string
  const currentStepIndex = STEPS.findIndex((s) =>
    step.toLowerCase().includes(s.key)
  );
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4">
      {/* Background animation */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-purple-900/30 blur-3xl" />
        <div
          className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-900/20 blur-2xl"
          style={{
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            animationDelay: '0.5s',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* Title */}
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-white">
            Creating Your Experience
          </h2>
          <p className="text-zinc-500">This may take a moment...</p>
        </div>

        {/* Vinyl record animation */}
        <div className="flex justify-center">
          <div className="relative h-32 w-32">
            {/* Outer ring */}
            <div
              className="absolute inset-0 rounded-full border-4 border-zinc-700"
              style={{
                animation: 'spin 3s linear infinite',
              }}
            >
              {/* Grooves */}
              <div className="absolute inset-2 rounded-full border border-zinc-800" />
              <div className="absolute inset-4 rounded-full border border-zinc-800" />
              <div className="absolute inset-6 rounded-full border border-zinc-800" />
              <div className="absolute inset-8 rounded-full border border-zinc-800" />
            </div>
            {/* Center label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-amber-500">
                <div className="flex h-full w-full items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-zinc-900" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-amber-500 transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">{step}</span>
            <span className="text-zinc-500">{percent}%</span>
          </div>
        </div>

        {/* Steps list */}
        <div className="space-y-3">
          {STEPS.map((s, index) => {
            const isCompleted = index < activeIndex;
            const isActive = index === activeIndex;

            return (
              <div
                key={s.key}
                className={`flex items-center gap-3 rounded-lg p-3 transition-colors ${
                  isActive
                    ? 'bg-zinc-900 text-white'
                    : isCompleted
                      ? 'text-zinc-500'
                      : 'text-zinc-600'
                }`}
              >
                {/* Status icon */}
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    isCompleted
                      ? 'bg-green-500/20 text-green-400'
                      : isActive
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-zinc-800 text-zinc-600'
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : isActive ? (
                    <div className="h-2 w-2 animate-pulse rounded-full bg-purple-400" />
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </div>
                <span>{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spinning keyframes */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
