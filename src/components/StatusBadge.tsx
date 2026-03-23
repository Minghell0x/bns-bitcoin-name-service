interface StatusBadgeProps {
  status: 'available' | 'active' | 'expiring' | 'grace-period' | 'taken'
}

const config = {
  available: { label: 'Available', color: 'primary', pulse: true },
  active: { label: 'Active', color: 'emerald-400', pulse: false },
  expiring: { label: 'Expiring', color: 'primary', pulse: true },
  'grace-period': { label: 'Grace Period', color: 'error', pulse: false },
  taken: { label: 'Taken', color: 'outline', pulse: false },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const c = config[status]

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-${c.color}/10 border border-${c.color}/20`}>
      <span className={`w-2 h-2 rounded-full bg-${c.color} ${c.pulse ? 'status-pulse' : ''}`} />
      <span className={`text-xs font-mono font-bold tracking-widest text-${c.color} uppercase`}>
        {c.label}
      </span>
    </span>
  )
}
