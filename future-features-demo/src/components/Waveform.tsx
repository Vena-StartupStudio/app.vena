interface WaveformProps {
  points: number[];
}

export function Waveform({ points }: WaveformProps) {
  return (
    <div className="flex h-12 items-end gap-1" aria-hidden="true">
      {points.map((height, index) => (
        <span
          key={index}
          className="w-1.5 rounded-full bg-gradient-to-b from-white/90 to-white/40 opacity-80"
          style={{
            height: `${Math.max(12, height * 4)}px`,
            animation: 'pulse-soft 2.2s ease-in-out infinite',
            animationDelay: `${index * 0.08}s`,
          }}
        />
      ))}
    </div>
  );
}
