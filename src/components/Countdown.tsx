import { useCountdown } from '../hooks/useCountdown'
import { OP_WALLET_LAUNCH_DATE } from '../config/constants'

export default function Countdown() {
  const { days, hours, minutes, isExpired } = useCountdown(OP_WALLET_LAUNCH_DATE)

  if (isExpired) {
    return (
      <div className="inline-flex flex-col items-center mb-12">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-tertiary mb-3">
          OP_WALLET Support
        </span>
        <span className="font-mono text-2xl font-bold text-primary">LIVE NOW</span>
      </div>
    )
  }

  return (
    <div className="inline-flex flex-col items-center mb-12">
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-tertiary mb-3">
        OP_WALLET Support Live In
      </span>
      <div className="flex gap-6 font-mono text-2xl md:text-3xl font-bold text-on-surface">
        <div className="flex flex-col"><span>{String(days).padStart(2, '0')}</span><span className="text-[9px] uppercase tracking-widest text-outline">Days</span></div>
        <span className="opacity-30">:</span>
        <div className="flex flex-col"><span>{String(hours).padStart(2, '0')}</span><span className="text-[9px] uppercase tracking-widest text-outline">Hours</span></div>
        <span className="opacity-30">:</span>
        <div className="flex flex-col"><span>{String(minutes).padStart(2, '0')}</span><span className="text-[9px] uppercase tracking-widest text-outline">Mins</span></div>
      </div>
    </div>
  )
}
