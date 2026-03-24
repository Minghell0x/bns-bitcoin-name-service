export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Primary amber orb — top right */}
      <div
        className="absolute w-[900px] h-[900px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(232, 145, 12, 0.15) 0%, transparent 70%)',
          top: '-25%',
          right: '-15%',
          animation: 'bgOrb1 20s ease-in-out infinite',
        }}
      />

      {/* Blue orb — bottom left */}
      <div
        className="absolute w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(137, 206, 255, 0.1) 0%, transparent 70%)',
          bottom: '-20%',
          left: '-10%',
          animation: 'bgOrb2 25s ease-in-out infinite',
        }}
      />

      {/* Amber pulse — center */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 184, 103, 0.08) 0%, transparent 70%)',
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'bgOrb3 15s ease-in-out infinite',
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255, 184, 103, 0.08) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Gradient sweep */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, transparent 0%, rgba(232, 145, 12, 0.04) 50%, transparent 100%)',
          backgroundSize: '200% 200%',
          animation: 'bgSweep 12s ease-in-out infinite',
        }}
      />
    </div>
  )
}
