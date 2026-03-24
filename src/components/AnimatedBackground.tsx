export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Large ambient gradient orbs — GPU-accelerated CSS animations only */}

      {/* Primary amber orb — top right, slow drift */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full opacity-[0.03]"
        style={{
          background: 'radial-gradient(circle, #e8910c 0%, transparent 70%)',
          top: '-20%',
          right: '-10%',
          animation: 'bgOrb1 20s ease-in-out infinite',
        }}
      />

      {/* Secondary blue orb — bottom left, slower drift */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.025]"
        style={{
          background: 'radial-gradient(circle, #89ceff 0%, transparent 70%)',
          bottom: '-15%',
          left: '-5%',
          animation: 'bgOrb2 25s ease-in-out infinite',
        }}
      />

      {/* Small amber accent — center, subtle pulse */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-[0.02]"
        style={{
          background: 'radial-gradient(circle, #ffb867 0%, transparent 70%)',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'bgOrb3 15s ease-in-out infinite',
        }}
      />

      {/* Grid overlay — subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffb867 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Diagonal gradient sweep — very subtle moving light */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          background: 'linear-gradient(135deg, transparent 0%, #e8910c 50%, transparent 100%)',
          backgroundSize: '200% 200%',
          animation: 'bgSweep 12s ease-in-out infinite',
        }}
      />
    </div>
  )
}
