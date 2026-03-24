export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Amber glow — top right, slow drift */}
      <div
        className="absolute rounded-full blur-[120px]"
        style={{
          width: '50vw',
          height: '50vw',
          background: 'rgba(232, 145, 12, 0.12)',
          top: '-15%',
          right: '-10%',
          animation: 'bgOrb1 20s ease-in-out infinite',
        }}
      />

      {/* Blue glow — bottom left, slower drift */}
      <div
        className="absolute rounded-full blur-[100px]"
        style={{
          width: '40vw',
          height: '40vw',
          background: 'rgba(137, 206, 255, 0.08)',
          bottom: '-10%',
          left: '-5%',
          animation: 'bgOrb2 25s ease-in-out infinite',
        }}
      />

      {/* Small amber accent — center-left, gentle pulse */}
      <div
        className="absolute rounded-full blur-[80px]"
        style={{
          width: '30vw',
          height: '30vw',
          background: 'rgba(255, 184, 103, 0.06)',
          top: '40%',
          left: '30%',
          animation: 'bgOrb3 15s ease-in-out infinite',
        }}
      />
    </div>
  )
}
